export type AiDirectWriteMode = 'draft_only' | 'direct_task_event';

export type AiDirectWriteKind = 'task' | 'event';

export type AiDirectWriteCommand = {
  kind: AiDirectWriteKind;
  title: string;
  scheduledAt: string;
  startAt?: string;
  endAt?: string;
  matchedDate: string;
  matchedTime: string;
};

const STORAGE_KEY = 'closeflow:ai-direct-write-mode:v1';
const SAVE_WORDS = /\b(zapisz|dodaj|utworz|utworzmy|stworz|wrzuc|notuj|zanotuj)\b/u;
const LEAD_WORDS = /\b(lead|leada|lida|kontakt|klient|klienta)\b/u;
const EVENT_WORDS = /\b(wydarzenie|spotkanie|termin|wizyta|rozmowa|call|prezentacja)\b/u;
const TASK_WORDS = /\b(zadanie|task|todo|przypomnienie|followup|follow-up)\b/u;

function canUseStorage() {
  return typeof window !== 'undefined' && Boolean(window.localStorage);
}

export function getStoredAiDirectWriteMode(): AiDirectWriteMode {
  if (!canUseStorage()) return 'draft_only';
  return window.localStorage.getItem(STORAGE_KEY) === 'direct_task_event' ? 'direct_task_event' : 'draft_only';
}

export function persistAiDirectWriteMode(mode: AiDirectWriteMode) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(STORAGE_KEY, mode);
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

  const atHour = text.match(/\bo\s+(\d{1,2})\b/u);
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

function cleanTitle(rawText: string, kind: AiDirectWriteKind, matchedDate: string, matchedTime: string) {
  const kindWords = kind === 'event'
    ? /\b(wydarzenie|spotkanie|termin|wizyta|rozmowa|call|prezentacja)\b/giu
    : /\b(zadanie|task|todo|przypomnienie|followup|follow-up)\b/giu;

  const title = rawText
    .split(matchedDate).join(' ')
    .split(matchedTime).join(' ')
    .replace(/\b(zapisz|dodaj|utworz|utworzmy|stworz|wrzuc|notuj|zanotuj)\b/giu, ' ')
    .replace(kindWords, ' ')
    .replace(/\b(mi|na|o|do|w|we|proszę|prosze)\b/giu, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (title) return title;
  return kind === 'event' ? 'Wydarzenie z AI' : 'Zadanie z AI';
}

export function parseAiDirectWriteCommand(rawText: string, now = new Date()): AiDirectWriteCommand | null {
  // AI_DIRECT_TASK_EVENT_GATE
  const normalized = normalize(rawText);
  if (!normalized || !SAVE_WORDS.test(normalized)) return null;
  if (LEAD_WORDS.test(normalized)) return null;

  const kind: AiDirectWriteKind | null = EVENT_WORDS.test(normalized)
    ? 'event'
    : TASK_WORDS.test(normalized)
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
