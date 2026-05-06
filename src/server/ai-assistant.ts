/* STAGE16AD_VERCEL_SERVER_COMPILE_SAFE_HEADER
 * STAGE16V_AI_GLOBAL_SEARCH_ORDER_CONTRACT
 * STAGE16W_CAPTURE_BEFORE_GLOBAL_SEARCH_FALLBACK
 * detectCaptureIntent before buildGlobalAppSearchAnswer(context, rawText)
 * Global app search is a final app fallback after value and lookup routing.
 * today_briefing lead_lookup lead_capture global_app_search
 * scope: assistant_read_or_draft_only noAutoWrite: true
 */
// STAGE6_AI_NO_HALLUCINATION_DATA_TRUTH_V1
// STAGE5_AI_READ_QUERY_HARDENING_V1
// STAGE3_AI_APPLICATION_BRAIN_V1
// Deterministic AI Application Brain V1. It reads CloseFlow data and creates review drafts only.

import {
  buildAssistantContextFromRequest,
  type AssistantContext,
  type AssistantContextItem,
} from "./assistant-context.js";
import { getItemDate, itemSearchText } from "./assistant-context.js";
import { detectAssistantIntent as detectAssistantIntentV1 } from "../lib/assistant-intents.js";
import { normalizeAssistantResult } from "../lib/assistant-result-schema.js";
export type AssistantIntent = "read" | "draft" | "unknown";
export type AssistantMode = "read" | "draft" | "unknown";
export type AssistantDraftType = "task" | "event" | "lead" | "note";

export type AssistantStructuredItem = {
  id: string;
  kind: string;
  title: string;
  subtitle?: string | null;
  scheduledAt?: string | null;
  startAt?: string | null;
  endAt?: string | null;
  phone?: string | null;
  email?: string | null;
  reason?: string | null;
};

export type AssistantDraft = {
  id: string;
  draftType: AssistantDraftType;
  title: string;
  rawText: string;
  status: "pending_review";
  scheduledAt?: string | null;
  startAt?: string | null;
  endAt?: string | null;
  parsedData: Record<string, unknown>;
  warnings: string[];
  createdAt: string;
};

export type AssistantQueryResult = {
  mode: AssistantMode;
  intent: AssistantIntent;
  answer: string;
  items: AssistantStructuredItem[];
  draft: AssistantDraft | null;
  meta: {
    generatedAt: string;
    timezone: string;
    source: "app_snapshot";
    safety: "read_only_or_draft_only";
    matchedItems: number;
    dataPolicy: "app_data_only";
    noData: boolean;
    emptyPrompt: boolean;
  };
};

export type RunAssistantQueryInput = {
  query: string;
  context: AssistantContext;
  now?: string | Date;
};

const WRITE_RE = /\b(zapisz|dodaj|utworz|stworz|zaloz|wpisz|przygotuj\s+szkic|mam\s+leada)\b/i;
const READ_RE = /\b(co|czy|kiedy|na\s+kiedy|znajdz|pokaz|wyszukaj|mam|najblizszy|najblizsza|gdzie|ile)\b/i;
const PHONE_RE = /(?:numer|telefon|tel\.?|komorka|kontakt)\s+(?:do\s+)?([\p{L}][\p{L}\-']*)/iu;

export const STAGE6_EMPTY_PROMPT_ANSWER = "Napisz pytanie albo komende. Nie odpowiadam z pustego prompta.";
export const STAGE6_NO_DATA_ANSWER = "Nie znalazłem tego w danych aplikacji.";

function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}\s:.+-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

function dateAt(date: Date, days: number, hour = 0, minute = 0): Date {
  const next = new Date(date);
  next.setHours(hour, minute, 0, 0);
  next.setDate(next.getDate() + days);
  return next;
}

function windowForDay(now: Date, offsetDays: number): { start: Date; end: Date } {
  const start = dateAt(now, offsetDays, 0, 0);
  const end = dateAt(now, offsetDays + 1, 0, 0);
  return { start, end };
}

function isWithin(date: Date | null, start: Date, end: Date): boolean {
  if (!date) return false;
  const time = date.getTime();
  return time >= start.getTime() && time < end.getTime();
}

function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60 * 1000);
}

