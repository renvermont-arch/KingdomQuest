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
- Responsive design for phone, tablet, and desktop; on phones, quests are grouped into tabs, ladder rungs are paged three at a time, feedback opens in a bottom sheet, and review answers are collapsed until requested

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

The site is ready for GitHub Pages at `https://<owner>.github.io/KingdomQuest/`.

- `vite.config.js` sets `base: "./"`, so the built JS/CSS load correctly from a project subpath instead of the domain root.
- The committed `dist/` folder is the deployable site.

To publish:

1. In the repo, go to **Settings → Pages**.
2. Under **Build and deployment → Source**, choose **Deploy from a branch**.
3. Select branch **`main`** and folder **`/dist`**, then save.

After you change source files, run `npm run build` and commit the updated `dist/` folder to refresh the live site.

An optional GitHub Actions workflow is included as `github-pages-workflow.yml.example`. If you want automatic builds on every push, copy it to `.github/workflows/deploy.yml` and set Pages **Source** to **GitHub Actions**. Creating workflow files requires a token with the `workflow` scope.

## Where to edit things

- `src/data/organisms.js` — the creatures, clues, full taxonomy (domain → species), and fun facts
- `src/data/taxonomy.js` — the answer choices and configuration for each of the nine modes
- `src/App.jsx` — game flow, scoring, and screens
- `src/styles.css` — all the styling and animations

Made with love. ✨
