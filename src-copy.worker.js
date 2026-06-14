self.addEventListener("message", async (event) => {
  "use strict";

  const data = event.data || {};

  if (data.type !== "COPY_IFRAME_SRC") {
    return;
  }

  try {
    if (!data.src || typeof data.src !== "string") {
      throw new Error("Src iframe invalide.");
    }

    const response = await fetch(data.src, {
      method: "GET",
      credentials: "same-origin",
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error(`Impossible de charger "${data.src}" : HTTP ${response.status}`);
    }

    const contentType = response.headers.get("content-type") || "";

    if (!contentType.includes("text/html") && !contentType.includes("text/plain")) {
      throw new Error(
        `Le fichier chargé ne ressemble pas à du HTML ou du texte. Content-Type reçu : ${contentType || "inconnu"}`
      );
    }

    const html = await response.text();

    self.postMessage({
      ok: true,
      html
    });
  } catch (error) {
    self.postMessage({
      ok: false,
      error: error instanceof Error ? error.message : String(error)
    });
  }
});
