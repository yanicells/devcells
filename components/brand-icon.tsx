import { brandFor, brandSrc, isThemed } from "@/lib/brands";
import { cn } from "@/lib/cn";

type BrandIconProps = {
  /** Brand title or slug (e.g. "Next.js", "Tailwind CSS"). */
  name: string;
  size?: number;
  className?: string;
};

/**
 * Renders a brand SVG sourced from svgl.app.
 * For brands with separate light/dark assets, both are rendered and CSS toggles them.
 */
export function BrandIcon({ name, size = 18, className }: BrandIconProps) {
  const slug = brandFor(name) ?? name.toLowerCase();
  const themed = isThemed(slug);
  const dim = { width: size, height: size };
  const base = cn("inline-block shrink-0", className);

  if (!themed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={brandSrc(slug, "light")}
        alt=""
        aria-hidden
        className={base}
        {...dim}
      />
    );
  }

  return (
    <>
      {/* eslint-disable @next/next/no-img-element */}
      <img
        src={brandSrc(slug, "light")}
        alt=""
        aria-hidden
        className={cn(base, "dark:hidden")}
        {...dim}
      />
      <img
        src={brandSrc(slug, "dark")}
        alt=""
        aria-hidden
        className={cn(base, "hidden dark:inline-block")}
        {...dim}
      />
      {/* eslint-enable @next/next/no-img-element */}
    </>
  );
}
