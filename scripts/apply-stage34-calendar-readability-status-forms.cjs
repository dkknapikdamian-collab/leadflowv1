const fs = require('fs');
const path = require('path');

const root = process.cwd();

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}

function write(rel, value) {
  fs.writeFileSync(path.join(root, rel), value, 'utf8');
}

function fail(message) {
  throw new Error(message);
}

function ensureIndexImport() {
  const rel = 'src/index.css';
  let body = read(rel);
  const line = "@import './styles/stage34-calendar-readability-status-forms.css';";
  if (!body.includes(line)) {
    body = body.trimEnd() + "\n" + line + "\n";
    write(rel, body);
  }
}

function replaceFunctionByName(body, signatureStart, nextMarker, replacement, rel) {
  const start = body.indexOf(signatureStart);
  if (start === -1) fail(`${rel}: cannot find ${signatureStart}`);
  const end = body.indexOf(nextMarker, start);
  if (end === -1) fail(`${rel}: cannot find marker after ${signatureStart}`);
  return body.slice(0, start) + replacement.trimEnd() + "\n\n" + body.slice(end);
}

function patchScheduling() {
  const rel = 'src/lib/scheduling.ts';
  let body = read(rel);

  const replacement = String.raw`export function expandLeadEntries(leads: any[], rangeStart: Date, rangeEnd: Date): ScheduleEntry[] {
  // STAGE34_CALENDAR_LEAD_NEXT_ACTIONS: lead follow-up / next-action dates are real calendar entries.
  const readText = (...values: unknown[]) => {
    for (const value of values) {
      if (typeof value === 'string' && value.trim()) return value.trim();
    }
    return '';
  };

  const readLeadMoment = (lead: any) => readText(
    lead?.nextActionAt,
    lead?.next_action_at,
    lead?.followUpAt,
    lead?.follow_up_at,
    lead?.scheduledAt,
    lead?.scheduled_at,
    lead?.dueAt,
    lead?.due_at,
    lead?.reminderAt,
    lead?.reminder_at,
  );

  return leads.flatMap((lead, index) => {
    const rawMoment = readLeadMoment(lead);
    if (!rawMoment) return [] as ScheduleEntry[];

    const parsed = parseISO(rawMoment);
    if (Number.isNaN(parsed.getTime())) return [] as ScheduleEntry[];
    if (isBefore(parsed, rangeStart) || isAfter(parsed, rangeEnd)) return [] as ScheduleEntry[];

    const id = readText(lead?.id, lead?.leadId, lead?.lead_id) || String(index);
    const titleSource = readText(lead?.nextAction, lead?.next_action, lead?.title, lead?.name, lead?.company, lead?.phone, lead?.email);
    const name = readText(lead?.name, lead?.company, lead?.phone, lead?.email) || 'Lead bez nazwy';

    return [{
      id: 'lead:' + id + ':next-action',
      kind: 'lead' as const,
      title: titleSource ? 'Lead: ' + titleSource : 'Lead: ' + name,
      startsAt: toDateTimeLocalValue(parsed),
      endsAt: null,
      sourceId: id,
      link: id ? '/leads/' + id : '/leads',
      badgeLabel: 'Lead',
      leadId: id,
      leadName: name,
      raw: lead,
    }];
  });
}`;

  body = replaceFunctionByName(
    body,
    'export function expandLeadEntries(',
    'function choosePreferredEntry',
    replacement,
    rel,
  );

  write(rel, body);
}

function patchCalendarItems() {
  const rel = 'src/lib/calendar-items.ts';
  let body = read(rel);

  body = body.replace(
    "  const dueAt = firstText(row.dueAt, row.due_at);\n",
    "  const dueAt = firstText(row.dueAt, row.due_at, row.dueDate, row.due_date);\n",
  );

  body = body.replace(
    "  const scheduledAt = firstText(row.scheduledAt, row.scheduled_at);\n",
    "  const scheduledAt = firstText(row.scheduledAt, row.scheduled_at, row.startAt, row.start_at, row.startsAt, row.starts_at, row.nextActionAt, row.next_action_at, row.followUpAt, row.follow_up_at);\n",
  );

  body = body.replace(
    "  const dateField = firstText(row.date, row.due_date, row.scheduled_date);\n",
    "  const dateField = firstText(row.date, row.due_date, row.scheduled_date, row.next_action_date, row.follow_up_date);\n",
  );

  body = body.replace(
    "  const timeField = firstText(row.time, row.scheduled_time, row.due_time) || '09:00';\n",
    "  const timeField = firstText(row.time, row.scheduled_time, row.due_time, row.next_action_time, row.follow_up_time) || '09:00';\n",
  );

  if (!body.includes('STAGE34_CALENDAR_TASK_DATE_FALLBACKS')) {
    body = body.replace(
      'function normalizeTaskScheduledAt(row: Record<string, unknown>) {\n',
      'function normalizeTaskScheduledAt(row: Record<string, unknown>) {\n  // STAGE34_CALENDAR_TASK_DATE_FALLBACKS: calendar must see scheduled/due/next-action task dates.\n',
    );
  }

  write(rel, body);
}

function patchCalendarTsx() {
  const rel = 'src/pages/Calendar.tsx';
  let body = read(rel);

  const completedReplacement = String.raw`function isCompletedCalendarEntry(entry: ScheduleEntry) {
  // STAGE34_CALENDAR_COMPLETED_VISIBILITY: completed tasks/events stay visible but are clearly crossed out.
  const status = getCalendarEntryStatus(entry);
  const doneStatuses = new Set([
    'done',
    'completed',
    'complete',
    'finished',
    'closed',
    'zrobione',
    'wykonane',
    'archived',
  ]);

  return (
    doneStatuses.has(status) ||
    entry.raw?.done === true ||
    entry.raw?.isDone === true ||
    entry.raw?.is_done === true ||
    Boolean(entry.raw?.completedAt || entry.raw?.completed_at || entry.raw?.doneAt || entry.raw?.done_at)
  );
}`;

  body = replaceFunctionByName(
    body,
    'function isCompletedCalendarEntry(',
    'function sortCalendarEntriesForDisplay',
    completedReplacement,
    rel,
  );

  body = body.replace(
    "    <div className={`rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm transition hover:border-slate-300 hover:shadow-md ${isCompletedEntry ? 'opacity-60' : ''}`}>",
    "    <div data-calendar-entry-completed={isCompletedEntry ? 'true' : undefined} className={`calendar-entry-card ${isCompletedEntry ? 'calendar-entry-completed' : ''} rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm transition hover:border-slate-300 hover:shadow-md ${isCompletedEntry ? 'opacity-60' : ''}`}>",
  );

  if (!body.includes('data-calendar-stage34="readability-status-forms"')) {
    body = body.replace(
      '<Layout>',
      '<Layout>\n      <div data-calendar-stage34="readability-status-forms" hidden />',
    );
  }

  write(rel, body);
}

ensureIndexImport();
patchScheduling();
patchCalendarItems();
patchCalendarTsx();

console.log('stage34-calendar-readability-status-forms: patched');
