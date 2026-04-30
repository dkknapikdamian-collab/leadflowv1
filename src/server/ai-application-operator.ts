// AI_APP_CONTEXT_OPERATOR_STAGE26
type OperatorMode = 'read' | 'draft';
type OperatorDetailedIntent =
  | 'read_search'
  | 'create_draft_lead'
  | 'create_draft_task'
  | 'create_draft_event'
  | 'create_draft_note'
  | 'summarize_today'
  | 'summarize_tomorrow'
  | 'summarize_week'
  | 'find_contact'
  | 'overdue'
  | 'at_risk_leads'
  | 'no_planned_action'
  | 'unknown';

type LegacyIntent = 'today_briefing' | 'lead_lookup' | 'lead_capture' | 'global_app_search' | 'blocked_out_of_scope' | 'unknown';

type OperatorDraftType = 'lead' | 'task' | 'event' | 'note';

type OperatorItem = {
  label: string;
  detail?: string;
  href?: string;
  priority?: 'low' | 'medium' | 'high';
  entityType?: 'lead' | 'client' | 'case' | 'task' | 'event' | 'draft';
  id?: string;
};

type OperatorDraft = {
  type: OperatorDraftType;
  rawText: string;
  parsedDraft: Record<string, unknown>;
  status: 'draft';
  source: 'assistant_operator';
};

type OperatorInput = {
  rawText: string;
  context?: Record<string, unknown>;
  now?: string;
  workspaceId?: string | null;
};

type OperatorAnswer = {
  ok: true;
  mode: OperatorMode;
  answer: string;
  items: OperatorItem[];
  draft: OperatorDraft | null;
  operatorIntent: OperatorDetailedIntent;
  snapshotMeta: {
    scope: string;
    workspaceId: string | null;
    sourceCounts: Record<string, number>;
    filteredCounts: Record<string, number>;
    noAutoWrite: true;
    noHallucination: true;
  };
  systemInstruction: string[];

  // Legacy shape consumed by TodayAiAssistant.
  scope: 'assistant_read_or_draft_only';
  provider: 'rules';
  costGuard: 'local_rules';
  noAutoWrite: true;
  intent: LegacyIntent;
  title: string;
  summary: string;
  rawText: string;
  warnings: string[];
  suggestedCaptureText?: string;
  hardBlock?: boolean;
  allowedScope?: string[];
};

const NOT_FOUND = 'Nie znalazłem tego w danych aplikacji.';

const SYSTEM_INSTRUCTION = [
  'Odpowiadaj tylko na podstawie danych aplikacji.',
  'Nie wymyślaj leadów, klientów, spraw, zadań, wydarzeń ani kontaktów.',
  'Jeśli danych nie ma w snapshotcie, odpowiedz: Nie znalazłem tego w danych aplikacji.',
  'Bez komendy zapisu nie twórz szkicu.',
  'Z komendą zapisu utwórz szkic do sprawdzenia, nigdy finalny rekord.',
];

const SAVE_COMMAND_RE = /\b(zapisz|dodaj|utw[oó]rz|stw[oó]rz|wrzu[cć]|zanotuj|notuj)\b/u;
const LEAD_COMMAND_RE = /\b(mam leada|mam lead|nowy lead|nowego leada|lead|leada|lida|kontakt|klient|klienta)\b/u;
const TASK_COMMAND_RE = /\b(zadanie|task|todo|follow[- ]?up|oddzwoni[cć]|zadzwoni[cć]|wys[lł]a[cć]|sprawdzi[cć]|przypomnie[cć])\b/u;
const EVENT_COMMAND_RE = /\b(wydarzenie|event|spotkanie|termin|rozmowa|call|wizyta)\b/u;
const NOTE_COMMAND_RE = /\b(notatka|notatk[eę]|note|opis)\b/u;

function asText(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function normalizeText(value: unknown) {
  return asText(value)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\p{L}\p{N}\s@.+:-]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function safeArray(value: unknown): Record<string, unknown>[] {
  return Array.isArray(value) ? value.filter((item) => item && typeof item === 'object') as Record<string, unknown>[] : [];
}

function firstText(row: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = asText(row[key]);
    if (value) return value;
  }
  return '';
}

