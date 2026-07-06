import type { EntryMeta } from "./entries";
import { LINK_ALIASES } from "./link-aliases";

function escapeRegex(text: string) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function termPattern(title: string) {
  const escaped = escapeRegex(title);
  return /^\w[\w\s'-]*\w$|^\w+$/.test(title) ? `\\b${escaped}\\b` : escaped;
}

function protectMarkdown(text: string) {
  const placeholders: string[] = [];

  const protectedText = text.replace(
    /```[\s\S]*?```|`[^`\n]+`|\[[^\]]+\]\([^)]+\)/g,
    (match) => {
      const token = `\x00PH${placeholders.length}\x00`;
      placeholders.push(match);
      return token;
    },
  );

  return { protectedText, placeholders };
}

function restoreMarkdown(text: string, placeholders: string[]) {
  return text.replace(/\x00PH(\d+)\x00/g, (_, index) => placeholders[Number(index)]);
}

function sealMarkdownLinks(text: string, linkPlaceholders: string[]) {
  return text.replace(/\[[^\]]+\]\([^)]+\)/g, (match) => {
    const token = `\x00LK${linkPlaceholders.length}\x00`;
    linkPlaceholders.push(match);
    return token;
  });
}

function restoreMarkdownLinks(text: string, linkPlaceholders: string[]) {
  return text.replace(/\x00LK(\d+)\x00/g, (_, index) => linkPlaceholders[Number(index)]);
}

export function buildLinkTerms(entries: EntryMeta[], excludeSlug?: string) {
  const terms = new Map<string, { title: string; slug: string }>();

  for (const entry of entries) {
    if (entry.slug === excludeSlug) continue;
    const key = entry.title.toLowerCase();
    const existing = terms.get(key);
    const prefer =
      !existing ||
      (existing.slug.startsWith("glossary-") && !entry.slug.startsWith("glossary-"));
    if (prefer) {
      terms.set(key, { title: entry.title, slug: entry.slug });
    }
  }

  for (const entry of entries) {
    if (entry.slug === excludeSlug) continue;
    for (const relation of entry.linkedRelations || []) {
      if (!relation.slug || relation.slug === excludeSlug) continue;
      const key = relation.label.toLowerCase();
      if (!terms.has(key)) {
        terms.set(key, { title: relation.label, slug: relation.slug });
      }
    }
  }

  for (const [alias, slug] of Object.entries(LINK_ALIASES)) {
    if (slug === excludeSlug) continue;
    const entry = entries.find((item) => item.slug === slug);
    terms.set(alias.toLowerCase(), {
      title: alias,
      slug,
    });
    if (entry && !terms.has(entry.title.toLowerCase())) {
      terms.set(entry.title.toLowerCase(), { title: entry.title, slug: entry.slug });
    }
  }

  return [...terms.values()].sort((a, b) => b.title.length - a.title.length);
}

export function autoLinkMarkdown(content: string, entries: EntryMeta[], excludeSlug?: string) {
  const terms = buildLinkTerms(entries, excludeSlug).filter((term) => term.title.length >= 3);
  if (!terms.length) return content;

  const { protectedText, placeholders } = protectMarkdown(content);

  const linkedLines = protectedText.split("\n").map((line) => {
    if (/^#{1,6}\s/.test(line)) return line;

    let next = line;
    const linkPlaceholders: string[] = [];

    for (const term of terms) {
      next = sealMarkdownLinks(next, linkPlaceholders);
      const pattern = termPattern(term.title);
      const regex = new RegExp(`(?<!\\[)${pattern}(?!\\])`, "gi");
      next = next.replace(regex, (match) => `[${match}](/entry/${term.slug}/)`);
    }

    for (const term of terms) {
      next = sealMarkdownLinks(next, linkPlaceholders);
      const regex = new RegExp(`\\*${escapeRegex(term.title)}\\*`, "gi");
      next = next.replace(regex, `[${term.title}](/entry/${term.slug}/)`);
    }

    return restoreMarkdownLinks(next, linkPlaceholders);
  });

  return restoreMarkdown(linkedLines.join("\n"), placeholders);
}
