# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project

Arcade Vault is an online platform for playing games and competing for the highest score. It is currently a fresh `create-next-app` scaffold (only `app/layout.tsx` and `app/page.tsx` exist).

Development follows **Spec Driven Design** using the `/spec` and `/spec-impl` skills from [Klerith/fernando-skills](https://github.com/Klerith/fernando-skills), installed with:

```bash
npx skills@latest add Klerith/fernando-skills
```

## Commands

```bash
npm run dev     # dev server (Turbopack) at http://localhost:3000
npm run build   # production build
npm run start   # serve the production build
npm run lint    # ESLint 9 flat config (next core-web-vitals + typescript)
```

No test framework is configured yet.

## Stack and configuration notes

- **Next.js 16.4 (App Router) + React 19.3 + TypeScript.** APIs differ from older Next.js; consult `node_modules/next/dist/docs/` (`01-app`, `03-architecture`, …) before writing Next-specific code.
- `next.config.ts` enables `cacheComponents`, `partialPrefetching`, and `experimental.agentFeedback`. With Cache Components on, data fetching/caching follows the `"use cache"` / Suspense model rather than legacy route segment config — check the docs before using `dynamic`, `revalidate`, etc.
- **Tailwind CSS v4** is wired through a Turbopack CSS loader rule (`@tailwindcss/turbopack`), not PostCSS. Theme tokens live in `app/globals.css` via `@import "tailwindcss"` and `@theme inline` (there is no `tailwind.config.*`).
- Layout props use the generated global type `LayoutProps<"/">` (likewise `PageProps<...>`) rather than hand-written prop types.
- Path alias: `@/*` → project root.

## Skills
Usa siempre el skill /fronted-design para hacer interfaces de usuario. 
