import { differenceInCalendarDays, isPast, parseISO, startOfDay } from 'date-fns';
import type { KnownLeadStatus } from './domain-statuses';
const A25_NEAREST_PLANNED_ACTION_SOURCE_LOCK = 'Najbliższa zaplanowana akcja liczona z tasks/events';
const A25E_LEAD_HEALTH_NULL_GUARD_LOCK = 'Lead health helpers accept null lead during route loading';

export const LEAD_ACTIVE_SALES_STATUSES = [
  'new',
  'contacted',
  'qualification',
  'proposal_sent',
  'waiting_response',
  'negotiation',
  'accepted',
] as const;

type LeadHealthRecord = Record<string, unknown> & {
  status?: KnownLeadStatus | string | null;
  leadVisibility?: string | null;
  salesOutcome?: string | null;
  linkedCaseId?: string | null;
  caseId?: string | null;
  movedToService?: boolean | null;
  movedToServiceAt?: string | Date | null;
  caseStartedAt?: string | Date | null;
  serviceStartedAt?: string | Date | null;
  nextActionAt?: string | Date | null;
  nearestActionAt?: string | Date | null;
  lastContactAt?: string | Date | null;
  updatedAt?: string | Date | null;
  createdAt?: string | Date | null;
  dealValue?: number | string | null;
  isAtRisk?: boolean | null;
};

export type LeadHealthInput = LeadHealthRecord | null | undefined;

const CLOSED_STATUSES = new Set(['won', 'lost', 'moved_to_service', 'archived']);
const WAITING_STATUSES = new Set(['proposal_sent', 'waiting_response', 'negotiation', 'accepted']);

function normalizeLeadHealthInput(lead: LeadHealthInput): LeadHealthRecord | null {
  if (!lead || typeof lead !== 'object') return null;
  return lead;
}

function toDateSafe(value: unknown) {
  if (!value) return null;
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;
  if (typeof value === 'string') {
    const normalized = value.includes('T') ? value : `${value}T09:00:00`;
    const parsed = parseISO(normalized);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }
  if (typeof value === 'object' && value && 'toDate' in value) {
    try {
      const converted = (value as { toDate: () => Date }).toDate();
      return Number.isNaN(converted.getTime()) ? null : converted;
    } catch {
      return null;
    }
  }
  return null;
}

