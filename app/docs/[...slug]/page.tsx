import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Metadata } from "next";
import { Toc } from "@/components/layout/toc";
import { findSection, getAdjacent, navigation } from "@/lib/navigation";
import { getDocSource } from "@/lib/content";
import { extractToc } from "@/lib/toc";

export function generateStaticParams() {
  return navigation.map((s) => ({ slug: [s.slug] }));
}

export const dynamicParams = false;

type Props = { params: Promise<{ slug: string[] }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const section = findSection(slug[0]);
  if (!section) return {};
  return { title: section.title };
}

export default async function DocPage({ params }: Props) {
  const { slug } = await params;
  const sectionSlug = slug[0];
  const section = findSection(sectionSlug);
  if (!section) notFound();

  const source = getDocSource(sectionSlug);
  if (!source) notFound();

  let MDX: React.ComponentType;
  try {
    const mod = await import(`@/content/${sectionSlug}.mdx`);
    MDX = mod.default;
  } catch {
    notFound();
  }

  const toc = extractToc(source);
  const { prev, next } = getAdjacent(sectionSlug);

  return (
    <div className="flex">
      <main className="min-w-0 flex-1 px-2 py-10 lg:px-10">
        <article className="prose mx-auto max-w-[720px]">
          <MDX />
        </article>
        <nav
          aria-label="Section navigation"
          className="mx-auto mt-12 flex max-w-[720px] items-stretch justify-between gap-3 border-t border-border pt-6"
        >
          {prev ? (
            <Link
              href={`/docs/${prev.slug}`}
              className="group flex flex-1 flex-col rounded-md border border-border bg-bg-subtle p-3 transition-colors hover:bg-bg-muted"
            >
              <span className="flex items-center gap-1 text-[11px] uppercase tracking-wide text-fg-subtle">
                <ChevronLeft size={12} /> Prev
              </span>
              <span className="mt-0.5 text-sm font-medium text-fg group-hover:text-accent">
                {prev.title}
              </span>
            </Link>
          ) : (
            <div className="flex-1" />
          )}
          {next ? (
            <Link
              href={`/docs/${next.slug}`}
              className="group flex flex-1 flex-col items-end rounded-md border border-border bg-bg-subtle p-3 transition-colors hover:bg-bg-muted"
            >
              <span className="flex items-center gap-1 text-[11px] uppercase tracking-wide text-fg-subtle">
                Next <ChevronRight size={12} />
              </span>
              <span className="mt-0.5 text-sm font-medium text-fg group-hover:text-accent">
                {next.title}
              </span>
            </Link>
          ) : (
            <div className="flex-1" />
          )}
        </nav>
      </main>
      <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-60 shrink-0 overflow-y-auto px-4 py-10 xl:block">
        <Toc entries={toc} />
      </aside>
    </div>
  );
}
