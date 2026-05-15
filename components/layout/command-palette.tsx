"use client";

import { Search, CornerDownLeft, Hash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { buildSearchIndex, type SearchEntry } from "@/lib/search-index";
import { cn } from "@/lib/cn";

const INDEX = buildSearchIndex();

export function CommandPaletteTrigger() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Search"
        className="inline-flex h-8 w-44 items-center gap-2 rounded-md border border-border bg-bg-subtle px-2.5 text-xs text-fg-subtle transition-colors hover:bg-bg-muted hover:text-fg-muted sm:w-56"
      >
        <Search size={13} />
        <span className="flex-1 text-left">Search docs...</span>
        <kbd className="hidden items-center gap-0.5 rounded border border-border bg-bg px-1 py-px font-mono text-[10px] sm:inline-flex">
          <span>⌘</span>K
        </kbd>
      </button>
      <CommandPalette open={open} onClose={() => setOpen(false)} />
    </>
  );
}

function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActive(0);
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [open]);

  const results = useMemo(() => filter(INDEX, query), [query]);
  const groups = useMemo(() => groupBySection(results), [results]);
  const flat = useMemo(() => groups.flatMap((g) => g.items), [groups]);

  useEffect(() => {
    setActive(0);
  }, [query]);

  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-idx="${active}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const select = (entry: SearchEntry) => {
    router.push(entry.href);
    onClose();
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, flat.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const r = flat[active];
      if (r) select(r);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} ariaLabel="Search documentation" className="max-w-xl">
      <div className="flex items-center gap-2 border-b border-border px-4">
        <Search size={15} className="shrink-0 text-fg-subtle" />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onKey}
          placeholder="Jump to anything..."
          className="h-12 w-full bg-transparent text-sm placeholder:text-fg-subtle focus:outline-none"
        />
        <kbd className="hidden h-5 items-center rounded border border-border bg-bg-subtle px-1.5 font-mono text-[10px] text-fg-subtle sm:inline-flex">
          esc
        </kbd>
      </div>
      <div ref={listRef} className="max-h-[60vh] overflow-y-auto p-2">
        {flat.length === 0 ? (
          <div className="px-3 py-10 text-center text-sm text-fg-subtle">
            No results for &ldquo;{query}&rdquo;
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            {groups.map((group) => (
              <div key={group.section}>
                <div className="px-3 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-wider text-fg-subtle">
                  {group.section}
                </div>
                <ul className="flex flex-col">
                  {group.items.map((r) => {
                    const idx = flat.indexOf(r);
                    return (
                      <li key={r.id} data-idx={idx}>
                        <button
                          type="button"
                          onClick={() => select(r)}
                          onMouseEnter={() => setActive(idx)}
                          className={cn(
                            "flex w-full items-center gap-2.5 rounded-md px-3 py-1.5 text-left text-[13px] transition-colors",
                            active === idx
                              ? "bg-bg-muted text-fg"
                              : "text-fg-muted"
                          )}
                        >
                          <Hash size={12} className="shrink-0 text-fg-subtle" />
                          <span className="flex-1 truncate">{r.title}</span>
                          {active === idx && (
                            <CornerDownLeft size={11} className="shrink-0 text-fg-subtle" />
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="flex items-center justify-between gap-3 border-t border-border bg-bg-subtle px-3 py-2 text-[10px] text-fg-subtle">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1">
            <Kbd>↑</Kbd>
            <Kbd>↓</Kbd>
            <span>navigate</span>
          </span>
          <span className="inline-flex items-center gap-1">
            <Kbd>↵</Kbd>
            <span>open</span>
          </span>
        </div>
        <span className="inline-flex items-center gap-1">
          <Kbd>esc</Kbd>
          <span>close</span>
        </span>
      </div>
    </Dialog>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex h-4 min-w-4 items-center justify-center rounded border border-border bg-bg px-1 font-mono text-[10px] text-fg-muted">
      {children}
    </kbd>
  );
}

function groupBySection(items: SearchEntry[]) {
  const map = new Map<string, SearchEntry[]>();
  for (const item of items) {
    const arr = map.get(item.section) ?? [];
    arr.push(item);
    map.set(item.section, arr);
  }
  return Array.from(map, ([section, items]) => ({ section, items }));
}

function filter(items: SearchEntry[], query: string): SearchEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return items.slice(0, 60);
  const tokens = q.split(/\s+/);
  return items
    .map((item) => {
      const hay = `${item.title} ${item.section}`.toLowerCase();
      let score = 0;
      for (const t of tokens) {
        const i = hay.indexOf(t);
        if (i === -1) return null;
        score += 100 - i;
        if (item.title.toLowerCase().startsWith(t)) score += 50;
      }
      return { item, score };
    })
    .filter((x): x is { item: SearchEntry; score: number } => Boolean(x))
    .sort((a, b) => b.score - a.score)
    .slice(0, 60)
    .map((x) => x.item);
}
