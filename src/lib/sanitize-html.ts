const ALLOWED_TAGS = ["p", "h2", "h3", "ul", "ol", "li", "strong", "em", "a", "br"];

export function sanitizeRichHtml(input: string) {
  let html = input.replace(/<\/?(script|style|iframe|object|embed|svg|form)[^>]*>/gi, "");
  html = html.replace(/\son[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "");
  html = html.replace(/\s(?:href|src)\s*=\s*["']\s*javascript:[^"']*["']/gi, "");
  html = html.replace(/<([a-z0-9]+)(\s[^>]*)?>/gi, (full, tag: string, attrs = "") => {
    const name = tag.toLowerCase();
    if (!ALLOWED_TAGS.includes(name)) return "";
    if (name === "br") return "<br>";
    if (name === "a") {
      const href = attrs.match(/href\s*=\s*["']([^"']+)["']/i)?.[1] || "";
      if (!/^(https?:|mailto:|tel:|\/)/i.test(href)) return "<a>";
      const safe = href.replace(/"/g, "&quot;");
      return "<a href=\"" + safe + "\" rel=\"noopener noreferrer\">";
    }
    return "<" + name + ">";
  });
  html = html.replace(/<\/(?!p|h2|h3|ul|ol|li|strong|em|a|br)[a-z0-9]+\s*>/gi, "");
  return html;
}
