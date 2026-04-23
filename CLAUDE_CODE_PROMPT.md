# Prompt for Claude Code: Personal Web Dev Docs Site

## Context

I'm Yani, a CS student building a personal web dev reference site. Think of it as **my own version of the shadcn/ui or Tailwind docs** — not a tutorial, not for beginners, but a fast lookup for code patterns I use often. It's for me. I've already used most of this stuff; the docs are here so I don't have to re-Google the same snippets.

The content is already written — see `CONTENT.md` in this repo. Your job is the **site, design, and MDX component implementation**. Do not change the content's wording, structure, tone, or examples. Only convert it into a working site.

## Stack (locked in)

- **Next.js latest** (App Router)
- **MDX** via `@next/mdx` or `next-mdx-remote` — your call, justify it
- **TypeScript**, strict mode
- **Tailwind CSS v4**
- Custom components (build your own — no shadcn or component libraries)
- **lucide-react** for icons
- **Shiki** for syntax highlighting (rehype-pretty-code on top of it is fine)
- **pnpm** as the package manager

No CMS, no DB. The MDX files in the repo are the source of truth.

## Design direction

UI inspiration: shadcn/ui docs, Tailwind docs, Vercel docs, Fumadocs sites (look at these for visual reference — but build all components from scratch). Specifically:

- **Dark mode is the default**. Light mode toggle exists but dark is primary.
- **Three-column layout on desktop**: left sidebar (nav), center (content, max ~720px wide), right sidebar ("on this page" / table of contents that scroll-spies headings).
- **Mobile**: hamburger that opens left nav as a Sheet. No right sidebar on mobile.
- **Typography**: clean sans for body (Geist Sans or Inter), monospace for code (Geist Mono or JetBrains Mono). Tight line-height for headings, comfortable for prose.
- **Colors**: neutral palette. Zinc or stone background. One accent color (pick something — orange, violet, or emerald). Don't use blue.
- **Code blocks**: rounded corners, subtle border, copy button top-right, language label top-left, optional filename in a header bar.
- **No motion noise**. Subtle hover states on links and copy buttons. No page transitions, no scroll animations, no parallax.

The site should feel **fast, dense with information, and readable**. Not flashy.

## MDX component API (build these)

The content markdown uses these custom components. You must implement them:

### `<CodeBlock>`
The default for fenced code blocks. Already styled by Shiki/rehype-pretty-code. Must include:
- Copy-to-clipboard button (top-right, lucide `Copy` icon, swap to `Check` for 1s on click)
- Language label (top-left, small, muted)
- Optional `filename` prop that renders a small header bar above the code

```mdx
```tsx filename="components/Button.tsx"
export function Button() { return <button /> }
```
```

### `<Preview>`
Renders a live React component preview alongside its source. Two-tab layout: "Preview" and "Code". Default tab is Preview. Used heavily in the Tailwind and React sections.

```mdx
<Preview>
  <div className="flex gap-4">
    <div className="w-12 h-12 bg-zinc-200 rounded" />
    <div className="w-12 h-12 bg-zinc-200 rounded" />
  </div>
</Preview>
```

The component should auto-extract the JSX inside as the "Code" tab content. If that's too hard with MDX, accept a `code` prop as a string instead.

### `<Callout>`
For asides. Variants: `note`, `warning`, `tip`, `gotcha`. Each has a distinct color and lucide icon.

```mdx
<Callout type="gotcha">
Server Components can't use hooks. If you need state, mark the file `'use client'`.
</Callout>
```

### `<Steps>` and `<Step>`
Numbered vertical steps for setup guides.

```mdx
<Steps>
  <Step title="Install">
    ```bash
    pnpm add drizzle-orm
    ```
  </Step>
  <Step title="Configure">...</Step>
</Steps>
```

### `<LinkCard>`
For external resource links (used heavily in the "Others" section). Shows title, optional description, external link icon, hover state.

```mdx
<LinkCard
  href="https://date-fns.org"
  title="date-fns"
  description="Modern JS date utility library. Tree-shakeable."
/>
```

### `<Tabs>` and `<Tab>`
For showing the same pattern across providers (used in the AI section: OpenAI vs Claude vs Gemini tabs).

```mdx
<Tabs defaultValue="openai">
  <Tab value="openai" label="OpenAI">
    ```ts
    // openai code
    ```
  </Tab>
  <Tab value="claude" label="Claude">
    ```ts
    // claude code
    ```
  </Tab>
</Tabs>
```

