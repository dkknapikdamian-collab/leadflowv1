import { tryGenerateJsonWithAiProvider } from './ai-provider.js';

type NextActionRequest = {
  lead?: Record<string, unknown>;
  tasks?: Record<string, unknown>[];
  events?: Record<string, unknown>[];
  activities?: Record<string, unknown>[];
  now?: string;
};

type NextActionSuggestion = {
  kind: 'task' | 'message' | 'status_check';
  title: string;
  summary: string;
  reason: string;
  priority: 'low' | 'medium' | 'high';
  dueAt: string;
  suggestedTask: {
    title: string;
    type: string;
    priority: 'low' | 'medium' | 'high';
    dueAt: string;
  };
  messageHint: string;
  warnings: string[];
  sourceSummary: string[];
};

function parseBody(body: unknown) {
  if (!body) return {};
  if (typeof body === 'string') {
    try {
      return JSON.parse(body) as Record<string, unknown>;
    } catch {
      return {};
    }
  }
  return body as Record<string, unknown>;
}

function asText(value: unknown) {
  if (typeof value === 'string') return value.trim();
  if (value === null || value === undefined) return '';
  return String(value).trim();
}

function asArray(value: unknown): Record<string, unknown>[] {
  return Array.isArray(value) ? value.filter((entry) => entry && typeof entry === 'object') as Record<string, unknown>[] : [];
}

function parseMoment(value: unknown) {
  const raw = asText(value);
  if (!raw) return null;
  const parsed = new Date(raw.includes('T') ? raw : `${raw}T09:00:00`);
  return Number.isFinite(parsed.getTime()) ? parsed : null;
}

function addHours(base: Date, hours: number) {
  return new Date(base.getTime() + hours * 60 * 60 * 1000).toISOString();
}

