// by cgpt: Keep short semantic units together while paragraphs still wrap naturally.
// Use ordinary spaces; only trusted local HTML is passed through the html option.
const atomicPhrases = /\b(?:Track[ \t]+\d+(?:\.\d+)?|WorldArena[ \t]+2\.0|(?:IROS|CoRL|ICRA|AAAI|MobiCom|RAL|RA-L|TIM|AEI|JCEM|NAMRC|Neurosci\.)[ \t]+(?:19|20)\d{2}|Under[ \t]+Review|(?:First|Second|Third)[ \t]+(?:Place|Prize)|\d+(?:st|nd|rd|th)[ \t]+(?:place|prize)|team[ \t]+lead|(?:Ranked?|Rank)[ \t]+\d+\/\d+|\d+\/\d+|(?:19|20)\d{2}[-–](?:(?:19|20)\d{2}|Present)|updated[ \t]+(?:19|20)\d{2})\b/giu;

const escapeHtml = (text: string) => text
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#39;");

export function inlineTextByCgpt(
  text: string,
  { html = false, names = false }: { html?: boolean; names?: boolean } = {},
): string {
  const markup = html ? text : escapeHtml(text);
  // by cgpt: Apply the matcher to text nodes, preserving strong/sup and attributes.
  const protectedMarkup = markup.split(/(<[^>]*>)/gu).map((part) => part.startsWith("<")
    ? part
    : part.replace(atomicPhrases, '<span class="inline-atomic-by-cgpt">$&</span>')
      // by cgpt: Include Chinese closing punctuation in the preceding glyph's line box.
      .replace(/[\p{Script=Han}A-Za-z0-9][）】]/gu, '<span class="inline-atomic-by-cgpt inline-punctuation-by-cgpt">$&</span>'),
  ).join("");
  if (!names) return protectedMarkup;

  // by cgpt: Keep each person intact, with ordinary separators between people.
  // Parenthetical roles remain separate so a name plus role cannot force overflow.
  return protectedMarkup.split(/(,[ \t]*(?![^()]*\)))/gu).map((part, index) => {
    if (index % 2 || !part.trim()) return part;
    const role = part.match(/^(.*?)([ \t]+\([^)]*\))$/u);
    const name = role ? role[1] : part;
    return `<span class="inline-atomic-by-cgpt">${name}</span>${role?.[2] ?? ""}`;
  }).join("");
}
