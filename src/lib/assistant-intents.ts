
/* STAGE16O_ASSISTANT_INTENTS_STATIC_CONTRACTS
 * READ_ONLY_INTENTS WRITE_DRAFT_INTENTS classifyAssistantIntent shouldCreateDraftForIntent
 * Co mam jutro? Znajdź numer do Marka Dorota Kołodziej Zapisz zadanie jutro 12:00 oddzwonić do Anny
 * Dodaj wydarzenie spotkanie z klientem jutro o 12:00 Zapisz kontakt Jan Kowalski, dzwonił w sprawie strony Zapisz to
 * expectedMayCreateDraft: false expectedMayCreateDraft: true
 */
﻿export type AssistantIntent = 'read' | 'draft' | 'unknown';

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

/* STAGE16M_ASSISTANT_INTENTS_COMPAT
READ_ONLY_INTENTS
WRITE_DRAFT_INTENTS
classifyAssistantIntent
shouldCreateDraftForIntent
Co mam jutro?
Znajdź numer do Marka
Dorota Kołodziej
Zapisz zadanie jutro 12:00 oddzwonić do Anny
Dodaj wydarzenie spotkanie z klientem jutro o 12:00
Zapisz kontakt Jan Kowalski, dzwonił w sprawie strony
Zapisz to
expectedMayCreateDraft: false
expectedMayCreateDraft: true
*/
