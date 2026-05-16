const fs = require('fs');
const path = require('path');

const repo = process.cwd();
const targetPath = path.join(repo, 'src', 'lib', 'ai-assistant.ts');

if (!fs.existsSync(targetPath)) {
  throw new Error('Missing src/lib/ai-assistant.ts');
}

let source = fs.readFileSync(targetPath, 'utf8');

const marker = 'AI_ASSISTANT_QUERY_BRAIN_STAGE32';

const helperBlock = String.raw`

// AI_ASSISTANT_QUERY_BRAIN_STAGE32
// Lokalna warstwa rozumienia danych aplikacji: pytania analityczne o zadania, terminy i map\u0119 systemu
// odpowiadaj\u0105 z przekazanego kontekstu aplikacji, bez zgadywania i bez zapisu do bazy.
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
    return stage32MonthRange(now, 1, 'nast\u0119pnym miesi\u0105cu');
  }
  if (/\b(tym miesiacu|biezacy miesiac|obecny miesiac|ten miesiac)\b/u.test(query)) {
    return stage32MonthRange(now, 0, 'tym miesi\u0105cu');
  }
  if (/\b(jutro|jutrzejszy|jutrzejsze)\b/u.test(query)) {
    return stage32DayRange(now, 1, 'jutro');
  }
  if (/\b(pojutrze|po jutrze)\b/u.test(query)) {
    return stage32DayRange(now, 2, 'pojutrze');
  }
  if (/\b(dzis|dzisiaj|dzisiejszy|dzi\u015B)\b/u.test(query)) {
    return stage32DayRange(now, 0, 'dzisiaj');
  }
  if (/\b(nastepne 7 dni|najblizsze 7 dni|kolejne 7 dni|przyszly tydzien|nastepny tydzien)\b/u.test(query)) {
    const from = stage32StartOfDay(now);
    const to = stage32EndOfDay(new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7));
    return { label: 'najbli\u017Cszych 7 dniach', from, to };
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
  return /\b(zadanie|zadania|zadan|task|taski|co mam|pokaz|poka\u017C|lista|terminy)\b/u.test(query);
}

function stage32WantsAppMap(query: string) {
  return /\b(czym jest aplikacja|jak dziala aplikacja|co gdzie jest|mapa aplikacji|jak korzystac|gdzie jest)\b/u.test(query)
    && /\b(aplikacja|closeflow|system|zakladka|modul|dziala|jest)\b/u.test(query);
}

function stage32BuildTaskItem(task: Stage32TaskRow): TodayAiAssistantItem {
  const moment = task._stage32Moment;
  return {
    label: stage32TaskTitle(task),
    detail: 'Zadanie \u00B7 ' + (moment ? stage32FormatMoment(moment) : 'bez terminu'),
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
      ? 'Najwi\u0119cej zada\u0144 masz w dniu: ' + stage32FormatDay(top.date) + ' \u2014 ' + top.tasks.length + ' zada\u0144.'
      : 'Nie znalaz\u0142em otwartych zada\u0144 z terminem' + (range ? ' w ' + range.label : '') + '.',
    draft: null,
    operatorIntent: 'task_day_with_most_tasks',
    snapshotMeta: { stage: 'AI_ASSISTANT_QUERY_BRAIN_STAGE32', range: range?.label || 'all_open_tasks_with_date' },
    scope: 'assistant_read_or_draft_only',
    provider: 'rules',
    costGuard: 'local_rules',
    noAutoWrite: true,
    intent: 'global_app_search',
    title: top ? 'Dzie\u0144 z najwi\u0119ksz\u0105 liczb\u0105 zada\u0144' : 'Brak zada\u0144 do policzenia',
    summary: top
      ? 'Najwi\u0119cej otwartych zada\u0144 przypada na ' + stage32FormatDay(top.date) + ': ' + top.tasks.length + ' zada\u0144.'
      : 'Nie mam z czego policzy\u0107 obci\u0105\u017Cenia dni, bo nie widz\u0119 otwartych zada\u0144 z terminem' + (range ? ' w ' + range.label : '') + '.',
    rawText: input.rawText,
    items: ranked.slice(0, 8).map((group) => ({
      label: stage32FormatDay(group.date),
      detail: group.tasks.length + ' zada\u0144 \u00B7 pierwsze: ' + stage32TaskTitle(group.tasks[0]),
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
      ? 'Pierwsze zadanie ' + (range ? 'w ' + range.label : 'w danych aplikacji') + ': ' + stage32TaskTitle(first) + ' \u2014 ' + stage32FormatMoment(first._stage32Moment) + '.'
      : 'Nie znalaz\u0142em otwartego zadania' + (range ? ' w ' + range.label : '') + '.',
    draft: null,
    operatorIntent: 'first_task_in_range',
    snapshotMeta: { stage: 'AI_ASSISTANT_QUERY_BRAIN_STAGE32', range: range?.label || 'all_open_tasks_with_date' },
    scope: 'assistant_read_or_draft_only',
    provider: 'rules',
    costGuard: 'local_rules',
    noAutoWrite: true,
    intent: 'global_app_search',
    title: first ? 'Pierwsze zadanie' : 'Nie znalaz\u0142em zadania',
    summary: first && first._stage32Moment
      ? 'Pierwsze otwarte zadanie ' + (range ? 'w ' + range.label : 'w aplikacji') + ' to: ' + stage32TaskTitle(first) + ', termin ' + stage32FormatMoment(first._stage32Moment) + '.'
      : 'Nie widz\u0119 otwartych zada\u0144 z terminem' + (range ? ' w ' + range.label : '') + '.',
    rawText: input.rawText,
    items: first ? [stage32BuildTaskItem(first)] : [],
    warnings: first ? [] : ['Sprawdzi\u0142em zadania z terminem. Zadania bez daty nie wchodz\u0105 do odpowiedzi o kolejno\u015Bci.'],
  };
}

function stage32BuildTaskListAnswer(input: TodayAiAssistantInput, range: Stage32DateRange): TodayAiAssistantAnswer {
  const tasks = stage32FilterTasksByRange(stage32CollectOpenTasks(input.context), range);

  return {
    ok: true,
    mode: 'read',
    answer: tasks.length
      ? 'Widz\u0119 ' + tasks.length + ' otwartych zada\u0144 w ' + range.label + '.'
      : 'Nie widz\u0119 otwartych zada\u0144 w ' + range.label + '.',
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
      ? 'Lista jest posortowana od najwcze\u015Bniejszego terminu. Pokazuj\u0119 maksymalnie 10 pierwszych pozycji.'
      : 'Brak otwartych zada\u0144 w wybranym zakresie dat.',
    rawText: input.rawText,
    items: tasks.slice(0, 10).map(stage32BuildTaskItem),
    warnings: tasks.length > 10 ? ['Pokazuj\u0119 10 pierwszych zada\u0144. Pe\u0142n\u0105 list\u0119 otw\u00F3rz w zak\u0142adce Zadania.'] : [],
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
    answer: 'CloseFlow to system pracy na leadach: Dzi\u015B pokazuje priorytety, Leady zbieraj\u0105 kontakty, Klienci s\u0105 kartotek\u0105 os\u00F3b, Sprawy prowadz\u0105 obs\u0142ug\u0119, Zadania i Kalendarz pilnuj\u0105 termin\u00F3w, a Szkice AI czekaj\u0105 na zatwierdzenie.',
    draft: null,
    operatorIntent: 'app_map',
    snapshotMeta: { stage: 'AI_ASSISTANT_QUERY_BRAIN_STAGE32', counts },
    scope: 'assistant_read_or_draft_only',
    provider: 'rules',
    costGuard: 'local_rules',
    noAutoWrite: true,
    intent: 'global_app_search',
    title: 'Mapa CloseFlow',
    summary: 'Asystent ma u\u017Cywa\u0107 mapy aplikacji i aktualnych danych, a nie gotowych odpowiedzi tekstowych. Aktualny kontekst: leady ' + counts.leads + ', klienci ' + counts.clients + ', sprawy ' + counts.cases + ', zadania ' + counts.tasks + ', wydarzenia ' + counts.events + ', szkice AI ' + counts.drafts + '.',
    rawText: input.rawText,
    items: [
      { label: 'Dzi\u015B', detail: 'Priorytety, pilne zadania, terminy i skr\u00F3ty do pracy.', href: '/', priority: 'high', entityType: 'app_section' },
      { label: 'Leady', detail: 'Kontakty sprzeda\u017Cowe przed przej\u015Bciem do klienta lub sprawy.', href: '/leads', priority: 'medium', entityType: 'app_section' },
      { label: 'Klienci', detail: 'Kartoteka os\u00F3b i firm, bez dublowania pracy ze spraw.', href: '/clients', priority: 'medium', entityType: 'app_section' },
      { label: 'Sprawy', detail: 'Obs\u0142uga procesu po sprzeda\u017Cy lub po przyj\u0119ciu zlecenia.', href: '/cases', priority: 'medium', entityType: 'app_section' },
      { label: 'Zadania', detail: 'Rzeczy do wykonania, terminy, statusy i priorytety.', href: '/tasks', priority: 'high', entityType: 'app_section' },
      { label: 'Kalendarz', detail: 'Wydarzenia, spotkania i plan najbli\u017Cszych dni.', href: '/calendar', priority: 'high', entityType: 'app_section' },
      { label: 'Szkice AI', detail: 'Robocze zapisy od AI, kt\u00F3re trzeba zatwierdzi\u0107 r\u0119cznie.', href: '/ai-drafts', priority: 'medium', entityType: 'app_section' },
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
`;

if (!source.includes(marker)) {
  const anchor = 'function getContextWorkspaceId(context: TodayAiAssistantInput[\'context\']) {';
  if (!source.includes(anchor)) {
    throw new Error('Could not find getContextWorkspaceId anchor in src/lib/ai-assistant.ts');
  }
  source = source.replace(anchor, helperBlock + '\n' + anchor);
}

const callMarker = 'const stage32LocalAnswer = buildStage32LocalQueryBrainAnswer(input);';
if (!source.includes(callMarker)) {
  const anchor = 'export async function askTodayAiAssistant(input: TodayAiAssistantInput) {\n';
  if (!source.includes(anchor)) {
    throw new Error('Could not find askTodayAiAssistant anchor in src/lib/ai-assistant.ts');
  }
  const replacement = anchor
    + '  const stage32LocalAnswer = buildStage32LocalQueryBrainAnswer(input);\n'
    + '  if (stage32LocalAnswer) return stage32LocalAnswer;\n\n';
  source = source.replace(anchor, replacement);
}

fs.writeFileSync(targetPath, source, 'utf8');
console.log('stage32-ai-assistant-query-brain: patched src/lib/ai-assistant.ts');