function firstValue(row: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = row[key];
    if (value !== undefined && value !== null && String(value).trim() !== '') return value;
  }
  return null;
}

function getId(row: Record<string, unknown>) {
  return firstText(row, ['id', 'uid', 'sourceId', 'source_id', 'leadId', 'lead_id', 'clientId', 'client_id', 'caseId', 'case_id']);
}

function getWorkspaceId(row: Record<string, unknown>) {
  return firstText(row, ['workspaceId', 'workspace_id', 'organizationId', 'organization_id']);
}

function getTitle(row: Record<string, unknown>, fallback: string) {
  return firstText(row, ['title', 'name', 'fullName', 'full_name', 'clientName', 'client_name', 'company', 'companyName', 'company_name', 'email', 'phone']) || fallback;
}

function getPhone(row: Record<string, unknown>) {
  return firstText(row, ['phone', 'telefon', 'mobile', 'contactPhone', 'contact_phone']);
}

function getEmail(row: Record<string, unknown>) {
  return firstText(row, ['email', 'mail', 'contactEmail', 'contact_email']);
}

function getStatus(row: Record<string, unknown>) {
  return firstText(row, ['status', 'stage', 'state']);
}

function getLeadValue(row: Record<string, unknown>) {
  const value = firstValue(row, ['dealValue', 'deal_value', 'value', 'amount', 'estimatedValue', 'estimated_value', 'budget', 'price']);
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value !== 'string') return 0;
  const parsed = Number(value.replace(/\s+/g, '').replace(/zł|pln/gi, '').replace(',', '.').replace(/[^0-9.-]/g, ''));
  return Number.isFinite(parsed) ? parsed : 0;
}

function parseDate(value: unknown) {
  const raw = asText(value);
  if (!raw) return null;
  const parsed = new Date(raw.includes('T') ? raw : `${raw}T09:00:00`);
  return Number.isFinite(parsed.getTime()) ? parsed : null;
}

function startOfDay(now: Date, offset = 0) {
  const result = new Date(now);
  result.setDate(result.getDate() + offset);
  result.setHours(0, 0, 0, 0);
  return result;
}

function endOfDay(now: Date, offset = 0) {
  const result = new Date(now);
  result.setDate(result.getDate() + offset);
  result.setHours(23, 59, 59, 999);
  return result;
}

function addDays(now: Date, days: number) {
  const result = new Date(now);
  result.setDate(result.getDate() + days);
  return result;
}

function isOpenStatus(value: unknown) {
  const status = normalizeText(value);
  return !['done', 'completed', 'cancelled', 'canceled', 'archived', 'converted', 'won', 'lost', 'stracony', 'wygrany'].includes(status);
}

function getTaskMoment(task: Record<string, unknown>) {
  return firstText(task, ['scheduledAt', 'scheduled_at', 'dueAt', 'due_at', 'dueDate', 'due_date', 'startAt', 'start_at', 'startsAt', 'starts_at', 'date', 'reminderAt', 'reminder_at']);
}

function getEventMoment(event: Record<string, unknown>) {
  return firstText(event, ['startAt', 'start_at', 'startsAt', 'starts_at', 'scheduledAt', 'scheduled_at', 'date', 'eventDate', 'event_date', 'reminderAt', 'reminder_at']);
}

function formatDate(value: unknown) {
  const parsed = parseDate(value);
  if (!parsed) return 'Bez terminu';
  return parsed.toLocaleString('pl-PL', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
}

function hrefFor(kind: OperatorItem['entityType'], row: Record<string, unknown>) {
  const id = getId(row);
  if (kind === 'lead') return id ? `/leads/${id}` : '/leads';
  if (kind === 'client') return id ? `/clients/${id}` : '/clients';
  if (kind === 'case') return id ? `/cases/${id}` : '/cases';
  if (kind === 'event') return '/calendar';
  if (kind === 'draft') return '/ai-drafts';
  return '/tasks';
}

function wordDistance(a: string, b: string) {
  if (a === b) return 0;
  if (!a) return b.length;
  if (!b) return a.length;
  const previous = Array.from({ length: b.length + 1 }, (_, index) => index);
  const current = Array.from({ length: b.length + 1 }, () => 0);
  for (let i = 1; i <= a.length; i += 1) {
    current[0] = i;
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      current[j] = Math.min(current[j - 1] + 1, previous[j] + 1, previous[j - 1] + cost);
    }
    for (let j = 0; j <= b.length; j += 1) previous[j] = current[j];
  }
  return previous[b.length];
}

