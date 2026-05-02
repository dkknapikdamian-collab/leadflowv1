const ASSISTANT_LEAD_DRAFT_CONTRACT_TITLE = 'Szkic leada zapisany do sprawdzenia';
import { getSupabaseAccessToken } from './supabase-auth';

export type TodayAiAssistantIntent = 'today_briefing' | 'lead_lookup' | 'lead_capture' | 'global_app_search' | 'blocked_out_of_scope' | 'unknown';

export type TodayAiAssistantItem = {
  label: string;
  detail?: string;
  href?: string;
  priority?: 'low' | 'medium' | 'high';
  entityType?: string;
  id?: string;
};

export type TodayAiAssistantDraft = {
  type: 'lead' | 'task' | 'event' | 'note';
  rawText: string;
  parsedDraft: Record<string, unknown>;
  status: 'draft';
  source: 'assistant_operator';
};

export type TodayAiAssistantAnswer = {
  ok: boolean;
  mode?: 'read' | 'draft';
  answer?: string;
  draft?: TodayAiAssistantDraft | null;
  operatorIntent?: string;
  snapshotMeta?: Record<string, unknown>;
  systemInstruction?: string[];
  scope: 'assistant_read_or_draft_only';
  provider: string;
  noAutoWrite: boolean;
  intent: TodayAiAssistantIntent;
  title: string;
  summary: string;
  rawText: string;
  items: TodayAiAssistantItem[];
  warnings: string[];
  suggestedCaptureText?: string;
  hardBlock?: boolean;
  allowedScope?: string[];
  costGuard?: 'local_rules' | 'external_ai' | 'client_guard';
};

export type TodayAiAssistantInput = {
  rawText: string;
  context: {
    leads?: Record<string, unknown>[];
    tasks?: Record<string, unknown>[];
    events?: Record<string, unknown>[];
    cases?: Record<string, unknown>[];
    clients?: Record<string, unknown>[];
    drafts?: Record<string, unknown>[];
    operatorSnapshot?: Record<string, unknown>;
    summary?: Record<string, unknown>;
    relations?: Record<string, unknown>;
    searchIndex?: Record<string, unknown>[];
    workspaceId?: string | null;
    now?: string;
  };
};



// AI_ASSISTANT_QUERY_BRAIN_STAGE32
// Lokalna warstwa rozumienia danych aplikacji: pytania analityczne o zadania, terminy i mapę systemu
// odpowiadają z przekazanego kontekstu aplikacji, bez zgadywania i bez zapisu do bazy.
const AI_ASSISTANT_QUERY_BRAIN_STAGE32 = true;

type Stage32DateRange = {
  label: string;
  from: Date;
  to: Date;
};

type Stage32TaskRow = Record<string, unknown> & {
  _stage32Moment?: Date;
  _stage32MomentRaw?: string;
};

