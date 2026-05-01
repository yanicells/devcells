"use client";

import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Sheet } from "@/components/ui/dialog";
import { Sidebar } from "@/components/layout/sidebar";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        aria-label="Open navigation"
        onClick={() => setOpen(true)}
        className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-bg text-fg-muted hover:bg-bg-muted hover:text-fg lg:hidden"
      >
        <Menu size={15} />
      </button>
      <Sheet open={open} onClose={() => setOpen(false)} side="left">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <span className="font-mono text-sm font-semibold tracking-tight">
            devcells
          </span>
          <button
            type="button"
            aria-label="Close"
            onClick={() => setOpen(false)}
            className="inline-flex h-7 w-7 items-center justify-center rounded text-fg-muted hover:bg-bg-muted hover:text-fg"
          >
            <X size={15} />
          </button>
        </div>
        <div className="overflow-y-auto">
          <Sidebar onNavigate={() => setOpen(false)} />
        </div>
      </Sheet>
    </>
  );
}