function searchTextMatchesTerm(searchText: string, term: string) {
  if (!term) return false;
  if (searchText.includes(term)) return true;
  const stem = term.endsWith('a') ? term.slice(0, -1) : term;
  if (stem.length >= 3 && searchText.includes(stem)) return true;
  const words = searchText.split(' ').filter((word) => word.length >= 3);
  return words.some((word) => {
    if (word[0] !== term[0]) return false;
    const limit = term.length >= 4 ? 2 : 1;
    return wordDistance(word, term) <= limit;
  });
}

function rowSearchText(row: Record<string, unknown>) {
  const parts: string[] = [];
  for (const [key, value] of Object.entries(row)) {
    if (value === null || value === undefined) continue;
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      parts.push(String(value));
    } else if (typeof value === 'object' && /note|notes|description|summary|message|comment|contact|kontakt|phone|telefon|email|source|status|title|name/i.test(key)) {
      parts.push(JSON.stringify(value));
    }
  }
  return normalizeText(parts.join(' '));
}

function resolveWorkspaceId(input: OperatorInput) {
  const explicit = asText(input.workspaceId || null);
  const context = input.context || {};
  const fromContext = asText((context as any).workspaceId || (context as any).workspace_id);
  const operatorSnapshot = (context as any).operatorSnapshot && typeof (context as any).operatorSnapshot === 'object'
    ? (context as any).operatorSnapshot as Record<string, unknown>
    : {};
  const fromSnapshot = asText(operatorSnapshot.workspaceId || operatorSnapshot.workspace_id);
  return explicit || fromContext || fromSnapshot || null;
}

function filterByWorkspace(rows: Record<string, unknown>[], workspaceId: string | null) {
  if (!workspaceId) return rows;
  return rows.filter((row) => {
    const rowWorkspaceId = getWorkspaceId(row);
    return !rowWorkspaceId || rowWorkspaceId === workspaceId;
  });
}

function normalizeContext(input: OperatorInput) {
  const context = input.context || {};
  const workspaceId = resolveWorkspaceId(input);
  const source = {
    leads: safeArray(context.leads),
    clients: safeArray((context as any).clients),
    cases: safeArray(context.cases),
    tasks: safeArray(context.tasks),
    events: safeArray(context.events),
    drafts: safeArray((context as any).drafts),
  };
  const filtered = {
    leads: filterByWorkspace(source.leads, workspaceId),
    clients: filterByWorkspace(source.clients, workspaceId),
    cases: filterByWorkspace(source.cases, workspaceId),
    tasks: filterByWorkspace(source.tasks, workspaceId),
    events: filterByWorkspace(source.events, workspaceId),
    drafts: filterByWorkspace(source.drafts, workspaceId),
  };
  return { workspaceId, source, filtered };
}

function detectDraftType(query: string): OperatorDraftType | null {
  const hasSave = SAVE_COMMAND_RE.test(query) || /\bmam leada\b/u.test(query) || /\bnowy lead\b/u.test(query);
  if (!hasSave) return null;
  if (TASK_COMMAND_RE.test(query)) return 'task';
  if (EVENT_COMMAND_RE.test(query)) return 'event';
  if (NOTE_COMMAND_RE.test(query)) return 'note';
  if (LEAD_COMMAND_RE.test(query)) return 'lead';
  return 'note';
}

