# devcells

My personal web dev reference site. Static MDX docs over Next.js 16 (App Router) + Tailwind v4. Content lives in `content/*.mdx`, navigation in `lib/navigation.ts`, and everything renders to a fully prerendered static site.

## Run locally

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm build        # static prerender of every doc page
pnpm start        # serve the build
pnpm lint
```

## What's where

```
app/
  layout.tsx              # root layout, theme provider, header
  page.tsx                # landing page (intro + section grid)
  docs/
    layout.tsx            # sidebar + content shell
    page.tsx              # redirects /docs → /docs/getting-started
    [...slug]/page.tsx    # renders content/<slug>.mdx + ToC + prev/next
content/
  getting-started.mdx
  react.mdx
  tailwind.mdx
  nextjs.mdx
  tanstack-start.mdx
  drizzle.mdx
  apis.mdx
  auth.mdx
  ai.mdx
  patterns.mdx
  resources.mdx
components/
  brand-icon.tsx          # renders SVGs sourced from svgl.app
  ui/                     # primitives — button, dialog/sheet, tabs
  mdx/                    # custom MDX components — CodeBlock, Preview, Callout, Steps, LinkCard, Tabs
  layout/                 # header, sidebar, ToC, mobile nav, theme toggle, command palette
lib/
  navigation.ts           # single source of truth for the sidebar
  toc.ts                  # extracts H2/H3 from MDX source
  brands.ts               # title → /public/brand/<slug>.svg map
  content.ts              # filesystem helpers for MDX
  search-index.ts         # flat list for the cmd+k palette
  cn.ts                   # tailwind-merge helper
mdx-components.tsx        # global MDX component map (next/mdx convention)
public/brand/             # SVG brand marks fetched from https://svgl.app
```

## Adding a new section

1. Drop the file into `content/<slug>.mdx`. The first `#` becomes the page H1.
2. Add the section to `lib/navigation.ts` — both the entry order and its sub-items (H2 anchors).
3. Optional: pick a brand icon for the landing page card by adding the slug to `SECTION_BRAND` in `app/page.tsx`, or rely on the auto-detection in `lib/brands.ts`.

The dynamic `[...slug]` route uses `generateStaticParams` over the navigation list, so anything not in `lib/navigation.ts` will 404.

## Adding a new MDX component

1. Build it under `components/mdx/<name>.tsx`.
2. Register it in the `components` map inside `mdx-components.tsx`.
3. Use it directly in any `.mdx` file — no import needed.

## Brand SVGs

All brand marks live in `public/brand/` and were fetched from [svgl.app](https://svgl.app). To add or refresh icons, write a small node script that hits `https://api.svgl.app` and writes into `public/brand/`. Brands with separate light/dark assets are saved as `<slug>_light.svg` and `<slug>_dark.svg`; mark them in the `themed` set inside [lib/brands.ts](lib/brands.ts) and the `<BrandIcon>` component will swap them via the `dark:` variant.

`<LinkCard>` automatically renders a brand icon when its `title` matches an entry in `lib/brands.ts`. Pass `brand="..."` to override or `brand={false}` to hide it.

## Shortcuts

- **`⌘K` / `Ctrl+K`** — open the command palette. Indexes section titles and every sub-item heading.
- **`Esc`** — close any open palette / sheet / dialog.
- **`/docs/<slug>#<heading>`** — every H2 and H3 has a stable slug, so deep links work.

## Stack

- **Next.js 16** App Router, Turbopack, static export per route via `generateStaticParams` + `dynamicParams = false`.
- **Tailwind v4** with the `@theme` block in `app/globals.css`.
- **MDX** via `@next/mdx` and a custom `mdx-components.tsx`.
- **Shiki** through `rehype-pretty-code` for code highlighting (`github-light` + `github-dark-dimmed`, swapped by CSS).
- **next-themes** for the dark/light toggle. Default is dark.

## Deploy

Push to GitHub, import on Vercel, done. The output is fully static.
