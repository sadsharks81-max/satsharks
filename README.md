# My Daily Compass (SAT Sharks)

Monorepo for the SAT Sharks landing page — a TanStack Start full-stack React application.

## Structure

```
my-daily-compass/
├── frontend/          # TanStack Start app (UI + SSR)
├── package.json       # Workspace root
└── README.md
```

This project does **not** have a separate backend service. TanStack Start bundles the React UI and SSR server (`server.ts`, `start.ts`) into a single Vite build. Server files live inside `frontend/src/` as required by the framework.

## Requirements

- Node.js 18+
- npm 9+

## Scripts

Run from the repository root:

| Command | Description |
| --- | --- |
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | ESLint |
| `npm run format` | Prettier |

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Output is written to `frontend/dist/`.