function detectDetailedIntent(query: string): OperatorDetailedIntent {
  const draftType = detectDraftType(query);
  if (draftType === 'lead') return 'create_draft_lead';
  if (draftType === 'task') return 'create_draft_task';
  if (draftType === 'event') return 'create_draft_event';
  if (draftType === 'note') return 'create_draft_note';
  if (/\b(jutro|jutrzejsz|na jutro|co mam jutro|mam jutro)\b/u.test(query)) return 'summarize_tomorrow';
  if (/\b(dzis|dzisiaj|dziś|na dziś|na dzis|plan dnia|co mam)\b/u.test(query)) return 'summarize_today';
  if (/\b(tydzien|tydzień|ten tydzien|ten tydzień)\b/u.test(query)) return 'summarize_week';
  if (/\b(zalegle|zaległe|po terminie|przeterminowane)\b/u.test(query)) return 'overdue';
  if (/\b(numer|telefon|kontakt|email|e-mail|mail)\b/u.test(query)) return 'find_contact';
  if (/\b(zagrozone|zagrożone|ryzyko|uciekaja|uciekają|gnija|gniją)\b/u.test(query)) return 'at_risk_leads';
  if (/\b(bez akcji|bez zaplanowanej akcji|bez terminu|bez dzialania|bez działania|brak akcji)\b/u.test(query)) return 'no_planned_action';
  if (/\b(znajdz|znajdź|szukaj|wyszukaj|pokaz|pokaż)\b/u.test(query)) return 'read_search';
  return 'unknown';
}

function legacyIntent(operatorIntent: OperatorDetailedIntent): LegacyIntent {
  if (operatorIntent.startsWith('create_draft_')) return 'lead_capture';
  if (operatorIntent === 'summarize_today' || operatorIntent === 'summarize_tomorrow' || operatorIntent === 'summarize_week' || operatorIntent === 'overdue') return 'today_briefing';
  if (operatorIntent === 'find_contact' || operatorIntent === 'at_risk_leads' || operatorIntent === 'no_planned_action' || operatorIntent === 'read_search') return 'lead_lookup';
  return 'global_app_search';
}

function makeMeta(input: OperatorInput, source: ReturnType<typeof normalizeContext>['source'], filtered: ReturnType<typeof normalizeContext>['filtered'], workspaceId: string | null) {
  const count = (records: Record<string, unknown>[]) => records.length;
  return {
    scope: 'assistant_application_context_operator_stage26',
    workspaceId,
    sourceCounts: {
      leads: count(source.leads),
      clients: count(source.clients),
      cases: count(source.cases),
      tasks: count(source.tasks),
      events: count(source.events),
      drafts: count(source.drafts),
    },
    filteredCounts: {
      leads: count(filtered.leads),
      clients: count(filtered.clients),
      cases: count(filtered.cases),
      tasks: count(filtered.tasks),
      events: count(filtered.events),
      drafts: count(filtered.drafts),
    },
    noAutoWrite: true as const,
    noHallucination: true as const,
  };
}

function responseBase(input: OperatorInput, operatorIntent: OperatorDetailedIntent, items: OperatorItem[], title: string, answer: string, draft: OperatorDraft | null, meta: OperatorAnswer['snapshotMeta'], warnings: string[] = []): OperatorAnswer {
  return {
    ok: true,
    mode: draft ? 'draft' : 'read',
    answer,
    items,
    draft,
    operatorIntent,
    snapshotMeta: meta,
    systemInstruction: SYSTEM_INSTRUCTION,
    scope: 'assistant_read_or_draft_only',
    provider: 'rules',
    costGuard: 'local_rules',
    noAutoWrite: true,
    intent: legacyIntent(operatorIntent),
    title,
    summary: answer,
    rawText: input.rawText,
    warnings,
    suggestedCaptureText: draft ? input.rawText : undefined,
    allowedScope: SYSTEM_INSTRUCTION,
  };
}

function extractTime(raw: string) {
  const normalized = normalizeText(raw);
  const match = normalized.match(/\b(?:o|po)?\s*(\d{1,2})(?::(\d{2}))?\b/u);
  if (!match) return { hour: 9, minute: 0 };
  const hour = Math.max(0, Math.min(23, Number(match[1])));
  const minute = Math.max(0, Math.min(59, Number(match[2] || 0)));
  return { hour, minute };
}