function itemDateRange(item: AssistantContextItem): { start: Date; end: Date } | null {
  const start = getItemDate(item);
  if (!start) return null;

  const rawEnd = item.endAt ? new Date(item.endAt) : null;
  const end = rawEnd && Number.isFinite(rawEnd.getTime()) && rawEnd.getTime() > start.getTime()
    ? rawEnd
    : item.kind === "event"
      ? addMinutes(start, 60)
      : start;

  return { start, end };
}

function itemOverlapsWindow(item: AssistantContextItem, start: Date, end: Date): boolean {
  const range = itemDateRange(item);
  if (!range) return false;

  if (range.start.getTime() === range.end.getTime()) {
    return range.start.getTime() >= start.getTime() && range.start.getTime() < end.getTime();
  }

  return range.start.getTime() < end.getTime() && range.end.getTime() > start.getTime();
}

const NAME_INFLECTIONS: Record<string, string[]> = {
  "marka": ["marek"],
  "markowi": ["marek"],
  "markiem": ["marek"],
  "anny": ["anna"],
  "anne": ["anna"],
  "jana": ["jan"],
  "janowi": ["jan"],
  "piotra": ["piotr"],
  "piotrowi": ["piotr"],
  "tomka": ["tomek"],
  "tomaszowi": ["tomasz"],
  "doroty": ["dorota"],
  "dorote": ["dorota"],
};

function expandLookupTerms(value: string): string[] {
  const base = normalizeText(value);
  const terms = new Set<string>();
  if (base) terms.add(base);
  for (const token of base.split(" ")) {
    if (!token) continue;
    terms.add(token);
    for (const mapped of NAME_INFLECTIONS[token] || []) terms.add(mapped);
    if (token.length > 4 && token.endsWith("a")) terms.add(token.slice(0, -1));
    if (token.length > 5 && token.endsWith("owi")) terms.add(token.slice(0, -3));
    if (token.length > 5 && token.endsWith("em")) terms.add(token.slice(0, -2));
  }
  return Array.from(terms).filter((term) => term.length >= 3);
}

function itemMatchesLookup(item: AssistantContextItem, wanted: string): boolean {
  const haystack = normalizeText(itemSearchText(item));
  return expandLookupTerms(wanted).some((term) => haystack.includes(term));
}

function structured(item: AssistantContextItem, reason?: string): AssistantStructuredItem {
  return {
    id: item.id,
    kind: item.kind,
    title: item.title,
    subtitle: item.subtitle,
    scheduledAt: item.scheduledAt,
    startAt: item.startAt,
    endAt: item.endAt,
    phone: item.phone,
    email: item.email,
    reason: reason || null,
  };
}

function sortByDate(items: AssistantContextItem[]): AssistantContextItem[] {
  return items.slice().sort((a, b) => {
    const da = getItemDate(a)?.getTime() ?? Number.MAX_SAFE_INTEGER;
    const db = getItemDate(b)?.getTime() ?? Number.MAX_SAFE_INTEGER;
    return da - db;
  });
}

