import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Steps({ children }: { children: ReactNode }) {
  return (
    <div className="my-6 ml-3 [counter-reset:step] border-l border-border">
      {children}
    </div>
  );
}

export function Step({
  title,
  children,
  className,
}: {
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative pl-8 pb-6 [counter-increment:step] before:absolute before:-left-[13px] before:top-0 before:flex before:h-6 before:w-6 before:items-center before:justify-center before:rounded-full before:border before:border-border before:bg-bg before:text-xs before:font-mono before:text-fg-muted before:content-[counter(step)]",
        className
      )}
    >
      {title && <div className="mb-2 text-sm font-semibold text-fg">{title}</div>}
      <div className="text-sm leading-7 text-fg-muted [&>:first-child]:mt-0 [&>:last-child]:mb-0">
        {children}
      </div>
    </div>
  );
}