function extractScheduledAt(raw: string, now: Date) {
  const normalized = normalizeText(raw);
  const { hour, minute } = extractTime(raw);
  let date: Date | null = null;

  if (/\b(jutro|jutrzejsz)\b/u.test(normalized)) date = addDays(now, 1);
  else if (/\b(pojutrze)\b/u.test(normalized)) date = addDays(now, 2);
  else if (/\b(dzis|dzisiaj|dziś)\b/u.test(normalized)) date = new Date(now);

  const dotted = normalized.match(/\b(\d{1,2})[.-](\d{1,2})(?:[.-](\d{2,4}))?\b/u);
  if (dotted) {
    const day = Number(dotted[1]);
    const month = Number(dotted[2]) - 1;
    let year = dotted[3] ? Number(dotted[3]) : now.getFullYear();
    if (year < 100) year += 2000;
    date = new Date(now);
    date.setFullYear(year, month, day);
  }

  if (!date) return null;
  date.setHours(hour, minute, 0, 0);
  return date.toISOString();
}

function cleanedDraftTitle(raw: string, type: OperatorDraftType) {
  let title = raw
    .replace(/\b(zapisz|dodaj|utw[oó]rz|stw[oó]rz|wrzu[cć]|zanotuj|notuj|mi|prosz[eę])\b/giu, ' ')
    .replace(/\b(zadanie|task|wydarzenie|event|spotkanie|termin|notatk[eę]|notatka|lead|leada|kontakt|klient|mam|nowy|nowego)\b/giu, ' ')
    .replace(/\b(dzisiaj|dziś|dzis|jutro|pojutrze|o|po)\b/giu, ' ')
    .replace(/\b\d{1,2}[:.]\d{2}\b/gu, ' ')
    .replace(/\b\d{1,2}[.-]\d{1,2}(?:[.-]\d{2,4})?\b/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!title) {
    if (type === 'task') title = 'Nowe zadanie';
    else if (type === 'event') title = 'Nowe wydarzenie';
    else if (type === 'note') title = 'Nowa notatka';
    else title = 'Nowy lead';
  }
  return title.charAt(0).toUpperCase() + title.slice(1);
}

function buildDraft(input: OperatorInput, operatorIntent: OperatorDetailedIntent, now: Date): OperatorDraft {
  const type: OperatorDraftType = operatorIntent === 'create_draft_task'
    ? 'task'
    : operatorIntent === 'create_draft_event'
      ? 'event'
      : operatorIntent === 'create_draft_note'
        ? 'note'
        : 'lead';
  const scheduledAt = extractScheduledAt(input.rawText, now);
  const title = cleanedDraftTitle(input.rawText, type);
  return {
    type,
    rawText: input.rawText,
    status: 'draft',
    source: 'assistant_operator',
    parsedDraft: {
      type,
      title,
      name: type === 'lead' ? title : undefined,
      rawText: input.rawText,
      scheduledAt,
      date: scheduledAt ? scheduledAt.slice(0, 10) : undefined,
      status: 'draft',
      provider: 'rules',
      noAutoWrite: true,
    },
  };
}

function taskItem(task: Record<string, unknown>): OperatorItem {
  return {
    id: getId(task),
    entityType: 'task',
    label: getTitle(task, 'Zadanie'),
    detail: `Zadanie · ${formatDate(getTaskMoment(task))}`,
    href: hrefFor('task', task),
    priority: normalizeText(task.priority) === 'high' ? 'high' : 'medium',
  };
}

function eventItem(event: Record<string, unknown>): OperatorItem {
  return {
    id: getId(event),
    entityType: 'event',
    label: getTitle(event, 'Wydarzenie'),
    detail: `Wydarzenie · ${formatDate(getEventMoment(event))}`,
    href: hrefFor('event', event),
    priority: 'medium',
  };
}

function leadItem(lead: Record<string, unknown>, detailPrefix = 'Lead'): OperatorItem {
  const phone = getPhone(lead);
  const email = getEmail(lead);
  const status = getStatus(lead);
  const details = [detailPrefix, status ? `status: ${status}` : '', phone ? `telefon: ${phone}` : '', email ? `e-mail: ${email}` : ''].filter(Boolean).join(' · ');
  return {
    id: getId(lead),
    entityType: 'lead',
    label: getTitle(lead, 'Lead'),
    detail: details,
    href: hrefFor('lead', lead),
    priority: 'medium',
  };
}

function clientItem(client: Record<string, unknown>): OperatorItem {
  const phone = getPhone(client);
  const email = getEmail(client);
  return {
    id: getId(client),
    entityType: 'client',
    label: getTitle(client, 'Klient'),
    detail: ['Klient', phone ? `telefon: ${phone}` : '', email ? `e-mail: ${email}` : ''].filter(Boolean).join(' · '),
    href: hrefFor('client', client),
    priority: 'medium',
  };
}

