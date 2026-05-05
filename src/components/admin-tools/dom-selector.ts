function cssEscapeSafe(value: string) {
  try {
    if (typeof CSS !== 'undefined' && typeof CSS.escape === 'function') return CSS.escape(value);
  } catch {
    // fallback below
  }
  return value.replace(/[^a-zA-Z0-9_-]/g, '\\$&');
}

export function readElementText(element: Element | null | undefined, maxLength = 120) {
  if (!element) return '';
  const aria = element.getAttribute('aria-label') || '';
  const title = element.getAttribute('title') || '';
  const text = (aria || title || element.textContent || '').replace(/\s+/g, ' ').trim();
  return text.length > maxLength ? `${text.slice(0, maxLength - 1)}…` : text;
}

export function getElementDataAttributes(element: Element | null | undefined) {
  const result: Record<string, string> = {};
  if (!element) return result;
  Array.from(element.attributes || []).forEach((attr) => {
    if (attr.name.startsWith('data-')) result[attr.name] = attr.value;
  });
  return result;
}

export function buildSelectorHint(element: Element | null | undefined) {
  if (!element) return '';
  const tag = element.tagName.toLowerCase();
  const testId = element.getAttribute('data-testid');
  const action = element.getAttribute('data-context-action') || element.getAttribute('data-action');
  const navPath = element.getAttribute('data-nav-path');
  const id = element.id;

  if (testId) return `[data-testid="${cssEscapeSafe(testId)}"]`;
  if (action) return `${tag}[data-context-action="${cssEscapeSafe(action)}"]`;
  if (navPath) return `${tag}[data-nav-path="${cssEscapeSafe(navPath)}"]`;
  if (id) return `${tag}#${cssEscapeSafe(id)}`;

  const classes = String((element as HTMLElement).className || '')
    .split(/\s+/)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 3);

  if (classes.length) return `${tag}.${classes.map(cssEscapeSafe).join('.')}`;
  return tag;
}

export function summarizeElement(element: Element | null | undefined) {
  if (!element) return '';
  const tag = element.tagName.toLowerCase();
  const text = readElementText(element, 48);
  const selector = buildSelectorHint(element);
  return text ? `${selector || tag} "${text}"` : selector || tag;
}