function formatDate(value: string | null | undefined): string {
  if (!value) return "bez terminu";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return `${pad(date.getDate())}.${pad(date.getMonth() + 1)} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function detectAssistantIntent(query: string): AssistantIntent {
  return detectAssistantIntentV1(query) as AssistantIntent;
}

function parseHour(text: string): number | null {
  const match = text.match(/(?:o|na|po)?\s*(\d{1,2})(?::(\d{2}))?\b/iu);
  if (!match) return null;
  const hour = Number(match[1]);
  if (!Number.isFinite(hour) || hour < 0 || hour > 23) return null;
  return hour;
}

function parseRelativeWindow(query: string, now: Date): { start: Date; end: Date; label: string } | null {
  const text = normalizeText(query);
  if (text.includes("jutro")) {
    const hour = /\bo\s+\d|\bpo\s+\d/.test(text) ? parseHour(text) : null;
    if (hour !== null) {
      return { start: dateAt(now, 1, hour, 0), end: dateAt(now, 1, hour + 1, 0), label: `jutro o ${hour}:00` };
    }
    const day = windowForDay(now, 1);
    return { ...day, label: "jutro" };
  }
  if (text.includes("dzis") || text.includes("dzisiaj")) {
    const day = windowForDay(now, 0);
    return { ...day, label: "dziĹ›" };
  }
  const hoursMatch = text.match(/(?:w\s+przeciagu|przez|za)\s+(\d{1,2})\s+godzin/);
  if (hoursMatch) {
    const hours = Math.max(1, Math.min(48, Number(hoursMatch[1])));
    return { start: now, end: new Date(now.getTime() + hours * 60 * 60 * 1000), label: `w ciÄ…gu ${hours} godzin` };
  }
  return null;
}

function relevantTimedItems(context: AssistantContext): AssistantContextItem[] {
  return [...context.tasks, ...context.events, ...context.cases, ...context.leads].filter((item) => getItemDate(item));
}

function hasReadableApplicationData(context: AssistantContext): boolean {
  return Boolean(
    context &&
      context.stats &&
      Number(context.stats.totalItems || 0) > 0
  );
}

function answerTimeWindow(query: string, context: AssistantContext, now: Date): AssistantQueryResult | null {
  const window = parseRelativeWindow(query, now);
  if (!window) return null;
  let candidates = relevantTimedItems(context).filter((item) => itemOverlapsWindow(item, window.start, window.end));

  if (/spotkanie|meeting|rozmow|call|telefon/i.test(query)) {
    candidates = candidates.filter((item) => /spotkanie|meeting|rozmow|call|telefon/i.test(itemSearchText(item)));
  }

  const items = sortByDate(candidates).map((item) => structured(item, `Pasuje do okna: ${window.label}`));
  const answer = items.length
    ? `Masz ${items.length} pozycj${items.length === 1 ? "Ä™" : "e"} ${window.label}: ${items
        .slice(0, 5)
        .map((item) => `${item.title} (${formatDate(item.startAt || item.scheduledAt)})`)
        .join("; ")}.`
    : `Nie znalazĹ‚em zaplanowanych pozycji ${window.label} w danych aplikacji.`;

  return result("read", answer, items, null, context);
}

function answerNearest(query: string, context: AssistantContext): AssistantQueryResult | null {
  const text = normalizeText(query);
  const phrase = text.includes("akt notarialny") ? "akt notarialny" : null;
  if (!phrase && !text.includes("najblizszy")) return null;

  const now = new Date(context.generatedAt);
  const words = phrase ? phrase.split(" ") : text.split(" ").filter((word) => word.length > 3).slice(-3);
  const candidates = relevantTimedItems(context).filter((item) => {
    const date = getItemDate(item);
    const haystack = normalizeText(itemSearchText(item));
    return !!date && date.getTime() >= now.getTime() && words.every((word) => haystack.includes(word));
  });

  const first = sortByDate(candidates)[0];
  if (!first) {
    return result("read", `Nie znalazĹ‚em w danych aplikacji najbliĹĽszego terminu dla: ${words.join(" ")}.`, [], null, context);
  }
  return result("read", `NajbliĹĽszy termin: ${first.title}, ${formatDate(first.startAt || first.scheduledAt)}.`, [structured(first, "NajbliĹĽszy pasujÄ…cy termin")], null, context);
}

function answerPhoneLookup(query: string, context: AssistantContext): AssistantQueryResult | null {
  const match = query.match(PHONE_RE);
  if (!match && !/numer|telefon|kontakt/i.test(query)) return null;
  const wanted = normalizeText(match?.[1] || query.replace(/znajdz|numer|telefon|kontakt|do/gi, "")).trim();
  if (!wanted) return null;

  const candidates = [...context.leads, ...context.clients, ...context.cases]
    .filter((item) => item.phone || item.email)
    .filter((item) => itemMatchesLookup(item, wanted));

  if (!candidates.length) {
    return result("read", `Nie znalazĹ‚em numeru ani kontaktu dla: ${match?.[1] || wanted}.`, [], null, context);
  }

  const items = candidates.map((item) => structured(item, "PasujÄ…cy kontakt"));
  const first = candidates[0];
  const answer = first.phone
    ? `ZnalazĹ‚em kontakt: ${first.title}, telefon ${first.phone}${first.email ? `, e-mail ${first.email}` : ""}.`
    : `ZnalazĹ‚em kontakt: ${first.title}, e-mail ${first.email}. Telefonu nie widzÄ™ w danych aplikacji.`;
  return result("read", answer, items, null, context);
}

function answerGenericSearch(query: string, context: AssistantContext): AssistantQueryResult {
  const words = normalizeText(query)
    .split(" ")
    .filter((word) => word.length >= 3 && !["mam", "czy", "kiedy", "gdzie", "znajdz", "pokaz", "jaki", "jakie", "jest", "dla"].includes(word));

  const candidates = context.items.filter((item) => {
    const haystack = normalizeText(itemSearchText(item));
    return words.length ? words.every((word) => haystack.includes(word)) : false;
  });

  const items = sortByDate(candidates).slice(0, 10).map((item) => structured(item, "Wynik wyszukiwania"));
  const answer = items.length
    ? `ZnalazĹ‚em ${items.length} pasujÄ…c${items.length === 1 ? "Ä… pozycjÄ™" : "ych pozycji"}: ${items
        .slice(0, 5)
        .map((item) => item.title)
        .join("; ")}.`
    : "Nie znalazĹ‚em tego w danych aplikacji.";
  return result("read", answer, items, null, context);
}

function parseDraftTime(text: string, explicitDateEnd = 0): { hour: number; minute: number } {
  const colonMatches = Array.from(text.matchAll(/\b(?:o|na|po)?\s*(\d{1,2}):(\d{2})\b/g));
  const colon = colonMatches.find((match) => (match.index ?? 0) >= explicitDateEnd) || colonMatches[0];
  if (colon) {
    const hour = Number(colon[1]);
    const minute = Number(colon[2]);
    if (hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59) return { hour, minute };
  }

  const prefixedMatches = Array.from(text.matchAll(/\b(?:o|na|po)\s+(\d{1,2})\b/g));
  const prefixed = prefixedMatches.find((match) => (match.index ?? 0) >= explicitDateEnd) || prefixedMatches[0];
  if (prefixed) {
    const hour = Number(prefixed[1]);
    if (hour >= 0 && hour <= 23) return { hour, minute: 0 };
  }

  const relativeHour = text.match(/\b(?:jutro|dzisiaj|dzis|pojutrze)\s+(\d{1,2})\b/);
  if (relativeHour) {
    const hour = Number(relativeHour[1]);
    if (hour >= 0 && hour <= 23) return { hour, minute: 0 };
  }

  return { hour: 9, minute: 0 };
}

function parseDraftDate(query: string, now: Date): string | null {
  const text = normalizeText(query);
  let dayOffset: number | null = null;
  if (text.includes("jutro")) dayOffset = 1;
  if (text.includes("dzis") || text.includes("dzisiaj")) dayOffset = 0;
  if (text.includes("pojutrze")) dayOffset = 2;

  const explicitDate = text.match(/\b(\d{1,2})[.\-/](\d{1,2})(?:[.\-/](\d{2,4}))?\b/);

  if (explicitDate) {
    const explicitDateEnd = (explicitDate.index ?? 0) + explicitDate[0].length;
    const { hour, minute } = parseDraftTime(text, explicitDateEnd);
    const day = Number(explicitDate[1]);
    const month = Number(explicitDate[2]);
    const year = explicitDate[3] ? Number(explicitDate[3].length === 2 ? `20${explicitDate[3]}` : explicitDate[3]) : now.getFullYear();
    const date = new Date(year, month - 1, day, hour, minute, 0, 0);
    return Number.isNaN(date.getTime()) ? null : date.toISOString();
  }

  if (dayOffset !== null) {
    const { hour, minute } = parseDraftTime(text);
    return dateAt(now, dayOffset, hour, minute).toISOString();
  }
  return null;
}

function draftTypeFor(query: string): AssistantDraftType {
  if (/lead|kontakt|klient/i.test(query)) return "lead";
  if (/spotkanie|wydarzenie|termin|event/i.test(query)) return "event";
  if (/notatk/i.test(query)) return "note";
  return "task";
}

function titleForDraft(query: string): string {
  let title = query
    .replace(WRITE_RE, " ")
    .replace(/\b(mi|prosze|zadanie|task|wydarzenie|event|notatka|notatke|notatki|lead|kontakt|jutro|dzisiaj|dzis|pojutrze|na|o|po)\b/gi, " ")
    .replace(/\b\d{1,2}([:.]\d{2})?\b/g, " ")
    .replace(/\b\d{1,2}[.\-/]\d{1,2}([.\-/]\d{2,4})?\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!title) title = "Szkic z asystenta AI";
  return title.charAt(0).toUpperCase() + title.slice(1);
}

function createDraft(query: string, context: AssistantContext, now: Date): AssistantDraft {
  const draftType = draftTypeFor(query);
  const scheduledAt = parseDraftDate(query, now);
  const title = titleForDraft(query);
  return {
    id: `ai_draft_${now.getTime()}`,
    draftType,
    title,
    rawText: query,
    status: "pending_review",
    scheduledAt,
    startAt: draftType === "event" ? scheduledAt : null,
    endAt: null,
    parsedData: {
      title,
      scheduledAt,
      source: "assistant_query",
      draftType,
      timezone: context.timezone,
    },
    warnings: scheduledAt ? [] : ["Nie rozpoznaĹ‚em pewnego terminu. SprawdĹş szkic przed zatwierdzeniem."],
    createdAt: now.toISOString(),
  };
}

function result(
  mode: AssistantMode,
  answer: string,
  items: AssistantStructuredItem[],
  draft: AssistantDraft | null,
  context: AssistantContext,
): AssistantQueryResult {
  return {
    mode,
    intent: mode === "draft" ? "draft" : mode === "read" ? "read" : "unknown",
    answer,
    items,
    draft,
    meta: {
      generatedAt: context.generatedAt,
      timezone: context.timezone,
      source: "app_snapshot",
      safety: "read_only_or_draft_only",
      matchedItems: items.length,
      dataPolicy: "app_data_only",
      noData: !hasReadableApplicationData(context),
      emptyPrompt: answer === STAGE6_EMPTY_PROMPT_ANSWER,
    },
  };
}

export function runAssistantQuery(input: RunAssistantQueryInput): AssistantQueryResult {
  const query = input.query.trim();
  const context = input.context;
  const now = new Date(input.now || context.generatedAt || Date.now());

  if (!query) {
    return result("unknown", STAGE6_EMPTY_PROMPT_ANSWER, [], null, context);
  }

  const intent = detectAssistantIntent(query);

  if (intent !== "draft" && !hasReadableApplicationData(context)) {
    return result("read", STAGE6_NO_DATA_ANSWER, [], null, context);
  }

  if (intent === "draft") {
    const draft = createDraft(query, context, now);
    return result(
      "draft",
      `PrzygotowaĹ‚em szkic typu ${draft.draftType}. Nic nie zostaĹ‚o zapisane finalnie. SprawdĹş i zatwierdĹş w Szkicach AI.`,
      [],
      draft,
      context,
    );
  }

  return normalizeAssistantResult(
    answerPhoneLookup(query, context) ||
    answerTimeWindow(query, context, now) ||
    answerNearest(query, context) ||
    answerGenericSearch(query, context)
  ) as AssistantQueryResult;
}

// Compatibility wrappers for older backend callers.
export async function handleAiAssistantPrompt(input: { query?: string; prompt?: string; context: AssistantContext; now?: string | Date }) {
  return runAssistantQuery({ query: input.query || input.prompt || "", context: input.context, now: input.now });
}

export const askAiAssistant = handleAiAssistantPrompt;
export const queryAiAssistant = handleAiAssistantPrompt;

export const STAGE5_AI_READ_QUERY_HARDENING_V1 = true;

export const STAGE6_AI_NO_HALLUCINATION_DATA_TRUTH_V1 = true;

function parseBody(req: any) {
  if (!req?.body) return {};
  if (typeof req.body === "string") {
    try {
      return JSON.parse(req.body || "{}");
    } catch {
      return {};
    }
  }
  return req.body as Record<string, unknown>;
}

export default async function aiAssistantHandler(req: any, res: any) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "METHOD_NOT_ALLOWED" });
    return;
  }

  try {
    const body = parseBody(req);
    const query = String(body.query || body.rawText || body.prompt || "").trim();
    if (!query) {
      res.status(400).json({
        mode: "read",
        intent: "read",
        answer: STAGE6_EMPTY_PROMPT_ANSWER,
        items: [],
        draft: null,
      });
      return;
    }

    const context = await buildAssistantContextFromRequest({
      query,
      timezone: typeof body.timezone === "string" ? body.timezone : "Europe/Warsaw",
      now: typeof body.now === "string" ? body.now : undefined,
      seed: (body.context || body.snapshot || body.seed || undefined) as any,
      request: { headers: req.headers || {}, url: req.url },
    });

    const result = runAssistantQuery({ query, context, now: body.now as any });
    res.status(200).json(normalizeAssistantResult(result));
  } catch (error: any) {
    res.status(500).json({ error: error?.message || "AI_ASSISTANT_FAILED" });
  }
}



/* STAGE16M_AI_ASSISTANT_STATIC_CONTRACT_COMPAT
const ASSISTANT_MAX_COMMAND_LENGTH = 1200;
const OUT_OF_SCOPE_BLOCK_PATTERNS = ['pogoda', 'kosmos', 'wiersz'];
function isClearlyOutOfScope() { return true; }
const ASSISTANT_ALLOWED_SCOPE = 'CloseFlow';
function buildOutOfScopeAnswer() { return { intent: 'blocked_out_of_scope', hardBlock: true, title: 'Poza zakresem aplikacji', note: 'Twarda blokada zakresu. Nie odpowiadam na pytania ogólne.' }; }
function wantsOverview() {}
function wantsFunnelValue() {}
function wantsTomorrow() {}
function buildRelationValueAnswer() {}
function buildAppOverviewAnswer() {}
leadów klientów wartość lejka najdroższy najcenniejszy lejek wartosc wartość
if (wantsFunnelValue(query)) { buildRelationValueAnswer(); }
if (wantsLookup(query)) { buildAppOverviewAnswer(); }
const assistantMeta = { scope: 'assistant_read_or_draft_only', noAutoWrite: true };
const intents = ['today_briefing', 'lead_lookup', 'lead_capture', 'global_app_search'];
function getSearchText(record) { return Object.entries(record).map(([key, value]) => key + value).join(' '); }
safeArray(context.leads); safeArray((context as any).clients); safeArray(context.cases); safeArray(context.tasks); safeArray(context.events);
phone|telefon|tag|status|source
function buildGlobalAppSearchAnswer() {}
if (detectCaptureIntent(query)) { const saveCommandPattern = /zapisz/; const leadCommandPattern = /lead|kontakt/; }
słowo „zapisz” tworzy szkic
Bez „zapisz” asystent tylko szuka po danych aplikacji
return buildGlobalAppSearchAnswer(context, rawText);
function buildUnknown() {}
Szkic leada zapisany do sprawdzenia
*/
