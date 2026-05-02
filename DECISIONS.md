# Decisions

Choices I had to make where the brief left it open.

## MDX library: `@next/mdx`

Picked it over `next-mdx-remote`. Reasons:

- The content is local files in the repo, not anything fetched from a CMS. `@next/mdx` lets us `import` them directly and statically prerender the result.
- The component map lives in `mdx-components.tsx` per the App Router convention — one canonical place to register `<CodeBlock>`, `<Callout>`, etc.
- `next-mdx-remote` is the right call for runtime/remote MDX, but here it would just add a serialize step for no payoff.

Trade-off: with Turbopack (Next 16's default bundler), remark/rehype plugins must be passed by name (string) rather than as imported functions, because plugin args have to be serializable across the Rust↔JS boundary. So in [next.config.ts](next.config.ts) every plugin is configured by package name. If we ever need a custom function-based plugin, we either fall back to webpack (`next dev --webpack`) or wrap it in a published package.

## Syntax highlighting: `rehype-pretty-code` + Shiki

Shiki produces accurate, theme-aware highlighting at build time (no client JS for highlighting), and `rehype-pretty-code` adds the niceties Yani's MDX content already uses: `filename="..."` titles, line highlighting, etc.

Both `github-light` and `github-dark-dimmed` are emitted into the HTML, and CSS in [globals.css](app/globals.css) shows the right one based on `<html class="dark">`. No JS required to swap themes.

## Theme management: `next-themes`

Building this from scratch is fine until you want SSR-flash-free first paint. `next-themes` handles the inline script and class toggle correctly and is ~3KB. Default is dark (per the brief), with no system-preference fallback so users always start dark on first visit.

## Brand assets: svgl.app, downloaded statically

Per the user's request, the codebase uses real brand SVGs (not lucide stand-ins) wherever a brand is being represented — landing-page section cards, resource link cards. They're fetched from the [svgl.app](https://svgl.app) API and committed under `public/brand/`. Brands with light/dark variants are saved as two files and swapped via the `dark:hidden` Tailwind variant inside `<BrandIcon>`.

I did **not** replace lucide icons used for UI affordances (Copy, Search, Chevron, Sun/Moon, etc.) — those are functional UI iconography, not brand iconography.

## Routing: single `[...slug]` segment

`/docs/[...slug]/page.tsx` covers every MDX file. We `generateStaticParams` from the navigation list and set `dynamicParams = false`, so unknown slugs 404 at the edge instead of attempting on-demand rendering. This keeps the whole site static.

I considered one route per section file (`/docs/react/page.mdx`, etc.) which `@next/mdx` natively supports. That works, but then sidebar metadata, prev/next links, and ToC extraction all have to be re-derived per page. The catch-all keeps everything driven by `lib/navigation.ts`.

## Search: client-side, headings only

Per the brief, full-text search was deemed too much work for v1. The palette in [components/layout/command-palette.tsx](components/layout/command-palette.tsx) builds a flat index of every section title + sub-heading at module scope, then does a small token-based filter on the input. ~250 entries; no need for a fuzzy library.

## UI primitives: built from scratch

No Radix, no shadcn. The brief is explicit. The custom `<Dialog>` and `<Sheet>` use `createPortal`, ESC to close, body scroll lock, and click-outside dismiss. The custom `<Tabs>` is a small context + button/panel pair.

The trade-off here is accessibility surface area: Radix would give us full focus traps and proper aria-modal handling out of the box. The current implementation is keyboard-navigable and screen-reader-labeled but doesn't trap focus aggressively. That's acceptable for a personal docs site; if this ever shipped to a wider audience, swapping in Radix Dialog primitives would be a sub-hour change.

## Tailwind v4: `@theme` over JS config

Tailwind v4 prefers the CSS-first `@theme` block. All design tokens (colors, fonts, spacing) live in [app/globals.css](app/globals.css). Dark mode is configured via the `@custom-variant dark (&:where(.dark, .dark *))` directive so it pairs with `next-themes` adding `class="dark"` on `<html>`.

## Accent: orange

Among the brief's three options (orange / violet / emerald), orange contrasts best against the zinc/stone neutral palette in both themes and reads as warmer / less generic than violet for this kind of personal site.

## Fonts: Geist Sans + Geist Mono

Already imported in the starter via `next/font/google`. Kept them — they're a clean modern default and exactly what the brief listed first.

## Content was not edited

CONTENT.md was split verbatim into `content/*.mdx` files. The split honors top-level `#` headings while ignoring `#` lines that appear inside fenced code blocks (e.g. comments in bash snippets that begin with `#`). The introduction paragraph and the trailing "How to use this site" section were combined into `getting-started.mdx`. Nothing else was touched.
