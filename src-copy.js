/*
  src-copy.js
  À ajouter dans ta page HTML pour copier tous les attributs src présents dans la page.
  Le bouton est créé automatiquement en bas à droite.
*/
(function () {
  'use strict';

  const WORKER_PATH = './src-copy-worker.js';

  function collectSrcAttributes() {
    return Array.from(document.querySelectorAll('[src]')).map((element) => ({
      tag: element.tagName.toLowerCase(),
      src: element.getAttribute('src') || '',
      alt: element.getAttribute('alt') || '',
    }));
  }

  async function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return;
    }

    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', 'readonly');
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    textarea.remove();
  }

  function createButton() {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = 'Copier les src';
    button.style.position = 'fixed';
    button.style.right = '16px';
    button.style.bottom = '16px';
    button.style.zIndex = '999999';
    button.style.padding = '10px 14px';
    button.style.border = '0';
    button.style.borderRadius = '10px';
    button.style.cursor = 'pointer';
    button.style.boxShadow = '0 6px 18px rgba(0,0,0,.2)';
    button.style.font = '600 14px system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif';
    document.body.appendChild(button);
    return button;
  }

  function showStatus(button, message) {
    const original = button.dataset.originalText || button.textContent;
    button.dataset.originalText = original;
    button.textContent = message;
    window.setTimeout(() => {
      button.textContent = original;
    }, 2200);
  }

  function runWorker(items) {
    return new Promise((resolve, reject) => {
      const worker = new Worker(WORKER_PATH);

      worker.addEventListener('message', (event) => {
        worker.terminate();
        resolve(event.data);
      });

      worker.addEventListener('error', (error) => {
        worker.terminate();
        reject(error);
      });

      worker.postMessage({ items });
    });
  }

  async function handleCopy(button) {
    try {
      const items = collectSrcAttributes();
      const result = await runWorker(items);

      if (!result.text) {
        showStatus(button, 'Aucun src trouvé');
        return;
      }

      await copyText(result.text);
      showStatus(button, `${result.count} src copiés`);
      console.table(result.items);
    } catch (error) {
      console.error('Erreur pendant la copie des src :', error);
      showStatus(button, 'Erreur copie src');
    }
  }

  function init() {
    const button = createButton();
    button.addEventListener('click', () => handleCopy(button));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
