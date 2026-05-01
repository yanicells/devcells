"use client";

import { Search, CornerDownLeft } from "lucide-react";
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

  useEffect(() => {
    setActive(0);
  }, [query]);

  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-idx="${active}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const r = results[active];
      if (r) {
        router.push(r.href);
        onClose();
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose} ariaLabel="Search documentation" className="max-w-xl">
      <div className="flex items-center border-b border-border px-3">
        <Search size={14} className="text-fg-subtle" />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onKey}
          placeholder="Jump to anything..."
          className="h-12 w-full bg-transparent px-3 text-sm placeholder:text-fg-subtle focus:outline-none"
        />
        <kbd className="ml-2 inline-flex items-center rounded border border-border bg-bg-subtle px-1.5 py-0.5 font-mono text-[10px] text-fg-subtle">
          esc
        </kbd>
      </div>
      <div ref={listRef} className="max-h-[60vh] overflow-y-auto p-2">
        {results.length === 0 ? (
          <div className="px-3 py-8 text-center text-sm text-fg-subtle">
            No results for &ldquo;{query}&rdquo;
          </div>
        ) : (
          <ul className="flex flex-col gap-px">
            {results.map((r, i) => (
              <li key={r.id} data-idx={i}>
                <button
                  type="button"
                  onClick={() => {
                    router.push(r.href);
                    onClose();
                  }}
                  onMouseEnter={() => setActive(i)}
                  className={cn(
                    "group flex w-full items-center justify-between gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors",
                    active === i ? "bg-bg-muted text-fg" : "text-fg-muted"
                  )}
                >
                  <div className="min-w-0 flex-1">
                    <div className="truncate">{r.title}</div>
                    <div className="truncate text-[11px] text-fg-subtle">{r.section}</div>
                  </div>
                  <CornerDownLeft
                    size={12}
                    className={cn(
                      "shrink-0 text-fg-subtle",
                      active === i ? "opacity-100" : "opacity-0"
                    )}
                  />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Dialog>
  );
}

function filter(items: SearchEntry[], query: string): SearchEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return items.slice(0, 50);
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
    .slice(0, 50)
    .map((x) => x.item);
}
