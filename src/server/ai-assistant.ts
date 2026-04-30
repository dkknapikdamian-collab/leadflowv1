import { tryGenerateJsonWithAiProvider } from './ai-provider.js';
type AssistantIntent = 'today_briefing' | 'lead_lookup' | 'lead_capture' | 'global_app_search' | 'blocked_out_of_scope' | 'unknown';

type AssistantItem = {
  label: string;
  detail?: string;
  href?: string;
  priority?: 'low' | 'medium' | 'high';
};

type AssistantResponse = {
  ok: true;
  scope: 'assistant_read_or_draft_only';
  provider: string;
  noAutoWrite: true;
  intent: AssistantIntent;
  title: string;
  summary: string;
  rawText: string;
  items: AssistantItem[];
  warnings: string[];
  suggestedCaptureText?: string;
  hardBlock?: boolean;
  allowedScope?: string[];
  costGuard?: 'local_rules' | 'external_ai' | 'client_guard';
};

const ASSISTANT_ALLOWED_SCOPE = [
  'tworzenie szkicu leada z podyktowanej notatki',
  'plan dnia z zadań i wydarzeń w aplikacji',
  'plan na jutro i najbliższe terminy',
  'liczba leadów, klientów, spraw, zadań i wydarzeń',
  'wartość lejka z leadów, klientów i spraw',
  'najcenniejsze leady, klienci i sprawy',
  'sprawdzenie kolejnego kroku dla istniejącego leada lub klienta',
  'sprawdzenie powiązanych zadań, wydarzeń i spraw',
  'zasada zapisu: powiedz zapisz, dodaj, nowy lead albo mam leada; bez tego asystent szuka w aplikacji',
];

const ASSISTANT_MAX_COMMAND_LENGTH = 800;
const AI_OPERATOR_SNAPSHOT_STAGE02_SERVER = true;

const OUT_OF_SCOPE_BLOCK_PATTERNS = [
  /\b(pogoda|pogode|pogod[ye]|temperatura|deszcz|snieg|śnieg|wiatr)\b/u,
  /\b(kosmos|wszechswiat|wszechświat|planeta|galaktyka|czarna dziura)\b/u,
  /\b(wiersz|poemat|opowiadanie|bajka|zart|żart|dowcip|piosenka)\b/u,
  /\b(przepis|ugotuj|obiad|kolacja|sniadanie|śniadanie|ciasto)\b/u,
  /\b(polityka|wybory|wojna|geopolityka|religia|historia)\b/u,
];

const VALUE_KEYS = [
  'dealValue',
  'deal_value',
  'value',
  'estimatedValue',
  'estimated_value',
  'potentialValue',
  'potential_value',
  'projectValue',
  'project_value',
  'contractValue',
  'contract_value',
  'budget',
  'amount',
  'totalValue',
  'total_value',
  'price',
];

function asText(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function safeArray(value: unknown): Record<string, unknown>[] {
  return Array.isArray(value) ? value.filter((item) => item && typeof item === 'object') as Record<string, unknown>[] : [];
}

function normalizeText(value: unknown) {
  return asText(value)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\p{L}\p{N}\s@.+-]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function getId(row: Record<string, unknown>) {
  return asText(row.id || row.uid || row.sourceId || row.clientId || row.caseId || row.leadId);
}

function getLeadDisplayName(lead: Record<string, unknown>) {
  return asText(lead.name) || asText(lead.company) || asText(lead.email) || asText(lead.phone) || 'Lead bez nazwy';
}

function getClientDisplayName(client: Record<string, unknown>) {
  return asText(client.name) || asText(client.company) || asText(client.clientName) || asText(client.email) || asText(client.phone) || 'Klient bez nazwy';
}

function getCaseDisplayName(caseRecord: Record<string, unknown>) {
  return asText(caseRecord.title) || asText(caseRecord.clientName) || asText(caseRecord.name) || asText(caseRecord.company) || 'Sprawa bez nazwy';
}


function getSearchText(record: Record<string, unknown>) {
  const values: string[] = [];

  for (const [key, value] of Object.entries(record)) {
    if (value === null || value === undefined) continue;

    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      values.push(String(value));
      continue;
    }

    if (Array.isArray(value)) {
      value.slice(0, 12).forEach((item) => {
        if (typeof item === 'string' || typeof item === 'number' || typeof item === 'boolean') {
          values.push(String(item));
        }
      });
      continue;
    }

    if (typeof value === 'object' && /note|notes|description|summary|message|comment|kontakt|contact|address|adres|email|phone|telefon|tag|status|source/i.test(key)) {
      values.push(JSON.stringify(value));
    }
  }

  return normalizeText(values.filter(Boolean).join(' '));
}

function getTaskMoment(task: Record<string, unknown>) {
  return asText(
    task.scheduledAt
    || task.scheduled_at
    || task.dueAt
    || task.due_at
    || task.dueDate
    || task.due_date
    || task.startAt
    || task.start_at
    || task.startsAt
    || task.starts_at
    || task.date
    || task.reminderAt
    || task.reminder_at
    || task.updatedAt
    || task.updated_at
    || task.createdAt
    || task.created_at
  );
}

function getEventMoment(event: Record<string, unknown>) {
  return asText(
    event.startAt
    || event.start_at
    || event.startsAt
    || event.starts_at
    || event.scheduledAt
    || event.scheduled_at
    || event.date
    || event.eventDate
    || event.event_date
    || event.reminderAt
    || event.reminder_at
    || event.updatedAt
    || event.updated_at
    || event.createdAt
    || event.created_at
  );
}

function parseDate(value: unknown) {
  const text = asText(value);
  if (!text) return null;
  const parsed = new Date(text.includes('T') ? text : `${text}T09:00:00`);
  return Number.isFinite(parsed.getTime()) ? parsed : null;
}

