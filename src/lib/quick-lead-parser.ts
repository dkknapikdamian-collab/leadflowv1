export type QuickLeadPriority = 'low' | 'medium' | 'high';

export type QuickLeadDraft = {
  contactName: string;
  phone: string;
  email: string;
  source: string;
  need: string;
  nextAction: string;
  dueAt: string;
  priority: QuickLeadPriority;
};

export const QUICK_LEAD_CAPTURE_STAGE27 = 'QUICK_LEAD_CAPTURE_STAGE27_RULE_PARSER';

const SOURCE_PATTERNS: Array<{ value: string; patterns: RegExp[] }> = [
  { value: 'facebook', patterns: [/facebook[a-ząćęłńóśźż]*/i, /\bfb\b/i, /\bfejs/i] },
  { value: 'instagram', patterns: [/\binstagram\b/i, /\binsta\b/i, /\big\b/i] },
  { value: 'messenger', patterns: [/\bmessenger\b/i, /\bmsg\b/i] },
  { value: 'whatsapp', patterns: [/\bwhatsapp\b/i, /\bwhats\b/i] },
  { value: 'email', patterns: [/\be-?mail\b/i, /\bmail\b/i] },
  { value: 'phone', patterns: [/\btelefon\b/i, /\bdzwoni/i, /\bpo rozmowie\b/i] },
  { value: 'form', patterns: [/\bformularz\b/i, /\bform\b/i] },
  { value: 'referral', patterns: [/\bpolecen/i, /\bz polecenia\b/i] },
];

function cleanWhitespace(value: string) {
  return value.replace(/\s+/g, ' ').trim();
}

function normalizePhone(value: string) {
  const raw = value.replace(/[^0-9+]/g, '');
  if (raw.startsWith('+48')) return raw.slice(3);
  if (raw.startsWith('48') && raw.length === 11) return raw.slice(2);
  return raw;
}

function detectPhone(text: string) {
  const match = text.match(/(?:\+48\s*)?(?:\d[\s.-]?){9,}/);
  if (!match) return '';
  const normalized = normalizePhone(match[0]);
  return normalized.length >= 9 ? normalized.slice(0, 12) : '';
}

function detectEmail(text: string) {
  const match = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  return match ? match[0].trim() : '';
}

function detectSource(text: string) {
  for (const source of SOURCE_PATTERNS) {
    if (source.patterns.some((pattern) => pattern.test(text))) return source.value;
  }
  return 'other';
}

function detectPriority(text: string): QuickLeadPriority {
  if (/\b(pilne|pilny|szybko|dzisiaj|dziś|dzis|asap|natychmiast)\b/i.test(text)) return 'high';
  if (/\b(niski|bez pośpiechu|bez pospiechu|kiedyś|kiedys)\b/i.test(text)) return 'low';
  return 'medium';
}

function detectContactName(text: string) {
  const withoutContact = text
    .replace(/(?:\+48\s*)?(?:\d[\s.-]?){9,}/g, ' ')
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, ' ');

  const honorificMatch = withoutContact.match(/\b(?:pan|pani)\s+([A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]+(?:\s+[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]+)?)/i);
  if (honorificMatch) return cleanWhitespace(honorificMatch[1]);

  const namedMatch = withoutContact.match(/\b(?:kontakt|klient|lead|osoba)[:\s-]+([A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]+(?:\s+[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]+)?)/i);
  if (namedMatch) return cleanWhitespace(namedMatch[1]);

  const firstCapitalized = withoutContact.match(/\b([A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]+(?:\s+[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]+)?)/);
  return firstCapitalized ? cleanWhitespace(firstCapitalized[1]) : '';
}

function detectNeed(text: string) {
  const patterns = [
    /(?:chce|potrzebuje|szuka|pyta o|w sprawie|interesuje się|interesuje sie)\s+(.+?)(?:[,.;]|\bzadzwonić\b|\boddzwonić\b|\bwysłać\b|\bumówić\b|$)/i,
    /(?:wycena|oferta|mieszkania|domu|działki|dzialki|strony|kampanii|dokumentów|dokumentow).{0,80}/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return cleanWhitespace(match[1] || match[0]).slice(0, 180);
  }

  return cleanWhitespace(text).slice(0, 180);
}

function detectNextAction(text: string) {
  const match = text.match(/(zadzwonić|oddzwonić|wysłać|umówić|napisać|skontaktować się|przypomnieć|sprawdzić).{0,90}/i);
  if (match) return cleanWhitespace(match[0]).slice(0, 140);
  if (/\bjutro\b|\bdzisiaj\b|\bdziś\b|\bpo\s+\d{1,2}\b|\bo\s+\d{1,2}\b/i.test(text)) return 'Skontaktować się z leadem';
  return '';
}

function setTime(base: Date, hour: number, minute = 0) {
  const next = new Date(base);
  next.setHours(Math.max(0, Math.min(23, hour)), Math.max(0, Math.min(59, minute)), 0, 0);
  return next;
}

function detectHour(text: string) {
  const match = text.match(/\b(?:po|o|około|okolo)\s*(\d{1,2})(?::(\d{2}))?\b/i);
  if (!match) return { hour: 9, minute: 0 };
  const rawHour = Number(match[1]);
  const hour = Number.isFinite(rawHour) ? rawHour : 9;
  const rawMinute = Number(match[2] || 0);
  const minute = Number.isFinite(rawMinute) ? rawMinute : 0;
  return { hour, minute };
}

function toLocalIsoWithoutSeconds(value: Date) {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, '0');
  const day = String(value.getDate()).padStart(2, '0');
  const hour = String(value.getHours()).padStart(2, '0');
  const minute = String(value.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hour}:${minute}`;
}

function detectDueAt(text: string, now = new Date()) {
  const lower = text.toLowerCase();
  const { hour, minute } = detectHour(text);
  const base = new Date(now);

  if (/\bjutro\b/.test(lower)) {
    base.setDate(base.getDate() + 1);
    return toLocalIsoWithoutSeconds(setTime(base, hour, minute));
  }

  if (/\b(dzisiaj|dziś|dzis)\b/.test(lower)) {
    return toLocalIsoWithoutSeconds(setTime(base, hour, minute));
  }

  if (/\bpo\s*\d{1,2}\b|\bo\s*\d{1,2}\b/i.test(text)) {
    return toLocalIsoWithoutSeconds(setTime(base, hour, minute));
  }

  return '';
}

export function parseQuickLeadNote(rawText: string, now = new Date()): QuickLeadDraft {
  const text = cleanWhitespace(String(rawText || ''));

  return {
    contactName: detectContactName(text),
    phone: detectPhone(text),
    email: detectEmail(text),
    source: detectSource(text),
    need: detectNeed(text),
    nextAction: detectNextAction(text),
    dueAt: detectDueAt(text, now),
    priority: detectPriority(text),
  };
}
