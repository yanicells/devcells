import { Info, AlertTriangle, Lightbulb, AlertCircle, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "note" | "warning" | "tip" | "gotcha";

const styles: Record<
  Variant,
  { icon: LucideIcon; ring: string; text: string; iconColor: string }
> = {
  note: {
    icon: Info,
    ring: "border-border bg-bg-subtle",
    text: "text-fg-muted",
    iconColor: "text-fg-subtle",
  },
  tip: {
    icon: Lightbulb,
    ring: "border-emerald-500/25 bg-emerald-500/[0.06]",
    text: "text-fg-muted",
    iconColor: "text-emerald-500",
  },
  warning: {
    icon: AlertTriangle,
    ring: "border-amber-500/25 bg-amber-500/[0.06]",
    text: "text-fg-muted",
    iconColor: "text-amber-500",
  },
  gotcha: {
    icon: AlertCircle,
    ring: "border-accent/30 bg-accent/[0.06]",
    text: "text-fg",
    iconColor: "text-accent",
  },
};

export function Callout({
  type = "note",
  children,
  title,
}: {
  type?: Variant;
  title?: string;
  children: ReactNode;
}) {
  const s = styles[type] ?? styles.note;
  const Icon = s.icon;
  return (
    <div className={cn("my-4 flex gap-3 rounded-md border p-3.5", s.ring)}>
      <Icon size={16} className={cn("mt-0.5 shrink-0", s.iconColor)} />
      <div className={cn("min-w-0 flex-1 text-sm leading-6", s.text)}>
        {title && <div className="mb-1 font-semibold text-fg">{title}</div>}
        <div className="[&>p:first-child]:mt-0 [&>p:last-child]:mb-0">{children}</div>
      </div>
    </div>
  );
}