function formatShort(value: unknown) {
  const parsed = parseDate(value);
  if (!parsed) return 'Bez terminu';
  return parsed.toLocaleString('pl-PL', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatMoney(value: number) {
  return `${Math.round(Number(value) || 0).toLocaleString('pl-PL')} PLN`;
}

function startOfDay(now: Date, offsetDays = 0) {
  const result = new Date(now);
  result.setDate(result.getDate() + offsetDays);
  result.setHours(0, 0, 0, 0);
  return result;
}

function endOfDay(now: Date, offsetDays = 0) {
  const result = new Date(now);
  result.setDate(result.getDate() + offsetDays);
  result.setHours(23, 59, 59, 999);
  return result;
}

function isOpenStatus(value: unknown) {
  const status = asText(value).toLowerCase();
  return !['done', 'completed', 'cancelled', 'canceled', 'archived'].includes(status);
}

function isDueInRange(value: unknown, from: Date, to: Date) {
  const parsed = parseDate(value);
  if (!parsed) return false;
  return parsed.getTime() >= from.getTime() && parsed.getTime() <= to.getTime();
}

function isDueBeforeOrInRange(value: unknown, to: Date) {
  const parsed = parseDate(value);
  if (!parsed) return false;
  return parsed.getTime() <= to.getTime();
}

function taskHref(task: Record<string, unknown>) {
  const leadId = asText(task.leadId);
  const caseId = asText(task.caseId);
  if (leadId) return `/leads/${leadId}`;
  if (caseId) return `/cases/${caseId}`;
  return '/tasks';
}

function eventHref(event: Record<string, unknown>) {
  const leadId = asText(event.leadId);
  const caseId = asText(event.caseId);
  if (leadId) return `/leads/${leadId}`;
  if (caseId) return `/cases/${caseId}`;
  return '/calendar';
}

function parseMoneyValue(value: unknown) {
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
  if (typeof value !== 'string') return 0;

  const normalized = value
    .replace(/\s+/g, '')
    .replace(/pln/gi, '')
    .replace(/zł/gi, '')
    .replace(',', '.')
    .replace(/[^0-9.-]/g, '');

  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

function getRecordValue(record: Record<string, unknown>) {
  for (const key of VALUE_KEYS) {
    const value = parseMoneyValue(record[key]);
    if (value > 0) return value;
  }
  return 0;
}

function buildValueEntries(context: Record<string, unknown>) {
  const leads = safeArray(context.leads);
  const clients = safeArray((context as any).clients);
  const cases = safeArray(context.cases);
  const map = new Map<string, AssistantItem & { value: number }>();

  const upsert = (key: string, item: AssistantItem & { value: number }) => {
    if (item.value <= 0) return;
    const current = map.get(key);
    if (!current || item.value >= current.value) map.set(key, item);
  };

  leads.forEach((lead, index) => {
    const id = getId(lead) || String(index);
    const leadRelationId = asText(lead.id || lead.leadId || id);
    upsert(`lead:${leadRelationId}`, {
      label: getLeadDisplayName(lead),
      detail: `Lead · ${formatMoney(getRecordValue(lead))}`,
      href: id ? `/leads/${id}` : '/leads',
      priority: 'medium',
      value: getRecordValue(lead),
    });
  });

  clients.forEach((client, index) => {
    const id = getId(client) || String(index);
    const relationId = asText(client.leadId || client.clientId || id);
    upsert(`client:${relationId}`, {
      label: getClientDisplayName(client),
      detail: `Klient · ${formatMoney(getRecordValue(client))}`,
      href: id ? `/clients/${id}` : '/clients',
      priority: 'high',
      value: getRecordValue(client),
    });
  });

  cases.forEach((caseRecord, index) => {
    const id = getId(caseRecord) || String(index);
    const relationId = asText(caseRecord.leadId || caseRecord.clientId || id);
    upsert(`case:${relationId}`, {
      label: getCaseDisplayName(caseRecord),
      detail: `Sprawa / klient · ${formatMoney(getRecordValue(caseRecord))}`,
      href: id ? `/cases/${id}` : '/cases',
      priority: 'high',
      value: getRecordValue(caseRecord),
    });
  });

  return [...map.values()].sort((a, b) => b.value - a.value);
}


function getDateOffsetFromAssistantQuery(query: string) {
  if (/\b(pojutrze|po jutrze)\b/u.test(query)) return 2;
  if (/\b(jutro|jutrzejszy|jutrzejsze|jutrzejsza|na jutro|co jutro|mam jutro)\b/u.test(query)) return 1;
  if (/\b(dzis|dzisiaj|dziś|na dzis|na dziś|co mam|plan dnia|moj dzien|mój dzień)\b/u.test(query)) return 0;
  return null;
}

function buildDateBriefing(context: Record<string, unknown>, rawText: string, now: Date, offsetDays: number): AssistantResponse {
  const from = startOfDay(now, offsetDays);
  const to = endOfDay(now, offsetDays);
  const includeOverdue = offsetDays === 0;
  const dayLabel = offsetDays === 1 ? 'jutro' : 'dziś';

  const tasks = safeArray(context.tasks)
    .filter((task) => isOpenStatus(task.status) && (includeOverdue ? isDueBeforeOrInRange(getTaskMoment(task), to) : isDueInRange(getTaskMoment(task), from, to)))
    .sort((a, b) => (parseDate(getTaskMoment(a))?.getTime() ?? Number.MAX_SAFE_INTEGER) - (parseDate(getTaskMoment(b))?.getTime() ?? Number.MAX_SAFE_INTEGER));

  const events = safeArray(context.events)
    .filter((event) => isOpenStatus(event.status) && isDueInRange(getEventMoment(event), from, to))
    .sort((a, b) => (parseDate(getEventMoment(a))?.getTime() ?? Number.MAX_SAFE_INTEGER) - (parseDate(getEventMoment(b))?.getTime() ?? Number.MAX_SAFE_INTEGER));

  const items: AssistantItem[] = [
    ...tasks.slice(0, 6).map((task) => ({
      label: asText(task.title) || 'Zadanie',
      detail: `Zadanie · ${formatShort(getTaskMoment(task))}`,
      href: taskHref(task),
      priority: asText(task.priority) === 'high' ? 'high' : asText(task.priority) === 'low' ? 'low' : 'medium',
    } as AssistantItem)),
    ...events.slice(0, 4).map((event) => ({
      label: asText(event.title) || 'Wydarzenie',
      detail: `Wydarzenie · ${formatShort(getEventMoment(event))}`,
      href: eventHref(event),
      priority: 'medium' as const,
    })),
  ].slice(0, 10);

  return {
    ok: true,
    scope: 'assistant_read_or_draft_only',
    provider: 'rules',
    noAutoWrite: true,
    intent: 'today_briefing',
    title: items.length ? `Plan na ${dayLabel}` : `Na ${dayLabel} nie widzę pilnych akcji`,
    summary: items.length
      ? `Widzę ${tasks.length} zadań i ${events.length} wydarzeń na ${dayLabel}${includeOverdue ? ' albo zaległych' : ''}. Najpierw rusz pozycje z góry listy.`
      : `Nie znalazłem otwartych zadań ani wydarzeń przypadających na ${dayLabel}.`,
    rawText,
    items,
    warnings: [],
  };
}

function buildAppOverviewAnswer(context: Record<string, unknown>, rawText: string): AssistantResponse {
  const leads = safeArray(context.leads);
  const clients = safeArray((context as any).clients);
  const cases = safeArray(context.cases);
  const tasks = safeArray(context.tasks).filter((task) => isOpenStatus(task.status));
  const events = safeArray(context.events).filter((event) => isOpenStatus(event.status));
  const drafts = safeArray((context as any).drafts);
  const pendingDrafts = drafts.filter((draft) => asText(draft.status).toLowerCase() === 'draft' || !asText(draft.status));
  const valueEntries = buildValueEntries(context);
  const funnelValue = valueEntries.reduce((sum, item) => sum + item.value, 0);

  return {
    ok: true,
    scope: 'assistant_read_or_draft_only',
    provider: 'rules',
    noAutoWrite: true,
    intent: 'today_briefing',
    title: 'Szybki stan aplikacji',
    summary: `Leady: ${leads.length}. Klienci: ${clients.length}. Sprawy: ${cases.length}. Otwarte zadania: ${tasks.length}. Otwarte wydarzenia: ${events.length}. Szkice AI do sprawdzenia: ${pendingDrafts.length}. Wartość lejka: ${formatMoney(funnelValue)}.`,
    rawText,
    items: [
      { label: `Leady: ${leads.length}`, detail: 'Aktywne kontakty sprzedażowe', href: '/leads', priority: 'medium' },
      { label: `Klienci: ${clients.length}`, detail: 'Kontakty przeniesione do obsługi klienta', href: '/clients', priority: 'medium' },
      { label: `Sprawy: ${cases.length}`, detail: 'Operacje po sprzedaży', href: '/cases', priority: 'medium' },
      { label: `Wartość lejka: ${formatMoney(funnelValue)}`, detail: 'Leady + klienci + sprawy z wartością', href: '/leads', priority: 'high' },
      { label: `Szkice AI: ${pendingDrafts.length}`, detail: 'Robocze zapisy do ręcznego sprawdzenia', href: '/ai-drafts', priority: pendingDrafts.length ? 'high' : 'low' },
    ],
    warnings: [],
  };
}

function buildRelationValueAnswer(context: Record<string, unknown>, rawText: string): AssistantResponse {
  const entries = buildValueEntries(context);
  const total = entries.reduce((sum, item) => sum + item.value, 0);
  const topEntries = entries.slice(0, 8);

  return {
    ok: true,
    scope: 'assistant_read_or_draft_only',
    provider: 'rules',
    noAutoWrite: true,
    intent: 'today_briefing',
    title: 'Wartość lejka',
    summary: entries.length
      ? `Łączna wartość leadów, klientów i spraw: ${formatMoney(total)}. Poniżej najcenniejsze pozycje.`
      : 'Nie widzę jeszcze wartości przypisanych do leadów, klientów ani spraw.',
    rawText,
    items: topEntries.map((entry) => ({
      label: entry.label,
      detail: entry.detail,
      href: entry.href,
      priority: entry.priority,
    })),
    warnings: entries.length ? [] : ['Dodaj wartość przy leadzie, kliencie albo sprawie, żeby lejek był liczony poprawnie.'],
  };
}

type AppSearchKind = 'lead' | 'client' | 'case' | 'task' | 'event' | 'draft';

function getSearchTerms(query: string) {
  const stopWords = new Set([
    'jaki', 'jaka', 'jakie', 'jest', 'moj', 'moja', 'moje', 'mój', 'czy', 'dla', 'tego', 'tej', 'ten', 'tym', 'tam', 'mam', 'pokaz', 'pokaż', 'znajdz', 'znajdź', 'szukaj', 'gdzie', 'ktory', 'który', 'ktora', 'która', 'kontakt', 'lead', 'leada', 'klient', 'klienta', 'sprawa', 'zadanie', 'wydarzenie', 'email', 'mail', 'telefon', 'numer', 'adres'
  ]);
  return query.split(' ').map((term) => term.trim()).filter((term) => term.length >= 3 && !stopWords.has(term));
}

function getKindLabel(kind: AppSearchKind) {
  if (kind === 'client') return 'Klient';
  if (kind === 'case') return 'Sprawa';
  if (kind === 'task') return 'Zadanie';
  if (kind === 'event') return 'Wydarzenie';
  if (kind === 'draft') return 'Szkic AI';
  return 'Lead';
}

function getGenericTitle(kind: AppSearchKind, record: Record<string, unknown>) {
  if (kind === 'client') return getClientDisplayName(record);
  if (kind === 'case') return getCaseDisplayName(record);
  if (kind === 'task') return asText(record.title) || asText(record.name) || 'Zadanie';
  if (kind === 'event') return asText(record.title) || asText(record.name) || 'Wydarzenie';
  if (kind === 'draft') return asText(record._assistantTitle) || asText(record.rawText) || asText(record.raw_text) || 'Szkic AI';
  return getLeadDisplayName(record);
}

function getGenericHref(kind: AppSearchKind, record: Record<string, unknown>) {
  const id = getId(record);
  if (kind === 'client') return id ? '/clients/' + id : '/clients';
  if (kind === 'case') return id ? '/cases/' + id : '/cases';
  if (kind === 'task') return taskHref(record);
  if (kind === 'event') return eventHref(record);
  if (kind === 'draft') return '/ai-drafts';
  return id ? '/leads/' + id : '/leads';
}

function buildGenericDetail(kind: AppSearchKind, record: Record<string, unknown>) {
  const parts = [getKindLabel(kind)];
  const email = asText(record.email || record.mail || record.contactEmail);
  const phone = asText(record.phone || record.telefon || record.mobile || record.contactPhone);
  const status = asText(record.status || record.stage || record.state);
  const company = asText(record.company || record.clientName);
  const value = getRecordValue(record);
  const moment = kind === 'task' ? getTaskMoment(record) : kind === 'event' ? getEventMoment(record) : '';
  if (kind === 'draft') {
    const rawText = asText(record.rawText || record.raw_text);
    const draftType = asText(record.type) || 'lead';
    const status = asText(record.status) || 'draft';
    return ['Szkic AI', 'typ: ' + draftType, 'status: ' + status, rawText ? 'treść: ' + rawText.slice(0, 140) : 'bez treści'].join(' · ');
  }
  if (company) parts.push('firma: ' + company);
  if (email) parts.push('e-mail: ' + email);
  if (phone) parts.push('telefon: ' + phone);
  if (status) parts.push('status: ' + status);
  if (value > 0) parts.push('wartość: ' + formatMoney(value));
  if (moment) parts.push('termin: ' + formatShort(moment));
  return parts.join(' · ');
}

function buildGlobalSearchRows(context: Record<string, unknown>) {
  return [
    ...safeArray(context.leads).map((record) => ({ kind: 'lead' as const, record })),
    ...safeArray((context as any).clients).map((record) => ({ kind: 'client' as const, record })),
    ...safeArray(context.cases).map((record) => ({ kind: 'case' as const, record })),
    ...safeArray(context.tasks).map((record) => ({ kind: 'task' as const, record })),
    ...safeArray(context.events).map((record) => ({ kind: 'event' as const, record })),
    ...safeArray((context as any).drafts).map((record) => ({
      kind: 'draft' as const,
      record: {
        ...record,
        _assistantEntityLabel: 'szkic ai szkice draft do sprawdzenia',
        _assistantTitle: asText((record as any).rawText || (record as any).raw_text) || 'Szkic AI',
      },
    })),
  ];
}

function scoreGlobalRecord(query: string, record: Record<string, unknown>) {
  const searchText = getSearchText(record);
  if (!searchText) return 0;
  const terms = getSearchTerms(query);
  let score = 0;
  if (query.length >= 4 && searchText.includes(query)) score += 20;
  terms.forEach((term) => {
    if (!searchText.includes(term)) return;
    if (term.includes('@')) score += 12;
    else if (/\d/.test(term)) score += 8;
    else score += Math.min(6, Math.max(2, term.length - 1));
  });
  return score;
}

function wantsGlobalSearch(query: string) {
  return /\b(znajdz|znajdź|szukaj|wyszukaj|pokaz|pokaż|odszukaj|kontakt|email|e-mail|mail|telefon|numer|adres|szkic|szkice|draft|drafty)\b/u.test(query)
    || query.includes('@')
    || /\d{6,}/.test(query);
}

function hasPotentialRecordSearchQuery(query: string) {
  const terms = getSearchTerms(query);
  return query.includes('@') || /\d{6,}/.test(query) || terms.length >= 2;
}

function buildGlobalAppSearchAnswer(context: Record<string, unknown>, rawText: string): AssistantResponse {
  const query = normalizeText(rawText);
  if (wantsDraftReview(query)) return buildDraftReviewAnswer(context, rawText);
  const rows = buildGlobalSearchRows(context);
  const scored = rows
    .map((row) => ({ ...row, score: scoreGlobalRecord(query, row.record) }))
    .filter((row) => row.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

  if (!scored.length) {
    return {
      ok: true,
      scope: 'assistant_read_or_draft_only',
      provider: 'rules',
      noAutoWrite: true,
      intent: 'lead_lookup',
      title: 'Nie znalazłem tego w danych aplikacji',
      summary: 'Przeszukałem leady, klientów, sprawy, zadania i wydarzenia po nazwie, firmie, e-mailu, telefonie, opisie, notatkach i statusie.',
      rawText,
      items: rows.slice(0, 6).map((row) => ({
        label: getGenericTitle(row.kind, row.record),
        detail: buildGenericDetail(row.kind, row.record),
        href: getGenericHref(row.kind, row.record),
        priority: 'medium' as const,
      })),
      warnings: ['Brak dokładnego dopasowania. Spróbuj podać imię, firmę, e-mail, telefon albo fragment notatki.'],
    };
  }

  return {
    ok: true,
    scope: 'assistant_read_or_draft_only',
    provider: 'rules',
    noAutoWrite: true,
    intent: 'lead_lookup',
    title: 'Znalazłem w aplikacji',
    summary: 'Przeszukałem leady, klientów, sprawy, zadania i wydarzenia po nazwie, firmie, e-mailu, telefonie, opisie, notatkach i statusie.',
    rawText,
    items: scored.map((row) => ({
      label: getGenericTitle(row.kind, row.record),
      detail: buildGenericDetail(row.kind, row.record),
      href: getGenericHref(row.kind, row.record),
      priority: row.kind === 'client' || row.kind === 'case' ? 'high' as const : 'medium' as const,
    })),
    warnings: [],
  };
}



function wantsDraftReview(query: string) {
  return /\b(szkic|szkice|draft|drafty|do sprawdzenia|niezatwierdzone|ai inbox)\b/u.test(query);
}

function buildDraftReviewAnswer(context: Record<string, unknown>, rawText: string): AssistantResponse {
  // AI_OPERATOR_QUALITY_STAGE06_DRAFT_BRIEFING: pytania o szkice odpowiadają z danych aplikacji, bez modelu zewnętrznego.
  const drafts = safeArray((context as any).drafts)
    .filter((draft) => {
      const status = asText(draft.status).toLowerCase();
      return !status || status === 'draft';
    })
    .slice(0, 8);

  return {
    ok: true,
    scope: 'assistant_read_or_draft_only',
    provider: 'rules',
    costGuard: 'local_rules',
    noAutoWrite: true,
    intent: 'global_app_search',
    title: drafts.length ? 'Szkice AI do sprawdzenia' : 'Nie widzę szkiców AI do sprawdzenia',
    summary: drafts.length
      ? 'Masz ' + drafts.length + ' szkiców AI do ręcznego sprawdzenia. Żaden z nich nie jest finalnym rekordem.'
      : 'Nie znalazłem aktywnych szkiców AI w statusie do sprawdzenia.',
    rawText,
    items: drafts.map((draft, index) => ({
      label: asText(draft.rawText || draft.raw_text) || 'Szkic AI ' + String(index + 1),
      detail: 'Szkic AI · status: ' + (asText(draft.status) || 'draft') + ' · źródło: ' + (asText(draft.source) || 'manual'),
      href: '/ai-drafts',
      priority: 'high' as const,
    })),
    warnings: drafts.length ? ['Otwórz Szkice AI, sprawdź pola i dopiero wtedy utwórz finalny rekord.'] : [],
  };
}


// AI_ASSISTANT_SEMANTIC_ROUTER_STAGE33_SERVER
// To nie jest słownik fraz. Model dostaje mapę aplikacji i kompaktowy snapshot danych,
// sam tworzy plan odpowiedzi i zwraca ustrukturyzowany JSON zgodny z UI asystenta.
const AI_ASSISTANT_SEMANTIC_ROUTER_STAGE33_SERVER = true;

function stage33ParseRequestBody(req: any): Record<string, unknown> {
  const body = req?.body;
  if (!body) return {};
  if (typeof body === 'string') {
    try {
      const parsed = JSON.parse(body);
      return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed as Record<string, unknown> : {};
    } catch {
      return {};
    }
  }
  return body && typeof body === 'object' && !Array.isArray(body) ? body as Record<string, unknown> : {};
}

function stage33CompactRecord(kind: string, row: Record<string, unknown>, index: number) {
  const id = getId(row) || asText(row.id) || asText(row.uid) || String(index + 1);
  const title = kind === 'lead'
    ? getLeadDisplayName(row)
    : kind === 'client'
      ? getClientDisplayName(row)
      : kind === 'case'
        ? getCaseDisplayName(row)
        : asText(row.title || row.name || row.subject || row.rawText || row.raw_text) || kind + ' ' + String(index + 1);
  const moment = kind === 'task'
    ? getTaskMoment(row)
    : kind === 'event'
      ? getEventMoment(row)
      : asText(row.nextActionAt || row.next_action_at || row.updatedAt || row.updated_at || row.createdAt || row.created_at);
  return {
    kind,
    id,
    title,
    status: asText(row.status || row.state || row.stage),
    priority: asText(row.priority),
    moment,
    value: getRecordValue(row),
    email: asText(row.email || row.mail || row.contactEmail),
    phone: asText(row.phone || row.telefon || row.mobile || row.contactPhone),
    company: asText(row.company || row.clientName || row.client_name),
    leadId: asText(row.leadId || row.lead_id),
    clientId: asText(row.clientId || row.client_id),
    caseId: asText(row.caseId || row.case_id),
    notes: asText(row.notes || row.note || row.description || row.summary || row.rawText || row.raw_text).slice(0, 240),
  };
}

function stage33BuildCompactSnapshot(context: Record<string, unknown>) {
  const take = (kind: string, value: unknown, limit: number) => safeArray(value).slice(0, limit).map((row, index) => stage33CompactRecord(kind, row, index));
  return {
    appMap: {
      today: 'Dziś: priorytety, zadania, terminy, skróty pracy i szkice AI do sprawdzenia.',
      leads: 'Leady: kontakty sprzedażowe przed przejściem do klienta/sprawy.',
      clients: 'Klienci: kartoteka osób i firm oraz przejście do aktywnych spraw.',
      cases: 'Sprawy: obsługa procesu po sprzedaży lub przyjęciu zlecenia.',
      tasks: 'Zadania: rzeczy do wykonania, statusy, terminy, priorytety.',
      calendar: 'Kalendarz: wydarzenia, spotkania i plan najbliższych dni.',
      aiDrafts: 'Szkice AI: robocze zapisy do ręcznego zatwierdzenia.',
      notifications: 'Powiadomienia: alerty i przypomnienia.',
      billing: 'Rozliczenia: plan, trial, płatności.',
      settings: 'Ustawienia: profil, aplikacja, PWA, preferencje i konfiguracje.',
    },
    counts: {
      leads: safeArray(context.leads).length,
      clients: safeArray((context as any).clients).length,
      cases: safeArray(context.cases).length,
      tasks: safeArray(context.tasks).length,
      events: safeArray(context.events).length,
      drafts: safeArray((context as any).drafts).length,
    },
    leads: take('lead', context.leads, 80),
    clients: take('client', (context as any).clients, 80),
    cases: take('case', context.cases, 80),
    tasks: take('task', context.tasks, 140),
    events: take('event', context.events, 120),
    drafts: take('draft', (context as any).drafts, 40),
  };
}

function stage33SemanticRouterPrompt(rawText: string, context: Record<string, unknown>, nowIso: string) {
  const snapshot = stage33BuildCompactSnapshot(context);
  return [
    'Jesteś semantycznym operatorem danych aplikacji CloseFlow.',
    'Nie jesteś słownikiem fraz. Nie dopasowuj gotowych pytań do gotowych odpowiedzi.',
    'Zrozum intencję użytkownika dowolnie sformułowaną po polsku, utwórz plan zapytania, użyj WYŁĄCZNIE danych z JSON i odpowiedz krótko.',
    'Jeżeli pytanie dotyczy zapisu/utworzenia rekordu, nie twórz finalnego rekordu. Zwróć canAnswer=false, bo zapis obsługują Szkice AI.',
    'Jeżeli nie da się odpowiedzieć z danych aplikacji, zwróć canAnswer=false.',
    'Zwróć tylko poprawny JSON bez markdown. Kształt:',
    '{"canAnswer":true,"intent":"global_app_search|today_briefing|lead_lookup|unknown","title":"...","summary":"...","items":[{"label":"...","detail":"...","href":"/tasks","priority":"low|medium|high"}],"warnings":[]}',
    'Dzisiaj/teraz ISO: ' + nowIso,
    'Pytanie użytkownika: ' + rawText,
    'Snapshot aplikacji JSON:',
    JSON.stringify(snapshot),
  ].join('\n');
}

function stage33ValidIntent(value: unknown): AssistantIntent {
  const normalized = asText(value);
  if (normalized === 'today_briefing' || normalized === 'lead_lookup' || normalized === 'lead_capture' || normalized === 'global_app_search' || normalized === 'blocked_out_of_scope' || normalized === 'unknown') return normalized;
  return 'global_app_search';
}

function stage33ValidPriority(value: unknown): 'low' | 'medium' | 'high' {
  const normalized = asText(value);
  if (normalized === 'low' || normalized === 'medium' || normalized === 'high') return normalized;
  return 'medium';
}

function stage33CoerceItems(value: unknown): AssistantItem[] {
  return safeArray(value).slice(0, 10).map((item) => ({
    label: asText(item.label || item.title || item.name) || 'Wynik',
    detail: asText(item.detail || item.summary || item.description),
    href: asText(item.href || item.url || item.path) || undefined,
    priority: stage33ValidPriority(item.priority),
  })).filter((item) => Boolean(item.label));
}

function stage33CoerceWarnings(value: unknown) {
  return Array.isArray(value)
    ? value.map((entry) => asText(entry)).filter(Boolean).slice(0, 4)
    : [];
}

async function tryStage33SemanticAiAnswer(context: Record<string, unknown>, rawText: string, nowIso: string): Promise<AssistantResponse | null> {
  const command = asText(rawText);
  if (!command || command.length > ASSISTANT_MAX_COMMAND_LENGTH) return null;
  const normalized = normalizeText(command);
  if (!normalized) return null;
  if (detectCaptureIntent(normalized)) return null;
  if (OUT_OF_SCOPE_BLOCK_PATTERNS.some((pattern) => pattern.test(normalized))) return null;

  const prompt = stage33SemanticRouterPrompt(command, context, nowIso);
  const generated = await tryGenerateJsonWithAiProvider(prompt, {
    operation: 'ai_assistant_semantic_router_stage33',
    maxOutputTokens: 900,
    temperature: 0.05,
  });

  const json = generated?.json;
  if (!json || json.canAnswer !== true) return null;

  const title = asText(json.title) || 'Odpowiedź z danych aplikacji';
  const summary = asText(json.summary || json.answer) || 'Sprawdziłem dane aplikacji.';

  return {
    ok: true,
    scope: 'assistant_read_or_draft_only',
    provider: 'semantic_ai:' + generated.provider,
    costGuard: 'external_ai',
    noAutoWrite: true,
    intent: stage33ValidIntent(json.intent),
    title,
    summary,
    rawText: command,
    items: stage33CoerceItems(json.items),
    warnings: stage33CoerceWarnings(json.warnings),
  };
}

async function tryStage33SemanticAssistantFromRequest(req: any): Promise<AssistantResponse | null> {
  const body = stage33ParseRequestBody(req);
  const rawText = asText((body as any).rawText);
  const context = ((body as any).context && typeof (body as any).context === 'object' && !Array.isArray((body as any).context))
    ? (body as any).context as Record<string, unknown>
    : {};
  const nowIso = asText((body as any).now || (context as any).now) || new Date().toISOString();
  return tryStage33SemanticAiAnswer(context, rawText, nowIso);
}

void AI_ASSISTANT_SEMANTIC_ROUTER_STAGE33_SERVER;


function detectCaptureIntent(query: string) {
  const saveCommandPattern = /\b(zapisz|dodaj|utworz|stworz|wrzuc|wrzucic|zapamietaj|notuj|zanotuj)\b/u;
  const leadCommandPattern = /\b(mam leada|mam lead|nowy lead|nowego leada|nowy kontakt|nowego klienta|dodaj klienta|dodaj kontakt)\b/u;
  const hasSaveIntent = saveCommandPattern.test(query) || leadCommandPattern.test(query);
  if (!hasSaveIntent) return false;

  const payload = query
    .replace(saveCommandPattern, ' ')
    .replace(leadCommandPattern, ' ')
    .replace(/\b(lead|leada|kontakt|klient|klienta|notatke|notatka|notatkę)\b/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const meaningfulTokens = payload.split(' ').filter((token) => token.length >= 2);
  return meaningfulTokens.length > 0;
}


function buildCaptureAnswer(rawText: string): AssistantResponse {
  return {
    ok: true,
    scope: 'assistant_read_or_draft_only',
    provider: 'rules',
    noAutoWrite: true,
    intent: 'lead_capture',
    title: 'Szkic leada zapisany do sprawdzenia',
    summary: 'Usłyszałem komendę zapisu. Notatka trafia do Szkiców AI, a finalny lead powstanie dopiero po Twojej akceptacji.',
    rawText,
    suggestedCaptureText: rawText,
    items: [
      {
        label: 'Surowa treść do przepisania',
        detail: rawText,
        priority: 'high',
      },
      {
        label: 'Otwórz Szkice AI',
        detail: 'Tam poprawisz pola i zatwierdzisz leada. Bez zatwierdzenia nic nie trafia jako finalny kontakt.',
        href: '/ai-drafts',
        priority: 'medium',
      },
    ],
    warnings: ['Reguła pracy: słowo „zapisz” tworzy szkic. Bez „zapisz” asystent tylko szuka po danych aplikacji.'],
    allowedScope: ASSISTANT_ALLOWED_SCOPE,
  };
}

function findMentionedRecord(query: string, rows: Array<{ kind: 'lead' | 'client' | 'case'; record: Record<string, unknown> }>) {
  const queryText = normalizeText(query);
  let best: { kind: 'lead' | 'client' | 'case'; record: Record<string, unknown>; score: number } | null = null;

  for (const row of rows) {
    const searchText = getSearchText(row.record);
    if (!searchText) continue;

    const tokens = searchText.split(' ').filter((token) => token.length >= 3);
    const score = tokens.reduce((sum, token) => sum + (queryText.includes(token) ? 1 : 0), 0);
    if (score > 0 && (!best || score > best.score)) {
      best = { ...row, score };
    }
  }

  return best;
}

function recordTitle(kind: 'lead' | 'client' | 'case', record: Record<string, unknown>) {
  if (kind === 'client') return getClientDisplayName(record);
  if (kind === 'case') return getCaseDisplayName(record);
  return getLeadDisplayName(record);
}

function recordHref(kind: 'lead' | 'client' | 'case', id: string) {
  if (kind === 'client') return id ? `/clients/${id}` : '/clients';
  if (kind === 'case') return id ? `/cases/${id}` : '/cases';
  return id ? `/leads/${id}` : '/leads';
}

function buildLeadLookup(context: Record<string, unknown>, rawText: string): AssistantResponse {
  const leads = safeArray(context.leads);
  const clients = safeArray((context as any).clients);
  const cases = safeArray(context.cases);
  const tasks = safeArray(context.tasks);
  const events = safeArray(context.events);
  const query = normalizeText(rawText);
  const records = [
    ...leads.map((record) => ({ kind: 'lead' as const, record })),
    ...clients.map((record) => ({ kind: 'client' as const, record })),
    ...cases.map((record) => ({ kind: 'case' as const, record })),
  ];
  const matched = findMentionedRecord(query, records);

  if (!matched) {
    return {
      ok: true,
      scope: 'assistant_read_or_draft_only',
      provider: 'rules',
      noAutoWrite: true,
      intent: 'lead_lookup',
      title: 'Nie znalazłem konkretnego kontaktu',
      summary: 'Powiedz nazwę, firmę, telefon albo e-mail leada lub klienta, np. „co dalej z Janem Kowalskim?”.',
      rawText,
      items: records.slice(0, 6).map((item) => {
        const id = getId(item.record);
        return {
          label: recordTitle(item.kind, item.record),
          detail: item.kind === 'case' ? 'Sprawa' : item.kind === 'client' ? 'Klient' : 'Lead',
          href: recordHref(item.kind, id),
          priority: 'medium',
        };
      }),
      warnings: [],
    };
  }

  const id = getId(matched.record);
  const leadId = asText(matched.record.leadId || matched.record.sourceLeadId || matched.record.id);
  const caseId = asText(matched.record.caseId || matched.record.id);
  const clientId = asText(matched.record.clientId || matched.record.id);

  const openTasks = tasks
    .filter((task) => {
      const taskLeadId = asText(task.leadId);
      const taskCaseId = asText(task.caseId);
      const taskClientId = asText(task.clientId);
      return isOpenStatus(task.status) && (
        (leadId && taskLeadId === leadId) ||
        (caseId && taskCaseId === caseId) ||
        (clientId && taskClientId === clientId)
      );
    })
    .sort((a, b) => (parseDate(getTaskMoment(a))?.getTime() ?? Number.MAX_SAFE_INTEGER) - (parseDate(getTaskMoment(b))?.getTime() ?? Number.MAX_SAFE_INTEGER));

  const upcomingEvents = events
    .filter((event) => {
      const eventLeadId = asText(event.leadId);
      const eventCaseId = asText(event.caseId);
      const eventClientId = asText(event.clientId);
      return isOpenStatus(event.status) && (
        (leadId && eventLeadId === leadId) ||
        (caseId && eventCaseId === caseId) ||
        (clientId && eventClientId === clientId)
      );
    })
    .sort((a, b) => (parseDate(getEventMoment(a))?.getTime() ?? Number.MAX_SAFE_INTEGER) - (parseDate(getEventMoment(b))?.getTime() ?? Number.MAX_SAFE_INTEGER));

  const href = recordHref(matched.kind, id);
  const items: AssistantItem[] = [
    ...openTasks.slice(0, 5).map((task) => ({
      label: asText(task.title) || 'Zadanie',
      detail: `Zadanie · ${formatShort(getTaskMoment(task))}`,
      href,
      priority: asText(task.priority) === 'high' ? 'high' : 'medium',
    } as AssistantItem)),
    ...upcomingEvents.slice(0, 3).map((event) => ({
      label: asText(event.title) || 'Wydarzenie',
      detail: `Wydarzenie · ${formatShort(getEventMoment(event))}`,
      href,
      priority: 'medium' as const,
    })),
  ];

  if (!items.length) {
    items.push({
      label: 'Brak aktywnego zadania',
      detail: 'Najbezpieczniej dodać follow-up albo użyć AI następny ruch w szczegółach kontaktu.',
      href,
      priority: 'high',
    });
  }

  return {
    ok: true,
    scope: 'assistant_read_or_draft_only',
    provider: 'rules',
    noAutoWrite: true,
    intent: 'lead_lookup',
    title: `Co dalej z: ${recordTitle(matched.kind, matched.record)}`,
    summary: 'Poniżej masz aktualne zadania i wydarzenia powiązane z tym kontaktem albo sprawą.',
    rawText,
    items,
    warnings: [],
  };
}

function buildUnknown(rawText: string): AssistantResponse {
  return {
    ok: true,
    scope: 'assistant_read_or_draft_only',
    provider: 'rules',
    noAutoWrite: true,
    intent: 'unknown',
    title: 'Nie rozpoznałem polecenia w aplikacji',
    summary: 'Mogę odpowiadać w pełnym zakresie CloseFlow i szukać po danych aplikacji. Jeżeli chcesz zapisać kontakt albo notatkę, zacznij od słowa „zapisz”; w innym przypadku potraktuję tekst jako szukanie.',
    rawText,
    items: [
      { label: 'Przykład', detail: '„co mam jutro”, „ile mam leadów”, „jaka jest wartość lejka”, „co dalej z Dorotą Kołodziej” albo „zapisz leada...”', priority: 'medium' },
    ],
    warnings: ['Pytanie nie wyszło poza aplikację, ale nie udało się dopasować konkretnej akcji.'],
    allowedScope: ASSISTANT_ALLOWED_SCOPE,
  };
}

function buildOutOfScopeAnswer(rawText: string, customSummary?: string): AssistantResponse {
  return {
    ok: true,
    scope: 'assistant_read_or_draft_only',
    provider: 'rules',
    noAutoWrite: true,
    intent: 'blocked_out_of_scope',
    title: 'Poza zakresem aplikacji',
    summary: customSummary || 'Odpowiadam tylko na polecenia dotyczące leadów, klientów, zadań, wydarzeń, spraw, szkiców AI, wartości lejka i planu pracy w CloseFlow. Nie odpowiadam na pytania ogólne, żeby nie zużywać limitów AI poza pracą w aplikacji.',
    rawText,
    items: [
      {
        label: 'Dozwolone polecenia',
        detail: 'Powiedz np. „co mam jutro”, „ile mam leadów”, „wartość lejka”, „co dalej z Dorotą Kołodziej” albo „zapisz leada...”.',
        priority: 'medium',
      },
    ],
    warnings: ['Twarda blokada zakresu: brak odpowiedzi poza danymi i workflow aplikacji.'],
    hardBlock: true,
    allowedScope: ASSISTANT_ALLOWED_SCOPE,
  };
}

function isClearlyOutOfScope(query: string) {
  if (!query) return false;
  return OUT_OF_SCOPE_BLOCK_PATTERNS.some((pattern) => pattern.test(query));
}

function wantsTomorrow(query: string) {
  return /\b(jutro|jutrzejszy|jutrzejsza|jutrzejsze)\b/u.test(query);
}

function wantsDateBriefing(query: string) {
  return /\b(co mam|co dzis|dzisiaj|dzis|jutro|plan dnia|plan na|lista rzeczy|robic|zrobic|do zrobienia|zadania|wydarzenia|spotkania)\b/u.test(query);
}

function wantsOverview(query: string) {
  return /\b(ile mam|podsumowanie|stan aplikacji|stan closeflow|liczba|liczby)\b/u.test(query)
    && /\b(lead|leadow|leadów|klient|klientow|klientów|spraw|zadania|wydarzenia)\b/u.test(query);
}

function wantsFunnelValue(query: string) {
  return /\b(wartosc|wartość|lejek|lejka|najcenniejsz|najdrozszy|najdroższy|najdrozsz|najdroższ|najwieksz|największ|najwyzsz|najwyższ|najbardziej wartosciow|najbardziej wartościow|top lead|top klient|top spraw)\b/u.test(query);
}

function wantsLookup(query: string) {
  return /\b(co dalej|co ma|co z|jaki nastepny|jaki następny|następny krok|nastepny krok|zadanie z|zadania z|wydarzenia z|sprawa z)\b/u.test(query);
}

function buildAssistantAnswer(body: Record<string, unknown>): AssistantResponse {
  const rawText = asText(body.rawText || body.text || body.command);
  const context = (body.context && typeof body.context === 'object') ? body.context as Record<string, unknown> : {};
  const now = parseDate(body.now || (context as any).now) || new Date();
  const query = normalizeText(rawText);

  if (!rawText) {
    return buildUnknown(rawText);
  }

  if (rawText.length > ASSISTANT_MAX_COMMAND_LENGTH) {
    return buildOutOfScopeAnswer(rawText, 'Komenda jest za długa jak na asystenta CloseFlow. Skróć ją do konkretnej akcji w aplikacji: lead, klient, zadanie, wydarzenie, sprawa, wartość lejka albo plan dnia.');
  }

  if (isClearlyOutOfScope(query)) {
    return buildOutOfScopeAnswer(rawText);
  }

  if (detectCaptureIntent(query)) {
    return buildCaptureAnswer(rawText);
  }

  if (wantsFunnelValue(query)) {
    return buildRelationValueAnswer(context, rawText);
  }

  if (wantsOverview(query)) {
    return buildAppOverviewAnswer(context, rawText);
  }

  if (wantsDateBriefing(query)) {
    return buildDateBriefing(context, rawText, now, wantsTomorrow(query) ? 1 : 0);
  }

  if (wantsLookup(query)) {
    return buildLeadLookup(context, rawText);
  }

  if (wantsGlobalSearch(query) || hasPotentialRecordSearchQuery(query)) {
    return buildGlobalAppSearchAnswer(context, rawText);
  }

  return buildUnknown(rawText);
}

export default async function aiAssistantHandler(req: any, res: any) {
  const stage33SemanticEarlyAnswer = await tryStage33SemanticAssistantFromRequest(req).catch(() => null);
  if (stage33SemanticEarlyAnswer) {
    res.status(200).json(stage33SemanticEarlyAnswer);
    return;
  }

  try {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
      return;
    }

    const body = typeof req.body === 'string'
      ? JSON.parse(req.body || '{}')
      : req.body || {};

    const answer = buildAssistantAnswer(body as Record<string, unknown>);
    res.status(200).json(answer);
  } catch (error: any) {
    res.status(500).json({ error: error?.message || 'AI_ASSISTANT_FAILED' });
  }
}
