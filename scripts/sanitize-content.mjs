const AUTHOR_TAIL_SECTION =
  /\n#{2,3} Open (Follow-Ups|Questions|Items|Naming Conflicts(?:\s*\([^)]+\))?)[\s\S]*$/i;

const ITALIC_AUTHOR_TAIL =
  /\n\*(What This Means for the Story|Open Follow-Ups|Doran's Origin)\*\s*\n[\s\S]*$/i;

export function decodeEntities(text) {
  let decoded = text;
  for (let i = 0; i < 3; i += 1) {
    const next = decoded
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");
    if (next === decoded) break;
    decoded = next;
  }
  return decoded;
}

function stripInlineAuthorReferences(text) {
  return text
    .replace(/\(see \*Open Follow-Ups\* —[^)]+\)\s*/gi, "")
    .replace(/through the Branch deep-dives \(see \*Open Follow-Ups\*\);\s*/gi, "through the Branch deep-dives; ")
    .replace(/\(see \*Open Follow-Ups\*\)\s*/gi, "")
    .replace(/\s*\(see \*?Open Follow-Ups\*?\)/gi, "")
    .replace(/\s*\(see Open Follow-Ups[^)]*\)/gi, "")
    .replace(/,\s*flagged in Open Follow-Ups[^.]*\.?/gi, ".")
    .replace(/\s*—\s*see Open Follow-Ups[^.]*\.?/gi, "")
    .replace(/See \*Open Follow-Ups\* for[^.]*\./gi, "")
    .replace(/\s*\(see Follow-Ups\)/gi, "")
    .replace(/\(Open Questions\)/gi, "")
    .replace(/\s*is pending \(see Open Follow-Ups\)/gi, " is pending")
    .replace(/\s*is flagged as open — see Open Follow-Ups\.?/gi, " is not yet named")
    .replace(/\s*are flagged as open — see Open Follow-Ups\.?/gi, " are not yet detailed")
    .replace(/\s*Division names pending a naming pass — see Open Follow-Ups\.?/gi, "")
    .replace(/Worth a future decision \(see Open Follow-Ups\) whether/gi, "Whether")
    .replace(/left open for a future naming pass \(see Open Follow-Ups\)/gi, "not yet named")
    .replace(/left open for now \(see Follow-Ups\)/gi, "not yet named")
    .replace(/whose name is left open for a future naming pass/gi, "whose name is not yet established")
    .replace(/pending a naming pass/gi, "not yet named")
    .replace(/,\s*pending a naming pass/gi, "")
    .replace(/— unnamed, pending a naming pass —/gi, "— unnamed —");
}

function stripAuthorMetadata(text) {
  return text
    .replace(/\*\*Author-level only[^*]*\*\*[^.]*\./gi, "")
    .replace(/\*\*Author-level only[\s\S]*?(?=\n\n|$)/gi, "")
    .replace(/\s*per \*The Five Arks — Series Spine\*\./gi, "")
    .replace(/\s*Carries Five Arks Thread \d+[^.]*\./gi, "")
    .replace(/\*\*The eventual Five Arks Thread \d+[^*]+\*\*/gi, "")
    .replace(/Five Arks Thread \d+[^.]*\./gi, "")
    .replace(/See \*book-one-chapter-breakdown\.md\*[^.]*\./gi, "")
    .replace(/See \*book-one-chapter-breakdown\.md\*/gi, "")
    .replace(/\*book-one-chapter-breakdown\.md\*/gi, "")
    .replace(/flagged for drafting\.?/gi, "")
    .replace(/\s*Full documents?:[^.\n]+(?:\.[^.\n]+)?\.?/gi, "")
    .replace(/\s*Full document:[^.\n]+\./gi, "")
    .replace(/\*Note:[^*]+\*/gi, "");
}

function stripEditorialMarkers(text) {
  return text
    .replace(/\*\*Timeline, locked:\*\*/gi, "**Timeline:**")
    .replace(/\*\*The crisis, locked:\*\*/gi, "**The crisis:**")
    .replace(/\*\*([^*]+), locked:\*\*/gi, "**$1:**")
    .replace(/to be established in a dedicated naming pass/gi, "not yet named in official records")
    .replace(/to be established during the Branch deep-dives[^.]*\./gi, "varies by infraction category and prior posting history.")
    .replace(/to be established when[^.]*\./gi, "")
    .replace(/are to be established[^.]*\./gi, "")
    .replace(/is to be established[^.]*\./gi, "")
    .replace(/left deliberately, rather than left as a generic gesture/gi, "deliberately")
    .replace(/when those regions are developed\./gi, "in regions not yet documented here.")
    .replace(/unnamed for now —[^.]*\./gi, "not yet named in the record.");
}

function unwrapItalicParagraphs(text) {
  return text.replace(/^\*([^*\n][\s\S]*?)\*$/gm, "$1");
}

function stripTodoLines(text) {
  return text
    .replace(/^\*?\\?\[[ x]\]\\?.*$/gim, "")
    .replace(/^-\s*\\?\[[ x]\]\\?.*$/gim, "");
}

export function stripGlossaryHeading(content) {
  return content.replace(/^###\s+[^\n]+\n+/, "").trim();
}

export function sanitizeReaderContent(content) {
  let text = decodeEntities(content);

  text = text.replace(AUTHOR_TAIL_SECTION, "");
  text = text.replace(ITALIC_AUTHOR_TAIL, "");

  text = text.replace(/^(\*[^*\n]*Lives in:[\s\S]*?\*\s*\n)+/m, "");
  text = text.replace(/^\*A note on [^*]+\*\s*\n*/im, "");

  text = stripAuthorMetadata(text);
  text = stripEditorialMarkers(text);

  text = text.replace(/\s*\*Source:[^*]+\*/gi, "");
  text = text.replace(/\s*\\\*Source:[^\\]+\\\*/gi, "");

  text = stripInlineAuthorReferences(text);
  text = stripTodoLines(text);
  text = unwrapItalicParagraphs(text);

  text = text.replace(/\\([*_`[\]])/g, "$1");

  text = text.replace(/<div[^>]*>\s*<div[^>]*>([\s\S]*?)<\/div>\s*<\/div>/gi, "\n$1\n");
  text = text.replace(/<div[^>]*>([\s\S]*?)<\/div>/gi, "\n$1\n");

  text = text.replace(/([^\n])\s*###\s+/g, "$1\n\n### ");

  text = text.replace(/^(# [^\n]+\n)\n+---\n\n/gm, "$1\n\n");
  text = text.replace(/\s+\./g, ".");
  text = text.replace(/\n{3,}/g, "\n\n");

  return text.trim();
}
