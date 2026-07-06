import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { sanitizeReaderContent, stripGlossaryHeading } from "./sanitize-content.mjs";

const linkAliases = JSON.parse(
  fs.readFileSync(path.join(path.dirname(fileURLToPath(import.meta.url)), "../src/data/link-aliases.json"), "utf8"),
);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const loreDir = path.join(root, "lore");
const outFile = path.join(root, "src/data/entries.json");
const redirectsFile = path.join(root, "src/data/redirects.json");

const CATEGORY_TAGS = {
  "World & Lore": "world",
  Characters: "character",
  glossary: "glossary",
};

const SECTION_TAGS = {
  "Core Systems": "systems",
  "Factions & Power Structures": "factions",
  "History & Timeline": "history",
  "Locations & Sensory Detail": "locations",
  "The Convergence & Cosmology": "cosmology",
  Protagonists: "protagonist",
  Antagonists: "antagonist",
};

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function stripMarkdown(text) {
  return text
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function extractTitle(content, filename) {
  const match = content.match(/^#\s+(.+)$/m);
  if (match) return stripMarkdown(match[1]);
  return filename.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function extractExcerpt(content) {
  const lines = content.split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || trimmed.startsWith("*Lives in:")) continue;
    if (trimmed.startsWith("---")) continue;
    const clean = stripMarkdown(trimmed);
    if (clean.length > 40) return clean.slice(0, 220) + (clean.length > 220 ? "…" : "");
  }
  return "";
}

function extractRelations(content) {
  const relations = new Set();
  const patterns = [
    /\(see also:\s*([^)]+)\)/gi,
    /See also:\s*([^\n.]+)/gi,
    /See \*([^*]+)\*/gi,
    /\*Source:\s*([^*]+)\*/gi,
    /\*Lives in:\s*([^*]+)\*/gi,
  ];

  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      match[1]
        .split(/[;,]/)
        .map((part) => stripMarkdown(part))
        .forEach((part) => {
          if (part.length > 2 && part.length < 80) relations.add(part);
        });
    }
  }

  return [...relations];
}

function inferTags(relPath, title) {
  const parts = relPath.split(path.sep);
  const tags = new Set();

  if (parts[0] && CATEGORY_TAGS[parts[0]]) tags.add(CATEGORY_TAGS[parts[0]]);
  if (parts[1] && SECTION_TAGS[parts[1]]) tags.add(SECTION_TAGS[parts[1]]);

  const lower = `${relPath} ${title}`.toLowerCase();
  if (lower.includes("branch")) tags.add("branch");
  if (lower.includes("arbour")) tags.add("arbour");
  if (lower.includes("wayfarer")) tags.add("wayfarer");
  if (lower.includes("aetheris") || lower.includes("convergence")) tags.add("aetheris");
  if (lower.includes("penumbran")) tags.add("penumbran");
  if (lower.includes("cordis")) tags.add("cordis");
  if (lower.includes("badlands")) tags.add("badlands");
  if (lower.includes("installation")) tags.add("installations");

  return [...tags];
}

function walkMarkdown(dir, base = loreDir) {
  const entries = [];
  if (!fs.existsSync(dir)) return entries;

  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      entries.push(...walkMarkdown(full, base));
      continue;
    }
    if (!name.endsWith(".md")) continue;

    const relPath = path.relative(base, full);
    const content = fs.readFileSync(full, "utf8");
    const filename = name.replace(/\.md$/, "");

    if (filename === "glossary" && relPath === "glossary.md") {
      entries.push(...splitGlossary(content));
      continue;
    }

    const title = extractTitle(content, filename);
    const slug = slugify(filename);
    const sanitized = sanitizeReaderContent(content);
    entries.push({
      slug,
      title,
      category: relPath.split(path.sep)[0] || "Lore",
      section: relPath.split(path.sep).slice(1, -1).join(" / ") || "General",
      tags: inferTags(relPath, title),
      relations: extractRelations(content),
      excerpt: extractExcerpt(sanitized),
      sourcePath: relPath,
      content: sanitized,
    });
  }

  return entries;
}

