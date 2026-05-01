"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { navigation } from "@/lib/navigation";
import { cn } from "@/lib/cn";

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1 p-4 text-sm">
      {navigation.map((section) => (
        <SectionGroup
          key={section.slug}
          section={section}
          activePath={pathname}
          onNavigate={onNavigate}
        />
      ))}
    </nav>
  );
}

function SectionGroup({
  section,
  activePath,
  onNavigate,
}: {
  section: (typeof navigation)[number];
  activePath: string;
  onNavigate?: () => void;
}) {
  const sectionHref = `/docs/${section.slug}`;
  const isActiveSection = activePath === sectionHref;
  const [open, setOpen] = useState(isActiveSection);

  useEffect(() => {
    if (isActiveSection) setOpen(true);
  }, [isActiveSection]);

  return (
    <div className="mb-1">
      <div className="flex items-center">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-label={`Toggle ${section.title}`}
          className="inline-flex h-7 w-6 items-center justify-center rounded text-fg-subtle hover:text-fg"
        >
          <ChevronRight
            size={13}
            className={cn("transition-transform", open && "rotate-90")}
          />
        </button>
        <Link
          href={sectionHref}
          onClick={onNavigate}
          className={cn(
            "flex-1 truncate rounded px-2 py-1 text-[13px] font-semibold transition-colors",
            isActiveSection
              ? "text-fg"
              : "text-fg-muted hover:text-fg"
          )}
        >
          {section.title}
        </Link>
      </div>
      {open && (
        <ul className="mt-0.5 ml-[14px] flex flex-col gap-px border-l border-border pl-2">
          {section.items.map((item) => {
            const active =
              activePath + (typeof window !== "undefined" ? window.location.hash : "") ===
              item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  className={cn(
                    "block truncate rounded px-2 py-1 text-[12.5px] transition-colors",
                    active
                      ? "text-accent"
                      : "text-fg-subtle hover:text-fg"
                  )}
                >
                  {item.title}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