function asText(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

export function isClosedLeadStatus(status?: string) {
  return CLOSED_STATUSES.has(String(status || '').trim());
}

export function isLeadMovedToService(lead: LeadHealthInput) {
  const safeLead = normalizeLeadHealthInput(lead);
  if (!safeLead) return false;

  const status = asText(safeLead.status);
  const leadVisibility = asText(safeLead.leadVisibility);
  const salesOutcome = asText(safeLead.salesOutcome);
  const linkedCaseId = asText(safeLead.linkedCaseId || safeLead.caseId);

  return Boolean(
    safeLead.movedToService
    || status === 'moved_to_service'
    || leadVisibility === 'archived'
    || salesOutcome === 'moved_to_service'
    || linkedCaseId
    || toDateSafe(safeLead.movedToServiceAt)
    || toDateSafe(safeLead.caseStartedAt)
    || toDateSafe(safeLead.serviceStartedAt),
  );
}

export function isActiveSalesLead(lead: LeadHealthInput) {
  const safeLead = normalizeLeadHealthInput(lead);
  if (!safeLead) return false;

  const status = String(safeLead.status || '').trim();
  return LEAD_ACTIVE_SALES_STATUSES.includes(status as typeof LEAD_ACTIVE_SALES_STATUSES[number]) && !isLeadMovedToService(safeLead);
}

export function getLeadNextActionDate(lead: LeadHealthInput) {
  const safeLead = normalizeLeadHealthInput(lead);
  if (!safeLead) return null;

  return toDateSafe(safeLead.nearestActionAt || safeLead.nextActionAt);
}

export function getLeadLastTouchDate(lead: LeadHealthInput) {
  const safeLead = normalizeLeadHealthInput(lead);
  if (!safeLead) return null;

  return (
    toDateSafe(safeLead.lastContactAt) ||
    toDateSafe(safeLead.updatedAt) ||
    toDateSafe(safeLead.createdAt)
  );
}

export function hasNextStep(lead: LeadHealthInput) {
  return Boolean(getLeadNextActionDate(lead));
}

export function isNextStepOverdue(lead: LeadHealthInput) {
  const safeLead = normalizeLeadHealthInput(lead);
  if (!safeLead) return false;

  if (isClosedLeadStatus(String(safeLead.status || ''))) return false;
  const nextAction = getLeadNextActionDate(safeLead);
  if (!nextAction) return false;
  return isPast(nextAction);
}

export function daysSinceLastTouch(lead: LeadHealthInput) {
  const lastTouch = getLeadLastTouchDate(lead);
  if (!lastTouch) return null;
  return differenceInCalendarDays(startOfDay(new Date()), startOfDay(lastTouch));
}

export function isWaitingTooLong(lead: LeadHealthInput) {
  const safeLead = normalizeLeadHealthInput(lead);
  if (!safeLead) return false;

  if (isClosedLeadStatus(String(safeLead.status || ''))) return false;
  const status = String(safeLead.status || '');
  if (!WAITING_STATUSES.has(status)) return false;
  const days = daysSinceLastTouch(safeLead);
  return days !== null && days >= 3;
}

export function isHighValueAtRisk(lead: LeadHealthInput) {
  const safeLead = normalizeLeadHealthInput(lead);
  if (!safeLead) return false;

  if (isClosedLeadStatus(String(safeLead.status || ''))) return false;
  const dealValue = Number(safeLead.dealValue || 0);
  if (dealValue < 5000) return false;
  const days = daysSinceLastTouch(safeLead) ?? 0;
  return isNextStepOverdue(safeLead) || !hasNextStep(safeLead) || days >= 5 || Boolean(safeLead.isAtRisk);
}

export function getLeadPriorityScore(lead: LeadHealthInput) {
  const safeLead = normalizeLeadHealthInput(lead);
  if (!safeLead) return 0;

  if (isClosedLeadStatus(String(safeLead.status || ''))) return 0;

  let score = 0;
  const value = Number(safeLead.dealValue || 0);
  const days = daysSinceLastTouch(safeLead) ?? 0;

  if (isNextStepOverdue(safeLead)) score += 60;
  if (!hasNextStep(safeLead)) score += 45;
  if (isWaitingTooLong(safeLead)) score += 35;
  if (Boolean(safeLead.isAtRisk)) score += 25;

  if (value >= 20000) score += 35;
  else if (value >= 10000) score += 25;
  else if (value >= 5000) score += 15;
  else if (value > 0) score += 5;

  if (days >= 10) score += 20;
  else if (days >= 5) score += 10;
  else if (days >= 3) score += 5;

  return score;
}

export function buildLeadAlertReason(lead: LeadHealthInput) {
  const safeLead = normalizeLeadHealthInput(lead);
  if (!safeLead) return 'Brak danych leada';

  if (isLeadMovedToService(safeLead)) return 'Temat jest już w obsłudze';
  if (isNextStepOverdue(safeLead)) return 'Termin najbliższej akcji już minął';
  if (!hasNextStep(safeLead)) return 'Brak zaplanowanej akcji';
  if (isWaitingTooLong(safeLead)) return 'Temat czeka za długo bez nowego ruchu';
  if (isHighValueAtRisk(safeLead)) return 'Wysoka wartość i zbyt mało ruchu';
  if (Boolean(safeLead.isAtRisk)) return 'Temat oznaczony jako zagrożony';
  return 'Wymaga uwagi';
}

export function getLeadTodayDecisionReason(lead: LeadHealthInput) {
  const safeLead = normalizeLeadHealthInput(lead);
  if (!safeLead) return 'Brak danych';
  if (isLeadMovedToService(safeLead)) return 'Lead jest już w obsłudze';
  if (isNextStepOverdue(safeLead)) return 'Zaległa najbliższa akcja';
  if (!hasNextStep(safeLead)) return 'Bez zaplanowanej akcji';
  if (isWaitingTooLong(safeLead)) return 'Waiting za długo';
  if (isHighValueAtRisk(safeLead)) return 'Wysoka wartość / ryzyko';
  return 'Do ruchu dziś';
}
