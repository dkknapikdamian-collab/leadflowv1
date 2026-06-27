import { isDoneStatus } from './calendar-status';

export type StatusPillPrefix = 'lead-detail' | 'client-detail' | 'case-detail';

export const OWNER_SILENCE_BADGE_LABELS = {
  warning: 'Cisza 7+ dni',
  critical: 'Cisza 14+ dni',
} as const;

function isOverdue(dateValue: unknown, status: unknown) {
  if (isDoneStatus(status)) return false;
  if (!dateValue) return false;
  const parsed = new Date(String(dateValue));
  return Number.isFinite(parsed.getTime()) && parsed.getTime() < Date.now();
}

export function getStatusPillClass(status: unknown, prefix: StatusPillPrefix, dateValue?: unknown) {
  const normalized = String(status || '').trim().toLowerCase();
  const base = `${prefix}-pill`;

  if (isOverdue(dateValue, normalized) || normalized === 'overdue' || ['blocked', 'rejected'].includes(normalized)) return `${base}-${prefix === 'case-detail' ? 'red' : 'danger'}`;
  if (['accepted', 'done', 'completed', 'paid', 'ready_to_start', 'fully_paid'].includes(normalized)) return `${base}-green`;
  if (['missing', 'waiting_on_client', 'on_hold', 'to_approve', 'proposal_sent', 'waiting_response', 'negotiation'].includes(normalized)) return `${base}-amber`;
  if (['uploaded', 'submitted', 'in_progress', 'scheduled', 'planned', 'open', 'new', 'contacted', 'qualification'].includes(normalized)) return `${base}-blue`;
  if (['moved_to_service'].includes(normalized)) return prefix === 'lead-detail' ? `${base}-purple` : `${base}-blue`;
  if (['lost', 'canceled', 'cancelled', 'archived', 'deleted'].includes(normalized)) return `${base}-muted`;
  return prefix === 'case-detail' ? `${base}-muted` : `${base}-blue`;
}

export function getClientNextActionToneClass(tone: 'red' | 'amber' | 'blue' | 'emerald' | 'slate' | string) {
  if (tone === 'red') return 'client-detail-callout-danger';
  if (tone === 'amber') return 'client-detail-callout-amber';
  if (tone === 'emerald') return 'client-detail-callout-green';
  if (tone === 'blue') return 'client-detail-callout-blue';
  return 'client-detail-callout-muted';
}
