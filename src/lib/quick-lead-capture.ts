export type QuickLeadPriority = 'low' | 'normal' | 'high';
export type QuickLeadConfidence = 'low' | 'medium' | 'high' | 'unknown';

export type QuickLeadParsedData = {
  contactName: string | null;
  companyName: string | null;
  phone: string | null;
  email: string | null;
  source: string | null;
  need: string | null;
  nextAction: string | null;
  nextActionAt: string | null;
  priority: QuickLeadPriority;
  suggestedStatus: string | null;
  missingFields: string[];
  confidence: {
    contactName: QuickLeadConfidence;
    companyName: QuickLeadConfidence;
    phone: QuickLeadConfidence;
    email: QuickLeadConfidence;
    source: QuickLeadConfidence;
    need: QuickLeadConfidence;
    nextAction: QuickLeadConfidence;
    nextActionAt: QuickLeadConfidence;
    priority: QuickLeadConfidence;
  };
};

export type QuickLeadDraftStatus = 'idle' | 'pending' | 'ready' | 'confirmed' | 'cancelled' | 'failed';

export type QuickLeadDraft = {
  id: string;
  rawText: string | null;
  parsedData: QuickLeadParsedData | null;
  status: QuickLeadDraftStatus;
  provider: 'rule_parser';
  createdAt: string;
  updatedAt: string;
  confirmedAt: string | null;
  cancelledAt: string | null;
};

export type QuickLeadValidationResult = {
  ok: boolean;
  message: string | null;
};

const SOURCE_PATTERNS: Array<{ value: string; confidence: QuickLeadConfidence; patterns: RegExp[] }> = [
  { value: 'facebook', confidence: 'high', patterns: [/\bz facebooka\b/i, /\bz fb\b/i, /\bfacebook\b/i] },
  { value: 'instagram', confidence: 'high', patterns: [/\bz instagrama\b/i, /\binstagram\b/i, /\big\b/i] },
  { value: 'messenger', confidence: 'high', patterns: [/\bmessenger\b/i, /\bmesendżer\b/i] },
  { value: 'whatsapp', confidence: 'high', patterns: [/\bwhatsapp\b/i, /\bwhatsappa\b/i] },
  { value: 'email', confidence: 'medium', patterns: [/\bmaila\b/i, /\be-?maila\b/i, /\bz poczty\b/i] },
  { value: 'form', confidence: 'high', patterns: [/\bz formularza\b/i, /\bformularz\b/i] },
  { value: 'phone', confidence: 'medium', patterns: [/\bz telefonu\b/i, /\bdzwonił\b/i, /\bdzwonil\b/i, /\btelefon\b/i] },
  { value: 'referral', confidence: 'high', patterns: [/\bz polecenia\b/i, /\bpolecenie\b/i, /\bpolecił\b/i, /\bpolecil\b/i] },
  { value: 'cold_outreach', confidence: 'medium', patterns: [/\bcold\b/i, /\boutreach\b/i] },
  { value: 'other', confidence: 'low', patterns: [/\bolx\b/i, /\bz reklamy\b/i, /\breklama\b/i, /\bgoogle\b/i] },
];

const NEXT_ACTION_PATTERNS: Array<{ action: string; typeHint: string; patterns: RegExp[] }> = [
  { action: 'oddzwonić', typeHint: 'phone', patterns: [/oddzwonić/i, /oddzwonic/i] },
  { action: 'zadzwonić', typeHint: 'phone', patterns: [/zadzwonić/i, /zadzwonic/i, /zadzwoń/i, /zadzwon/i] },
  { action: 'wysłać ofertę', typeHint: 'send_offer', patterns: [/wysłać ofertę/i, /wyslac oferte/i, /ofertę wysłać/i, /oferte wyslac/i] },
  { action: 'wysłać maila', typeHint: 'reply', patterns: [/wysłać maila/i, /wyslac maila/i, /wysłać e-?mail/i, /wyslac e-?mail/i] },
  { action: 'umówić spotkanie', typeHint: 'meeting', patterns: [/umówić spotkanie/i, /umowic spotkanie/i, /spotkanie/i] },
  { action: 'przypomnieć', typeHint: 'follow_up', patterns: [/przypomnieć/i, /przypomniec/i, /follow[- ]?up/i] },
  { action: 'wrócić do tematu', typeHint: 'follow_up', patterns: [/wrócić do tematu/i, /wrocic do tematu/i] },
  { action: 'skontaktować się', typeHint: 'follow_up', patterns: [/skontaktować się/i, /skontaktowac sie/i] },
];

