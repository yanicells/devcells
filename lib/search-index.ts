import { navigation } from "./navigation";

export type SearchEntry = {
  id: string;
  section: string;
  title: string;
  href: string;
};

export function buildSearchIndex(): SearchEntry[] {
  const out: SearchEntry[] = [];
  for (const section of navigation) {
    out.push({
      id: section.slug,
      section: section.title,
      title: section.title,
      href: `/docs/${section.slug}`,
    });
    for (const item of section.items) {
      out.push({
        id: `${section.slug}-${item.href}`,
        section: section.title,
        title: item.title,
        href: item.href,
      });
    }
  }
  return out;
}
