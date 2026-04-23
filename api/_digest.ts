type LeadLike = Record<string, unknown>;
type TaskLike = Record<string, unknown>;
type EventLike = Record<string, unknown>;

type DigestSectionItem = {
  id: string;
  title: string;
  when?: string;
  leadName?: string;
  value?: number;
  daysWithoutUpdate?: number;
};

type DigestPayload = {
  overdueTasks: DigestSectionItem[];
  overdueLeads: DigestSectionItem[];
  todayTasks: DigestSectionItem[];
  todayEvents: DigestSectionItem[];
  noStepLeads: DigestSectionItem[];
  staleLeads: DigestSectionItem[];
  riskyValuableLeads: DigestSectionItem[];
  summary: {
    urgentCount: number;
    todayCount: number;
    noStepCount: number;
    stalledCount: number;
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

export function shouldSendDigestNow(timeZone: string, now = new Date(), digestHour = 7) {
  return getHour(now, timeZone) === digestHour;
}

function normalizeTaskDate(task: TaskLike) {
  return parseIso(task.scheduled_at ?? task.scheduledAt ?? task.dueAt ?? task.start_at ?? task.startAt ?? task.created_at);
}

function normalizeEventDate(event: EventLike) {
  return parseIso(event.start_at ?? event.startAt ?? event.scheduled_at ?? event.scheduledAt ?? event.created_at);
}

function normalizeLeadActionDate(lead: LeadLike) {
  return parseIso(lead.next_action_at ?? lead.nextActionAt);
}

function isLeadClosed(lead: LeadLike) {
  const status = asText(lead.status).toLowerCase();
  return status === 'won' || status === 'lost';
}

function isLeadOverdue(lead: LeadLike, now: Date, timeZone: string) {
  const actionAt = normalizeLeadActionDate(lead);
  if (!actionAt) return false;
  if (actionAt.getTime() >= now.getTime()) return false;
  return getDateKey(actionAt, timeZone) !== getDateKey(now, timeZone);
}

function mapLeadTitle(lead: LeadLike) {
  const name = asText(lead.name);
  const company = asText(lead.company);
  if (company) return `${name || 'Lead'} (${company})`;
  return name || 'Lead bez nazwy';
}

export function buildDailyDigestPayload({
  leads,
  tasks,
  events,
  now = new Date(),
  timeZone = 'Europe/Warsaw',
}: {
  leads: LeadLike[];
  tasks: TaskLike[];
  events: EventLike[];
  now?: Date;
  timeZone?: string;
}): DigestPayload {
  const todayKey = getDateKey(now, timeZone);

  const activeLeads = leads.filter((lead) => !isLeadClosed(lead));

  const overdueTasks = tasks
    .filter((task) => {
      const status = asText(task.status).toLowerCase();
      const startAt = normalizeTaskDate(task);
      if (!startAt) return false;
      if (status === 'done' || status === 'completed') return false;
      if (startAt.getTime() >= now.getTime()) return false;
      return getDateKey(startAt, timeZone) !== todayKey;
    })
    .map((task) => ({
      id: asText(task.id) || crypto.randomUUID(),
      title: asText(task.title) || 'Zadanie',
      when: normalizeTaskDate(task)?.toISOString(),
      leadName: asText(task.lead_name ?? task.leadName),
    }));

  const todayTasks = tasks
    .filter((task) => {
      const status = asText(task.status).toLowerCase();
      const startAt = normalizeTaskDate(task);
      if (!startAt) return false;
      if (status === 'done' || status === 'completed') return false;
      return getDateKey(startAt, timeZone) === todayKey;
    })
    .map((task) => ({
      id: asText(task.id) || crypto.randomUUID(),
      title: asText(task.title) || 'Zadanie',
      when: normalizeTaskDate(task)?.toISOString(),
      leadName: asText(task.lead_name ?? task.leadName),
    }));

  const todayEvents = events
    .filter((event) => {
      const status = asText(event.status).toLowerCase();
      const startAt = normalizeEventDate(event);
      if (!startAt) return false;
      if (status === 'done' || status === 'completed') return false;
      return getDateKey(startAt, timeZone) === todayKey;
    })
    .map((event) => ({
      id: asText(event.id) || crypto.randomUUID(),
      title: asText(event.title) || 'Wydarzenie',
      when: normalizeEventDate(event)?.toISOString(),
      leadName: asText(event.lead_name ?? event.leadName),
    }));

  const overdueLeads = activeLeads
    .filter((lead) => isLeadOverdue(lead, now, timeZone))
    .map((lead) => ({
      id: asText(lead.id) || crypto.randomUUID(),
      title: mapLeadTitle(lead),
      when: normalizeLeadActionDate(lead)?.toISOString(),
      value: asNumber(lead.value ?? lead.dealValue),
    }));

  const noStepLeads = activeLeads
    .filter((lead) => !normalizeLeadActionDate(lead))
    .map((lead) => ({
      id: asText(lead.id) || crypto.randomUUID(),
      title: mapLeadTitle(lead),
      value: asNumber(lead.value ?? lead.dealValue),
    }));

  const staleLeads = activeLeads
    .map((lead) => {
      const updatedAt = parseIso(lead.updated_at ?? lead.updatedAt ?? lead.created_at);
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
      id: asText(lead.id) || crypto.randomUUID(),
      title: mapLeadTitle(lead),
      daysWithoutUpdate,
      value: asNumber(lead.value ?? lead.dealValue),
    }));

  const riskyValuableLeads = activeLeads
    .filter((lead) => {
      const amount = asNumber(lead.value ?? lead.dealValue);
      if (amount <= 0) return false;
      const updatedAt = parseIso(lead.updated_at ?? lead.updatedAt ?? lead.created_at);
      const daysWithoutUpdate = updatedAt ? getDaysBetween(updatedAt, now) : 0;
      return (
        Boolean(lead.is_at_risk ?? lead.isAtRisk)
        || isLeadOverdue(lead, now, timeZone)
        || !normalizeLeadActionDate(lead)
        || daysWithoutUpdate >= 5
      );
    })
    .sort((a, b) => asNumber(b.value ?? b.dealValue) - asNumber(a.value ?? a.dealValue))
    .slice(0, 5)
    .map((lead) => ({
      id: asText(lead.id) || crypto.randomUUID(),
      title: mapLeadTitle(lead),
      value: asNumber(lead.value ?? lead.dealValue),
      when: normalizeLeadActionDate(lead)?.toISOString(),
    }));

  return {
    overdueTasks,
    overdueLeads,
    todayTasks,
    todayEvents,
    noStepLeads,
    staleLeads,
    riskyValuableLeads,
    summary: {
      urgentCount: overdueTasks.length + overdueLeads.length,
      todayCount: todayTasks.length + todayEvents.length,
      noStepCount: noStepLeads.length,
      stalledCount: staleLeads.length,
    },
  };
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

  const plain = [
    `CloseFlow - Plan dnia (${dateLabel})`,
    '',
    `Pilne: ${payload.summary.urgentCount}`,
    `Na dzis: ${payload.summary.todayCount}`,
    `Bez kroku: ${payload.summary.noStepCount}`,
    `Bez ruchu: ${payload.summary.stalledCount}`,
    '',
    `Zalegle zadania: ${payload.overdueTasks.length}`,
    `Leady po terminie: ${payload.overdueLeads.length}`,
    `Wydarzenia na dzis: ${payload.todayEvents.length}`,
    '',
    'Top leady do ruszenia:',
    ...(topLeads.length
      ? topLeads.map((lead, index) => `${index + 1}. ${lead.title} (${lead.value || 0} PLN)`)
      : ['Brak']),
    '',
    `Otworz Today: ${appUrl.replace(/\/+$/, '')}/today`,
  ].join('\n');

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.5;color:#0f172a">
      <h2 style="margin:0 0 8px">CloseFlow - Plan dnia</h2>
      <p style="margin:0 0 16px;color:#475569">${fullName ? `Czesc ${fullName},` : 'Czesc,'} ${dateLabel}</p>
      <table style="width:100%;border-collapse:collapse;margin-bottom:16px">
        <tr>
          <td style="padding:8px;border:1px solid #e2e8f0">Pilne</td>
          <td style="padding:8px;border:1px solid #e2e8f0"><strong>${payload.summary.urgentCount}</strong></td>
        </tr>
        <tr>
          <td style="padding:8px;border:1px solid #e2e8f0">Na dzis</td>
          <td style="padding:8px;border:1px solid #e2e8f0"><strong>${payload.summary.todayCount}</strong></td>
        </tr>
        <tr>
          <td style="padding:8px;border:1px solid #e2e8f0">Leady bez kroku</td>
          <td style="padding:8px;border:1px solid #e2e8f0"><strong>${payload.summary.noStepCount}</strong></td>
        </tr>
        <tr>
          <td style="padding:8px;border:1px solid #e2e8f0">Leady bez ruchu</td>
          <td style="padding:8px;border:1px solid #e2e8f0"><strong>${payload.summary.stalledCount}</strong></td>
        </tr>
      </table>
      <p style="margin:0 0 8px"><strong>Top leady do ruszenia:</strong></p>
      <ol style="margin:0 0 16px;padding-left:20px">
        ${
          topLeads.length
            ? topLeads.map((lead) => `<li>${lead.title} (${lead.value || 0} PLN)</li>`).join('')
            : '<li>Brak</li>'
        }
      </ol>
      <a href="${appUrl.replace(/\/+$/, '')}/today" style="display:inline-block;padding:10px 14px;background:#0f172a;color:#fff;text-decoration:none;border-radius:8px">Otworz Today</a>
    </div>
  `;

  return { plain, html };
}