function formatMoment(value: unknown) {
  const parsed = parseMoment(value);
  if (!parsed) return '';
  return parsed.toLocaleString('pl-PL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function normalizeStatusLabel(status: unknown) {
  const normalized = asText(status) || 'new';
  const map: Record<string, string> = {
    new: 'nowy',
    contacted: 'po pierwszym kontakcie',
    qualification: 'w kwalifikacji',
    proposal_sent: 'po wysłaniu oferty',
    waiting_response: 'czeka na odpowiedź',
    accepted: 'zaakceptowany',
    negotiation: 'w negocjacjach',
    moved_to_service: 'w obsłudze',
    lost: 'przegrany',
    archived: 'w koszu',
  };
  return map[normalized] || normalized.replaceAll('_', ' ');
}

function getOpenTasks(tasks: Record<string, unknown>[]) {
  return tasks
    .filter((task) => asText(task.status || 'todo') !== 'done')
    .map((task) => ({
      title: asText(task.title) || 'Zadanie',
      dueAt: parseMoment(task.scheduledAt || task.dueAt || task.date),
      priority: asText(task.priority) || 'medium',
      type: asText(task.type) || 'follow_up',
    }))
    .sort((left, right) => (left.dueAt?.getTime() || Number.MAX_SAFE_INTEGER) - (right.dueAt?.getTime() || Number.MAX_SAFE_INTEGER));
}

function getOpenEvents(events: Record<string, unknown>[]) {
  return events
    .filter((event) => !['done', 'completed'].includes(asText(event.status).toLowerCase()))
    .map((event) => ({
      title: asText(event.title) || 'Wydarzenie',
      dueAt: parseMoment(event.startAt),
      type: asText(event.type) || 'meeting',
    }))
    .sort((left, right) => (left.dueAt?.getTime() || Number.MAX_SAFE_INTEGER) - (right.dueAt?.getTime() || Number.MAX_SAFE_INTEGER));
}

function getLastNote(activities: Record<string, unknown>[]) {
  const notes = activities
    .filter((activity) => asText(activity.eventType) === 'note_added')
    .map((activity) => ({
      content: asText((activity.payload as Record<string, unknown> | undefined)?.content),
      at: parseMoment(activity.createdAt || activity.created_at || activity.updatedAt || activity.updated_at),
    }))
    .filter((entry) => entry.content);
  notes.sort((left, right) => (right.at?.getTime() || 0) - (left.at?.getTime() || 0));
  return notes[0]?.content || '';
}

function buildSuggestion(input: NextActionRequest): NextActionSuggestion {
  const lead = input.lead || {};
  const tasks = asArray(input.tasks);
  const events = asArray(input.events);
  const activities = asArray(input.activities);
  const now = parseMoment(input.now) || new Date();
  const name = asText(lead.name || lead.company) || 'Lead';
  const firstName = name.split(/\s+/)[0] || name;
  const status = asText(lead.status || 'new');
  const statusLabel = normalizeStatusLabel(status);
  const dealValue = Number(lead.dealValue || 0);
  const hasContact = Boolean(asText(lead.email) || asText(lead.phone));
  const openTasks = getOpenTasks(tasks);
  const openEvents = getOpenEvents(events);
  const lastNote = getLastNote(activities);
  const warnings: string[] = [];
  const sourceSummary = [
    `Lead: ${name}`,
    `Status: ${statusLabel}`,
    `Otwarte zadania: ${openTasks.length}`,
    `Otwarte wydarzenia: ${openEvents.length}`,
  ];

  if (dealValue > 0) sourceSummary.push(`Potencjał: ${dealValue.toLocaleString('pl-PL')} PLN`);
  if (lastNote) sourceSummary.push(`Ostatnia notatka: ${lastNote.slice(0, 180)}`);
  if (!hasContact) warnings.push('Brak telefonu i e-maila. Najpierw warto uzupełnić kontakt, inaczej follow-up będzie ręczny.');

  const overdueTask = openTasks.find((task) => task.dueAt && task.dueAt.getTime() < now.getTime());
  if (overdueTask) {
    const dueAt = addHours(now, 1);
    return {
      kind: 'task',
      title: `Domknij zaległe zadanie: ${overdueTask.title}`,
      summary: 'Najpilniejszy ruch to wrócić do zaległego zadania, bo blokuje dalszy proces sprzedaży.',
      reason: `Zadanie miało termin ${formatMoment(overdueTask.dueAt.toISOString())}.`,
      priority: 'high',
      dueAt,
      suggestedTask: {
        title: `Domknij: ${overdueTask.title}`,
        type: overdueTask.type || 'follow_up',
        priority: 'high',
        dueAt,
      },
      messageHint: `Cześć ${firstName}, wracam zgodnie z ustaleniami w sprawie naszego tematu. Daj proszę znać, czy kontynuujemy i jaki termin będzie wygodny.`,
      warnings,
      sourceSummary,
    };
  }

  const waitingLike = ['proposal_sent', 'waiting_response', 'negotiation'].includes(status);
  if (waitingLike) {
    const dueAt = addHours(now, 24);
    return {
      kind: 'message',
      title: 'Wyślij krótki follow-up do leada',
      summary: 'Lead jest w etapie, w którym łatwo utknąć. Najlepszy ruch to krótka wiadomość i jasne pytanie o decyzję.',
      reason: `Aktualny status to: ${statusLabel}.`,
      priority: dealValue >= 3000 ? 'high' : 'medium',
      dueAt,
      suggestedTask: {
        title: `Follow-up: ${name}`,
        type: 'follow_up',
        priority: dealValue >= 3000 ? 'high' : 'medium',
        dueAt,
      },
      messageHint: `Cześć ${firstName}, wracam z krótkim pytaniem, czy temat jest nadal aktualny. Jeżeli tak, możemy ustalić następny krok i termin.`,
      warnings,
      sourceSummary,
    };
  }

  if (!openTasks.length && !openEvents.length) {
    const dueAt = addHours(now, 24);
    warnings.push('Lead nie ma otwartego zadania ani wydarzenia. To zwiększa ryzyko zgubienia kontaktu.');
    return {
      kind: 'task',
      title: 'Dodaj następny follow-up',
      summary: 'Najważniejsze jest ustawienie konkretnego następnego ruchu, żeby lead nie zniknął z radaru.',
      reason: 'Brak otwartych zadań i wydarzeń powiązanych z leadem.',
      priority: dealValue >= 3000 ? 'high' : 'medium',
      dueAt,
      suggestedTask: {
        title: `Follow-up: ${name}`,
        type: 'follow_up',
        priority: dealValue >= 3000 ? 'high' : 'medium',
        dueAt,
      },
      messageHint: `Cześć ${firstName}, chciałem tylko potwierdzić, czy temat jest nadal aktualny i czy możemy przejść do kolejnego kroku.`,
      warnings,
      sourceSummary,
    };
  }

  const nextTask = openTasks[0];
  const nextEvent = openEvents[0];
  const nextTaskTime = nextTask?.dueAt?.getTime() || Number.MAX_SAFE_INTEGER;
  const nextEventTime = nextEvent?.dueAt?.getTime() || Number.MAX_SAFE_INTEGER;
  const next = nextTaskTime <= nextEventTime ? nextTask : nextEvent;
  const dueAt = addHours(now, 6);

  return {
    kind: 'status_check',
    title: `Przygotuj się do: ${next?.title || 'następnego ruchu'}`,
    summary: 'Lead ma już kolejny krok. Najlepszy ruch to przygotować krótką notatkę i dopilnować terminu.',
    reason: next?.dueAt ? `Najbliższy termin: ${formatMoment(next.dueAt.toISOString())}.` : 'Lead ma otwarty kolejny krok.',
    priority: 'medium',
    dueAt,
    suggestedTask: {
      title: `Sprawdź przygotowanie: ${name}`,
      type: 'follow_up',
      priority: 'medium',
      dueAt,
    },
    messageHint: `Cześć ${firstName}, potwierdzam, że mamy zapisany kolejny krok. Wrócę z informacją w ustalonym terminie.`,
    warnings,
    sourceSummary,
  };
}

function pickPriority(value: unknown, fallback: 'low' | 'medium' | 'high'): 'low' | 'medium' | 'high' {
  const normalized = asText(value).toLowerCase();
  return normalized === 'low' || normalized === 'medium' || normalized === 'high' ? normalized : fallback;
}

function pickKind(value: unknown, fallback: 'task' | 'message' | 'status_check'): 'task' | 'message' | 'status_check' {
  const normalized = asText(value).toLowerCase();
  return normalized === 'task' || normalized === 'message' || normalized === 'status_check' ? normalized : fallback;
}

function asStringArray(value: unknown, fallback: string[]) {
  if (!Array.isArray(value)) return fallback;
  return value.map((item) => asText(item)).filter(Boolean).slice(0, 8);
}

function sanitizeAiNextActionSuggestion(candidate: unknown, fallback: NextActionSuggestion): NextActionSuggestion {
  const root = candidate && typeof candidate === 'object' ? candidate as Record<string, unknown> : {};
  const suggestion = root.suggestion && typeof root.suggestion === 'object' ? root.suggestion as Record<string, unknown> : root;
  const task = suggestion.suggestedTask && typeof suggestion.suggestedTask === 'object' ? suggestion.suggestedTask as Record<string, unknown> : {};
  const dueAt = asText(suggestion.dueAt) || fallback.dueAt;

  return {
    kind: pickKind(suggestion.kind, fallback.kind),
    title: asText(suggestion.title) || fallback.title,
    summary: asText(suggestion.summary) || fallback.summary,
    reason: asText(suggestion.reason) || fallback.reason,
    priority: pickPriority(suggestion.priority, fallback.priority),
    dueAt,
    suggestedTask: {
      title: asText(task.title) || fallback.suggestedTask.title,
      type: asText(task.type) || fallback.suggestedTask.type,
      priority: pickPriority(task.priority, fallback.suggestedTask.priority),
      dueAt: asText(task.dueAt) || dueAt || fallback.suggestedTask.dueAt,
    },
    messageHint: asText(suggestion.messageHint) || fallback.messageHint,
    warnings: asStringArray(suggestion.warnings, fallback.warnings),
    sourceSummary: asStringArray(suggestion.sourceSummary, fallback.sourceSummary),
  };
}

async function buildModelBackedNextAction(input: NextActionRequest, fallback: NextActionSuggestion) {
  const prompt = [
    'Jesteś operatorem CloseFlow. Wybierz jeden najlepszy następny ruch dla leada na podstawie danych z aplikacji.',
    'Nie twórz zadania samodzielnie. Nie wysyłaj wiadomości. Zwróć wyłącznie sugestię do zatwierdzenia przez użytkownika.',
    'Zwróć wyłącznie JSON: {"suggestion":{"kind":"task|message|status_check","title":"","summary":"","reason":"","priority":"low|medium|high","dueAt":"ISO","suggestedTask":{"title":"","type":"follow_up","priority":"medium","dueAt":"ISO"},"messageHint":"","warnings":[],"sourceSummary":[]}}.',
    'Język: polski. Styl: konkretny operator sprzedaży.',
    JSON.stringify({
      lead: input.lead || {},
      tasks: asArray(input.tasks).slice(0, 10),
      events: asArray(input.events).slice(0, 10),
      activities: asArray(input.activities).slice(0, 10),
      now: input.now || new Date().toISOString(),
    }),
  ].join('\n');

  const result = await tryGenerateJsonWithAiProvider(prompt, {
    operation: 'next_action',
    maxOutputTokens: 900,
    temperature: 0.15,
  });

  if (!result) return { provider: 'rule_parser', suggestion: fallback };
  return { provider: result.provider, suggestion: sanitizeAiNextActionSuggestion(result.json, fallback) };
}

export default async function aiNextActionHandler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
    return;
  }

  const body = parseBody(req.body) as NextActionRequest;
  const lead = body.lead || {};
  if (!asText(lead.name || lead.company || lead.email || lead.phone)) {
    res.status(400).json({ error: 'LEAD_CONTEXT_REQUIRED' });
    return;
  }
  const fallbackSuggestion = buildSuggestion(body);
  const modelResult = await buildModelBackedNextAction(body, fallbackSuggestion);

  res.status(200).json({
    ok: true,
    scope: 'suggestion_only',
    provider: modelResult.provider,
    noAutoWrite: true,
    suggestion: modelResult.suggestion,
  });
}