function stage32Text(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function stage32Normalize(value: unknown) {
  return stage32Text(value)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9@.+\-\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function stage32Array(value: unknown): Record<string, unknown>[] {
  return Array.isArray(value) ? value.filter((item) => item && typeof item === 'object') as Record<string, unknown>[] : [];
}

function stage32RecordId(row: Record<string, unknown>) {
  return stage32Text(row.id || row.uid || row.sourceId || row.source_id || row.taskId || row.task_id || row.leadId || row.lead_id || row.caseId || row.case_id);
}

function stage32GetDateLike(row: Record<string, unknown>) {
  return stage32Text(
    row.scheduledAt
    || row.scheduled_at
    || row.dueAt
    || row.due_at
    || row.dueDate
    || row.due_date
    || row.startAt
    || row.start_at
    || row.startsAt
    || row.starts_at
    || row.date
    || row.reminderAt
    || row.reminder_at
    || row.createdAt
    || row.created_at,
  );
}

function stage32ParseDate(value: unknown) {
  const text = stage32Text(value);
  if (!text) return null;
  const parsed = new Date(text.includes('T') ? text : text + 'T09:00:00');
  return Number.isFinite(parsed.getTime()) ? parsed : null;
}

function stage32StartOfDay(value: Date) {
  const next = new Date(value);
  next.setHours(0, 0, 0, 0);
  return next;
}

function stage32EndOfDay(value: Date) {
  const next = new Date(value);
  next.setHours(23, 59, 59, 999);
  return next;
}

function stage32MonthRange(now: Date, monthOffset: number, label: string): Stage32DateRange {
  const from = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1, 0, 0, 0, 0);
  const to = new Date(now.getFullYear(), now.getMonth() + monthOffset + 1, 0, 23, 59, 59, 999);
  return { label, from, to };
}

function stage32DayRange(now: Date, dayOffset: number, label: string): Stage32DateRange {
  const base = new Date(now);
  base.setDate(base.getDate() + dayOffset);
  return { label, from: stage32StartOfDay(base), to: stage32EndOfDay(base) };
}

function stage32ResolveDateRange(query: string, now: Date): Stage32DateRange | null {
  if (/\b(nastepnym miesiacu|nastepny miesiac|przyszly miesiac|kolejny miesiac)\b/u.test(query)) {
    return stage32MonthRange(now, 1, 'następnym miesiącu');
  }
  if (/\b(tym miesiacu|biezacy miesiac|obecny miesiac|ten miesiac)\b/u.test(query)) {
    return stage32MonthRange(now, 0, 'tym miesiącu');
  }
  if (/\b(jutro|jutrzejszy|jutrzejsze)\b/u.test(query)) {
    return stage32DayRange(now, 1, 'jutro');
  }
  if (/\b(pojutrze|po jutrze)\b/u.test(query)) {
    return stage32DayRange(now, 2, 'pojutrze');
  }
  if (/\b(dzis|dzisiaj|dzisiejszy|dziś)\b/u.test(query)) {
    return stage32DayRange(now, 0, 'dzisiaj');
  }
  if (/\b(nastepne 7 dni|najblizsze 7 dni|kolejne 7 dni|przyszly tydzien|nastepny tydzien)\b/u.test(query)) {
    const from = stage32StartOfDay(now);
    const to = stage32EndOfDay(new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7));
    return { label: 'najbliższych 7 dniach', from, to };
  }
  return null;
}

