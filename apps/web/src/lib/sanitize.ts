const ALLOWED_TAGS = new Set([
  'P',
  'BR',
  'HR',
  'UL',
  'OL',
  'LI',
  'STRONG',
  'B',
  'EM',
  'I',
  'U',
  'S',
  'A',
  'H1',
  'H2',
  'H3',
  'H4',
  'BLOCKQUOTE',
  'CODE',
  'PRE',
  'SPAN',
  'MARK',
]);

function safeHref(href: string): boolean {
  return /^(https?:|mailto:)/i.test(href.trim());
}

/** Allowlist HTML sanitizer for user notes (Tiptap output). Drops scripts, styles and handlers. */
export function sanitizeHtml(html: string): string {
  const doc = new DOMParser().parseFromString(`<div>${html}</div>`, 'text/html');
  const root = doc.body.firstElementChild;
  if (!root) return '';

  const walk = (node: Element) => {
    for (const child of Array.from(node.children)) {
      if (!ALLOWED_TAGS.has(child.tagName)) {
        if (['SCRIPT', 'STYLE', 'IFRAME', 'OBJECT'].includes(child.tagName)) child.remove();
        else child.replaceWith(...Array.from(child.childNodes));
        continue;
      }
      for (const attr of Array.from(child.attributes)) {
        const keep = child.tagName === 'A' && attr.name === 'href' && safeHref(attr.value);
        if (!keep) child.removeAttribute(attr.name);
      }
      if (child.tagName === 'A') {
        child.setAttribute('target', '_blank');
        child.setAttribute('rel', 'noopener noreferrer');
      }
      walk(child);
    }
  };
  // Re-run until stable, because unwrapping can surface new disallowed children.
  let previous = '';
  while (previous !== root.innerHTML) {
    previous = root.innerHTML;
    walk(root);
  }
  return root.innerHTML;
}
