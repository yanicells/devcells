import GithubSlugger from "github-slugger";

export type TocEntry = {
  level: 2 | 3;
  text: string;
  slug: string;
};

export function extractToc(source: string): TocEntry[] {
  const slugger = new GithubSlugger();
  const entries: TocEntry[] = [];
  const lines = source.split("\n");
  let inFence = false;

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (line.startsWith("```")) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    const match = /^(#{2,3})\s+(.+?)\s*$/.exec(line);
    if (!match) continue;
    const level = match[1].length as 2 | 3;
    const text = match[2].replace(/`/g, "").trim();
    entries.push({ level, text, slug: slugger.slug(text) });
  }

  return entries;
}
