/*
  src-copy-worker.js
  Web Worker: nettoie, déduplique et prépare la liste des attributs src trouvés dans la page.
  Il ne lit pas le DOM directement : la page lui envoie les valeurs src.
*/
self.addEventListener('message', (event) => {
  const items = Array.isArray(event.data?.items) ? event.data.items : [];

  const cleaned = items
    .map((item) => ({
      tag: String(item.tag || '').toLowerCase(),
      src: String(item.src || '').trim(),
      alt: String(item.alt || '').trim(),
    }))
    .filter((item) => item.src.length > 0);

  const seen = new Set();
  const unique = [];

  for (const item of cleaned) {
    const key = `${item.tag}|${item.src}`;
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(item);
    }
  }

  const text = unique
    .map((item) => {
      const label = item.alt ? ` // ${item.alt}` : '';
      return `<${item.tag}> ${item.src}${label}`;
    })
    .join('\n');

  self.postMessage({
    count: unique.length,
    items: unique,
    text,
  });
});