export const QUICK_LEAD_SOURCE_LABELS: Record<string, string> = {
  instagram: 'Instagram',
  facebook: 'Facebook',
  messenger: 'Messenger',
  whatsapp: 'WhatsApp',
  email: 'E-mail',
  form: 'Formularz',
  phone: 'Telefon',
  referral: 'Polecenie',
  cold_outreach: 'Cold Outreach',
  other: 'Inne',
};

export function validateQuickLeadRawText(rawText: string): QuickLeadValidationResult {
  const trimmed = rawText.trim();
  if (!trimmed) {
    return { ok: false, message: 'Wpisz albo podyktuj notatkę przed przetworzeniem.' };
  }
  if (trimmed.length < 5) {
    return { ok: false, message: 'Notatka jest za krótka, żeby przygotować szkic.' };
  }
  if (trimmed.length > 5000) {
    return { ok: false, message: 'Notatka jest za długa. Skróć ją do najważniejszych informacji po rozmowie.' };
  }
  return { ok: true, message: null };
}

export function createQuickLeadDraft(rawText: string, now: Date = new Date()): QuickLeadDraft {
  const parsedData = parseQuickLeadNote(rawText, now);
  const timestamp = now.toISOString();

  return {
    id: `quick_${now.getTime()}_${Math.random().toString(36).slice(2, 8)}`,
    rawText,
    parsedData,
    status: 'ready',
    provider: 'rule_parser',
    createdAt: timestamp,
    updatedAt: timestamp,
    confirmedAt: null,
    cancelledAt: null,
  };
}

export function confirmQuickLeadDraft(draft: QuickLeadDraft, now: Date = new Date()): QuickLeadDraft {
  return {
    ...draft,
    rawText: null,
    status: 'confirmed',
    updatedAt: now.toISOString(),
    confirmedAt: now.toISOString(),
  };
}

export function cancelQuickLeadDraft(draft: QuickLeadDraft, now: Date = new Date()): QuickLeadDraft {
  return {
    ...draft,
    rawText: null,
    status: 'cancelled',
    updatedAt: now.toISOString(),
    cancelledAt: now.toISOString(),
  };
}

export function parseQuickLeadNote(rawText: string, now: Date = new Date()): QuickLeadParsedData {
  const text = normalizeWhitespace(rawText);
  const email = extractEmail(text);
  const phone = extractPhone(text);
  const source = extractSource(text);
  const action = extractNextAction(text);
  const dateResult = extractNaturalDate(text, now);
  const priority = extractPriority(text);
  const contactName = extractContactName(text);
  const need = extractNeed(text, action?.action ?? null);

  const parsed: QuickLeadParsedData = {
    contactName,
    companyName: null,
    phone,
    email,
    source: source?.value ?? null,
    need,
    nextAction: action?.action ?? null,
    nextActionAt: dateResult.iso,
    priority: priority.value,
    suggestedStatus: 'new',
    missingFields: [],
    confidence: {
      contactName: contactName ? 'medium' : 'unknown',
      companyName: 'unknown',
      phone: phone ? 'high' : 'unknown',
      email: email ? 'high' : 'unknown',
      source: source?.confidence ?? 'unknown',
      need: need ? 'medium' : 'unknown',
      nextAction: action ? 'high' : 'unknown',
      nextActionAt: dateResult.confidence,
      priority: priority.confidence,
    },
  };

  return normalizeMissingFields(parsed);
}

export function normalizeMissingFields(data: QuickLeadParsedData): QuickLeadParsedData {
  const missingFields: string[] = [];
  if (!data.contactName) missingFields.push('contactName');
  if (!data.phone) missingFields.push('phone');
  if (!data.email) missingFields.push('email');
  if (!data.source) missingFields.push('source');
  if (!data.need) missingFields.push('need');
  if (!data.nextAction) missingFields.push('nextAction');
  if (!data.nextActionAt) missingFields.push('nextActionAt');

  return {
    ...data,
    missingFields,
  };
}

