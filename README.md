# Kingdom Quest 💗

A sweet little React web game about taxonomy. Identify any rank from **domain** down to **species** using clues, then learn a fun fact about it.

## Features

- Nine game modes: Full Ladder, Domain Dive, Kingdom Match, Phylum Safari, Class Climb, Order Odyssey, Family Finder, Genus Puzzle, and Species Spot
- **Full Ladder** asks for every rank at once — domain, kingdom, phylum, class, order, family, genus, and species — with partial credit per rung
- 27 organisms across animals, plants, fungi, protists, and bacteria
- Choose 5, 10, or 15 questions per round
- No timer — gentle, low-pressure gameplay
- Peek at the scientific name for a small point cost, or skip a question
- Streak bonuses, confetti, explanations, and a review screen that spells out every correct answer you missed
- Personal bests saved in your browser with `localStorage`
- Fixed full-viewport pixel-art dirt background at 10% opacity, with drifting dinosaur bones, a T-rex skull near the top right, and animated ants climbing upward
- Soft pastel theme with a light pink, lavender, and blue background; subtle pixel-art fossils and ants keep the scene playful without overwhelming the game
- Responsive design for phone, tablet, and desktop

## Run it locally

```bash
npm install
npm run dev
```

Vite will print a local URL (usually `http://localhost:5173`). Open it in your browser.

## Build for production

```bash
npm run build
npm run preview
```

The production files are written to `dist/`.

## Publish on GitHub Pages

The site is configured for GitHub Pages at `https://<owner>.github.io/KingdomQuest/`.

- `vite.config.js` sets `base: "./"`, so the built JS/CSS load correctly from a project subpath.
- `.github/workflows/deploy.yml` builds the site and deploys `dist/` automatically on every push to `main`.

To enable it once:

1. In the repo, go to **Settings → Pages**.
2. Under **Build and deployment → Source**, choose **GitHub Actions**.
3. Push to `main` (or run the **Deploy to GitHub Pages** workflow manually). The site will appear at the URL shown in the Pages settings and in the workflow’s deployment summary.

If you prefer branch-based Pages instead, set **Source → Deploy from a branch → `main` / `/dist`**. The relative asset paths work with that setup too.

## Where to edit things

- `src/data/organisms.js` — the creatures, clues, full taxonomy (domain → species), and fun facts
- `src/data/taxonomy.js` — the answer choices and configuration for each of the nine modes
- `src/App.jsx` — game flow, scoring, and screens
- `src/styles.css` — all the styling and animations

Made with love. ✨
