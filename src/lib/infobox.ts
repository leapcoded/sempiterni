import infoboxData from "../data/infoboxes.json";
import type { EntryMeta } from "./entries";

export type InfoboxField = {
  label: string;
  value: string;
  href?: string;
};

export type Infobox = {
  kind: string;
  fields: InfoboxField[];
};

const infoboxes = infoboxData as Record<string, Record<string, string | string[]>>;

function inferCharacterFields(entry: EntryMeta, content: string): InfoboxField[] {
  const fields: InfoboxField[] = [];
  const intro = content.split("\n").slice(0, 12).join("\n");

  const species = intro.match(/\bis a ([^,\n]+?),/i)?.[1]?.trim();
  const age = intro.match(/(\d+)\s+years old/i)?.[1];
  const role = intro.match(/,\s*([^,\n]+?)\.\s*Precise/i)?.[1] || intro.match(/,\s*([^,\n]+?)\.\s*Physical/i)?.[1];

  if (species) fields.push({ label: "Species", value: species });
  if (age) fields.push({ label: "Age", value: age });
  if (role) fields.push({ label: "Role", value: role });
  if (entry.section) fields.push({ label: "Category", value: entry.section });

  return fields;
}

export function getInfobox(entry: EntryMeta, content: string): Infobox | null {
  const manual = infoboxes[entry.slug];
  const fields: InfoboxField[] = [];

  if (entry.entryType === "character") {
    if (manual) {
      for (const [key, value] of Object.entries(manual)) {
        if (key === "tags" || !value) continue;
        fields.push({ label: key[0].toUpperCase() + key.slice(1), value: String(value) });
      }
    }
    const inferred = inferCharacterFields(entry, content);
    for (const field of inferred) {
      if (!fields.some((item) => item.label === field.label)) fields.push(field);
    }
    return fields.length ? { kind: "Character", fields } : null;
  }

  if (!manual) return null;

  const kind = String(manual.type || entry.entryType || "Entry");
  for (const [key, value] of Object.entries(manual)) {
    if (key === "type" || key === "tags" || !value) continue;
    fields.push({ label: key[0].toUpperCase() + key.slice(1), value: String(value) });
  }

  return fields.length ? { kind, fields } : null;
}
