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
    // The grouped palette uses the section title as a non-clickable header,
    // and each sub-item below goes to a specific anchor. The section root link
    // would just duplicate either the header or the first item, so it is
    // intentionally omitted.
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