export function sanitizeQuickLeadParsedData(data: QuickLeadParsedData): QuickLeadParsedData {
  const priority: QuickLeadPriority = ['low', 'normal', 'high'].includes(data.priority) ? data.priority : 'normal';
  const source = data.source && QUICK_LEAD_SOURCE_LABELS[data.source] ? data.source : 'other';
  const nextActionAt = data.nextActionAt && !Number.isNaN(Date.parse(data.nextActionAt)) ? data.nextActionAt : null;

  return normalizeMissingFields({
    ...data,
    contactName: cleanNullable(data.contactName),
    companyName: cleanNullable(data.companyName),
    phone: cleanNullable(data.phone),
    email: cleanNullable(data.email),
    source,
    need: cleanNullable(data.need),
    nextAction: cleanNullable(data.nextAction),
    nextActionAt,
    priority,
    suggestedStatus: data.suggestedStatus || 'new',
  });
}

export function getQuickLeadTaskType(nextAction: string | null): string {
  if (!nextAction) return 'follow_up';
  const text = nextAction.toLowerCase();
  const match = NEXT_ACTION_PATTERNS.find((entry) => entry.patterns.some((pattern) => pattern.test(text)) || text.includes(entry.action));
  return match?.typeHint ?? 'follow_up';
}

export function formatQuickLeadDateForInput(iso: string | null): string {
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function fromDateTimeLocalInput(value: string): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
}

function extractEmail(text: string): string | null {
  const match = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  return match?.[0]?.toLowerCase() ?? null;
}

function extractPhone(text: string): string | null {
  const match = text.match(/(?:\+48\s*)?(?:\d[\s-]?){9,}/);
  if (!match) return null;
  const raw = match[0].replace(/[^+\d]/g, '');
  const withoutPrefix = raw.startsWith('+48') ? raw.slice(3) : raw;
  if (withoutPrefix.length !== 9) return null;
  return raw.startsWith('+48') ? `+48 ${groupPhone(withoutPrefix)}` : groupPhone(withoutPrefix);
}

function groupPhone(phone: string): string {
  return `${phone.slice(0, 3)} ${phone.slice(3, 6)} ${phone.slice(6, 9)}`;
}

function extractSource(text: string): { value: string; confidence: QuickLeadConfidence } | null {
  for (const source of SOURCE_PATTERNS) {
    if (source.patterns.some((pattern) => pattern.test(text))) {
      return { value: source.value, confidence: source.confidence };
    }
  }
  return null;
}

function extractPriority(text: string): { value: QuickLeadPriority; confidence: QuickLeadConfidence } {
  if (/\b(bardzo pilne|na już|na juz|pilne|szybko|ważne|wazne)\b/i.test(text)) {
    return { value: 'high', confidence: 'high' };
  }
  if (/\b(niepilne|może poczekać|moze poczekac|bez pośpiechu|bez pospiechu)\b/i.test(text)) {
    return { value: 'low', confidence: 'medium' };
  }
  return { value: 'normal', confidence: 'unknown' };
}

function extractNextAction(text: string): { action: string; typeHint: string } | null {
  for (const entry of NEXT_ACTION_PATTERNS) {
    if (entry.patterns.some((pattern) => pattern.test(text))) {
      return { action: entry.action, typeHint: entry.typeHint };
    }
  }
  return null;
}

function extractContactName(text: string): string | null {
  const honorific = text.match(/\b(Pan|Pani)\s+([A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]+(?:\s+[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]+)?)/);
  if (honorific) return `${honorific[1]} ${honorific[2]}`.trim();

  const firstToken = text.split(/[,.]/)[0]?.trim() ?? '';
  if (/^[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]{2,}(\s+[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]{2,})?$/.test(firstToken)) {
    return firstToken;
  }

  const simple = text.match(/^([A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]{2,})\b/);
  return simple?.[1] ?? null;
}

function extractNeed(text: string, nextAction: string | null): string | null {
  const wants = text.match(/(?:chce|potrzebuje|pyta o|interesuje go|interesuje ją|interesuje ja|w sprawie)\s+(.+?)(?:,|\.|;|\s+(?:oddzwonić|oddzwonic|zadzwonić|zadzwonic|wysłać|wyslac|umówić|umowic|przypomnieć|przypomniec)\b|$)/i);
  if (wants?.[1]) return trimNeed(wants[1]);

  const offer = text.match(/\b(ofert[ęeąa]?\s+na\s+[^,.;]+)/i);
  if (offer?.[1]) return trimNeed(offer[1]);

  if (nextAction) {
    const withoutAction = text.replace(new RegExp(nextAction, 'i'), '').split(/[,.]/)[0]?.trim();
    if (withoutAction && withoutAction.length > 8) return trimNeed(withoutAction);
  }

  return null;
}