function splitGlossary(content) {
  const parts = content.split(/\n(?=###\s+)/);
  const entries = [];

  for (const part of parts) {
    const heading = part.match(/^###\s+(.+)$/m);
    if (!heading) continue;

    const rawTitle = stripMarkdown(heading[1]).replace(/\s*\(see also:[^)]+\)\s*/i, "").trim();
    const slug = `glossary-${slugify(rawTitle)}`;
    const sanitized = sanitizeReaderContent(part.trim());
    const body = stripGlossaryHeading(sanitized);
    entries.push({
      slug,
      title: rawTitle,
      category: "Glossary",
      section: "Terms",
      tags: ["glossary", "term"],
      relations: extractRelations(part),
      excerpt: extractExcerpt(body),
      sourcePath: "glossary.md",
      content: body,
    });
  }

  return entries;
}

function resolveAliasSlug(label, entries) {
  const direct = linkAliases[label] || linkAliases[label.trim()];
  if (direct) return direct;

  const lower = label.toLowerCase();
  const aliasEntry = Object.entries(linkAliases).find(([key]) => key.toLowerCase() === lower);
  if (aliasEntry) return aliasEntry[1];

  const byTitle = entries.find((entry) => entry.title.toLowerCase() === lower);
  if (byTitle) return byTitle.slug;

  const termSlug = slugify(label);
  return entries.find((entry) => entry.slug === termSlug || entry.slug.endsWith(`-${termSlug}`))?.slug ?? null;
}

function findCanonicalSlug(entry, entries) {
  const seeMatch = entry.content.trim().match(/^See \*([^*]+)\*/i);
  if (seeMatch) {
    return resolveAliasSlug(seeMatch[1].trim(), entries);
  }

  if (entry.slug.startsWith("glossary-")) {
    const base = entry.slug.slice("glossary-".length);
    const full = entries.find((item) => item.slug === base && !item.slug.startsWith("glossary-"));
    if (full) return full.slug;
  }

  if (entry.slug === "glossary-cassan-vale") return "cassan-vale";

  return null;
}

function isStubEntry(entry, canonicalSlug) {
  if (!canonicalSlug || canonicalSlug === entry.slug) return false;
  const words = entry.content.trim().split(/\s+/).filter(Boolean).length;
  if (/^See \*/i.test(entry.content.trim())) return true;
  return entry.tags.includes("glossary") && words < 50;
}

function annotateStubs(entries) {
  for (const entry of entries) {
    const canonicalSlug = findCanonicalSlug(entry, entries);
    entry.canonicalSlug = canonicalSlug;
    entry.isStub = isStubEntry(entry, canonicalSlug);
  }
}

function linkRelations(entries) {
  const byTitle = new Map();
  const bySlug = new Map();

  for (const entry of entries) {
    bySlug.set(entry.slug, entry);
    byTitle.set(slugify(entry.title), entry.slug);
    byTitle.set(entry.title.toLowerCase(), entry.slug);
  }

  for (const [alias, slug] of Object.entries(linkAliases)) {
    byTitle.set(slugify(alias), slug);
    byTitle.set(alias.toLowerCase(), slug);
  }

  for (const entry of entries) {
    entry.linkedRelations = entry.relations
      .map((label) => {
        const clean = stripMarkdown(label);
        const key = slugify(clean);
        const slug =
          byTitle.get(key) ||
          byTitle.get(clean.toLowerCase()) ||
          resolveAliasSlug(clean, entries);
        if (!slug || slug === entry.slug) return null;
        const target = bySlug.get(slug);
        return target ? { label: target.title, slug: target.slug } : { label: clean, slug: null };
      })
      .filter(Boolean)
      .slice(0, 12);
  }
}

const entries = walkMarkdown(loreDir);

for (const entry of entries) {
  if (entry.excerpt || entry.sourcePath !== "glossary.md") continue;
  const seeMatch = entry.content.match(/^See \*([^*]+)\*\.?$/i);
  if (!seeMatch) continue;
  const term = seeMatch[1].trim().toLowerCase();
  const termSlug = slugify(seeMatch[1].trim());
  const target = entries.find(
    (item) =>
      item.title.toLowerCase() === term ||
      item.title.toLowerCase().includes(term) ||
      item.slug.includes(termSlug),
  );
  if (target?.excerpt) entry.excerpt = target.excerpt;
}

const redirects = {};
const canonicalEntries = [];

for (const entry of entries) {
  if (!entry.slug.startsWith("glossary-")) {
    canonicalEntries.push(entry);
    continue;
  }

  const canonical = entries.find(
    (item) => !item.slug.startsWith("glossary-") && item.title.toLowerCase() === entry.title.toLowerCase(),
  );

  if (canonical) {
    redirects[entry.slug] = canonical.slug;
    continue;
  }

  canonicalEntries.push(entry);
}

linkRelations(canonicalEntries);
annotateStubs(canonicalEntries);

canonicalEntries.sort((a, b) => a.title.localeCompare(b.title));

const tagSet = new Set();
for (const entry of canonicalEntries) entry.tags.forEach((tag) => tagSet.add(tag));

const manifest = {
  generatedAt: new Date().toISOString(),
  series: "Sempiterni",
  entryCount: canonicalEntries.length,
  tags: [...tagSet].sort(),
  entries: canonicalEntries.map(({ content, ...meta }) => meta),
};

fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, JSON.stringify(manifest, null, 2));
fs.writeFileSync(redirectsFile, JSON.stringify(redirects, null, 2));

const contentDir = path.join(root, "src/content/entries");
fs.rmSync(contentDir, { recursive: true, force: true });
fs.mkdirSync(contentDir, { recursive: true });

for (const entry of canonicalEntries) {
  fs.writeFileSync(path.join(contentDir, `${entry.slug}.md`), entry.content);
}

console.log(
  `Indexed ${canonicalEntries.length} entries with ${manifest.tags.length} tags (${Object.keys(redirects).length} redirects).`,
);
