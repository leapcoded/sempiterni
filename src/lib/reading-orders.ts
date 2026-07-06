import readingOrders from "../data/reading-orders.json";
import type { EntryMeta } from "./entries";
import { getEntry } from "./entries";

export type ReadingPath = {
  id: string;
  title: string;
  description: string;
  entries: EntryMeta[];
};

export function getReadingPaths(): ReadingPath[] {
  return readingOrders.paths.map((path) => ({
    id: path.id,
    title: path.title,
    description: path.description,
    entries: path.slugs.map((slug) => getEntry(slug)).filter((entry): entry is EntryMeta => Boolean(entry)),
  }));
}

export function getSectionReadingOrder(category: string, section: string) {
  const key = `${category}|${section}`;
  return (readingOrders.sections as Record<string, string[]>)[key] || null;
}
