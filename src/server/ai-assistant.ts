type AssistantIntent = 'today_briefing' | 'lead_lookup' | 'lead_capture' | 'unknown';

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
};

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
  return asText(row.id || row.uid || row.sourceId);
}

function getLeadDisplayName(lead: Record<string, unknown>) {
  return asText(lead.name) || asText(lead.company) || asText(lead.email) || asText(lead.phone) || 'Lead bez nazwy';
}

function getLeadSearchText(lead: Record<string, unknown>) {
  return normalizeText([
    lead.name,
    lead.company,
    lead.email,
    lead.phone,
    lead.source,
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

function startOfToday(now: Date) {
  const result = new Date(now);
  result.setHours(0, 0, 0, 0);
  return result;
}

function endOfToday(now: Date) {
  const result = new Date(now);
  result.setHours(23, 59, 59, 999);
  return result;
}

function isOpenStatus(value: unknown) {
  const status = asText(value).toLowerCase();
  return !['done', 'completed', 'cancelled', 'canceled', 'archived'].includes(status);
}

function isDueTodayOrOverdue(value: unknown, now: Date) {
  const parsed = parseDate(value);
  if (!parsed) return false;
  return parsed.getTime() <= endOfToday(now).getTime();
}

function isEventToday(value: unknown, now: Date) {
  const parsed = parseDate(value);
  if (!parsed) return false;
  return parsed.getTime() >= startOfToday(now).getTime() && parsed.getTime() <= endOfToday(now).getTime();
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

function buildTodayBriefing(context: Record<string, unknown>, rawText: string, now: Date): AssistantResponse {
  const tasks = safeArray(context.tasks)
    .filter((task) => isOpenStatus(task.status) && isDueTodayOrOverdue(getTaskMoment(task), now))
    .sort((a, b) => (parseDate(getTaskMoment(a))?.getTime() ?? Number.MAX_SAFE_INTEGER) - (parseDate(getTaskMoment(b))?.getTime() ?? Number.MAX_SAFE_INTEGER));

  const events = safeArray(context.events)
    .filter((event) => isOpenStatus(event.status) && isEventToday(getEventMoment(event), now))
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
    title: items.length ? 'Plan na dziś' : 'Na dziś nie widzę pilnych akcji',
    summary: items.length
      ? `Widzę ${tasks.length} zadań i ${events.length} wydarzeń na dziś lub zaległych. Najpierw domknij pozycje z góry listy.`
      : 'Nie znalazłem otwartych zadań ani wydarzeń przypadających na dziś.',
    rawText,
    items,
    warnings: [],
  };
}

function detectCaptureIntent(query: string) {
  const hasSaveVerb = /\b(zapisz|dodaj|utworz|stworz|wrzuc)\b/u.test(query);
  const hasLeadWord = /\b(lead|leada|kontakt|klient|temat)\b/u.test(query);
  const hasLeadLikeContent = /\b(zainteresowan|sprzedaz|zakup|dzialk|dzialki|stron|ofert|papiery|oddzwon)\b/u.test(query);
  return (hasSaveVerb && (hasLeadWord || hasLeadLikeContent)) || /\bmam leada\b/u.test(query);
}

function buildCaptureAnswer(rawText: string): AssistantResponse {
  return {
    ok: true,
    scope: 'assistant_read_or_draft_only',
    provider: 'rules',
    noAutoWrite: true,
    intent: 'lead_capture',
    title: 'To wygląda jak lead do zapisania',
    summary: 'Zostawiłem treść jako surową notatkę. Następny krok to szybki szkic leada, gdzie poprawisz pola i dopiero wtedy zapiszesz rekord.',
    rawText,
    suggestedCaptureText: rawText,
    items: [
      {
        label: 'Surowa treść do przepisania',
        detail: rawText,
        priority: 'high',
      },
      {
        label: 'Użyj Szybkiego szkicu',
        detail: 'AI uzupełni roboczo pola, ale zapis nastąpi dopiero po Twojej akceptacji.',
        href: '/leads',
        priority: 'medium',
      },
    ],
    warnings: ['Ten panel jeszcze nie zapisuje leadów samodzielnie. Zapis zostaje w Szybkim szkicu z potwierdzeniem użytkownika.'],
  };
}

function findMentionedLead(query: string, leads: Record<string, unknown>[]) {
  const queryText = normalizeText(query);
  let best: { lead: Record<string, unknown>; score: number } | null = null;

  for (const lead of leads) {
    const searchText = getLeadSearchText(lead);
    if (!searchText) continue;

    const tokens = searchText.split(' ').filter((token) => token.length >= 3);
    const score = tokens.reduce((sum, token) => sum + (queryText.includes(token) ? 1 : 0), 0);
    if (score > 0 && (!best || score > best.score)) {
      best = { lead, score };
    }
  }

  return best?.lead || null;
}

function buildLeadLookup(context: Record<string, unknown>, rawText: string, now: Date): AssistantResponse {
  const leads = safeArray(context.leads);
  const tasks = safeArray(context.tasks);
  const events = safeArray(context.events);
  const query = normalizeText(rawText);
  const lead = findMentionedLead(query, leads);

  if (!lead) {
    return {
      ok: true,
      scope: 'assistant_read_or_draft_only',
      provider: 'rules',
      noAutoWrite: true,
      intent: 'lead_lookup',
      title: 'Nie znalazłem konkretnego leada',
      summary: 'Powiedz nazwę, firmę, telefon albo e-mail leada, np. „co dalej z Janem Kowalskim?”.',
      rawText,
      items: leads.slice(0, 5).map((item) => ({
        label: getLeadDisplayName(item),
        detail: asText(item.status) || 'Lead',
        href: `/leads/${getId(item)}`,
        priority: 'medium',
      })),
      warnings: [],
    };
  }

  const leadId = getId(lead);
  const openTasks = tasks
    .filter((task) => asText(task.leadId) === leadId && isOpenStatus(task.status))
    .sort((a, b) => (parseDate(getTaskMoment(a))?.getTime() ?? Number.MAX_SAFE_INTEGER) - (parseDate(getTaskMoment(b))?.getTime() ?? Number.MAX_SAFE_INTEGER));

  const upcomingEvents = events
    .filter((event) => asText(event.leadId) === leadId && isOpenStatus(event.status))
    .sort((a, b) => (parseDate(getEventMoment(a))?.getTime() ?? Number.MAX_SAFE_INTEGER) - (parseDate(getEventMoment(b))?.getTime() ?? Number.MAX_SAFE_INTEGER));

  const items: AssistantItem[] = [
    ...openTasks.slice(0, 5).map((task) => ({
      label: asText(task.title) || 'Zadanie',
      detail: `Zadanie · ${formatShort(getTaskMoment(task))}`,
      href: `/leads/${leadId}`,
      priority: asText(task.priority) === 'high' ? 'high' : 'medium',
    } as AssistantItem)),
    ...upcomingEvents.slice(0, 3).map((event) => ({
      label: asText(event.title) || 'Wydarzenie',
      detail: `Wydarzenie · ${formatShort(getEventMoment(event))}`,
      href: `/leads/${leadId}`,
      priority: 'medium' as const,
    })),
  ];

  if (!items.length) {
    items.push({
      label: 'Brak aktywnego zadania',
      detail: 'Najbezpieczniej dodać follow-up albo użyć AI następny ruch w szczegółach leada.',
      href: `/leads/${leadId}`,
      priority: 'high',
    });
  }

  return {
    ok: true,
    scope: 'assistant_read_or_draft_only',
    provider: 'rules',
    noAutoWrite: true,
    intent: 'lead_lookup',
    title: `Co dalej z: ${getLeadDisplayName(lead)}`,
    summary: items.length
      ? 'Poniżej masz aktualne zadania i wydarzenia powiązane z tym leadem.'
      : 'Nie znalazłem aktywnych akcji dla tego leada.',
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
    title: 'Nie jestem pewien, o co chodzi',
    summary: 'Spróbuj: „co mam dzisiaj zrobić”, „co dalej z Janem Kowalskim” albo „mam leada, zapisz...”.',
    rawText,
    items: [],
    warnings: [],
  };
}

function buildAssistantAnswer(body: Record<string, unknown>): AssistantResponse {
  const rawText = asText(body.rawText || body.text || body.command);
  const context = (body.context && typeof body.context === 'object') ? body.context as Record<string, unknown> : {};
  const now = parseDate(body.now || (context as any).now) || new Date();
  const query = normalizeText(rawText);

  if (!rawText) {
    return buildUnknown(rawText);
  }

  if (detectCaptureIntent(query)) {
    return buildCaptureAnswer(rawText);
  }

  if (/\b(co mam|co dzis|dzisiaj|dzis|plan dnia|lista rzeczy|robic|zrobic|do zrobienia)\b/u.test(query)) {
    return buildTodayBriefing(context, rawText, now);
  }

  if (/\b(co dalej|co ma|jaki nastepny|następny|lead|klient|temat)\b/u.test(query)) {
    return buildLeadLookup(context, rawText, now);
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
