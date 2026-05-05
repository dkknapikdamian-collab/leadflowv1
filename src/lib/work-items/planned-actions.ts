import { normalizeWorkItem, type WorkItem } from './normalize';

export type NearestPlannedAction = {
  id: string;
  type: WorkItem['type'];
  title: string;
  status: string;
  when: string;
  leadId: string | null;
  caseId: string | null;
  clientId: string | null;
};

type NearestActionInput = {
  recordType: 'lead' | 'case' | 'client';
  recordId: string;
  items: unknown[];
  relatedCaseIds?: string[];
  relatedLeadIds?: string[];
};

function parseMoment(value: string | null | undefined) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function isClosedWorkItemStatus(status: unknown) {
  const normalized = String(status || '').trim().toLowerCase();
  return normalized === 'done' || normalized === 'completed' || normalized === 'cancelled' || normalized === 'canceled' || normalized === 'closed' || normalized === 'archived';
}

export function normalizeWorkItems(items: unknown[]) {
  return (Array.isArray(items) ? items : []).map((item) => normalizeWorkItem(item));
}

export function getNearestPlannedAction(input: NearestActionInput): NearestPlannedAction | null {
  const recordId = String(input.recordId || '').trim();
  if (!recordId) return null;

  const relatedCaseIds = new Set((input.relatedCaseIds || []).map((item) => String(item || '').trim()).filter(Boolean));
  const relatedLeadIds = new Set((input.relatedLeadIds || []).map((item) => String(item || '').trim()).filter(Boolean));
  const candidates = normalizeWorkItems(input.items)
    .filter((item) => {
      if (isClosedWorkItemStatus(item.status)) return false;
      if (!item.dateAt) return false;

      if (input.recordType === 'lead') {
        if (String(item.leadId || '').trim() === recordId) return true;
        if (item.caseId && relatedCaseIds.has(String(item.caseId))) return true;
        return false;
      }

      if (input.recordType === 'case') return String(item.caseId || '').trim() === recordId;

      const clientId = String(item.clientId || '').trim();
      const leadId = String(item.leadId || '').trim();
      const caseId = String(item.caseId || '').trim();
      if (clientId === recordId) return true;
      if (leadId && relatedLeadIds.has(leadId)) return true;
      if (caseId && relatedCaseIds.has(caseId)) return true;
      return false;
    })
    .sort((left, right) => {
      const leftDate = parseMoment(left.dateAt)?.getTime() ?? Number.MAX_SAFE_INTEGER;
      const rightDate = parseMoment(right.dateAt)?.getTime() ?? Number.MAX_SAFE_INTEGER;
      return leftDate - rightDate;
    });

  const first = candidates[0];
  if (!first || !first.dateAt) return null;

  return {
    id: first.id,
    type: first.type,
    title: first.title || 'Bez tytulu',
    status: first.status || 'todo',
    when: first.dateAt,
    leadId: first.leadId,
    caseId: first.caseId,
    clientId: first.clientId,
  };
}
