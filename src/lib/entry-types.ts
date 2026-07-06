import type { EntryMeta } from "./entries";

export type EntryType =
  | "character"
  | "glossary"
  | "term"
  | "location"
  | "branch"
  | "system"
  | "history"
  | "cosmology"
  | "faction"
  | "deprecated"
  | "article";

const LABELS: Record<EntryType, string> = {
  character: "Character",
  glossary: "Glossary",
  term: "Term",
  location: "Location",
  branch: "Branch",
  system: "System",
  history: "History",
  cosmology: "Cosmology",
  faction: "Faction",
  deprecated: "Deprecated",
  article: "Article",
};

export function getEntryTypeLabel(entry: EntryMeta) {
  const type = (entry.entryType || "article") as EntryType;
  return LABELS[type] || "Article";
}

export function getEntryTypeClass(entry: EntryMeta) {
  return `type-${(entry.entryType || "article").replace(/[^a-z0-9-]/g, "")}`;
}