function itemsForDay(context: ReturnType<typeof normalizeContext>['filtered'], now: Date, offset: number) {
  const from = startOfDay(now, offset);
  const to = endOfDay(now, offset);
  const tasks = context.tasks
    .filter((task) => isOpenStatus(task.status) && Boolean(parseDate(getTaskMoment(task))))
    .filter((task) => {
      const moment = parseDate(getTaskMoment(task));
      return moment ? moment >= from && moment <= to : false;
    })
    .sort((a, b) => (parseDate(getTaskMoment(a))?.getTime() || 0) - (parseDate(getTaskMoment(b))?.getTime() || 0));
  const events = context.events
    .filter((event) => isOpenStatus(event.status) && Boolean(parseDate(getEventMoment(event))))
    .filter((event) => {
      const moment = parseDate(getEventMoment(event));
      return moment ? moment >= from && moment <= to : false;
    })
    .sort((a, b) => (parseDate(getEventMoment(a))?.getTime() || 0) - (parseDate(getEventMoment(b))?.getTime() || 0));
  return [...tasks.map(taskItem), ...events.map(eventItem)].slice(0, 20);
}

function overdueItems(context: ReturnType<typeof normalizeContext>['filtered'], now: Date) {
  const start = startOfDay(now, 0);
  const tasks = context.tasks.filter((task) => {
    const moment = parseDate(getTaskMoment(task));
    return isOpenStatus(task.status) && moment ? moment < start : false;
  });
  const events = context.events.filter((event) => {
    const moment = parseDate(getEventMoment(event));
    return isOpenStatus(event.status) && moment ? moment < start : false;
  });
  return [...tasks.map(taskItem), ...events.map(eventItem)].slice(0, 20);
}

function leadHasPlannedAction(lead: Record<string, unknown>, context: ReturnType<typeof normalizeContext>['filtered'], now: Date) {
  const leadId = getId(lead);
  const nextActionAt = parseDate(firstText(lead, ['nextActionAt', 'next_action_at', 'nextAt', 'next_at']));
  if (nextActionAt && nextActionAt >= startOfDay(now, 0)) return true;
  const task = context.tasks.find((item) => firstText(item, ['leadId', 'lead_id']) === leadId && isOpenStatus(item.status) && parseDate(getTaskMoment(item)));
  if (task) return true;
  const event = context.events.find((item) => firstText(item, ['leadId', 'lead_id']) === leadId && isOpenStatus(item.status) && parseDate(getEventMoment(item)));
  return Boolean(event);
}

function atRiskLeads(context: ReturnType<typeof normalizeContext>['filtered'], now: Date) {
  return context.leads
    .filter((lead) => isOpenStatus(lead.status))
    .filter((lead) => {
      const status = normalizeText(getStatus(lead));
      const risk = normalizeText(firstText(lead, ['risk', 'riskLevel', 'risk_level', 'riskReason', 'risk_reason']));
      const nextActionAt = parseDate(firstText(lead, ['nextActionAt', 'next_action_at', 'nextAt', 'next_at']));
      const noAction = !leadHasPlannedAction(lead, context, now);
      const overdue = nextActionAt ? nextActionAt < startOfDay(now, 0) : false;
      const value = getLeadValue(lead);
      return risk.includes('high') || risk.includes('zagroz') || status.includes('waiting') || status.includes('czekam') || overdue || noAction || value >= 10000;
    })
    .slice(0, 20)
    .map((lead) => leadItem(lead, 'Lead zagrożony'));
}

function leadsWithoutPlannedAction(context: ReturnType<typeof normalizeContext>['filtered'], now: Date) {
  return context.leads
    .filter((lead) => isOpenStatus(lead.status))
    .filter((lead) => !leadHasPlannedAction(lead, context, now))
    .slice(0, 20)
    .map((lead) => leadItem(lead, 'Brak zaplanowanej akcji'));
}

