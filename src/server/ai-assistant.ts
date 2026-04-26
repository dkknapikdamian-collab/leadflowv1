type AssistantIntent = 'today_briefing' | 'lead_lookup' | 'lead_capture' | 'blocked_out_of_scope' | 'unknown';

type AssistantItem = {
  label: string;
  detail?: string;
  href?: string;
  priority?: 'low' | 'medium' | 'high';
};

type AssistantResponse = {
  ok: true;
  scope: 'assistant_read_or_draft_only';
  provider: 'rules';
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
];

const ASSISTANT_MAX_COMMAND_LENGTH = 800;

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
  return normalizeText([
    record.name,
    record.company,
    record.clientName,
    record.title,
    record.email,
    record.phone,
    record.source,
    record.status,
  ].filter(Boolean).join(' '));
}

function getTaskMoment(task: Record<string, unknown>) {
  return asText(task.scheduledAt || task.dueAt || task.date || task.reminderAt || task.updatedAt);
}

function getEventMoment(event: Record<string, unknown>) {
  return asText(event.startAt || event.scheduledAt || event.date || event.reminderAt || event.updatedAt);
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
  const valueEntries = buildValueEntries(context);
  const funnelValue = valueEntries.reduce((sum, item) => sum + item.value, 0);

  return {
    ok: true,
    scope: 'assistant_read_or_draft_only',
    provider: 'rules',
    noAutoWrite: true,
    intent: 'today_briefing',
    title: 'Szybki stan aplikacji',
    summary: `Leady: ${leads.length}. Klienci: ${clients.length}. Sprawy: ${cases.length}. Otwarte zadania: ${tasks.length}. Otwarte wydarzenia: ${events.length}. Wartość lejka: ${formatMoney(funnelValue)}.`,
    rawText,
    items: [
      { label: `Leady: ${leads.length}`, detail: 'Aktywne kontakty sprzedażowe', href: '/leads', priority: 'medium' },
      { label: `Klienci: ${clients.length}`, detail: 'Kontakty przeniesione do obsługi klienta', href: '/clients', priority: 'medium' },
      { label: `Sprawy: ${cases.length}`, detail: 'Operacje po sprzedaży', href: '/cases', priority: 'medium' },
      { label: `Wartość lejka: ${formatMoney(funnelValue)}`, detail: 'Leady + klienci + sprawy z wartością', href: '/leads', priority: 'high' },
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

function detectCaptureIntent(query: string) {
  const hasSaveVerb = /\b(zapisz|dodaj|utworz|stworz|wrzuc|wrzucic|zapamietaj)\b/u.test(query);
  const hasLeadWord = /\b(lead|leada|kontakt|klient|temat)\b/u.test(query);
  const hasLeadLikeContent = /\b(zainteresowan|sprzedaz|sprzedaza|zakup|dzialk|dzialki|stron|ofert|papiery|oddzwon|dzwonil|telefon|mail)\b/u.test(query);
  return (hasSaveVerb && (hasLeadWord || hasLeadLikeContent)) || /\bmam leada\b/u.test(query);
}

function buildCaptureAnswer(rawText: string): AssistantResponse {
  return {
    ok: true,
    scope: 'assistant_read_or_draft_only',
    provider: 'rules',
    noAutoWrite: true,
    intent: 'lead_capture',
    title: 'Szkic leada zapisany do sprawdzenia',
    summary: 'To wygląda jak lead. Notatka powinna trafić do Szkiców AI, a finalny lead powstanie dopiero po Twojej akceptacji.',
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
        detail: 'Tam poprawisz pola i zatwierdzisz leada, gdy będziesz mógł spokojnie sprawdzić dane.',
        href: '/ai-drafts',
        priority: 'medium',
      },
    ],
    warnings: ['Asystent nie tworzy leada automatycznie. Zapisuje tylko szkic do późniejszego zatwierdzenia.'],
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
    summary: 'Mogę odpowiadać w pełnym zakresie CloseFlow: leady, klienci, sprawy, zadania, wydarzenia, plan dnia, plan na jutro, wartość lejka i szkice AI.',
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
  return /\b(wartosc|wartość|lejek|lejka|najcenniejsz|najdrozsz|najdroższ|top lead|top klient)\b/u.test(query);
}

function wantsLookup(query: string) {
  return /\b(co dalej|co ma|jaki nastepny|następny|lead|leada|klient|klienta|kontakt|temat|sprawa|zadanie z|zadania z)\b/u.test(query);
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

  return buildUnknown(rawText);
}

export default async function aiAssistantHandler(req: any, res: any) {
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
