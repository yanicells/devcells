import Link from "next/link";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { MobileNav } from "@/components/layout/mobile-nav";
import { CommandPaletteTrigger } from "@/components/layout/command-palette";

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-bg/80 backdrop-blur supports-[backdrop-filter]:bg-bg/60">
      <div className="flex h-14 items-center gap-3 px-4 lg:px-6">
        <MobileNav />
        <Link
          href="/"
          className="flex items-baseline gap-1.5 font-mono text-[15px] font-semibold tracking-tight"
        >
          <span className="inline-block h-2 w-2 rounded-sm bg-accent" />
          devcells
          <span className="hidden font-sans text-xs font-normal text-fg-subtle sm:inline">
            / yani&apos;s web dev docs
          </span>
        </Link>
        <div className="ml-auto flex items-center gap-2">
          <CommandPaletteTrigger />
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden h-8 items-center rounded-md border border-border px-3 text-xs text-fg-muted hover:bg-bg-muted hover:text-fg sm:inline-flex"
          >
            GitHub
          </a>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
