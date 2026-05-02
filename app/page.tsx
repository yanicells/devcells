import Link from "next/link";
import { ArrowRight, Sparkles, Library, Wrench, Boxes } from "lucide-react";
import { BrandIcon } from "@/components/brand-icon";
import { brandFor } from "@/lib/brands";
import { navigation } from "@/lib/navigation";

const FALLBACK_ICONS = {
  "getting-started": Sparkles,
  apis: Wrench,
  patterns: Boxes,
  resources: Library,
} as const;

const SECTION_BRAND: Record<string, string> = {
  react: "react",
  tailwind: "tailwind",
  nextjs: "nextjs",
  "tanstack-start": "tanstack",
  drizzle: "drizzle",
  auth: "better-auth",
  ai: "anthropic",
};

export default function HomePage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-16 lg:py-24">
      <section className="mb-16 max-w-2xl">
        <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-bg-subtle px-3 py-1 text-xs text-fg-muted">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
          A personal reference, not a tutorial
        </p>
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
          The patterns I keep <span className="text-accent">re-googling</span>,
          collected.
        </h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-fg-muted">
          devcells is my own version of the docs I check 5x a day &mdash; React,
          Next.js, Tailwind, Drizzle, AI integration. Built for fast lookup, not
          for learning from scratch.
        </p>
        <div className="mt-7 flex flex-wrap items-center gap-3">
          <Link
            href="/docs/getting-started"
            className="inline-flex h-9 items-center gap-1.5 rounded-md bg-accent px-4 text-sm font-medium text-accent-fg transition-colors hover:bg-accent/90"
          >
            Start reading <ArrowRight size={14} />
          </Link>
          <Link
            href="/docs/patterns"
            className="inline-flex h-9 items-center rounded-md border border-border bg-bg px-4 text-sm font-medium text-fg-muted transition-colors hover:bg-bg-muted hover:text-fg"
          >
            Jump to patterns
          </Link>
          <span className="ml-1 hidden items-center gap-1.5 text-xs text-fg-subtle sm:flex">
            or hit
            <kbd className="inline-flex items-center gap-0.5 rounded border border-border bg-bg-subtle px-1.5 py-0.5 font-mono text-[10px]">
              <span>⌘</span>K
            </kbd>
          </span>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-wide text-fg-subtle">
          Sections
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {navigation.map((s) => {
            const brand = SECTION_BRAND[s.slug] ?? brandFor(s.title);
            const Fallback =
              FALLBACK_ICONS[s.slug as keyof typeof FALLBACK_ICONS] ?? Sparkles;
            return (
              <Link
                key={s.slug}
                href={`/docs/${s.slug}`}
                className="group relative flex flex-col rounded-lg border border-border bg-bg-subtle p-4 transition-colors hover:border-border-strong hover:bg-bg-muted"
              >
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-md border border-border bg-bg text-fg-muted group-hover:border-border-strong">
                  {brand ? (
                    <BrandIcon name={brand} size={18} />
                  ) : (
                    <Fallback size={16} className="group-hover:text-accent" />
                  )}
                </div>
                <div className="text-sm font-semibold text-fg">{s.title}</div>
                <div className="mt-1 text-xs text-fg-subtle">
                  {s.items.length} {s.items.length === 1 ? "topic" : "topics"}
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
