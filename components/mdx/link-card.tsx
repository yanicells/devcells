import { ArrowUpRight } from "lucide-react";
import { BrandIcon } from "@/components/brand-icon";
import { brandFor } from "@/lib/brands";

type LinkCardProps = {
  href: string;
  title: string;
  description?: string;
  /** Override brand icon. Pass `false` to suppress auto-detection. */
  brand?: string | false;
};

export function LinkCard({ href, title, description, brand }: LinkCardProps) {
  const external = /^https?:\/\//.test(href);
  const brandSlug = brand === false ? null : brandFor(brand ?? title);

  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="not-prose group my-2 flex items-start gap-3 rounded-lg border border-border bg-bg-subtle p-3.5 transition-colors hover:border-border-strong hover:bg-bg-muted"
    >
      {brandSlug && (
        <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-border bg-bg">
          <BrandIcon name={brandSlug} size={15} />
        </div>
      )}
      <div className="min-w-0 flex-1">
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
