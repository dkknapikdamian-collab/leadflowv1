export type AiDirectWriteMode = 'draft_only' | 'direct_task_event';

export const AI_DIRECT_WRITE_ENABLED = false;

export type AiDirectWriteKind = 'lead' | 'task' | 'event';

export type AiDirectWriteLeadData = {
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  source?: string;
};

export type AiDirectWriteCommand = {
  kind: AiDirectWriteKind;
  title: string;
  scheduledAt?: string;
  startAt?: string;
  endAt?: string;
  matchedDate?: string;
  matchedTime?: string;
  leadData?: AiDirectWriteLeadData;
};

const STORAGE_KEY = 'closeflow:ai-direct-write-mode:v1';
const SAVE_WORDS = /\b(zapisz|dodaj|utworz|utworzmy|stworz|wrzuc|notuj|zanotuj)\b/u;
const LEAD_WORDS = /\b(lead|leada|lida|kontakt|kontaktu|klient|klienta)\b/u;
const EVENT_WORDS = /\b(wydarzenie|spotkanie|termin|wizyta|rozmowa|call|prezentacja)\b/u;
const TASK_WORDS = /\b(zadanie|task|todo|przypomnienie|followup|follow-up)\b/u;
const TASK_ACTION_WORDS = /\b(oddzwonic|oddzwonić|zadzwonic|zadzwonić|wyslac|wysłać|napisac|napisać|przypomniec|przypomnieć|sprawdzic|sprawdzić|zrobic|zrobić|wysylka|wysyłka)\b/u;

function canUseStorage() {
  return typeof window !== 'undefined' && Boolean(window.localStorage);
}

export function getStoredAiDirectWriteMode(): AiDirectWriteMode {
  return 'draft_only';
}

export function persistAiDirectWriteMode(_mode: AiDirectWriteMode) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(STORAGE_KEY, 'draft_only');
}

function pad2(value: number) {
  return String(value).padStart(2, '0');
}

function normalize(value: string) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseDateFromText(text: string, now: Date) {
  const normalized = normalize(text);
  const base = new Date(now);

  if (/\bdzisiaj\b/u.test(normalized)) {
    return { date: String(base.getFullYear()) + '-' + pad2(base.getMonth() + 1) + '-' + pad2(base.getDate()), matched: 'dzisiaj' };
  }

  if (/\bjutro\b/u.test(normalized)) {
    const next = new Date(base);
    next.setDate(next.getDate() + 1);
    return { date: String(next.getFullYear()) + '-' + pad2(next.getMonth() + 1) + '-' + pad2(next.getDate()), matched: 'jutro' };
  }

  if (/\bpojutrze\b/u.test(normalized)) {
    const next = new Date(base);
    next.setDate(next.getDate() + 2);
    return { date: String(next.getFullYear()) + '-' + pad2(next.getMonth() + 1) + '-' + pad2(next.getDate()), matched: 'pojutrze' };
  }

  const match = text.match(/\b(\d{1,2})[.\-/](\d{1,2})(?:[.\-/](\d{2,4}))?\b/u);
  if (!match) return null;

  const day = Number(match[1]);
  const month = Number(match[2]);
  let year = match[3] ? Number(match[3]) : base.getFullYear();
  if (year < 100) year += 2000;

  const parsed = new Date(year, month - 1, day);
  if (parsed.getFullYear() !== year || parsed.getMonth() !== month - 1 || parsed.getDate() !== day) return null;

  if (!match[3]) {
    const todayStart = new Date(base.getFullYear(), base.getMonth(), base.getDate());
    if (parsed.getTime() < todayStart.getTime()) {
      parsed.setFullYear(parsed.getFullYear() + 1);
    }
  }

  return { date: String(parsed.getFullYear()) + '-' + pad2(parsed.getMonth() + 1) + '-' + pad2(parsed.getDate()), matched: match[0] };
}

function parseTimeFromText(text: string) {
  const clock = text.match(/\b(\d{1,2})[:.](\d{2})\b/u);
  if (clock) {
    const hour = Number(clock[1]);
    const minute = Number(clock[2]);
    if (hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59) {
      return { time: pad2(hour) + ':' + pad2(minute), matched: clock[0] };
    }
  }

  const atHour = text.match(/\b(?:o|po)\s+(\d{1,2})\b/u);
  if (atHour) {
    const hour = Number(atHour[1]);
    if (hour >= 0 && hour <= 23) {
      return { time: pad2(hour) + ':00', matched: atHour[0] };
    }
  }

  return null;
}

function addMinutes(localIso: string, minutes: number) {
  const date = new Date(localIso);
  if (Number.isNaN(date.getTime())) return undefined;
  date.setMinutes(date.getMinutes() + minutes);
  return String(date.getFullYear()) + '-' + pad2(date.getMonth() + 1) + '-' + pad2(date.getDate()) + 'T' + pad2(date.getHours()) + ':' + pad2(date.getMinutes()) + ':00';
}

