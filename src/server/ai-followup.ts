type FollowupDraftRequest = {
  lead?: Record<string, unknown>;
  tasks?: Record<string, unknown>[];
  events?: Record<string, unknown>[];
  activities?: Record<string, unknown>[];
  goal?: string;
  tone?: string;
  channel?: string;
};

type FollowupDraft = {
  subject: string;
  message: string;
  channel: string;
  goal: string;
  tone: string;
  copyHint: string;
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

function normalizeSourceLabel(source: unknown) {
  const normalized = asText(source) || 'other';
  const map: Record<string, string> = {
    instagram: 'Instagram',
    facebook: 'Facebook',
    messenger: 'Messenger',
    whatsapp: 'WhatsApp',
    email: 'e-mail',
    form: 'formularz',
    phone: 'telefon',
    referral: 'polecenie',
    cold_outreach: 'cold outreach',
    other: 'inne źródło',
  };
  return map[normalized] || normalized.replaceAll('_', ' ');
}

function parseMoment(value: unknown) {
  const raw = asText(value);
  if (!raw) return null;
  const parsed = new Date(raw.includes('T') ? raw : `${raw}T09:00:00`);
  return Number.isFinite(parsed.getTime()) ? parsed : null;
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

function findNextAction(tasks: Record<string, unknown>[], events: Record<string, unknown>[]) {
  const candidates = [
    ...tasks
      .filter((task) => asText(task.status || 'todo') !== 'done')
      .map((task) => ({
        kind: 'zadanie',
        title: asText(task.title) || 'Zadanie',
        at: parseMoment(task.scheduledAt || task.dueAt || task.date),
      })),
    ...events
      .filter((event) => !['done', 'completed'].includes(asText(event.status).toLowerCase()))
      .map((event) => ({
        kind: 'wydarzenie',
        title: asText(event.title) || 'Wydarzenie',
        at: parseMoment(event.startAt),
      })),
  ].filter((entry) => entry.at);

  candidates.sort((left, right) => (left.at?.getTime() || 0) - (right.at?.getTime() || 0));
  return candidates[0] || null;
}

function findLastNote(activities: Record<string, unknown>[]) {
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

function buildRuleFollowupDraft(input: FollowupDraftRequest): FollowupDraft {
  const lead = input.lead || {};
  const tasks = asArray(input.tasks);
  const events = asArray(input.events);
  const activities = asArray(input.activities);
  const name = asText(lead.name || lead.company) || 'dzień dobry';
  const firstName = name.split(/\s+/)[0] || name;
  const status = normalizeStatusLabel(lead.status);
  const source = normalizeSourceLabel(lead.source);
  const value = Number(lead.dealValue || 0);
  const goal = asText(input.goal) || 'uprzejmie przypomnieć się i zaproponować następny krok';
  const tone = asText(input.tone) || 'krótko, konkretnie i po ludzku';
  const channel = asText(input.channel) || (asText(lead.email) ? 'email' : asText(lead.phone) ? 'sms' : 'wiadomość');
  const nextAction = findNextAction(tasks, events);
  const lastNote = findLastNote(activities);
  const warnings: string[] = [];

  if (!asText(lead.email) && !asText(lead.phone)) {
    warnings.push('Brak e-maila i telefonu przy leadzie. Szkic można skopiować, ale warto uzupełnić kontakt.');
  }
  if (!nextAction) {
    warnings.push('Brak zaplanowanego następnego kroku. W wiadomości proponuję prosty kolejny ruch.');
  }

  const sourceSummary = [
    `Lead: ${name}`,
    `Status: ${status}`,
    `Źródło: ${source}`,
  ];
  if (value > 0) sourceSummary.push(`Potencjał: ${value.toLocaleString('pl-PL')} PLN`);
  if (nextAction?.at) sourceSummary.push(`Najbliższy ruch: ${nextAction.kind} ${nextAction.title}, ${formatMoment(nextAction.at.toISOString())}`);
  if (lastNote) sourceSummary.push(`Ostatnia notatka: ${lastNote.slice(0, 180)}`);

  const nextMoveLine = nextAction?.at
    ? `Mam zapisany kolejny krok: ${nextAction.title} (${formatMoment(nextAction.at.toISOString())}).`
    : 'Mogę zaproponować krótki kolejny krok: szybkie potwierdzenie, czy temat jest nadal aktualny.';

  const contextLine = lastNote
    ? `Odnoszę się też do ostatniej notatki: ${lastNote.slice(0, 160)}${lastNote.length > 160 ? '...' : ''}`
    : `Piszę w sprawie tematu, który mamy u siebie jako: ${status}.`;

  const message = [
    `Cześć ${firstName},`,
    '',
    contextLine,
    nextMoveLine,
    '',
    'Daj proszę znać, czy kontynuujemy temat i jaki termin będzie dla Ciebie wygodny.',
    '',
    'Pozdrawiam',
  ].join('\n');

  return {
    subject: `Follow-up: ${name}`,
    message,
    channel,
    goal,
    tone,
    copyHint: 'To jest szkic do sprawdzenia. AI niczego nie wysyła automatycznie.',
    warnings,
    sourceSummary,
  };
}

export default async function aiFollowupHandler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
    return;
  }

  const body = parseBody(req.body) as FollowupDraftRequest;
  const rawLead = body.lead || {};
  if (!asText(rawLead.name || rawLead.company || rawLead.email || rawLead.phone)) {
    res.status(400).json({ error: 'LEAD_CONTEXT_REQUIRED' });
    return;
  }

  const draft = buildRuleFollowupDraft(body);
  res.status(200).json({
    ok: true,
    scope: 'draft_only',
    provider: 'rule_parser',
    noAutoSend: true,
    draft,
  });
}
