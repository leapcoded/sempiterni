import entriesData from "../data/entries.json";
import fs from "node:fs";
import path from "node:path";
import { marked } from "marked";
import { autoLinkMarkdown } from "./auto-link";

export type EntryMeta = {
  slug: string;
  title: string;
  category: string;
  section: string;
  tags: string[];
  relations: string[];
  linkedRelations: { label: string; slug: string | null }[];
  excerpt: string;
  sourcePath: string;
};

export type EntriesManifest = {
  generatedAt: string;
  series: string;
  entryCount: number;
  tags: string[];
  entries: EntryMeta[];
};

export type TocItem = {
  level: number;
  text: string;
  id: string;
};

export type SectionGroup = {
  name: string;
  slug: string;
  entries: EntryMeta[];
};

export type CategoryGroup = {
  name: string;
  slug: string;
  description: string;
  entryCount: number;
  sections: SectionGroup[];
};

export const CATEGORY_INFO: Record<string, { description: string; blurb: string }> = {
  "World & Lore": {
    description: "Systems, factions, history, locations, and cosmology of the Sempiterni universe.",
    blurb: "How the world works — branches, Aetheris, Cordis, and the installations.",
  },
  Characters: {
    description: "Protagonists, antagonists, and the people who move through the story.",
    blurb: "Who they are, where they stand, and what they want.",
  },
  Glossary: {
    description: "Canonical terms, in-universe jargon, and quick-reference definitions.",
    blurb: "Short entries for concepts referenced across the series.",
  },
};

export const manifest = entriesData as EntriesManifest;

export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function getEntries() {
  return manifest.entries;
}

export function getTags() {
  return manifest.tags;
}

export function getEntry(slug: string) {
  return manifest.entries.find((entry) => entry.slug === slug);
}

export function getCategoryTree(): CategoryGroup[] {
  const categories = new Map<string, Map<string, EntryMeta[]>>();

  for (const entry of manifest.entries) {
    if (!categories.has(entry.category)) {
      categories.set(entry.category, new Map());
    }
    const sections = categories.get(entry.category)!;
    if (!sections.has(entry.section)) {
      sections.set(entry.section, []);
    }
    sections.get(entry.section)!.push(entry);
  }

  const order = ["World & Lore", "Characters", "Glossary"];

  return [...categories.entries()]
    .sort(([a], [b]) => {
      const ai = order.indexOf(a);
      const bi = order.indexOf(b);
      if (ai === -1 && bi === -1) return a.localeCompare(b);
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    })
    .map(([name, sectionMap]) => {
      const sections = [...sectionMap.entries()]
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([sectionName, entries]) => ({
          name: sectionName,
          slug: slugify(sectionName),
          entries: entries.sort((a, b) => a.title.localeCompare(b.title)),
        }));

      const entryCount = sections.reduce((sum, section) => sum + section.entries.length, 0);

      return {
        name,
        slug: slugify(name),
        description: CATEGORY_INFO[name]?.description ?? `Articles in ${name}.`,
        entryCount,
        sections,
      };
    });
}

export function getCategory(slug: string) {
  return getCategoryTree().find((category) => category.slug === slug);
}

export function getSection(categorySlug: string, sectionSlug: string) {
  const category = getCategory(categorySlug);
  if (!category) return null;
  const section = category.sections.find((item) => item.slug === sectionSlug);
  if (!section) return null;
  return { category, section };
}

export function getEntriesByTag(tag: string) {
  return manifest.entries
    .filter((entry) => entry.tags.includes(tag))
    .sort((a, b) => a.title.localeCompare(b.title));
}

export function getBacklinks(slug: string) {
  return manifest.entries
    .filter((entry) => entry.linkedRelations?.some((relation) => relation.slug === slug))
    .sort((a, b) => a.title.localeCompare(b.title));
}

export function getRelatedEntries(entry: EntryMeta, limit = 8) {
  const relatedSlugs = new Set(
    entry.linkedRelations?.map((relation) => relation.slug).filter(Boolean) as string[],
  );

  for (const backlink of getBacklinks(entry.slug)) {
    relatedSlugs.add(backlink.slug);
  }

  relatedSlugs.delete(entry.slug);

  return [...relatedSlugs]
    .map((relatedSlug) => getEntry(relatedSlug))
    .filter((item): item is EntryMeta => Boolean(item))
    .slice(0, limit);
}

export function getAdjacentEntries(entry: EntryMeta) {
  const siblings = manifest.entries
    .filter((item) => item.category === entry.category && item.section === entry.section)
    .sort((a, b) => a.title.localeCompare(b.title));

  const index = siblings.findIndex((item) => item.slug === entry.slug);

  return {
    prev: index > 0 ? siblings[index - 1] : null,
    next: index >= 0 && index < siblings.length - 1 ? siblings[index + 1] : null,
  };
}

export function extractToc(content: string): TocItem[] {
  const items: TocItem[] = [];

  for (const line of content.split("\n")) {
    const match = line.match(/^(#{2,4})\s+(.+)$/);
    if (!match) continue;

    const text = match[2]
      .replace(/\*([^*]+)\*/g, "$1")
      .replace(/`([^`]+)`/g, "$1")
      .replace(/\s*\(see also:[^)]+\)\s*/gi, "")
      .trim();

    items.push({
      level: match[1].length,
      text,
      id: slugify(text),
    });
  }

  return items;
}

function addHeadingIds(html: string) {
  return html.replace(/<h([2-4])>([^<]+)<\/h\1>/g, (_match, level, text) => {
    const id = slugify(text);
    return `<h${level} id="${id}">${text}</h${level}>`;
  });
}

export function renderMarkdown(content: string, slug?: string) {
  const linked = autoLinkMarkdown(content, manifest.entries, slug);
  const html = marked.parse(linked, { async: false }) as string;
  return addHeadingIds(html);
}

export function getEntryContent(slug: string) {
  const file = path.join(process.cwd(), "src/content/entries", `${slug}.md`);
  if (!fs.existsSync(file)) return "";
  return fs.readFileSync(file, "utf8");
}

export function categoryUrl(category: string | CategoryGroup) {
  const slug = typeof category === "string" ? slugify(category) : category.slug;
  return `/category/${slug}/`;
}

export function sectionUrl(category: string | CategoryGroup, section: string | SectionGroup) {
  const categorySlug = typeof category === "string" ? slugify(category) : category.slug;
  const sectionSlug = typeof section === "string" ? slugify(section) : section.slug;
  return `/category/${categorySlug}/${sectionSlug}/`;
}

export function tagUrl(tag: string) {
  return `/tag/${slugify(tag)}/`;
}
