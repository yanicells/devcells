"use client";

import { useEffect, useState } from "react";
import type { TocEntry } from "@/lib/toc";
import { cn } from "@/lib/cn";

export function Toc({ entries }: { entries: TocEntry[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (entries.length === 0) return;
    const headings = entries
      .map((e) => document.getElementById(e.slug))
      .filter((el): el is HTMLElement => Boolean(el));

    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (records) => {
        const visible = records
          .filter((r) => r.isIntersecting)
          .sort((a, b) => a.target.getBoundingClientRect().top - b.target.getBoundingClientRect().top);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-80px 0px -65% 0px", threshold: [0, 1] }
    );

    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, [entries]);

  if (entries.length === 0) return null;

  return (
    <div className="text-sm">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-fg-subtle">
        On this page
      </p>
      <ul className="flex flex-col gap-px border-l border-border">
        {entries.map((e) => {
          const active = activeId === e.slug;
          return (
            <li key={e.slug}>
              <a
                href={`#${e.slug}`}
                onClick={(ev) => {
                  ev.preventDefault();
                  const el = document.getElementById(e.slug);
                  if (el) {
                    el.scrollIntoView({ behavior: "smooth", block: "start" });
                    history.replaceState(null, "", `#${e.slug}`);
                    setActiveId(e.slug);
                  }
                }}
                className={cn(
                  "block truncate border-l-2 -ml-px py-1 transition-colors",
                  e.level === 3 ? "pl-6 text-[12.5px]" : "pl-3 text-[13px]",
                  active
                    ? "border-accent text-accent"
                    : "border-transparent text-fg-subtle hover:text-fg"
                )}
              >
                {e.text}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
