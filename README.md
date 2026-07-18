# Wakha Darija

« Wakha » (واخا) — « d'accord » en darija, le mot le plus utile du Maroc.

Application d'apprentissage du darija marocain. 86 mots et expressions, phonétique, 4 modes d'exercice.

React + Vite. Aucun backend, aucune base de données.

## Lancer en local

```bash
npm install
npm run dev
```

Ouvre http://localhost:5173

## Mettre en ligne

### 1. Pousser sur GitHub

Crée un dépôt vide sur github.com (sans README, sans .gitignore), puis :

```bash
git init
git add .
git commit -m "Wakha Darija v1"
git branch -M main
git remote add origin https://github.com/TON-COMPTE/wakha-darija.git
git push -u origin main
```

### 2. Déployer sur Vercel

1. vercel.com → **Add New** → **Project**
2. Importer le dépôt `wakha-darija`
3. Vercel détecte Vite automatiquement — ne rien changer
4. **Deploy**

L'URL est en ligne en une minute environ. Chaque `git push` redéploie automatiquement.

## Modifier le vocabulaire

Tout est dans `src/App.jsx`, tableau `LESSONS` en haut du fichier.

```js
{ d: "Salam", ph: "sa-LAM", ar: "سلام", fr: "Salut", note: "Optionnel" }
```

- `d` — translittération latine
- `ph` — phonétique, syllabe accentuée en MAJUSCULES
- `ar` — écriture arabe
- `fr` — traduction
- `note` — remarque affichée au verso des cartes (facultatif)

Commit + push = mise en ligne.

## Limites connues

- **La progression n'est pas sauvegardée.** Elle repart de zéro à chaque rechargement. Nécessite une base (Supabase) ou un `localStorage`.
- **L'audio dépend de l'appareil.** La synthèse vocale utilise la voix `ar-MA` du système. Sans voix arabe installée, le mode Écoute est muet. La voix rend par ailleurs un arabe standard, pas un vrai darija.
- **Vocabulaire non validé par un locuteur natif.** À faire relire avant diffusion large. Entrées douteuses repérées : `Msaltch`, `Ts3oud`.