function contactItems(context: ReturnType<typeof normalizeContext>['filtered'], rawText: string) {
  const query = normalizeText(rawText);
  const terms = query
    .split(' ')
    .filter((term) => term.length >= 3)
    .filter((term) => !['znajdz', 'znajdź', 'numer', 'telefon', 'kontakt', 'email', 'mail', 'e-mail', 'pokaż', 'pokaz'].includes(term));
  const rows = [
    ...context.leads.map((record) => ({ kind: 'lead' as const, record })),
    ...context.clients.map((record) => ({ kind: 'client' as const, record })),
  ];
  const scored = rows.map((row) => {
    const searchText = rowSearchText(row.record);
    let score = 0;
    for (const term of terms) {
      if (searchTextMatchesTerm(searchText, term)) score += Math.max(4, term.length);
    }
    if (/\d{6,}/.test(query) && searchText.includes(query.replace(/\s+/g, ''))) score += 12;
    if (query.includes('@') && searchText.includes(query)) score += 12;
    return { ...row, score };
  }).filter((row) => row.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
  return scored.map((row) => row.kind === 'client' ? clientItem(row.record) : leadItem(row.record, 'Kontakt'));
}

function genericSearchItems(context: ReturnType<typeof normalizeContext>['filtered'], rawText: string) {
  const query = normalizeText(rawText);
  const terms = query.split(' ').filter((term) => term.length >= 3 && !['znajdz', 'znajdź', 'szukaj', 'pokaż', 'pokaz'].includes(term));
  const rows = [
    ...context.leads.map((record) => ({ kind: 'lead' as const, record })),
    ...context.clients.map((record) => ({ kind: 'client' as const, record })),
    ...context.cases.map((record) => ({ kind: 'case' as const, record })),
    ...context.tasks.map((record) => ({ kind: 'task' as const, record })),
    ...context.events.map((record) => ({ kind: 'event' as const, record })),
    ...context.drafts.map((record) => ({ kind: 'draft' as const, record })),
  ];
  return rows.map((row) => {
    const searchText = rowSearchText(row.record);
    const score = terms.reduce((sum, term) => sum + (searchText.includes(term) ? term.length : 0), 0);
    return { ...row, score };
  }).filter((row) => row.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 20)
    .map((row) => {
      if (row.kind === 'lead') return leadItem(row.record, 'Lead');
      if (row.kind === 'client') return clientItem(row.record);
      if (row.kind === 'task') return taskItem(row.record);
      if (row.kind === 'event') return eventItem(row.record);
      return {
        id: getId(row.record),
        entityType: row.kind,
        label: getTitle(row.record, row.kind === 'case' ? 'Sprawa' : 'Szkic AI'),
        detail: row.kind === 'case' ? `Sprawa · ${getStatus(row.record) || 'bez statusu'}` : `Szkic AI · ${getStatus(row.record) || 'draft'}`,
        href: hrefFor(row.kind, row.record),
        priority: 'medium' as const,
      };
    });
}

function answerForItems(items: OperatorItem[], found: string, notFound = NOT_FOUND) {
  if (!items.length) return notFound;
  return found;
}

export function dedupeIncrementalTranscript(parts: string[]) {
  let current = '';
  for (const part of parts) {
    const next = asText(part);
    if (!next) continue;
    const currentNorm = normalizeText(current);
    const nextNorm = normalizeText(next);
    if (!current) {
      current = next;
    } else if (nextNorm === currentNorm || currentNorm.includes(nextNorm)) {
      continue;
    } else if (nextNorm.startsWith(currentNorm)) {
      current = next;
    } else {
      current = `${current} ${next}`.replace(/\s+/g, ' ').trim();
    }
  }
  return current;
}

export function detectAssistantIntent(rawText: string): OperatorDetailedIntent {
  return detectDetailedIntent(normalizeText(rawText));
}

export function buildAiApplicationOperatorAnswer(input: OperatorInput): OperatorAnswer {
  const rawText = asText(input.rawText);
  const now = parseDate(input.now) || new Date();
  const normalized = normalizeText(rawText);
  const { workspaceId, source, filtered } = normalizeContext(input);
  const meta = makeMeta(input, source, filtered, workspaceId);
  const operatorIntent = detectDetailedIntent(normalized);

  if (!rawText) {
    return responseBase(input, 'unknown', [], 'Brak pytania', NOT_FOUND, null, meta, ['Wpisz pytanie albo komendę zapisu.']);
  }

  if (operatorIntent.startsWith('create_draft_')) {
    const draft = buildDraft(input, operatorIntent, now);
    const title = draft.type === 'task'
      ? 'Szkic zadania do sprawdzenia'
      : draft.type === 'event'
        ? 'Szkic wydarzenia do sprawdzenia'
        : draft.type === 'note'
          ? 'Szkic notatki do sprawdzenia'
          : 'Szkic leada do sprawdzenia';
    return responseBase(
      input,
      operatorIntent,
      [{ label: title, detail: `Typ: ${draft.type} · finalny rekord nie został utworzony`, href: '/ai-drafts', priority: 'high', entityType: 'draft' }],
      title,
      'Utworzyłem tylko szkic do sprawdzenia. Finalny rekord powstanie dopiero po zatwierdzeniu w Szkicach AI.',
      draft,
      meta,
      ['Bezpieczny tryb: komenda zapisu nie tworzy finalnego rekordu.'],
    );
  }

  if (operatorIntent === 'summarize_today' || operatorIntent === 'summarize_tomorrow') {
    const offset = operatorIntent === 'summarize_tomorrow' ? 1 : 0;
    const label = offset === 1 ? 'jutro' : 'dziś';
    const items = itemsForDay(filtered, now, offset);
    return responseBase(
      input,
      operatorIntent,
      items,
      items.length ? `Plan na ${label}` : `Brak danych na ${label}`,
      answerForItems(items, `Znalazłem ${items.length} pozycji na ${label}.`, NOT_FOUND),
      null,
      meta,
    );
  }

  if (operatorIntent === 'summarize_week') {
    const from = startOfDay(now, 0);
    const to = endOfDay(now, 6);
    const items = [
      ...filtered.tasks.filter((task) => {
        const moment = parseDate(getTaskMoment(task));
        return isOpenStatus(task.status) && moment ? moment >= from && moment <= to : false;
      }).map(taskItem),
      ...filtered.events.filter((event) => {
        const moment = parseDate(getEventMoment(event));
        return isOpenStatus(event.status) && moment ? moment >= from && moment <= to : false;
      }).map(eventItem),
    ].slice(0, 20);
    return responseBase(input, operatorIntent, items, 'Plan na ten tydzień', answerForItems(items, `Znalazłem ${items.length} pozycji na ten tydzień.`, NOT_FOUND), null, meta);
  }

  if (operatorIntent === 'overdue') {
    const items = overdueItems(filtered, now);
    return responseBase(input, operatorIntent, items, 'Zaległe', answerForItems(items, `Znalazłem ${items.length} zaległych pozycji.`, NOT_FOUND), null, meta);
  }

  if (operatorIntent === 'find_contact') {
    const items = contactItems(filtered, rawText);
    return responseBase(input, operatorIntent, items, items.length ? 'Znalazłem kontakt' : 'Nie znalazłem kontaktu', answerForItems(items, `Znalazłem ${items.length} pasujących kontaktów.`, NOT_FOUND), null, meta);
  }

  if (operatorIntent === 'at_risk_leads') {
    const items = atRiskLeads(filtered, now);
    return responseBase(input, operatorIntent, items, 'Leady zagrożone', answerForItems(items, `Znalazłem ${items.length} leadów wymagających uwagi.`, NOT_FOUND), null, meta);
  }

  if (operatorIntent === 'no_planned_action') {
    const items = leadsWithoutPlannedAction(filtered, now);
    return responseBase(input, operatorIntent, items, 'Leady bez zaplanowanej akcji', answerForItems(items, `Znalazłem ${items.length} leadów bez zaplanowanej akcji.`, NOT_FOUND), null, meta);
  }

  const items = genericSearchItems(filtered, rawText);
  return responseBase(input, items.length ? 'read_search' : 'unknown', items, items.length ? 'Znalazłem w danych aplikacji' : 'Nie znalazłem w danych aplikacji', answerForItems(items, `Znalazłem ${items.length} pasujących pozycji w danych aplikacji.`, NOT_FOUND), null, meta, items.length ? [] : ['Asystent nie zgaduje. Podaj imię, firmę, telefon, e-mail albo fragment notatki.']);
}