function cleanTitle(rawText: string, kind: AiDirectWriteKind, matchedDate?: string, matchedTime?: string) {
  const kindWords = kind === 'event'
    ? /\b(wydarzenie|spotkanie|termin|wizyta|rozmowa|call|prezentacja)\b/giu
    : /\b(zadanie|task|todo|przypomnienie|followup|follow-up)\b/giu;

  let title = rawText;
  if (matchedDate) title = title.split(matchedDate).join(' ');
  if (matchedTime) title = title.split(matchedTime).join(' ');

  title = title
    .replace(/\b(zapisz|dodaj|utworz|utworzmy|stworz|wrzuc|notuj|zanotuj)\b/giu, ' ')
    .replace(kindWords, ' ')
    .replace(/\b(mi|na|o|w|we|proszę|prosze)\b/giu, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (title) return title;
  return kind === 'event' ? 'Wydarzenie z AI' : 'Zadanie z AI';
}

function extractPhone(rawText: string) {
  const match = rawText.match(/(?:\+48\s*)?(?:\d[\s-]?){9,}/u);
  if (!match) return undefined;
  const digits = match[0].replace(/\D/g, '');
  const normalized = digits.startsWith('48') && digits.length === 11 ? digits.slice(2) : digits;
  return normalized.length === 9 ? normalized : undefined;
}

function extractEmail(rawText: string) {
  return rawText.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/iu)?.[0];
}

function extractSource(rawText: string) {
  const normalized = normalize(rawText);
  if (/\b(facebook|fb|fejs|fejsbuk)\b/u.test(normalized)) return 'Facebook';
  if (/\b(instagram|insta)\b/u.test(normalized)) return 'Instagram';
  if (/\b(google)\b/u.test(normalized)) return 'Google';
  if (/\b(olx)\b/u.test(normalized)) return 'OLX';
  if (/\b(polecenia|polecenie|rekomendacja)\b/u.test(normalized)) return 'Polecenie';
  if (/\b(formularz|formularza)\b/u.test(normalized)) return 'Formularz';
  return undefined;
}

function cleanupLeadName(rawText: string, phone?: string, email?: string, source?: string) {
  let cleaned = rawText;
  if (phone) cleaned = cleaned.replace(phone, ' ').replace(phone.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3'), ' ');
  if (email) cleaned = cleaned.replace(email, ' ');
  if (source) cleaned = cleaned.replace(new RegExp(source, 'giu'), ' ');

  cleaned = cleaned
    .replace(/\b(zapisz|dodaj|utworz|utworzmy|stworz|wrzuc|notuj|zanotuj)\b/giu, ' ')
    .replace(/\b(lead|leada|lida|kontakt|kontaktu|klient|klienta|nowy|nowego|z|ze|od|telefon|tel|numer|email|mail)\b/giu, ' ')
    .replace(/\b(facebooka|facebook|fb|instagrama|instagram|google|olx|polecenia|formularza|formularz)\b/giu, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const politeName = cleaned.match(/\b(Pan|Pani)\s+([A-ZŁŚŻŹĆŃÓĘ][\p{L}-]+(?:\s+[A-ZŁŚŻŹĆŃÓĘ][\p{L}-]+)?)/u);
  if (politeName) return (politeName[1] + ' ' + politeName[2]).trim();

  const titleCase = cleaned.match(/\b([A-ZŁŚŻŹĆŃÓĘ][\p{L}-]+(?:\s+[A-ZŁŚŻŹĆŃÓĘ][\p{L}-]+){0,2})\b/u);
  if (titleCase) return titleCase[1].trim();

  return cleaned.length >= 3 && cleaned.length <= 80 ? cleaned : '';
}

function parseLeadDirectWriteCommand(rawText: string): AiDirectWriteCommand | null {
  const phone = extractPhone(rawText);
  const email = extractEmail(rawText);
  const source = extractSource(rawText);
  const name = cleanupLeadName(rawText, phone, email, source);

  if (!name && !phone && !email) return null;

  const leadData: AiDirectWriteLeadData = {
    name: name || phone || email || 'Lead z AI',
  };
  if (phone) leadData.phone = phone;
  if (email) leadData.email = email;
  if (source) leadData.source = source;

  return {
    kind: 'lead',
    title: leadData.name,
    leadData,
  };
}

export function parseAiDirectWriteCommand(rawText: string, now = new Date()): AiDirectWriteCommand | null {
  void rawText;
  void now;
  // AI_DRAFT_ONLY_POLICY_STAGE10: direct write is disabled. This parser remains only as a dormant legacy utility.
  if (!AI_DIRECT_WRITE_ENABLED) return null;
  // AI_DIRECT_TASK_EVENT_GATE
  // AI_DIRECT_WRITE_RESPECTS_MODE_STAGE28
  const normalized = normalize(rawText);
  if (!normalized || !SAVE_WORDS.test(normalized)) return null;

  if (LEAD_WORDS.test(normalized)) {
    return parseLeadDirectWriteCommand(rawText);
  }

  const kind: AiDirectWriteKind | null = EVENT_WORDS.test(normalized)
    ? 'event'
    : (TASK_WORDS.test(normalized) || TASK_ACTION_WORDS.test(normalized))
      ? 'task'
      : null;
  if (!kind) return null;

  const date = parseDateFromText(rawText, now);
  const time = parseTimeFromText(rawText);
  if (!date || !time) return null;

  const scheduledAt = date.date + 'T' + time.time + ':00';
  const title = cleanTitle(rawText, kind, date.matched, time.matched);
  const result: AiDirectWriteCommand = {
    kind,
    title,
    scheduledAt,
    matchedDate: date.matched,
    matchedTime: time.matched,
  };

  if (kind === 'event') {
    result.startAt = scheduledAt;
    result.endAt = addMinutes(scheduledAt, 60);
  }

  return result;
}
