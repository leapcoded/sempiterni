const AUTHOR_TAIL_SECTION =
  /\n#{2,3} Open (Follow-Ups|Questions|Items|Naming Conflicts(?:\s*\([^)]+\))?)[\s\S]*$/i;

const ITALIC_AUTHOR_TAIL =
  /\n\*(What This Means for the Story|Open Follow-Ups|Doran's Origin)\*\s*\n[\s\S]*$/i;

export function decodeEntities(text) {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
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
    .replace(/whose name is left open for a future naming pass/gi, "whose name is not yet established");
}

function unwrapItalicParagraphs(text) {
  return text.replace(/^\*([^*\n][\s\S]*?)\*$/gm, "$1");
}

function stripTodoLines(text) {
  return text
    .replace(/^\*?\\?\[[ x]\]\\?.*$/gim, "")
    .replace(/^-\s*\\?\[[ x]\]\\?.*$/gim, "");
}

export function sanitizeReaderContent(content) {
  let text = decodeEntities(content);

  text = text.replace(AUTHOR_TAIL_SECTION, "");
  text = text.replace(ITALIC_AUTHOR_TAIL, "");

  text = text.replace(/^(\*[^*\n]*Lives in:[\s\S]*?\*\s*\n)+/m, "");
  text = text.replace(/^\*A note on [^*]+\*\s*\n*/im, "");

  text = text.replace(/\*\*Author-level only[^*]*\*\*[^\n]*/gi, "");
  text = text.replace(/\*Note:[^*]+\*/gi, "");

  text = text.replace(/\s*\*Source:[^*]+\*/gi, "");
  text = text.replace(/\s*\\\*Source:[^\\]+\\\*/gi, "");

  text = text.replace(/\s*Full documents?:[^.\n]+(?:\.[^.\n]+)?\.?/gi, "");
  text = text.replace(/\s*Full document:[^.\n]+\./gi, "");

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
