// Map a title (case-insensitive) to a brand slug under /public/brand.
// Multiple aliases for the same brand are common (e.g. "Drizzle" and "Drizzle ORM").
const aliases: Record<string, string> = {
  react: "react",
  "react.js": "react",
  "tailwind": "tailwind",
  "tailwind css": "tailwind",
  "next.js": "nextjs",
  nextjs: "nextjs",
  "tanstack": "tanstack",
  "tanstack start": "tanstack",
  "tanstack query": "react-query",
  "tanstack router": "tanstack",
  drizzle: "drizzle",
  "drizzle orm": "drizzle",
  postgres: "postgres",
  postgresql: "postgres",
  typescript: "typescript",
  vercel: "vercel",
  openai: "openai",
  anthropic: "anthropic",
  claude: "claude",
  gemini: "gemini",
  "hugging face": "huggingface",
  huggingface: "huggingface",
  zod: "zod",
  "better auth": "better-auth",
  vite: "vite",
  astro: "astro",
  remix: "remix",
  "radix ui": "radix",
  "shadcn/ui": "shadcn",
  shadcn: "shadcn",
  "react hook form": "react-hook-form",
  zustand: "zustand",
  "react query": "react-query",
  stripe: "stripe",
  supabase: "supabase",
  neon: "neon",
  cloudflare: "cloudflare",
  resend: "resend",
  posthog: "posthog",
  sentry: "sentry",
  vitest: "vitest",
  playwright: "playwright",
  bun: "bun",
  pnpm: "pnpm",
  "node.js": "nodejs",
  nodejs: "nodejs",
  github: "github",
  linear: "linear",
  notion: "notion",
  "framer motion": "framer",
  framer: "framer",
  storybook: "storybook",
  jotai: "jotai",
  swr: "swr",
  trpc: "trpc",
  prisma: "prisma",
  "auth.js": "authjs",
  authjs: "authjs",
  "next-auth": "authjs",
  clerk: "clerk",
  "mistral ai": "mistral",
  mistral: "mistral",
  cohere: "cohere",
  cloudinary: "cloudinary",
  discord: "discord",
  slack: "slack",
  hono: "hono",
  fastify: "fastify",
  render: "render",
  railway: "railway",
  "fly.io": "fly",
  fly: "fly",
  netlify: "netlify",
  twilio: "twilio",
};

// Brands that ship _light/_dark variants in /public/brand/.
const themed = new Set([
  "react",
  "anthropic",
  "openai",
  "vercel",
  "github",
  "drizzle",
  "remix",
  "radix",
  "shadcn",
  "framer",
  "better-auth",
  "clerk",
  "fastify",
  "pnpm",
  "prisma",
  "railway",
  "render",
  "resend",
  "swr",
]);

// nextjs only ships single-file but visually it adapts via currentColor poorly;
// override above set as needed.

export function brandFor(title: string | undefined | null): string | null {
  if (!title) return null;
  return aliases[title.trim().toLowerCase()] ?? null;
}

export function brandSrc(slug: string, theme: "light" | "dark"): string {
  if (themed.has(slug)) return `/brand/${slug}_${theme}.svg`;
  return `/brand/${slug}.svg`;
}

export function isThemed(slug: string): boolean {
  return themed.has(slug);
}
