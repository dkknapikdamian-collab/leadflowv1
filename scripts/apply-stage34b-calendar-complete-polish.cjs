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

function findFunctionEnd(body, startIndex) {
  const braceStart = body.indexOf('{', startIndex);
  if (braceStart === -1) return -1;
  let depth = 0;
  for (let i = braceStart; i < body.length; i += 1) {
    const char = body[i];
    if (char === '{') depth += 1;
    if (char === '}') {
      depth -= 1;
      if (depth === 0) return i + 1;
    }
  }
  return -1;
}

function replaceFunction(body, functionStart, replacement, rel) {
  const start = body.indexOf(functionStart);
  if (start === -1) fail(`${rel}: cannot find function start: ${functionStart}`);
  const end = findFunctionEnd(body, start);
  if (end === -1) fail(`${rel}: cannot find function end: ${functionStart}`);
  return body.slice(0, start) + replacement.trimEnd() + body.slice(end);
}

function ensureIndexImport() {
  const rel = 'src/index.css';
  let body = read(rel);
  const line = "@import './styles/stage34b-calendar-complete-polish.css';";
  if (!body.includes(line)) {
    body = body.trimEnd() + '\n' + line + '\n';
    write(rel, body);
  }
}

function patchScheduling() {
  const rel = 'src/lib/scheduling.ts';
  let body = read(rel);

  const replacement = String.raw`export function expandLeadEntries(leads: any[], rangeStart: Date, rangeEnd: Date): ScheduleEntry[] {
  // STAGE34B_CALENDAR_LEAD_NEXT_ACTIONS: lead follow-up / next-action dates are real calendar entries.
  const readText = (...values: unknown[]) => {
    for (const value of values) {
      if (typeof value === 'string' && value.trim()) return value.trim();
    }
    return '';
  };

  const readLeadMoment = (lead: any) => readText(
    lead?.nextActionAt,
    lead?.next_action_at,
    lead?.nextActionDate,
    lead?.next_action_date,
    lead?.followUpAt,
    lead?.follow_up_at,
    lead?.followUpDate,
    lead?.follow_up_date,
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

    const parsed = parseISO(rawMoment.includes('T') ? rawMoment : rawMoment + 'T09:00:00');
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

  body = replaceFunction(body, 'export function expandLeadEntries(', replacement, rel);
  write(rel, body);
}

function patchCalendarItems() {
  const rel = 'src/lib/calendar-items.ts';
  let body = read(rel);

  body = body.replace(
    "import { fetchCasesFromSupabase, fetchEventsFromSupabase, fetchTasksFromSupabase, hasStoredWorkspaceContext, isSupabaseConfigured } from './supabase-fallback';",
    "import { fetchCasesFromSupabase, fetchEventsFromSupabase, fetchLeadsFromSupabase, fetchTasksFromSupabase, hasStoredWorkspaceContext, isSupabaseConfigured } from './supabase-fallback';",
  );

  body = body.replace('  leads: never[];\n', '  leads: Record<string, unknown>[];\n');

  const normalizeTaskReplacement = String.raw`function normalizeTaskScheduledAt(row: Record<string, unknown>) {
  // STAGE34B_CALENDAR_TASK_DATE_FALLBACKS: calendar must see scheduled/due/start/next-action/follow-up task dates.
  const directMoment = firstText(
    row.dueAt,
    row.due_at,
    row.scheduledAt,
    row.scheduled_at,
    row.startAt,
    row.start_at,
    row.startsAt,
    row.starts_at,
    row.nextActionAt,
    row.next_action_at,
    row.nextActionDate,
    row.next_action_date,
    row.followUpAt,
    row.follow_up_at,
    row.followUpDate,
    row.follow_up_date,
    row.reminderAt,
    row.reminder_at,
  );

  if (directMoment && isIsoLike(directMoment)) return directMoment;

  const dateField = firstText(
    row.date,
    row.dueDate,
    row.due_date,
    row.scheduledDate,
    row.scheduled_date,
    row.next_action_date,
    row.nextActionDate,
    row.follow_up_date,
    row.followUpDate,
  );
  const timeField = firstText(
    row.time,
    row.scheduled_time,
    row.due_time,
    row.next_action_time,
    row.nextActionTime,
    row.follow_up_time,
    row.followUpTime,
  ) || '09:00';
  if (!dateField) return '';

  const composed = dateField.includes('T') ? dateField : dateField + 'T' + timeField;
  return isIsoLike(composed) ? composed : '';
}`;

  const normalizeEventReplacement = String.raw`function normalizeEventStartAt(row: Record<string, unknown>) {
  // STAGE34B_CALENDAR_EVENT_DATE_FALLBACKS: event rows may arrive with legacy scheduled/date fields.
  const startAt = firstText(
    row.startAt,
    row.start_at,
    row.startsAt,
    row.starts_at,
    row.scheduledAt,
    row.scheduled_at,
    row.eventAt,
    row.event_at,
  );
  if (startAt && isIsoLike(startAt)) return startAt;

  const dateField = firstText(row.date, row.eventDate, row.event_date, row.scheduledDate, row.scheduled_date);
  const timeField = firstText(row.time, row.eventTime, row.event_time, row.scheduled_time) || '09:00';
  const composed = dateField ? dateField + 'T' + timeField : ''; 
  return composed && isIsoLike(composed) ? composed : '';
}`;

  body = replaceFunction(body, 'function normalizeTaskScheduledAt(', normalizeTaskReplacement, rel);
  body = replaceFunction(body, 'function normalizeEventStartAt(', normalizeEventReplacement, rel);

  const fetchReplacement = String.raw`export async function fetchCalendarBundleFromSupabase(): Promise<CalendarBundle> {
  // STAGE34B_CALENDAR_BUNDLE_LEADS: Calendar includes tasks, events, cases and lead next-actions.
  if (!isSupabaseConfigured() || !hasStoredWorkspaceContext()) return { tasks: [], events: [], leads: [], cases: [] };

  const [taskItems, eventItems, caseItems, leadItems] = await Promise.all([
    fetchTasksFromSupabase(),
    fetchEventsFromSupabase(),
    fetchCasesFromSupabase().catch(() => []),
    fetchLeadsFromSupabase().catch(() => []),
  ]);

  return {
    tasks: (taskItems as Record<string, unknown>[]).map(normalizeCalendarTask).filter((item): item is CalendarTaskItem => Boolean(item)),
    events: (eventItems as Record<string, unknown>[]).map(normalizeCalendarEvent).filter((item): item is CalendarEventItem => Boolean(item)),
    leads: leadItems as Record<string, unknown>[],
    cases: caseItems as Record<string, unknown>[],
  };
}`;

  body = replaceFunction(body, 'export async function fetchCalendarBundleFromSupabase(', fetchReplacement, rel);
  write(rel, body);
}

function patchCalendarTsx() {
  const rel = 'src/pages/Calendar.tsx';
  let body = read(rel);

  const completedReplacement = String.raw`function isCompletedCalendarEntry(entry: ScheduleEntry) {
  // STAGE34B_CALENDAR_COMPLETED_VISIBILITY: completed tasks/events/leads stay visible but are clearly crossed out.
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

  body = replaceFunction(body, 'function isCompletedCalendarEntry(', completedReplacement, rel);

  if (!body.includes('data-calendar-entry-completed={isCompletedEntry ?')) {
    body = body.replace(
      "    <div className={`rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm transition hover:border-slate-300 hover:shadow-md ${isCompletedEntry ? 'opacity-60' : ''}`}",
      "    <div data-calendar-entry-completed={isCompletedEntry ? 'true' : undefined} className={`calendar-entry-card ${isCompletedEntry ? 'calendar-entry-completed' : ''} rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm transition hover:border-slate-300 hover:shadow-md ${isCompletedEntry ? 'opacity-60' : ''}`}",
    );
  }

  body = body.replace(/\$\{getEntryTone\(entry\)\}/g, "${getEntryTone(entry)} ${isCompletedCalendarEntry(entry) ? 'calendar-entry-completed calendar-month-entry-completed' : ''}");
  body = body.replace(/\$\{getEntryTone\(dayEntry\)\}/g, "${getEntryTone(dayEntry)} ${isCompletedCalendarEntry(dayEntry) ? 'calendar-entry-completed calendar-month-entry-completed' : ''}");
  body = body.replace(/\$\{getEntryTone\(scheduleEntry\)\}/g, "${getEntryTone(scheduleEntry)} ${isCompletedCalendarEntry(scheduleEntry) ? 'calendar-entry-completed calendar-month-entry-completed' : ''}");

  if (!body.includes('data-calendar-stage34b="complete-polish"')) {
    body = body.replace(
      '<Layout>',
      '<Layout>\n      <div data-calendar-stage34b="complete-polish" hidden />',
    );
  }

  write(rel, body);
}

ensureIndexImport();
patchScheduling();
patchCalendarItems();
patchCalendarTsx();

console.log('stage34b-calendar-complete-polish: patched');