## File structure

```
app/
  layout.tsx                 # Root layout, theme provider, font setup
  page.tsx                   # Landing page (intro + "jump to section" links)
  docs/
    layout.tsx               # Docs layout (sidebar + content + ToC)
    [...slug]/
      page.tsx               # Renders MDX for any slug
content/
  react.mdx
  tailwind.mdx
  nextjs.mdx
  tanstack-start.mdx
  drizzle.mdx
  apis.mdx
  ai.mdx
  auth.mdx
  patterns.mdx               # "must-know" patterns
  resources.mdx              # Links/libraries cheatsheet
components/
  ui/                        # custom-built primitives (button, dialog, tabs, etc.)
  mdx/
    code-block.tsx
    preview.tsx
    callout.tsx
    steps.tsx
    link-card.tsx
    tabs.tsx
  layout/
    sidebar.tsx
    toc.tsx
    theme-toggle.tsx
    mobile-nav.tsx
lib/
  navigation.ts              # Sidebar nav config (single source of truth)
  toc.ts                     # Extract headings from MDX for ToC
mdx-components.tsx           # Maps custom components to MDX
```

## Sidebar navigation

Build it from a single config file (`lib/navigation.ts`). Sections in this order:

1. Getting Started (intro, how to use this site)
2. React + TypeScript
3. Tailwind
4. Next.js
5. TanStack Start
6. Drizzle + Postgres
7. APIs (fetch, route handlers, server actions, Zod)
8. Auth (Better Auth)
9. AI Integration
10. Patterns (must-know stuff)
11. Resources (libraries cheatsheet)

Each section has sub-items mapping to H2s in its MDX file. Active link highlighted. Collapsible groups.

## On-this-page (right sidebar)

Auto-generated from H2 and H3 headings in the current MDX file. Scroll-spy active state. Smooth scroll on click. Hidden below `lg` breakpoint.

## Search (nice-to-have for v1)

Add a `cmd+k` command palette. Build it yourself with a simple modal + filtered list using Radix Dialog primitives or a fully custom implementation. Indexes section titles + headings. Skip full-text search for v1 — too much work, just headings is fine.

## Setup checklist

The Next.js app is already scaffolded (`create-next-app` was already run with TypeScript, Tailwind, App Router, no src dir).

1. Install deps: `pnpm add @next/mdx @mdx-js/loader @mdx-js/react remark-gfm rehype-pretty-code shiki lucide-react @radix-ui/react-tabs @radix-ui/react-dialog next-themes class-variance-authority clsx tailwind-merge`
2. Configure `next.config.mjs` with MDX
3. Configure `mdx-components.tsx` to map H1, H2, H3, code blocks, and the custom components
4. Set up dark mode via `next-themes`, default to dark
5. Build base UI primitives from scratch (button, dialog/modal wrapper, tabs) — no shadcn
6. Build the MDX components (`<CodeBlock>`, `<Preview>`, `<Callout>`, `<Steps>`, `<LinkCard>`, `<Tabs>`)
7. Build layouts (root, docs with sidebar + ToC, mobile nav)
8. Drop the content MDX in
9. Test that all `<Preview>` blocks render correctly

## Constraints

- **Don't add features I didn't ask for.** No comments system, no view counts, no analytics dashboard, no auth on the site itself, no admin panel. This is a static docs site.
- **Don't change the content.** If you spot typos in `CONTENT.md`, leave a comment in the PR — don't silently fix.
- **Don't over-engineer.** No state management library. No tRPC. No tests for v1. Just a clean, fast docs site.
- **Accessibility**: keyboard-navigable sidebar, proper heading hierarchy, focus rings visible, sufficient color contrast in both themes.
- **Performance**: this is static content. Use static generation. Lighthouse perf > 95.

## Deliverable

A working Next.js app in this repo that I can `pnpm dev` and see all the content rendered with the design described above. I will be the one to push to GitHub, and deploy to Vercel.

When done, leave a `README.md` with:
- How to run locally
- How to add a new section (where to update navigation, where to add MDX)
- Any shortcuts I should know (e.g., the cmd+k search)

If you hit a fork in the road on something I didn't specify (e.g., MDX library choice, exact font), make the call and document why in a `DECISIONS.md`. Don't ask me 20 questions — make reasonable defaults and move.