function stage32FormatDay(value: Date) {
  return new Intl.DateTimeFormat('pl-PL', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(value);
}

function stage32FormatMoment(value: Date) {
  return new Intl.DateTimeFormat('pl-PL', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(value);
}

function stage32DateKey(value: Date) {
  return [
    value.getFullYear(),
    String(value.getMonth() + 1).padStart(2, '0'),
    String(value.getDate()).padStart(2, '0'),
  ].join('-');
}

function stage32IsOpenTask(row: Record<string, unknown>) {
  const status = stage32Normalize(row.status || row.state || row.stage);
  return !['done', 'completed', 'complete', 'cancelled', 'canceled', 'archived', 'zrobione', 'anulowane'].includes(status);
}

function stage32TaskTitle(row: Record<string, unknown>) {
  return stage32Text(row.title || row.name || row.subject || row.description) || 'Zadanie';
}

function stage32TaskHref(row: Record<string, unknown>) {
  const leadId = stage32Text(row.leadId || row.lead_id);
  const caseId = stage32Text(row.caseId || row.case_id);
  if (leadId) return '/leads/' + leadId;
  if (caseId) return '/cases/' + caseId;
  return '/tasks';
}

function stage32CollectOpenTasks(context: TodayAiAssistantInput['context']) {
  return stage32Array(context.tasks)
    .filter(stage32IsOpenTask)
    .map((task) => {
      const rawMoment = stage32GetDateLike(task);
      const parsedMoment = stage32ParseDate(rawMoment);
      return {
        ...task,
        _stage32Moment: parsedMoment || undefined,
        _stage32MomentRaw: rawMoment || undefined,
      } as Stage32TaskRow;
    })
    .filter((task) => task._stage32Moment instanceof Date)
    .sort((a, b) => (a._stage32Moment?.getTime() || 0) - (b._stage32Moment?.getTime() || 0));
}

function stage32FilterTasksByRange(tasks: Stage32TaskRow[], range: Stage32DateRange | null) {
  if (!range) return tasks;
  return tasks.filter((task) => {
    const moment = task._stage32Moment;
    return Boolean(moment && moment.getTime() >= range.from.getTime() && moment.getTime() <= range.to.getTime());
  });
}

function stage32LooksLikeSaveCommand(query: string) {
  return /\b(zapisz|dodaj|utworz|stworz|wrzuc|wrzucic|zapamietaj|notuj|zanotuj|mam leada|nowy lead|nowego leada|nowy kontakt)\b/u.test(query);
}

function stage32WantsMostTasksDay(query: string) {
  return /\b(najwiecej|najwiecej zadan|najbardziej obciazony|najbardziej zajety)\b/u.test(query)
    && /\b(zadan|zadania|zadanie|task|taskow)\b/u.test(query)
    && /\b(dzien|dnia|kiedy|ktory|jaki)\b/u.test(query);
}

function stage32WantsFirstTask(query: string) {
  return /\b(pierwsze|pierwszy|najwczesniejsze|najwczesniejszy|najblizsze|najblizszy)\b/u.test(query)
    && /\b(zadanie|zadania|zadan|task)\b/u.test(query);
}

function stage32WantsTaskListInRange(query: string, range: Stage32DateRange | null) {
  if (!range) return false;
  return /\b(zadanie|zadania|zadan|task|taski|co mam|pokaz|pokaż|lista|terminy)\b/u.test(query);
}

function stage32WantsAppMap(query: string) {
  return /\b(czym jest aplikacja|jak dziala aplikacja|co gdzie jest|mapa aplikacji|jak korzystac|gdzie jest)\b/u.test(query)
    && /\b(aplikacja|closeflow|system|zakladka|modul|dziala|jest)\b/u.test(query);
}

function stage32BuildTaskItem(task: Stage32TaskRow): TodayAiAssistantItem {
  const moment = task._stage32Moment;
  return {
    label: stage32TaskTitle(task),
    detail: 'Zadanie · ' + (moment ? stage32FormatMoment(moment) : 'bez terminu'),
    href: stage32TaskHref(task),
    priority: stage32Normalize(task.priority) === 'high' || stage32Normalize(task.priority) === 'pilne' ? 'high' : 'medium',
    entityType: 'task',
    id: stage32RecordId(task) || undefined,
  };
}

function stage32BuildMostTasksDayAnswer(input: TodayAiAssistantInput, query: string, range: Stage32DateRange | null): TodayAiAssistantAnswer {
  const tasks = stage32FilterTasksByRange(stage32CollectOpenTasks(input.context), range);
  const groups = new Map<string, { date: Date; tasks: Stage32TaskRow[] }>();

  for (const task of tasks) {
    const moment = task._stage32Moment;
    if (!moment) continue;
    const key = stage32DateKey(moment);
    if (!groups.has(key)) groups.set(key, { date: stage32StartOfDay(moment), tasks: [] });
    groups.get(key)?.tasks.push(task);
  }

  const ranked = [...groups.values()]
    .sort((a, b) => b.tasks.length - a.tasks.length || a.date.getTime() - b.date.getTime());

  const top = ranked[0];

  return {
    ok: true,
    mode: 'read',
    answer: top
      ? 'Najwięcej zadań masz w dniu: ' + stage32FormatDay(top.date) + ' — ' + top.tasks.length + ' zadań.'
      : 'Nie znalazłem otwartych zadań z terminem' + (range ? ' w ' + range.label : '') + '.',
    draft: null,
    operatorIntent: 'task_day_with_most_tasks',
    snapshotMeta: { stage: 'AI_ASSISTANT_QUERY_BRAIN_STAGE32', range: range?.label || 'all_open_tasks_with_date' },
    scope: 'assistant_read_or_draft_only',
    provider: 'rules',
    costGuard: 'local_rules',
    noAutoWrite: true,
    intent: 'global_app_search',
    title: top ? 'Dzień z największą liczbą zadań' : 'Brak zadań do policzenia',
    summary: top
      ? 'Najwięcej otwartych zadań przypada na ' + stage32FormatDay(top.date) + ': ' + top.tasks.length + ' zadań.'
      : 'Nie mam z czego policzyć obciążenia dni, bo nie widzę otwartych zadań z terminem' + (range ? ' w ' + range.label : '') + '.',
    rawText: input.rawText,
    items: ranked.slice(0, 8).map((group) => ({
      label: stage32FormatDay(group.date),
      detail: group.tasks.length + ' zadań · pierwsze: ' + stage32TaskTitle(group.tasks[0]),
      href: '/tasks',
      priority: group === top ? 'high' : 'medium',
      entityType: 'task_day_group',
      id: stage32DateKey(group.date),
    })),
    warnings: [],
  };
}

function stage32BuildFirstTaskAnswer(input: TodayAiAssistantInput, range: Stage32DateRange | null): TodayAiAssistantAnswer {
  const tasks = stage32FilterTasksByRange(stage32CollectOpenTasks(input.context), range);
  const first = tasks[0];

  return {
    ok: true,
    mode: 'read',
    answer: first && first._stage32Moment
      ? 'Pierwsze zadanie ' + (range ? 'w ' + range.label : 'w danych aplikacji') + ': ' + stage32TaskTitle(first) + ' — ' + stage32FormatMoment(first._stage32Moment) + '.'
      : 'Nie znalazłem otwartego zadania' + (range ? ' w ' + range.label : '') + '.',
    draft: null,
    operatorIntent: 'first_task_in_range',
    snapshotMeta: { stage: 'AI_ASSISTANT_QUERY_BRAIN_STAGE32', range: range?.label || 'all_open_tasks_with_date' },
    scope: 'assistant_read_or_draft_only',
    provider: 'rules',
    costGuard: 'local_rules',
    noAutoWrite: true,
    intent: 'global_app_search',
    title: first ? 'Pierwsze zadanie' : 'Nie znalazłem zadania',
    summary: first && first._stage32Moment
      ? 'Pierwsze otwarte zadanie ' + (range ? 'w ' + range.label : 'w aplikacji') + ' to: ' + stage32TaskTitle(first) + ', termin ' + stage32FormatMoment(first._stage32Moment) + '.'
      : 'Nie widzę otwartych zadań z terminem' + (range ? ' w ' + range.label : '') + '.',
    rawText: input.rawText,
    items: first ? [stage32BuildTaskItem(first)] : [],
    warnings: first ? [] : ['Sprawdziłem zadania z terminem. Zadania bez daty nie wchodzą do odpowiedzi o kolejności.'],
  };
}

function stage32BuildTaskListAnswer(input: TodayAiAssistantInput, range: Stage32DateRange): TodayAiAssistantAnswer {
  const tasks = stage32FilterTasksByRange(stage32CollectOpenTasks(input.context), range);

  return {
    ok: true,
    mode: 'read',
    answer: tasks.length
      ? 'Widzę ' + tasks.length + ' otwartych zadań w ' + range.label + '.'
      : 'Nie widzę otwartych zadań w ' + range.label + '.',
    draft: null,
    operatorIntent: 'task_list_in_range',
    snapshotMeta: { stage: 'AI_ASSISTANT_QUERY_BRAIN_STAGE32', range: range.label },
    scope: 'assistant_read_or_draft_only',
    provider: 'rules',
    costGuard: 'local_rules',
    noAutoWrite: true,
    intent: 'global_app_search',
    title: 'Zadania w ' + range.label,
    summary: tasks.length
      ? 'Lista jest posortowana od najwcześniejszego terminu. Pokazuję maksymalnie 10 pierwszych pozycji.'
      : 'Brak otwartych zadań w wybranym zakresie dat.',
    rawText: input.rawText,
    items: tasks.slice(0, 10).map(stage32BuildTaskItem),
    warnings: tasks.length > 10 ? ['Pokazuję 10 pierwszych zadań. Pełną listę otwórz w zakładce Zadania.'] : [],
  };
}

function stage32BuildAppMapAnswer(input: TodayAiAssistantInput): TodayAiAssistantAnswer {
  const context = input.context;
  const counts = {
    leads: stage32Array(context.leads).length,
    clients: stage32Array(context.clients).length,
    cases: stage32Array(context.cases).length,
    tasks: stage32Array(context.tasks).length,
    events: stage32Array(context.events).length,
    drafts: stage32Array(context.drafts).length,
  };

  return {
    ok: true,
    mode: 'read',
    answer: 'CloseFlow to system pracy na leadach: Dziś pokazuje priorytety, Leady zbierają kontakty, Klienci są kartoteką osób, Sprawy prowadzą obsługę, Zadania i Kalendarz pilnują terminów, a Szkice AI czekają na zatwierdzenie.',
    draft: null,
    operatorIntent: 'app_map',
    snapshotMeta: { stage: 'AI_ASSISTANT_QUERY_BRAIN_STAGE32', counts },
    scope: 'assistant_read_or_draft_only',
    provider: 'rules',
    costGuard: 'local_rules',
    noAutoWrite: true,
    intent: 'global_app_search',
    title: 'Mapa CloseFlow',
    summary: 'Asystent ma używać mapy aplikacji i aktualnych danych, a nie gotowych odpowiedzi tekstowych. Aktualny kontekst: leady ' + counts.leads + ', klienci ' + counts.clients + ', sprawy ' + counts.cases + ', zadania ' + counts.tasks + ', wydarzenia ' + counts.events + ', szkice AI ' + counts.drafts + '.',
    rawText: input.rawText,
    items: [
      { label: 'Dziś', detail: 'Priorytety, pilne zadania, terminy i skróty do pracy.', href: '/', priority: 'high', entityType: 'app_section' },
      { label: 'Leady', detail: 'Kontakty sprzedażowe przed przejściem do klienta lub sprawy.', href: '/leads', priority: 'medium', entityType: 'app_section' },
      { label: 'Klienci', detail: 'Kartoteka osób i firm, bez dublowania pracy ze spraw.', href: '/clients', priority: 'medium', entityType: 'app_section' },
      { label: 'Sprawy', detail: 'Obsługa procesu po sprzedaży lub po przyjęciu zlecenia.', href: '/cases', priority: 'medium', entityType: 'app_section' },
      { label: 'Zadania', detail: 'Rzeczy do wykonania, terminy, statusy i priorytety.', href: '/tasks', priority: 'high', entityType: 'app_section' },
      { label: 'Kalendarz', detail: 'Wydarzenia, spotkania i plan najbliższych dni.', href: '/calendar', priority: 'high', entityType: 'app_section' },
      { label: 'Szkice AI', detail: 'Robocze zapisy od AI, które trzeba zatwierdzić ręcznie.', href: '/ai-drafts', priority: 'medium', entityType: 'app_section' },
    ],
    warnings: [],
  };
}

function buildStage32LocalQueryBrainAnswer(input: TodayAiAssistantInput): TodayAiAssistantAnswer | null {
  const query = stage32Normalize(input.rawText);
  if (!query || stage32LooksLikeSaveCommand(query)) return null;

  const now = stage32ParseDate(input.context.now) || new Date();
  const range = stage32ResolveDateRange(query, now);

  if (stage32WantsAppMap(query)) {
    return stage32BuildAppMapAnswer(input);
  }

  if (stage32WantsMostTasksDay(query)) {
    return stage32BuildMostTasksDayAnswer(input, query, range);
  }

  if (stage32WantsFirstTask(query)) {
    return stage32BuildFirstTaskAnswer(input, range);
  }

  if (stage32WantsTaskListInRange(query, range)) {
    return stage32BuildTaskListAnswer(input, range!);
  }

  return null;
}

void AI_ASSISTANT_QUERY_BRAIN_STAGE32;

function getContextWorkspaceId(context: TodayAiAssistantInput['context']) {
  const direct = typeof context.workspaceId === 'string' ? context.workspaceId.trim() : '';
  const snapshot = context.operatorSnapshot && typeof context.operatorSnapshot === 'object'
    ? String((context.operatorSnapshot as any).workspaceId || (context.operatorSnapshot as any).workspace_id || '').trim()
    : '';
  return direct || snapshot || '';
}

// AI_APP_CONTEXT_OPERATOR_STAGE26_TYPES: odpowiedź zachowuje stary kontrakt UI i dodaje { mode, answer, items, draft }.
export async function askTodayAiAssistant(input: TodayAiAssistantInput) {
  // AI_ASSISTANT_SEMANTIC_ROUTER_STAGE33_CLIENT
  // Modelowy router semantyczny jest pierwszą ścieżką dla pytań o aplikację.
  // Lokalny Stage32 zostaje tylko jako offline/error fallback, a nie jako główny mózg oparty o frazy.
  const stage32LocalFallback = buildStage32LocalQueryBrainAnswer(input);
  const workspaceId = getContextWorkspaceId(input.context);
  const accessToken = await getSupabaseAccessToken();

  try {
    const response = await fetch('/api/system?kind=ai-assistant', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      body: JSON.stringify({
        rawText: input.rawText,
        now: new Date().toISOString(),
        workspaceId,
        semanticRouter: true,
        context: {
          ...input.context,
          workspaceId,
          now: input.context.now || new Date().toISOString(),
        },
      }),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(String(data?.error || 'AI_ASSISTANT_FAILED'));
    }

    // AI_DRAFT_ONLY_POLICY_STAGE10_CLIENT_NORMALIZE: even provider answers cannot enable direct writes.
    return {
      ...(data as TodayAiAssistantAnswer),
      scope: 'assistant_read_or_draft_only',
      noAutoWrite: true,
    } as TodayAiAssistantAnswer;
  } catch (error) {
    if (stage32LocalFallback) {
      return {
        ...stage32LocalFallback,
        warnings: [
          ...(stage32LocalFallback.warnings || []),
          'Fallback lokalny: modelowy router semantyczny nie odpowiedział, więc użyto awaryjnych reguł z danych aplikacji.',
        ],
      };
    }

    throw error;
  }
}

void ASSISTANT_LEAD_DRAFT_CONTRACT_TITLE;
