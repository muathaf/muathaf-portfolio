# muathaf.com — Portfolio

Built with [Astro](https://astro.build) · GSAP · Lenis · Splitting.js

## Setup

```bash
npm install
npm run dev      # localhost:4321
npm run build    # outputs to /dist
npm run preview  # preview the build
```

## Project Structure

```
src/
├── components/
│   ├── Nav.astro         ← edit nav links
│   ├── Hero.astro        ← edit name, tagline, stats
│   ├── Ticker.astro      ← edit scrolling keywords
│   ├── About.astro       ← edit bio text + degrees
│   ├── Skills.astro      ← edit skill categories + pills
│   ├── Projects.astro    ← add/edit projects
│   ├── Experience.astro  ← add/edit jobs
│   ├── Contact.astro     ← edit contact cards + location tags
│   └── Footer.astro      ← edit footer text
├── layouts/
│   └── BaseLayout.astro  ← edit <head>, fonts, CDN scripts
├── pages/
│   └── index.astro       ← page assembly (reorder sections here)
└── styles/
    └── global.css        ← design tokens (:root vars), base styles

public/
└── main.js               ← all GSAP/Lenis/cursor animation logic
```

## How to edit

| What you want to change | Where to go |
|---|---|
| Colors / fonts / spacing | `src/styles/global.css` → `:root` block |
| Add a new project | `src/components/Projects.astro` → `projects` array |
| Add a new job | `src/components/Experience.astro` → `jobs` array |
| Change nav links | `src/components/Nav.astro` → `navLinks` array |
| Change the marquee keywords | `src/components/Ticker.astro` → `items` array |
| Change animation speed/easing | `public/main.js` → duration/ease values |
| Add a new section | Create `src/components/NewSection.astro`, import in `src/pages/index.astro` |

## Deploy to Vercel

```bash
npm i -g vercel
vercel login
vercel --prod
```

Then point muathaf.com domain to Vercel in 2 minutes.
