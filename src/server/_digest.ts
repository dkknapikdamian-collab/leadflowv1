/* STAGE_A28_DIGEST_WEEKLY_REPORT_VALUE: dzienny digest, raport tygodniowy i lekkie payloady wartości bez ciężkiego dashboardu. */
type RowLike = Record<string, unknown>;
type LeadLike = RowLike;
type TaskLike = RowLike;
type EventLike = RowLike;
type CaseLike = RowLike;
type AiDraftLike = RowLike;

export type DigestSectionItem = {
  id: string;
  title: string;
  when?: string;
  leadName?: string;
  caseName?: string;
  value?: number;
  daysWithoutUpdate?: number;
  reason?: string;
};

export type DigestPayload = {
  overdueTasks: DigestSectionItem[];
  overdueEvents: DigestSectionItem[];
  overdueLeads: DigestSectionItem[];
  todayTasks: DigestSectionItem[];
  todayEvents: DigestSectionItem[];
  noStepLeads: DigestSectionItem[];
  casesWithoutPlannedAction: DigestSectionItem[];
  staleLeads: DigestSectionItem[];
  riskyValuableLeads: DigestSectionItem[];
  pendingAiDrafts: DigestSectionItem[];
  summary: {
    urgentCount: number;
    todayCount: number;
    noStepCount: number;
    stalledCount: number;
    aiDraftCount: number;
    caseNoActionCount: number;
  };
};

export type WeeklyReportPayload = {
  newLeads: DigestSectionItem[];
  movedToCases: DigestSectionItem[];
  completedTasks: DigestSectionItem[];
  overdueItems: DigestSectionItem[];
  caseBlockers: DigestSectionItem[];
  pendingDrafts: DigestSectionItem[];
  nextWeekItems: DigestSectionItem[];
  summary: {
    newLeadsCount: number;
    movedToCasesCount: number;
    completedTasksCount: number;
    overdueCount: number;
    blockerCount: number;
    draftCount: number;
    nextWeekCount: number;
  };
};

function asText(value: unknown) {
  if (typeof value === 'string') return value.trim();
  if (value === null || value === undefined) return '';
  return String(value).trim();
}

function asNumber(value: unknown) {
  const amount = Number(value || 0);
  return Number.isFinite(amount) ? amount : 0;
}

function safeRows(value: unknown): RowLike[] {
  return Array.isArray(value) ? (value.filter((row) => row && typeof row === 'object') as RowLike[]) : [];
}

function stableId(row: RowLike, prefix: string) {
  return asText(row.id) || `${prefix}-${Math.random().toString(36).slice(2)}`;
}

