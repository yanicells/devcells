# Migrating Next.js (App Router) to Cloudflare Workers

Guide for migrating a Next.js 16+ app with Drizzle ORM, Neon PostgreSQL, Better Auth, and server actions from Vercel to Cloudflare Workers using `@opennextjs/cloudflare`.

## Tech Stack Assumptions

- Next.js 16+ (App Router)
- Drizzle ORM + Neon PostgreSQL (`@neondatabase/serverless`)
- Better Auth (GitHub OAuth)
- Server Actions
- Tailwind CSS, Radix UI, Recharts, Tiptap, Lucide React
- pnpm

---

## 1. Use `@opennextjs/cloudflare`, NOT `@cloudflare/next-on-pages`

`@cloudflare/next-on-pages` is **deprecated**. The official adapter is now `@opennextjs/cloudflare`, which deploys to Cloudflare Workers (not Pages).

- Docs: https://opennext.js.org/cloudflare/get-started
- GitHub: https://github.com/opennextjs/opennextjs-cloudflare

---

## 2. Install Dependencies

```bash
pnpm add @opennextjs/cloudflare@latest
pnpm add -D wrangler@latest
```

Make sure your `next` version satisfies the peer dependency (check the adapter's requirements).

---

## 3. Update `next.config.ts`

```ts
import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

initOpenNextCloudflareForDev();

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    // Tree-shake barrel exports from heavy packages
    optimizePackageImports: [
      "lucide-react",
      "recharts",
      "@radix-ui/react-dialog",
      "@radix-ui/react-select",
      "@radix-ui/react-popover",
      "@radix-ui/react-navigation-menu",
      "@radix-ui/react-radio-group",
      "@radix-ui/react-checkbox",
      "@tiptap/react",
      "@tiptap/starter-kit",
      "date-fns",
    ],
  },
  // Webpack produces smaller server bundles than Turbopack for Workers
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.optimization.minimize = true;
    }
    return config;
  },
};

export default nextConfig;
```

### Why `--webpack`?

Next.js 16 defaults to Turbopack, which produces larger server bundles. For Cloudflare Workers (which have size limits), force Webpack:

```json
"build": "next build --webpack"
```

---

## 4. Create `open-next.config.ts`

```ts
import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default defineCloudflareConfig({});
```

If you later need ISR with R2 cache:

```ts
import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";

export default defineCloudflareConfig({
  incrementalCache: r2IncrementalCache,
});
```

---

## 5. Create `wrangler.jsonc`

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "main": ".open-next/worker.js",
  "name": "your-app-name",
  "compatibility_date": "2024-12-30",
  "compatibility_flags": ["nodejs_compat", "global_fetch_strictly_public"],
  "assets": {
    "directory": ".open-next/assets",
    "binding": "ASSETS"
  },
  "services": [
    {
      "binding": "WORKER_SELF_REFERENCE",
      "service": "your-app-name"
    }
  ],
  "observability": {
    "logs": {
      "enabled": true,
      "invocation_logs": true
    }
  }
}
```

### Compatibility Flags

| Flag | Purpose |
|------|---------|
| `nodejs_compat` | Enables Node.js API subset in Workers runtime (prevents polyfill bloat) |
| `global_fetch_strictly_public` | Routes `fetch()` through public Internet (required for external API calls) |

Reference: https://developers.cloudflare.com/workers/configuration/compatibility-flags/

---

## 6. Environment Variables (Secrets)

**NEVER put secrets in `wrangler.jsonc`** — it gets committed to git.

**NEVER use the dashboard "Variables and Secrets" section** — `wrangler deploy` overrides dashboard vars with local config, wiping them.

Use `wrangler secret put` — secrets are encrypted, persist across deploys, and are never in code:

```bash
npx wrangler secret put DATABASE_URL
npx wrangler secret put BETTER_AUTH_SECRET
npx wrangler secret put BETTER_AUTH_URL
npx wrangler secret put GITHUB_CLIENT_ID
npx wrangler secret put GITHUB_CLIENT_SECRET
npx wrangler secret put UPLOADTHING_TOKEN
```

Each command prompts you to paste the value interactively.

For local development, use `.dev.vars` (gitignored):

```
NEXTJS_ENV=development
DATABASE_URL=postgresql://...
BETTER_AUTH_SECRET=...
BETTER_AUTH_URL=http://localhost:3000
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
UPLOADTHING_TOKEN=...
```

---

## 7. Update `package.json` Scripts

```json
"scripts": {
  "dev": "next dev",
  "build": "next build --webpack",
  "start": "next start",
  "preview": "opennextjs-cloudflare build && opennextjs-cloudflare preview",
  "deploy": "opennextjs-cloudflare build && opennextjs-cloudflare deploy",
  "cf-typegen": "wrangler types --env-interface CloudflareEnv cloudflare-env.d.ts"
}
```

---

## 8. TypeScript Setup

Create `cloudflare-env.d.ts`:

```ts
interface CloudflareEnv {
  ASSETS: Fetcher;
  WORKER_SELF_REFERENCE: Fetcher;
}
```

Add to `tsconfig.json` includes:

```json
"include": ["cloudflare-env.d.ts", ...]
```

---

## 9. Update `.gitignore`

```
# cloudflare
.open-next
.dev.vars
.wrangler
```

---

## 10. Static Asset Caching

Create `public/_headers`:

```
/_next/static/*
  Cache-Control: public,max-age=31536000,immutable
```

---

## 11. Remove Vercel-Specific Code

- Remove `@vercel/analytics` from `package.json` and layout imports
- Remove any `@vercel/speed-insights`
- Remove `.vercel` directory

---

## 12. Neon Database — No Changes Needed

If you're already using `neon()` (HTTP proxy) from `@neondatabase/serverless`, it works natively in the Workers runtime. **No WebSocket adapter needed.**

```ts
// This already works on Cloudflare Workers
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql);
```

The WebSocket adapter (`ws`) is only needed for `Pool`/`Client` connections, not the HTTP proxy.

---

## 13. Edge Runtime — Do NOT Add

**Do not** add `export const runtime = 'edge'` to any routes. The OpenNext adapter handles the entire app as a Worker. Adding edge runtime declarations is unsupported and will cause errors.

---

## 14. Deploy via Cloudflare Dashboard (Git Integration)

1. Go to **Workers & Pages > Create > Import a repository**
2. Connect GitHub and select your repo
3. Configure build settings:
   - **Build command:** `npx opennextjs-cloudflare build`
   - **Deploy command:** `npx opennextjs-cloudflare deploy`
4. Set your production branch
5. Deploy

After first deploy, set secrets via CLI (see step 6).

---

## 15. Lockfile Gotcha

Cloudflare's build system auto-detects your package manager from lockfiles. If you have multiple lockfiles (`bun.lock`, `pnpm-lock.yaml`, `package-lock.json`), it picks the wrong one.

**Keep only one lockfile.** Delete the others.

Priority order: `bun.lock` > `pnpm-lock.yaml` > `package-lock.json`

---

## Worker Size Limits

| Plan | Compressed Limit |
|------|-----------------|
| Free | 3 MiB |
| Paid ($5/mo) | 10 MiB |

A full-stack Next.js app with Radix, Recharts, Tiptap, etc. will typically be **4+ MiB compressed**. The free plan likely won't fit — you'll need the $5/month Workers Paid plan.

### Reducing Bundle Size

- Use `optimizePackageImports` for barrel-export packages (lucide-react, recharts, radix, etc.)
- Use `next build --webpack` instead of Turbopack (more aggressive minification)
- Enable `config.optimization.minimize = true` for server builds
- Use `next/dynamic` with `ssr: false` for heavy client-only libs if needed

---

## Compatibility Notes

| Feature | Status |
|---------|--------|
| Server Actions | Works — handled as Worker fetch handlers |
| Middleware | Works — runs within the Worker |
| ISR / Revalidation | Works — add R2 cache for persistence across deploys |
| Better Auth | Works — uses Neon HTTP driver which is Workers-compatible |
| Uploadthing | Needs testing — may have Node.js stream dependencies |
| `next/font` (Google Fonts) | Works |
| `next/image` optimization | Uses unoptimized fallback unless you add Cloudflare Images binding |
| `html2canvas` / `dompurify` | Safe if client-side only (needs DOM) |
| `@vercel/og` (`next/og`) | Auto-excluded by adapter if not used, but wasm files may still inflate bundle |

---

## Local Testing

```bash
# Normal Next.js dev (uses initOpenNextCloudflareForDev)
pnpm dev

# Full Cloudflare Workers preview
pnpm preview
```

---

## After Deploy Checklist

- [ ] Set all secrets via `wrangler secret put`
- [ ] Update GitHub OAuth callback URL to `https://your-app.workers.dev/api/auth/callback/github`
- [ ] Update `BETTER_AUTH_URL` secret to match your Workers URL
- [ ] Verify DB queries work (check freedom wall, stats, quiz results)
- [ ] Check logs in dashboard: Workers & Pages > your-app > Logs
- [ ] Rotate any secrets that were accidentally committed

## Other Reference
https://medium.com/@Yasirgaji/migrating-next-js-16-from-vercel-to-cloudflare-overcoming-the-25mb-limit-aa88e8396b29