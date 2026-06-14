(() => {
  "use strict";

  const iframe = document.querySelector("#source-frame");
  const output = document.querySelector("#copied-content");
  const status = document.querySelector("#status");
  const button = document.querySelector("#copy-button");

  if (!iframe || !output || !status || !button) {
    console.error("Élément manquant : iframe, sortie, statut ou bouton.");
    return;
  }

  if (!window.Worker) {
    status.textContent = "Ton navigateur ne supporte pas les Web Workers.";
    return;
  }

  const worker = new Worker("./src-copy.worker.js", { type: "classic" });

  const setStatus = (message) => {
    status.textContent = message;
  };

  const showError = (message) => {
    output.innerHTML = "";
    const error = document.createElement("pre");
    error.className = "error";
    error.textContent = message;
    output.appendChild(error);
  };

  const injectHtmlSafelyForYourOwnSameOriginContent = (html) => {
    /*
      Cette fonction injecte le HTML récupéré.
      À utiliser uniquement avec une page que tu contrôles.
      Pour un contenu utilisateur ou externe, il faut nettoyer/sanitizer le HTML avant injection.
    */
    output.innerHTML = html;
  };

  worker.addEventListener("message", (event) => {
    const data = event.data || {};

    if (data.ok) {
      injectHtmlSafelyForYourOwnSameOriginContent(data.html);
      setStatus("Contenu copié.");
      return;
    }

    showError(data.error || "Erreur inconnue pendant la copie.");
    setStatus("Erreur.");
  });

  worker.addEventListener("error", (event) => {
    showError(`Erreur worker : ${event.message}`);
    setStatus("Erreur worker.");
  });

  const copyIframeSrcIntoPage = () => {
    const src = iframe.getAttribute("src");

    if (!src) {
      showError("L’iframe n’a pas d’attribut src.");
      return;
    }

    setStatus("Chargement du contenu…");
    output.textContent = "";

    /*
      On envoie le chemin tel qu’il est écrit dans l’iframe.
      Le worker peut donc fonctionner avec un chemin relatif.
    */
    worker.postMessage({
      type: "COPY_IFRAME_SRC",
      src
    });
  };

  button.addEventListener("click", copyIframeSrcIntoPage);

  /*
    Copie automatique au chargement.
    Supprime cette ligne si tu veux uniquement lancer la copie avec le bouton.
  */
  window.addEventListener("DOMContentLoaded", copyIframeSrcIntoPage);
})();