function parseIso(value: unknown) {
  const normalized = asText(value);
  if (!normalized) return null;
  const parsed = new Date(normalized);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function getDateKey(date: Date, timeZone: string) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

function getHour(date: Date, timeZone: string) {
  const hour = new Intl.DateTimeFormat('en-GB', {
    timeZone,
    hour: '2-digit',
    hour12: false,
  }).format(date);
  return Number(hour);
}

function getDaysBetween(fromDate: Date, toDate: Date) {
  const diffMs = toDate.getTime() - fromDate.getTime();
  return Math.max(0, Math.floor(diffMs / 86_400_000));
}

function startOfLocalWeek(now: Date, timeZone: string) {
  const dateKey = getDateKey(now, timeZone);
  const localMidnight = new Date(`${dateKey}T00:00:00.000Z`);
  const day = localMidnight.getUTCDay() || 7;
  localMidnight.setUTCDate(localMidnight.getUTCDate() - day + 1);
  return localMidnight;
}

function addDays(date: Date, days: number) {
  const copy = new Date(date);
  copy.setUTCDate(copy.getUTCDate() + days);
  return copy;
}

function isBetween(date: Date | null, start: Date, end: Date) {
  if (!date) return false;
  return date.getTime() >= start.getTime() && date.getTime() < end.getTime();
}

export function shouldSendDigestNow(timeZone: string, now = new Date(), digestHour = 7) {
  return getHour(now, timeZone) === digestHour;
}

export function getReportWeekRange(now = new Date(), timeZone = 'Europe/Warsaw') {
  const thisWeekStart = startOfLocalWeek(now, timeZone);
  const previousWeekStart = addDays(thisWeekStart, -7);
  const previousWeekEnd = thisWeekStart;
  const nextWeekStart = thisWeekStart;
  const nextWeekEnd = addDays(thisWeekStart, 7);

  return {
    previousWeekStart,
    previousWeekEnd,
    nextWeekStart,
    nextWeekEnd,
    reportDateKey: getDateKey(previousWeekStart, timeZone),
  };
}

function normalizeTaskDate(task: TaskLike) {
  return parseIso(task.scheduled_at ?? task.scheduledAt ?? task.due_at ?? task.dueAt ?? task.start_at ?? task.startAt ?? task.date ?? task.created_at);
}

function normalizeTaskCompletedDate(task: TaskLike) {
  return parseIso(task.completed_at ?? task.completedAt ?? task.done_at ?? task.doneAt ?? task.updated_at ?? task.updatedAt);
}

function normalizeEventDate(event: EventLike) {
  return parseIso(event.start_at ?? event.startAt ?? event.scheduled_at ?? event.scheduledAt ?? event.date ?? event.created_at);
}

function normalizeLeadActionDate(lead: LeadLike) {
  return parseIso(lead.next_action_at ?? lead.nextActionAt ?? lead.nearest_action_at ?? lead.nearestActionAt);
}

function normalizeCaseActionDate(row: CaseLike) {
  return parseIso(row.next_action_at ?? row.nextActionAt ?? row.nearest_action_at ?? row.nearestActionAt ?? row.follow_up_at ?? row.followUpAt);
}

function normalizeCreatedDate(row: RowLike) {
  return parseIso(row.created_at ?? row.createdAt);
}

function normalizeUpdatedDate(row: RowLike) {
  return parseIso(row.updated_at ?? row.updatedAt ?? row.created_at ?? row.createdAt);
}

function isTaskDone(task: TaskLike) {
  const status = asText(task.status).toLowerCase();
  return status === 'done' || status === 'completed' || status === 'zrobione';
}

function isEventDone(event: EventLike) {
  const status = asText(event.status).toLowerCase();
  return status === 'done' || status === 'completed' || status === 'zrobione' || status === 'cancelled' || status === 'canceled';
}

function isLeadClosed(lead: LeadLike) {
  const status = asText(lead.status).toLowerCase();
  return status === 'won' || status === 'lost' || status === 'moved_to_service' || status === 'in_service' || status === 'archived';
}

function isCaseClosed(row: CaseLike) {
  const status = asText(row.status).toLowerCase();
  return ['done', 'completed', 'closed', 'archived', 'zrobione'].includes(status);
}

function isCaseBlocked(row: CaseLike) {
  const status = asText(row.status).toLowerCase();
  return Boolean(
    status.includes('block') ||
    status.includes('hold') ||
    status.includes('waiting') ||
    asText(row.blocker_reason ?? row.blockerReason ?? row.blocked_reason ?? row.blockedReason),
  );
}

function isPendingDraft(draft: AiDraftLike) {
  const status = asText(draft.status).toLowerCase();
  return !status || ['draft', 'pending', 'pending_review', 'review'].includes(status);
}

function isLeadOverdue(lead: LeadLike, now: Date, timeZone: string) {
  const actionAt = normalizeLeadActionDate(lead);
  if (!actionAt) return false;
  if (actionAt.getTime() >= now.getTime()) return false;
  return getDateKey(actionAt, timeZone) !== getDateKey(now, timeZone);
}

function mapLeadTitle(lead: LeadLike) {
  const name = asText(lead.name ?? lead.title ?? lead.person_name ?? lead.personName);
  const company = asText(lead.company ?? lead.company_name ?? lead.companyName);
  if (company) return `${name || 'Lead'} (${company})`;
  return name || 'Lead bez nazwy';
}

function mapCaseTitle(row: CaseLike) {
  return asText(row.title ?? row.name ?? row.case_title ?? row.caseTitle) || 'Sprawa bez nazwy';
}

function mapTaskTitle(row: TaskLike) {
  return asText(row.title ?? row.name ?? row.summary) || 'Zadanie';
}

function mapEventTitle(row: EventLike) {
  return asText(row.title ?? row.name ?? row.summary) || 'Wydarzenie';
}

function mapLeadName(row: RowLike) {
  return asText(row.lead_name ?? row.leadName ?? row.lead_title ?? row.leadTitle);
}

function mapCaseName(row: RowLike) {
  return asText(row.case_name ?? row.caseName ?? row.case_title ?? row.caseTitle);
}

export function buildDailyDigestPayload({
  leads,
  tasks,
  events,
  cases = [],
  drafts = [],
  now = new Date(),
  timeZone = 'Europe/Warsaw',
}: {
  leads: LeadLike[];
  tasks: TaskLike[];
  events: EventLike[];
  cases?: CaseLike[];
  drafts?: AiDraftLike[];
  now?: Date;
  timeZone?: string;
}): DigestPayload {
  const todayKey = getDateKey(now, timeZone);
  const activeLeads = safeRows(leads).filter((lead) => !isLeadClosed(lead));
  const activeCases = safeRows(cases).filter((row) => !isCaseClosed(row));

  const pendingAiDrafts = safeRows(drafts)
    .filter(isPendingDraft)
    .sort((a, b) => (normalizeCreatedDate(b)?.getTime() ?? 0) - (normalizeCreatedDate(a)?.getTime() ?? 0))
    .slice(0, 5)
    .map((draft) => ({
      id: stableId(draft, 'draft'),
      title: (asText(draft.raw_text ?? draft.rawText ?? draft.title) || 'Szkic AI bez treści').slice(0, 140),
      when: normalizeCreatedDate(draft)?.toISOString(),
      reason: 'Szkic do sprawdzenia',
    }));

  const overdueTasks = safeRows(tasks)
    .filter((task) => {
      const startAt = normalizeTaskDate(task);
      if (!startAt || isTaskDone(task)) return false;
      if (startAt.getTime() >= now.getTime()) return false;
      return getDateKey(startAt, timeZone) !== todayKey;
    })
    .map((task) => ({
      id: stableId(task, 'task'),
      title: mapTaskTitle(task),
      when: normalizeTaskDate(task)?.toISOString(),
      leadName: mapLeadName(task),
      caseName: mapCaseName(task),
      reason: 'Zadanie po terminie',
    }));

  const overdueEvents = safeRows(events)
    .filter((event) => {
      const startAt = normalizeEventDate(event);
      if (!startAt || isEventDone(event)) return false;
      if (startAt.getTime() >= now.getTime()) return false;
      return getDateKey(startAt, timeZone) !== todayKey;
    })
    .map((event) => ({
      id: stableId(event, 'event'),
      title: mapEventTitle(event),
      when: normalizeEventDate(event)?.toISOString(),
      leadName: mapLeadName(event),
      caseName: mapCaseName(event),
      reason: 'Wydarzenie po terminie',
    }));

  const todayTasks = safeRows(tasks)
    .filter((task) => {
      const startAt = normalizeTaskDate(task);
      if (!startAt || isTaskDone(task)) return false;
      return getDateKey(startAt, timeZone) === todayKey;
    })
    .map((task) => ({
      id: stableId(task, 'task'),
      title: mapTaskTitle(task),
      when: normalizeTaskDate(task)?.toISOString(),
      leadName: mapLeadName(task),
      caseName: mapCaseName(task),
      reason: 'Do wykonania dzisiaj',
    }));

  const todayEvents = safeRows(events)
    .filter((event) => {
      const startAt = normalizeEventDate(event);
      if (!startAt || isEventDone(event)) return false;
      return getDateKey(startAt, timeZone) === todayKey;
    })
    .map((event) => ({
      id: stableId(event, 'event'),
      title: mapEventTitle(event),
      when: normalizeEventDate(event)?.toISOString(),
      leadName: mapLeadName(event),
      caseName: mapCaseName(event),
      reason: 'Termin dzisiaj',
    }));

  const overdueLeads = activeLeads
    .filter((lead) => isLeadOverdue(lead, now, timeZone))
    .map((lead) => ({
      id: stableId(lead, 'lead'),
      title: mapLeadTitle(lead),
      when: normalizeLeadActionDate(lead)?.toISOString(),
      value: asNumber(lead.value ?? lead.dealValue ?? lead.deal_value),
      reason: 'Lead po terminie akcji',
    }));

  const noStepLeads = activeLeads
    .filter((lead) => !normalizeLeadActionDate(lead))
    .map((lead) => ({
      id: stableId(lead, 'lead'),
      title: mapLeadTitle(lead),
      value: asNumber(lead.value ?? lead.dealValue ?? lead.deal_value),
      reason: 'Brak zaplanowanej akcji',
    }));

  const casesWithoutPlannedAction = activeCases
    .filter((row) => !normalizeCaseActionDate(row))
    .slice(0, 10)
    .map((row) => ({
      id: stableId(row, 'case'),
      title: mapCaseTitle(row),
      reason: 'Sprawa bez zaplanowanej akcji',
    }));

  const staleLeads = activeLeads
    .map((lead) => {
      const updatedAt = normalizeUpdatedDate(lead);
      const daysWithoutUpdate = updatedAt ? getDaysBetween(updatedAt, now) : 0;
      return { lead, daysWithoutUpdate };
    })
    .filter(({ lead, daysWithoutUpdate }) => {
      const hasAction = Boolean(normalizeLeadActionDate(lead));
      const isAtRisk = Boolean(lead.is_at_risk ?? lead.isAtRisk);
      return daysWithoutUpdate >= 5 && hasAction && !isAtRisk && !isLeadOverdue(lead, now, timeZone);
    })
    .sort((a, b) => b.daysWithoutUpdate - a.daysWithoutUpdate)
    .slice(0, 5)
    .map(({ lead, daysWithoutUpdate }) => ({
      id: stableId(lead, 'lead'),
      title: mapLeadTitle(lead),
      daysWithoutUpdate,
      value: asNumber(lead.value ?? lead.dealValue ?? lead.deal_value),
      reason: `Brak ruchu od ${daysWithoutUpdate} dni`,
    }));

  const riskyValuableLeads = activeLeads
    .filter((lead) => {
      const amount = asNumber(lead.value ?? lead.dealValue ?? lead.deal_value);
      if (amount <= 0) return false;
      const updatedAt = normalizeUpdatedDate(lead);
      const daysWithoutUpdate = updatedAt ? getDaysBetween(updatedAt, now) : 0;
      return (
        Boolean(lead.is_at_risk ?? lead.isAtRisk) ||
        isLeadOverdue(lead, now, timeZone) ||
        !normalizeLeadActionDate(lead) ||
        daysWithoutUpdate >= 5
      );
    })
    .sort((a, b) => asNumber(b.value ?? b.dealValue ?? b.deal_value) - asNumber(a.value ?? a.dealValue ?? a.deal_value))
    .slice(0, 5)
    .map((lead) => ({
      id: stableId(lead, 'lead'),
      title: mapLeadTitle(lead),
      value: asNumber(lead.value ?? lead.dealValue ?? lead.deal_value),
      when: normalizeLeadActionDate(lead)?.toISOString(),
      reason: 'Wartościowy lead wymaga kontroli',
    }));

  return {
    overdueTasks,
    overdueEvents,
    overdueLeads,
    todayTasks,
    todayEvents,
    noStepLeads,
    casesWithoutPlannedAction,
    staleLeads,
    riskyValuableLeads,
    pendingAiDrafts,
    summary: {
      urgentCount: overdueTasks.length + overdueEvents.length + overdueLeads.length,
      todayCount: todayTasks.length + todayEvents.length,
      noStepCount: noStepLeads.length,
      stalledCount: staleLeads.length,
      aiDraftCount: pendingAiDrafts.length,
      caseNoActionCount: casesWithoutPlannedAction.length,
    },
  };
}

function sectionPlain(title: string, items: DigestSectionItem[], empty = 'Brak') {
  return [
    `${title}: ${items.length}`,
    ...(items.length ? items.slice(0, 8).map((item, index) => `${index + 1}. ${item.title}${item.reason ? ` - ${item.reason}` : ''}`) : [empty]),
  ];
}

function sectionHtml(title: string, items: DigestSectionItem[]) {
  const rows = items.length
    ? items.slice(0, 8).map((item) => `<li><strong>${escapeHtml(item.title)}</strong>${item.reason ? ` - ${escapeHtml(item.reason)}` : ''}</li>`).join('')
    : '<li>Brak</li>';
  return `<p style="margin:16px 0 8px"><strong>${escapeHtml(title)} (${items.length})</strong></p><ol style="margin:0 0 12px;padding-left:20px">${rows}</ol>`;
}

function escapeHtml(value: unknown) {
  return asText(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function buildDigestEmail({
  fullName,
  appUrl,
  payload,
  now = new Date(),
  timeZone = 'Europe/Warsaw',
}: {
  fullName?: string;
  appUrl: string;
  payload: DigestPayload;
  now?: Date;
  timeZone?: string;
}) {
  const dateLabel = new Intl.DateTimeFormat('pl-PL', {
    timeZone,
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(now);

  const topLeads = payload.riskyValuableLeads.slice(0, 3);
  const todayUrl = `${appUrl.replace(/\/+$/, '')}/today`;

  const plain = [
    `CloseFlow - Plan dnia (${dateLabel})`,
    '',
    `Pilne: ${payload.summary.urgentCount}`,
    `Na dziś: ${payload.summary.todayCount}`,
    `Leady bez akcji: ${payload.summary.noStepCount}`,
    `Sprawy bez akcji: ${payload.summary.caseNoActionCount}`,
    `Bez ruchu: ${payload.summary.stalledCount}`,
    `Szkice do sprawdzenia: ${payload.summary.aiDraftCount}`,
    '',
    ...sectionPlain('Zaległe zadania', payload.overdueTasks),
    '',
    ...sectionPlain('Zaległe wydarzenia', payload.overdueEvents),
    '',
    ...sectionPlain('Leady po terminie', payload.overdueLeads),
    '',
    ...sectionPlain('Zadania na dziś', payload.todayTasks),
    '',
    ...sectionPlain('Wydarzenia na dziś', payload.todayEvents),
    '',
    ...sectionPlain('Leady bez zaplanowanej akcji', payload.noStepLeads),
    '',
    ...sectionPlain('Sprawy bez zaplanowanej akcji', payload.casesWithoutPlannedAction),
    '',
    ...sectionPlain('Szkice do sprawdzenia', payload.pendingAiDrafts),
    '',
    'Top leady do ruszenia:',
    ...(topLeads.length ? topLeads.map((lead, index) => `${index + 1}. ${lead.title} (${lead.value || 0} PLN)`) : ['Brak']),
    '',
    `Otwórz Dziś: ${todayUrl}`,
  ].join('\n');

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.5;color:#0f172a">
      <h2 style="margin:0 0 8px">CloseFlow - Plan dnia</h2>
      <p style="margin:0 0 16px;color:#475569">${fullName ? `Cześć ${escapeHtml(fullName)},` : 'Cześć,'} ${escapeHtml(dateLabel)}</p>
      <table style="width:100%;border-collapse:collapse;margin-bottom:16px">
        <tr><td style="padding:8px;border:1px solid #e2e8f0">Pilne</td><td style="padding:8px;border:1px solid #e2e8f0"><strong>${payload.summary.urgentCount}</strong></td></tr>
        <tr><td style="padding:8px;border:1px solid #e2e8f0">Na dziś</td><td style="padding:8px;border:1px solid #e2e8f0"><strong>${payload.summary.todayCount}</strong></td></tr>
        <tr><td style="padding:8px;border:1px solid #e2e8f0">Leady bez akcji</td><td style="padding:8px;border:1px solid #e2e8f0"><strong>${payload.summary.noStepCount}</strong></td></tr>
        <tr><td style="padding:8px;border:1px solid #e2e8f0">Sprawy bez akcji</td><td style="padding:8px;border:1px solid #e2e8f0"><strong>${payload.summary.caseNoActionCount}</strong></td></tr>
        <tr><td style="padding:8px;border:1px solid #e2e8f0">Szkice do sprawdzenia</td><td style="padding:8px;border:1px solid #e2e8f0"><strong>${payload.summary.aiDraftCount}</strong></td></tr>
      </table>
      ${sectionHtml('Zaległe zadania', payload.overdueTasks)}
      ${sectionHtml('Zaległe wydarzenia', payload.overdueEvents)}
      ${sectionHtml('Leady bez zaplanowanej akcji', payload.noStepLeads)}
      ${sectionHtml('Sprawy bez zaplanowanej akcji', payload.casesWithoutPlannedAction)}
      ${sectionHtml('Szkice do sprawdzenia', payload.pendingAiDrafts)}
      <a href="${todayUrl}" style="display:inline-block;padding:10px 14px;background:#0f172a;color:#fff;text-decoration:none;border-radius:8px">Otwórz Dziś</a>
    </div>
  `;

  return { plain, html };
}

export function buildWeeklyReportPayload({
  leads,
  tasks,
  events,
  cases = [],
  drafts = [],
  now = new Date(),
  timeZone = 'Europe/Warsaw',
}: {
  leads: LeadLike[];
  tasks: TaskLike[];
  events: EventLike[];
  cases?: CaseLike[];
  drafts?: AiDraftLike[];
  now?: Date;
  timeZone?: string;
}): WeeklyReportPayload {
  const range = getReportWeekRange(now, timeZone);
  const allTasks = safeRows(tasks);
  const allEvents = safeRows(events);
  const activeTasks = allTasks.filter((task) => !isTaskDone(task));
  const activeEvents = allEvents.filter((event) => !isEventDone(event));

  const newLeads = safeRows(leads)
    .filter((lead) => isBetween(normalizeCreatedDate(lead), range.previousWeekStart, range.previousWeekEnd))
    .map((lead) => ({
      id: stableId(lead, 'lead'),
      title: mapLeadTitle(lead),
      when: normalizeCreatedDate(lead)?.toISOString(),
      value: asNumber(lead.value ?? lead.dealValue ?? lead.deal_value),
      reason: 'Nowy lead w poprzednim tygodniu',
    }));

  const movedToCases = safeRows(leads)
    .filter((lead) => {
      const status = asText(lead.status).toLowerCase();
      const hasCase = Boolean(lead.case_id ?? lead.caseId ?? lead.linked_case_id ?? lead.linkedCaseId ?? lead.converted_case_id ?? lead.convertedCaseId);
      const movedStatus = ['won', 'moved_to_service', 'in_service', 'converted'].includes(status);
      const movedAt = parseIso(lead.converted_at ?? lead.convertedAt ?? lead.won_at ?? lead.wonAt ?? lead.updated_at ?? lead.updatedAt);
      return (hasCase || movedStatus) && isBetween(movedAt, range.previousWeekStart, range.previousWeekEnd);
    })
    .map((lead) => ({
      id: stableId(lead, 'lead'),
      title: mapLeadTitle(lead),
      when: parseIso(lead.converted_at ?? lead.convertedAt ?? lead.won_at ?? lead.wonAt ?? lead.updated_at ?? lead.updatedAt)?.toISOString(),
      value: asNumber(lead.value ?? lead.dealValue ?? lead.deal_value),
      reason: 'Przeniesiony do sprawy / obsługi',
    }));

  const completedTasks = allTasks
    .filter((task) => isTaskDone(task) && isBetween(normalizeTaskCompletedDate(task), range.previousWeekStart, range.previousWeekEnd))
    .map((task) => ({
      id: stableId(task, 'task'),
      title: mapTaskTitle(task),
      when: normalizeTaskCompletedDate(task)?.toISOString(),
      leadName: mapLeadName(task),
      caseName: mapCaseName(task),
      reason: 'Zadanie wykonane',
    }));

  const overdueTaskItems = activeTasks
    .filter((task) => {
      const at = normalizeTaskDate(task);
      return Boolean(at && at.getTime() < now.getTime());
    })
    .map((task) => ({
      id: stableId(task, 'task'),
      title: mapTaskTitle(task),
      when: normalizeTaskDate(task)?.toISOString(),
      leadName: mapLeadName(task),
      caseName: mapCaseName(task),
      reason: 'Zadanie zaległe',
    }));

  const overdueEventItems = activeEvents
    .filter((event) => {
      const at = normalizeEventDate(event);
      return Boolean(at && at.getTime() < now.getTime());
    })
    .map((event) => ({
      id: stableId(event, 'event'),
      title: mapEventTitle(event),
      when: normalizeEventDate(event)?.toISOString(),
      leadName: mapLeadName(event),
      caseName: mapCaseName(event),
      reason: 'Wydarzenie zaległe',
    }));

  const caseBlockers = safeRows(cases)
    .filter((row) => !isCaseClosed(row) && isCaseBlocked(row))
    .map((row) => ({
      id: stableId(row, 'case'),
      title: mapCaseTitle(row),
      when: normalizeUpdatedDate(row)?.toISOString(),
      reason: asText(row.blocker_reason ?? row.blockerReason ?? row.blocked_reason ?? row.blockedReason) || 'Sprawa z blokerem',
    }));

  const pendingDrafts = safeRows(drafts)
    .filter(isPendingDraft)
    .map((draft) => ({
      id: stableId(draft, 'draft'),
      title: (asText(draft.raw_text ?? draft.rawText ?? draft.title) || 'Szkic do sprawdzenia').slice(0, 140),
      when: normalizeCreatedDate(draft)?.toISOString(),
      reason: 'Szkic niezatwierdzony',
    }));

  const nextWeekTaskItems = activeTasks
    .filter((task) => isBetween(normalizeTaskDate(task), range.nextWeekStart, range.nextWeekEnd))
    .map((task) => ({
      id: stableId(task, 'task'),
      title: mapTaskTitle(task),
      when: normalizeTaskDate(task)?.toISOString(),
      leadName: mapLeadName(task),
      caseName: mapCaseName(task),
      reason: 'Zaplanowane na następny tydzień',
    }));

  const nextWeekEventItems = activeEvents
    .filter((event) => isBetween(normalizeEventDate(event), range.nextWeekStart, range.nextWeekEnd))
    .map((event) => ({
      id: stableId(event, 'event'),
      title: mapEventTitle(event),
      when: normalizeEventDate(event)?.toISOString(),
      leadName: mapLeadName(event),
      caseName: mapCaseName(event),
      reason: 'Termin w następnym tygodniu',
    }));

  const overdueItems = [...overdueTaskItems, ...overdueEventItems]
    .sort((a, b) => (parseIso(a.when)?.getTime() ?? 0) - (parseIso(b.when)?.getTime() ?? 0))
    .slice(0, 20);
  const nextWeekItems = [...nextWeekTaskItems, ...nextWeekEventItems]
    .sort((a, b) => (parseIso(a.when)?.getTime() ?? 0) - (parseIso(b.when)?.getTime() ?? 0))
    .slice(0, 20);

  return {
    newLeads,
    movedToCases,
    completedTasks,
    overdueItems,
    caseBlockers,
    pendingDrafts,
    nextWeekItems,
    summary: {
      newLeadsCount: newLeads.length,
      movedToCasesCount: movedToCases.length,
      completedTasksCount: completedTasks.length,
      overdueCount: overdueItems.length,
      blockerCount: caseBlockers.length,
      draftCount: pendingDrafts.length,
      nextWeekCount: nextWeekItems.length,
    },
  };
}

export function buildWeeklyReportEmail({
  fullName,
  appUrl,
  payload,
  now = new Date(),
  timeZone = 'Europe/Warsaw',
}: {
  fullName?: string;
  appUrl: string;
  payload: WeeklyReportPayload;
  now?: Date;
  timeZone?: string;
}) {
  const range = getReportWeekRange(now, timeZone);
  const rangeLabel = `${new Intl.DateTimeFormat('pl-PL', { timeZone, day: '2-digit', month: '2-digit' }).format(range.previousWeekStart)} - ${new Intl.DateTimeFormat('pl-PL', { timeZone, day: '2-digit', month: '2-digit', year: 'numeric' }).format(addDays(range.previousWeekEnd, -1))}`;
  const activityUrl = `${appUrl.replace(/\/+$/, '')}/activity`;

  const plain = [
    `CloseFlow - Raport tygodniowy (${rangeLabel})`,
    '',
    `Nowe leady: ${payload.summary.newLeadsCount}`,
    `Przeniesione do spraw: ${payload.summary.movedToCasesCount}`,
    `Wykonane zadania: ${payload.summary.completedTasksCount}`,
    `Zaległe: ${payload.summary.overdueCount}`,
    `Blokery spraw: ${payload.summary.blockerCount}`,
    `Szkice: ${payload.summary.draftCount}`,
    `Następny tydzień: ${payload.summary.nextWeekCount}`,
    '',
    ...sectionPlain('Nowe leady', payload.newLeads),
    '',
    ...sectionPlain('Przeniesione do spraw', payload.movedToCases),
    '',
    ...sectionPlain('Wykonane zadania', payload.completedTasks),
    '',
    ...sectionPlain('Zaległe', payload.overdueItems),
    '',
    ...sectionPlain('Blokery spraw', payload.caseBlockers),
    '',
    ...sectionPlain('Szkice do sprawdzenia', payload.pendingDrafts),
    '',
    ...sectionPlain('Następny tydzień', payload.nextWeekItems),
    '',
    `Otwórz Aktywność: ${activityUrl}`,
  ].join('\n');

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.5;color:#0f172a">
      <h2 style="margin:0 0 8px">CloseFlow - Raport tygodniowy</h2>
      <p style="margin:0 0 16px;color:#475569">${fullName ? `Cześć ${escapeHtml(fullName)},` : 'Cześć,'} tydzień ${escapeHtml(rangeLabel)}</p>
      <table style="width:100%;border-collapse:collapse;margin-bottom:16px">
        <tr><td style="padding:8px;border:1px solid #e2e8f0">Nowe leady</td><td style="padding:8px;border:1px solid #e2e8f0"><strong>${payload.summary.newLeadsCount}</strong></td></tr>
        <tr><td style="padding:8px;border:1px solid #e2e8f0">Przeniesione do spraw</td><td style="padding:8px;border:1px solid #e2e8f0"><strong>${payload.summary.movedToCasesCount}</strong></td></tr>
        <tr><td style="padding:8px;border:1px solid #e2e8f0">Wykonane zadania</td><td style="padding:8px;border:1px solid #e2e8f0"><strong>${payload.summary.completedTasksCount}</strong></td></tr>
        <tr><td style="padding:8px;border:1px solid #e2e8f0">Zaległe</td><td style="padding:8px;border:1px solid #e2e8f0"><strong>${payload.summary.overdueCount}</strong></td></tr>
        <tr><td style="padding:8px;border:1px solid #e2e8f0">Blokery spraw</td><td style="padding:8px;border:1px solid #e2e8f0"><strong>${payload.summary.blockerCount}</strong></td></tr>
        <tr><td style="padding:8px;border:1px solid #e2e8f0">Szkice</td><td style="padding:8px;border:1px solid #e2e8f0"><strong>${payload.summary.draftCount}</strong></td></tr>
      </table>
      ${sectionHtml('Nowe leady', payload.newLeads)}
      ${sectionHtml('Przeniesione do spraw', payload.movedToCases)}
      ${sectionHtml('Wykonane zadania', payload.completedTasks)}
      ${sectionHtml('Zaległe', payload.overdueItems)}
      ${sectionHtml('Blokery spraw', payload.caseBlockers)}
      ${sectionHtml('Szkice do sprawdzenia', payload.pendingDrafts)}
      ${sectionHtml('Następny tydzień', payload.nextWeekItems)}
      <a href="${activityUrl}" style="display:inline-block;padding:10px 14px;background:#0f172a;color:#fff;text-decoration:none;border-radius:8px">Otwórz Aktywność</a>
    </div>
  `;

  return { plain, html };
}
