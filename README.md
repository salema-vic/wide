# Copier le src d’une iframe dans la page avec un Web Worker

## Fichiers

- `index.html` : page principale.
- `main.js` : lit le `src` de l’iframe et dialogue avec le worker.
- `src-copy.worker.js` : récupère le HTML du fichier indiqué par le `src`.
- `iframe-content.html` : exemple de contenu à copier.

## Utilisation

1. Dépose les fichiers dans le même dossier que ta page GitHub Pages.
2. Dans `index.html`, remplace le `src` de l’iframe :

```html
<iframe id="source-frame" src="./ta-page.html"></iframe>
```

3. Ouvre la page. Le contenu est copié automatiquement au chargement.
4. Le bouton permet de relancer la copie.

## Important

Un Web Worker ne peut pas accéder directement au DOM ni lire l’intérieur d’une iframe.
Il peut seulement récupérer le fichier indiqué par `src` avec `fetch`.

Cela fonctionne bien si le `src` pointe vers une page/fichier que tu contrôles sur le même site.
Pour une page externe qui refuse l’accès navigateur, le worker ne pourra pas la copier.
