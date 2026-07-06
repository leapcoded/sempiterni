import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { sanitizeReaderContent } from "./sanitize-content.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const loreDir = path.join(root, "lore");
const outFile = path.join(root, "src/data/entries.json");

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
    entries.push({
      slug,
      title: rawTitle,
      category: "Glossary",
      section: "Terms",
      tags: ["glossary", "term"],
      relations: extractRelations(part),
      excerpt: extractExcerpt(sanitized),
      sourcePath: "glossary.md",
      content: sanitized,
    });
  }

  return entries;
}

function linkRelations(entries) {
  const byTitle = new Map();
  const bySlug = new Map();

  for (const entry of entries) {
    bySlug.set(entry.slug, entry);
    byTitle.set(slugify(entry.title), entry.slug);
    byTitle.set(entry.title.toLowerCase(), entry.slug);
  }

  for (const entry of entries) {
    entry.linkedRelations = entry.relations
      .map((label) => {
        const key = slugify(stripMarkdown(label));
        const slug = byTitle.get(key) || byTitle.get(label.toLowerCase());
        if (!slug || slug === entry.slug) return null;
        const target = bySlug.get(slug);
        return target ? { label: target.title, slug: target.slug } : { label: stripMarkdown(label), slug: null };
      })
      .filter(Boolean)
      .slice(0, 12);
  }
}

const entries = walkMarkdown(loreDir);
linkRelations(entries);

entries.sort((a, b) => a.title.localeCompare(b.title));

const tagSet = new Set();
for (const entry of entries) entry.tags.forEach((tag) => tagSet.add(tag));

const manifest = {
  generatedAt: new Date().toISOString(),
  series: "Sempiterni",
  entryCount: entries.length,
  tags: [...tagSet].sort(),
  entries: entries.map(({ content, ...meta }) => meta),
};

fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, JSON.stringify(manifest, null, 2));

const contentDir = path.join(root, "src/content/entries");
fs.rmSync(contentDir, { recursive: true, force: true });
fs.mkdirSync(contentDir, { recursive: true });

for (const entry of entries) {
  fs.writeFileSync(path.join(contentDir, `${entry.slug}.md`), entry.content);
}

console.log(`Indexed ${entries.length} entries with ${manifest.tags.length} tags.`);
