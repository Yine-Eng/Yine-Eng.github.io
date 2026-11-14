# yine-eng.github.io

**Live: [yine-eng.github.io](https://yine-eng.github.io)**

My portfolio. The idea: backend work is invisible by default, so this site makes it something
you can watch. The **Watch it run** section replays, step by step, how my
[RelayCRM](https://github.com/Yine-Eng/relaycrm) API decides a request: who the caller is, the
organization scope, the role check and PostgreSQL row-level security. Pick a user, send a request,
and turn on the "the app forgets its tenant filter" bug to see the database still refuse the row.

## Features

- **Light and dark themes.** Follows the system setting on the first visit, remembers an explicit
  choice, and is applied before first paint (no flash of the wrong theme).
- **Command menu.** `⌘K` / `Ctrl K` jumps to any section, switches the theme or opens a link.
- **Request demo.** A typed model of RelayCRM's checks (`src/lib/requestPipeline.ts`) with unit tests
  for every outcome: 200, 403, 404 at the org scope, and 404 at row-level security.
- **Accessible and fast.** Real buttons and links, a skip link, visible focus rings, live-region
  output for the demo, `prefers-reduced-motion` respected, self-hosted fonts, no tracking.

## Stack

React 19, TypeScript (strict), Vite, Tailwind CSS 4, Vitest and Testing Library, ESLint and
Prettier. Deployed to GitHub Pages by GitHub Actions.

## Run it

Needs Node 22 (see `.nvmrc`).

```bash
npm install
npm run dev          # http://localhost:5173
```

| Command                                 | What it does                       |
| --------------------------------------- | ---------------------------------- |
| `npm run dev`                           | Development server with hot reload |
| `npm run lint` / `npm run format:check` | ESLint / Prettier                  |
| `npm run typecheck`                     | TypeScript, strict                 |
| `npm test`                              | Vitest + Testing Library           |
| `npm run build`                         | Production build into `dist/`      |

## How it ships

Every pull request runs lint, format check, typecheck, tests and a build
(`.github/workflows/ci.yml`). A merge to `main` runs them again and deploys `dist/` to GitHub Pages.

## Code map

```
src/
  App.tsx                 page layout, theme, ⌘K shortcut
  components/             Nav, Hero, Marquee, Work, RequestDemo, About, Footer, CommandPalette
  data/content.ts         projects, experience, links: edit copy here
  lib/requestPipeline.ts  the RelayCRM request model the demo replays
  lib/theme.ts            theme state and persistence
  lib/commands.ts         command menu entries
public/caricature.svg     the illustration, one named group per part
```

## License

Code: MIT. The caricature and personal content are © Sampson Anaba and not covered by the license.
