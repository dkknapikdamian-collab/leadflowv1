export type NormalizedPriority = 'low' | 'medium' | 'high' | 'urgent' | 'normal';

export type NormalizedTask = {
  id: string;
  title: string;
  type: string;
  status: string;
  priority: NormalizedPriority;
  date: string | null;
  scheduledAt: string | null;
  dueAt: string | null;
  reminderAt: string | null;
  leadId: string | null;
  caseId: string | null;
  raw: any;
};

export type NormalizedEvent = {
  id: string;
  title: string;
  type: string;
  status: string;
  startAt: string | null;
  endAt: string | null;
  date: string | null;
  reminderAt: string | null;
  leadId: string | null;
  caseId: string | null;
  raw: any;
};

export type NormalizedLead = {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  source: string;
  status: string;
  priority: NormalizedPriority;
  dealValue: number;
  nextActionAt: string | null;
  linkedCaseId: string | null;
  isAtRisk: boolean;
  raw: any;
};

export type NormalizedCase = {
  id: string;
  title: string;
  clientName: string;
  status: string;
  leadId: string | null;
  completenessPercent: number;
  portalReady: boolean;
  raw: any;
};

export function toIsoLike(value: any): string | null {
  if (!value) return null;
  if (typeof value === 'string') return value;
  if (value instanceof Date) return value.toISOString();
  if (typeof value?.toDate === 'function') return value.toDate().toISOString();
  if (typeof value?.seconds === 'number') return new Date(value.seconds * 1000).toISOString();
  return null;
}

export function dateOnly(value: any): string | null {
  const normalized = toIsoLike(value);
  if (!normalized) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(normalized)) return normalized;
  const parsed = new Date(normalized);
  if (Number.isNaN(parsed.getTime())) return null;
  const year = parsed.getFullYear();
  const month = `${parsed.getMonth() + 1}`.padStart(2, '0');
  const day = `${parsed.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function numberOrZero(value: any): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function normalizeTask(input: any): NormalizedTask {
  const date = dateOnly(input?.date ?? input?.scheduledAt ?? input?.dueAt ?? input?.startAt);
  const scheduledAt = toIsoLike(input?.scheduledAt ?? input?.dueAt ?? input?.startAt ?? input?.date);
  return {
    id: String(input?.id ?? ''),
    title: String(input?.title ?? input?.name ?? 'Zadanie'),
    type: String(input?.type ?? input?.taskType ?? 'other'),
    status: String(input?.status ?? 'todo'),
    priority: (input?.priority ?? 'medium') as NormalizedPriority,
    date,
    scheduledAt,
    dueAt: toIsoLike(input?.dueAt ?? input?.scheduledAt ?? input?.date),
    reminderAt: toIsoLike(input?.reminderAt),
    leadId: input?.leadId ?? input?.lead_id ?? null,
    caseId: input?.caseId ?? input?.case_id ?? null,
    raw: input,
  };
}

export function normalizeEvent(input: any): NormalizedEvent {
  const startAt = toIsoLike(input?.startAt ?? input?.start_at ?? input?.date);
  return {
    id: String(input?.id ?? ''),
    title: String(input?.title ?? input?.name ?? 'Wydarzenie'),
    type: String(input?.type ?? input?.eventType ?? 'event'),
    status: String(input?.status ?? 'scheduled'),
    startAt,
    endAt: toIsoLike(input?.endAt ?? input?.end_at),
    date: dateOnly(input?.date ?? input?.startAt ?? input?.start_at),
    reminderAt: toIsoLike(input?.reminderAt),
    leadId: input?.leadId ?? input?.lead_id ?? null,
    caseId: input?.caseId ?? input?.case_id ?? null,
    raw: input,
  };
}

export function normalizeLead(input: any): NormalizedLead {
  const linkedCaseId = input?.linkedCaseId ?? input?.caseId ?? input?.convertedCaseId ?? input?.linked_case_id ?? null;
  return {
    id: String(input?.id ?? ''),
    name: String(input?.name ?? input?.title ?? input?.personName ?? input?.company ?? 'Lead'),
    company: String(input?.company ?? input?.companyName ?? ''),
    email: String(input?.email ?? ''),
    phone: String(input?.phone ?? ''),
    source: String(input?.source ?? input?.sourceType ?? 'other'),
    status: String(input?.status ?? 'new'),
    priority: (input?.priority ?? 'medium') as NormalizedPriority,
    dealValue: numberOrZero(input?.dealValue ?? input?.value),
    nextActionAt: toIsoLike(input?.nextActionAt ?? input?.next_step_due_at),
    linkedCaseId,
    isAtRisk: Boolean(input?.isAtRisk ?? input?.riskLevel === 'high'),
    raw: input,
  };
}

export function normalizeCase(input: any): NormalizedCase {
  return {
    id: String(input?.id ?? ''),
    title: String(input?.title ?? input?.name ?? 'Sprawa'),
    clientName: String(input?.clientName ?? input?.client_name ?? input?.customerName ?? ''),
    status: String(input?.status ?? 'new'),
    leadId: input?.leadId ?? input?.lead_id ?? null,
    completenessPercent: numberOrZero(input?.completenessPercent ?? input?.completeness_percent),
    portalReady: Boolean(input?.portalReady ?? input?.portal_ready),
    raw: input,
  };
}

export function isClosedLeadStatus(status: string | null | undefined): boolean {
  return ['won', 'lost', 'in_service', 'converted', 'service_started'].includes(String(status ?? ''));
}
