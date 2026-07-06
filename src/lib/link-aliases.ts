import aliases from "../data/link-aliases.json";

export const LINK_ALIASES = aliases as Record<string, string>;

export function resolveAliasSlug(label: string, entries: { slug: string; title: string }[]) {
  const direct = LINK_ALIASES[label] || LINK_ALIASES[label.trim()];
  if (direct) return direct;

  const lower = label.toLowerCase();
  const aliasEntry = Object.entries(LINK_ALIASES).find(([key]) => key.toLowerCase() === lower);
  if (aliasEntry) return aliasEntry[1];

  const byTitle = entries.find((entry) => entry.title.toLowerCase() === lower);
  return byTitle?.slug ?? null;
}
