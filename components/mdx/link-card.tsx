import { ArrowUpRight } from "lucide-react";

type LinkCardProps = {
  href: string;
  title: string;
  description?: string;
};

export function LinkCard({ href, title, description }: LinkCardProps) {
  const external = /^https?:\/\//.test(href);
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="not-prose group my-2 flex items-start justify-between gap-3 rounded-lg border border-border bg-bg-subtle p-3.5 transition-colors hover:border-border-strong hover:bg-bg-muted"
    >
      <div className="min-w-0">
        <div className="flex items-center gap-1.5 text-sm font-medium text-fg">
          {title}
          {external && (
            <ArrowUpRight
              size={13}
              className="text-fg-subtle transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
            />
          )}
        </div>
        {description && (
          <p className="mt-1 text-xs leading-relaxed text-fg-muted">{description}</p>
        )}
      </div>
    </a>
  );
}
