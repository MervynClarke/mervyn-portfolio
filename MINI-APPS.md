# Embedding a mini-app into the portfolio

This repo hosts self-contained mini-apps as their own routes (the first one is
**Jump Work** at `/jump`). Use this recipe to add another. The `/jump` app under
`src/jump/` is the reference implementation — copy its shape.

## The pattern (what worked for `/jump`)

The portfolio is **Next.js 14 (App Router) + TypeScript + Tailwind**, dark-mode
via a `.dark` class on `<html>` (toggled by `src/components/ThemeToggle.tsx`,
persisted to `localStorage["theme"]`). Fonts: Playfair Display (`font-display`),
Inter (`font-sans`), JetBrains Mono (`font-mono`). `tsconfig` has `allowJs: true`,
so a Vite/CRA-style app's `.jsx`/`.js` files can be dropped in almost verbatim.

### Steps

1. **Drop the app under `src/<name>/`** — keep its `components/`, `hooks/`,
   `lib/`, `data/` structure so internal relative imports keep working. They can
   stay `.jsx`/`.js` (allowJs compiles them).

2. **One client entry component** (e.g. `src/<name>/<Name>App.jsx`) with
   `"use client"` at the top. Only the entry needs the directive; children
   imported by it are client too. Strip any in-app theme provider/toggle — the
   app inherits the site's dark mode (see step 5).

3. **Add the route** `src/app/<name>/page.tsx` (a server component, so it can
   `export const metadata`). It just renders the client app:
   ```tsx
   import type { Metadata } from "next";
   import NameApp from "@/<name>/<Name>App";
   export const metadata: Metadata = { title: "...", description: "..." };
   export default function Page() { return <NameApp />; }
   ```

4. **Scope the app's CSS variables** in `src/app/globals.css` under a wrapper
   class so they never leak into the rest of the site. The wrapper responds to
   the site-wide `.dark` class:
   ```css
   .<name>-app { --bg: …; --surface: …; --text: …; background-color: var(--bg); color: var(--text); }
   .dark .<name>-app { --bg: …; --surface: …; --text: …; }
   ```
   Put that wrapper class on the app's root `<div className="<name>-app …">`.

5. **Inherit the site theme** — reuse `@/components/ThemeToggle` (it controls the
   global `.dark` class). Don't ship a second theme system; they fight over the
   `.dark` class and `localStorage["theme"]`.

6. **Tailwind tokens** — add any custom color/animation tokens the app needs to
   `tailwind.config.ts` under `theme.extend`. For `/jump` these are
   `bg`/`surface`/`surface-2`/`line`/`text`/`muted` (mapped to the CSS vars
   above) plus `coral`/`teal` accents and the `ropeSwing`/`floatIn` animations.

7. **Hide the global navbar if the app has its own header.** In
   `src/components/Navbar.tsx`, after all hooks run, early-return for the route:
   ```tsx
   if (pathname?.startsWith("/<name>")) return null;
   ```
   (`/jump` uses its own centered header instead of the global navbar.)

8. **Add any new dependency** with `npm install` (e.g. `/jump` needed
   `lucide-react`). Then `npm run build` to confirm a clean compile.

### Palette (matches the portfolio)
- Work / "go" accent: green `#34D399` (`coral` token)
- Recover / "slow down" accent: gold `#D99A3C` (`teal` token)
- Dark surfaces: near-black forest greens (`--bg: #0a120d`, `--surface: #101c15`)
- Light surfaces: warm parchment (`--bg: #f5f1e8`)

## Gotchas learned on `/jump`
- The portfolio's global navbar is fixed (h-16). If you DON'T hide it, offset the
  app with `pt-16` so content clears it. `/jump` hides it and uses its own header.
- Keep the original app's accent **class names** when re-theming and just change
  the token *values* — avoids touching every component file.
- There's currently no "back to portfolio" link from inside `/jump` (TODO if
  desired).

## Open follow-ups for `/jump`
- Optional "← Portfolio" link in the Jump Work header.
- Tighten visual relationship now that nav is a centered header.