function trimNeed(value: string): string {
  return value
    .replace(/\b(jutro|dzisiaj|dziś|dzis|pojutrze|rano|wieczorem|po południu|po poludniu|pilne|ważne|wazne)\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/[,.]$/, '');
}

function extractNaturalDate(text: string, now: Date): { iso: string | null; confidence: QuickLeadConfidence } {
  const lower = stripDiacritics(text.toLowerCase());
  let base = startOfLocalDay(now);
  let confidence: QuickLeadConfidence = 'unknown';

  if (/\bpojutrze\b/.test(lower)) {
    base = addLocalDays(base, 2);
    confidence = 'high';
  } else if (/\bjutro\b/.test(lower)) {
    base = addLocalDays(base, 1);
    confidence = 'high';
  } else if (/\b(dzisiaj|dzis)\b/.test(lower)) {
    confidence = 'high';
  } else if (/\bw przyszlym tygodniu\b/.test(lower)) {
    base = nextMonday(now);
    confidence = 'low';
  } else {
    const weekday = extractWeekday(lower, now);
    if (weekday) {
      base = weekday;
      confidence = 'medium';
    }
  }

  const relativeHours = lower.match(/\bza\s+(\d{1,2})\s+godzin/);
  if (relativeHours) {
    const date = new Date(now);
    date.setHours(date.getHours() + Number(relativeHours[1]), date.getMinutes(), 0, 0);
    return { iso: date.toISOString(), confidence: 'high' };
  }

  const time = extractTime(lower);
  if (time) {
    base.setHours(time.hour, time.minute, 0, 0);
    return { iso: base.toISOString(), confidence: confidence === 'unknown' ? 'medium' : confidence };
  }

  if (/\brano\b/.test(lower)) {
    base.setHours(9, 0, 0, 0);
    return { iso: base.toISOString(), confidence: confidence === 'unknown' ? 'low' : 'medium' };
  }

  if (/\b(po poludniu|popoludniu)\b/.test(lower)) {
    base.setHours(15, 0, 0, 0);
    return { iso: base.toISOString(), confidence: confidence === 'unknown' ? 'low' : 'medium' };
  }

  if (/\bwieczorem\b/.test(lower)) {
    base.setHours(18, 0, 0, 0);
    return { iso: base.toISOString(), confidence: confidence === 'unknown' ? 'low' : 'medium' };
  }

  if (confidence !== 'unknown') {
    base.setHours(9, 0, 0, 0);
    return { iso: base.toISOString(), confidence: confidence === 'high' ? 'medium' : confidence };
  }

  return { iso: null, confidence: 'unknown' };
}

function extractTime(text: string): { hour: number; minute: number } | null {
  const exact = text.match(/(?:\bo|\bpo)\s+(\d{1,2})(?::(\d{2}))?\b/);
  if (!exact) return null;
  const hour = Number(exact[1]);
  const minute = exact[2] ? Number(exact[2]) : 0;
  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return null;
  return { hour, minute };
}

function extractWeekday(text: string, now: Date): Date | null {
  const weekdays: Array<{ key: string; day: number }> = [
    { key: 'poniedzialek', day: 1 },
    { key: 'wtorek', day: 2 },
    { key: 'srode', day: 3 },
    { key: 'sroda', day: 3 },
    { key: 'czwartek', day: 4 },
    { key: 'piatek', day: 5 },
    { key: 'sobote', day: 6 },
    { key: 'sobota', day: 6 },
    { key: 'niedziele', day: 0 },
    { key: 'niedziela', day: 0 },
  ];

  const found = weekdays.find((weekday) => text.includes(weekday.key));
  if (!found) return null;

  const date = startOfLocalDay(now);
  const currentDay = date.getDay();
  let delta = found.day - currentDay;
  if (delta <= 0) delta += 7;
  return addLocalDays(date, delta);
}

function nextMonday(now: Date): Date {
  const date = startOfLocalDay(now);
  const currentDay = date.getDay();
  const delta = currentDay === 1 ? 7 : (8 - currentDay) % 7 || 7;
  return addLocalDays(date, delta);
}

function startOfLocalDay(date: Date): Date {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function addLocalDays(date: Date, days: number): Date {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy;
}

function normalizeWhitespace(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

function cleanNullable(value: string | null): string | null {
  const clean = value?.trim();
  return clean ? clean : null;
}

function stripDiacritics(value: string): string {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}
