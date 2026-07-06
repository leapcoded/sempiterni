import entriesData from "../data/entries.json";
import fs from "node:fs";
import path from "node:path";
import { marked } from "marked";

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

export const manifest = entriesData as EntriesManifest;

export function getEntries() {
  return manifest.entries;
}

export function getTags() {
  return manifest.tags;
}

export function getEntry(slug: string) {
  return manifest.entries.find((entry) => entry.slug === slug);
}

export function renderMarkdown(content: string) {
  return marked.parse(content, { async: false }) as string;
}

export function getEntryContent(slug: string) {
  const file = path.join(process.cwd(), "src/content/entries", `${slug}.md`);
  if (!fs.existsSync(file)) return "";
  return fs.readFileSync(file, "utf8");
}
