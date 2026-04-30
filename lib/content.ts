import fs from "node:fs";
import path from "node:path";
import { navigation } from "./navigation";
import { extractToc, type TocEntry } from "./toc";

const CONTENT_DIR = path.join(process.cwd(), "content");

export function getDocSource(slug: string): string | null {
  const file = path.join(CONTENT_DIR, `${slug}.mdx`);
  if (!fs.existsSync(file)) return null;
  return fs.readFileSync(file, "utf8");
}

export function getDocToc(slug: string): TocEntry[] {
  const src = getDocSource(slug);
  if (!src) return [];
  return extractToc(src);
}

export function listDocSlugs(): string[] {
  return navigation.map((s) => s.slug);
}
