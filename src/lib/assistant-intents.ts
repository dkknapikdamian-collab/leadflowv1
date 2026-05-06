export type AssistantIntent = 'read' | 'draft' | 'unknown';

const WRITE_RE = /\b(zapisz|dodaj|utw[oó]rz|stw[oó]rz|za[lł][oó][zż]|wpisz|przygotuj\s+szkic|mam\s+leada)\b/i;
const READ_RE = /\b(co|czy|kiedy|na\s+kiedy|znajd[zź]|poka[zż]|wyszukaj|mam|najbli[zż]szy|najbli[zż]sza|gdzie|ile)\b/i;

export function detectAssistantIntent(query: string): AssistantIntent {
  const text = String(query || '').trim();
  if (!text) return 'unknown';
  if (WRITE_RE.test(text)) return 'draft';
  if (READ_RE.test(text) || text.endsWith('?')) return 'read';
  return 'read';
}

export function isWriteIntent(query: string) {
  return detectAssistantIntent(query) === 'draft';
}
