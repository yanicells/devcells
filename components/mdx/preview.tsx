import type { ReactNode } from "react";

type PreviewProps = {
  children: ReactNode;
  /** Optional label, defaults to "Preview". */
  label?: string;
};

/**
 * A visual frame that renders its children. The MDX file is expected to follow
 * with a fenced code block showing the same source — no toggling, both visible.
 *
 * The preview area uses block layout (not flex-center) so grids and full-width
 * elements expand to the available width instead of collapsing to content size.
 */
export function Preview({ children, label = "Preview" }: PreviewProps) {
  return (
    <div className="not-prose my-5 overflow-hidden rounded-lg border border-border bg-bg-subtle">
      <div className="flex items-center justify-between border-b border-border bg-bg-muted px-3 py-1.5">
        <span className="text-[10px] font-medium uppercase tracking-wider text-fg-subtle">
          {label}
        </span>
      </div>
      <div className="bg-bg p-6 text-fg">
        <div className="mx-auto max-w-full">{children}</div>
      </div>
    </div>
  );
}
