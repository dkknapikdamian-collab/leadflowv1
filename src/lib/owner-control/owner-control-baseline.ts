import { getNearestPlannedAction, isClosedWorkItemStatus } from '../work-items/planned-actions';
import { normalizeWorkItem } from '../work-items/normalize';
import { buildMissingOwnerControlItems, isOwnerMissingControlItem } from './owner-control-missing-blockers';
import { buildActivityTruth } from './activity-truth';
import { buildNextMoveContract } from './next-move-contract';
import { normalizeOwnerRiskSettings, type OwnerRiskSettings } from './owner-risk-rules';
import { getCaseFinanceValue } from '../finance/case-finance-source';

const STAGE_A35_R1_OWNER_CONTROL_BASELINE_GAP_CLOSE_AND_QUEUE_SYNC = 'STAGE-A35_R1_OWNER_CONTROL_BASELINE_GAP_CLOSE_AND_QUEUE_SYNC';
void STAGE_A35_R1_OWNER_CONTROL_BASELINE_GAP_CLOSE_AND_QUEUE_SYNC;

export type OwnerControlEntityType = 'lead' | 'case' | 'client' | 'task' | 'event';
export type OwnerControlSeverity = 'critical' | 'warning' | 'normal';

export type OwnerControlItem = {
  key: string;
  entityType: OwnerControlEntityType;
  entityId: string;
  title: string;
  href: string;
  severity: OwnerControlSeverity;
  priority: number;
  reason: string;
  suggestedAction: string;
  statusLabel: string;
  silentDays: number | null;
  valuePln: number;
  nextMoveAt: string | null;
  signals: string[];
  sourceEntityType?: 'lead' | 'case' | 'client';
  sourceEntityId?: string;
  sourceItemId?: string;
  sourceBadge?: 'Lead' | 'Sprawa' | 'Klient';
  isMissingItem?: boolean;
  isBlockingMissingItem?: boolean;
  gapCloseKind?: 'note_without_followup';
};

export type OwnerControlBaseline = {
  generatedAt: string;
  settings: OwnerRiskSettings;
  items: OwnerControlItem[];
  counts: {
    critical: number;
    warning: number;
    normal: number;
    missingNextStep: number;
    stale: number;
  };
};

export type BuildOwnerControlBaselineInput = {
  leads?: unknown[];
  cases?: unknown[];
  tasks?: unknown[];
  events?: unknown[];
  settings?: unknown;
  now?: Date;
};

const CLOSED_RECORD_STATUSES = new Set([
  'won', 'lost', 'closed', 'archived', 'done', 'completed', 'cancelled', 'canceled', 'moved_to_service',
]);

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' ? value as Record<string, unknown> : {};
}

function readString(record: Record<string, unknown>, keys: string[], fallback = '') {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'string' && value.trim()) return value.trim();
    if (typeof value === 'number' && Number.isFinite(value)) return String(value);
  }
  return fallback;
}

function readNumber(record: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'number' && Number.isFinite(value)) return value;
    if (typeof value === 'string' && value.trim()) {
      const parsed = Number(value.replace(/\s+/g, '').replace(',', '.').replace(/[^0-9.-]/g, ''));
      if (Number.isFinite(parsed)) return parsed;
    }
  }
  return 0;
}

function getValue(record: Record<string, unknown>) {
  return readNumber(record, [
    'contractValue', 'contract_value', 'expectedRevenue', 'expected_revenue', 'caseValue', 'case_value',
    'dealValue', 'deal_value', 'estimatedValue', 'estimated_value', 'value', 'amount', 'budget', 'commission',
    'commissionAmount', 'commission_amount',
  ]);
}

function isClosedRecord(record: Record<string, unknown>) {
  const status = readString(record, ['status', 'salesOutcome', 'sales_outcome', 'leadVisibility', 'lead_visibility']).toLowerCase();
  return CLOSED_RECORD_STATUSES.has(status) || Boolean(record.archivedAt || record.archived_at || record.deletedAt || record.deleted_at);
}

function pushSignal(signals: string[], signal: string) {
  if (signal && !signals.includes(signal)) signals.push(signal);
}

function classifySilence(silentDays: number | null, settings: OwnerRiskSettings) {
  if (typeof silentDays !== 'number') return null;
  if (silentDays >= settings.criticalDays) return 'critical' as const;
  if (silentDays >= settings.warningDays) return 'warning' as const;
  return null;
}


function getOwnerControlSourceLabel(sourceEntityType: 'lead' | 'case' | 'client') {
  if (sourceEntityType === 'lead') return 'Lead' as const;
  if (sourceEntityType === 'case') return 'Sprawa' as const;
  return 'Klient' as const;
}

function getOwnerControlSourceHref(sourceEntityType: 'lead' | 'case' | 'client', sourceEntityId: string) {
  const encodedId = encodeURIComponent(sourceEntityId);
  if (sourceEntityType === 'lead') return `/leads/${encodedId}`;
  if (sourceEntityType === 'case') return `/case/${encodedId}`;
  return `/clients/${encodedId}`;
}

function resolveNoteSource(normalized: ReturnType<typeof normalizeWorkItem>): { sourceEntityType: 'lead' | 'case' | 'client'; sourceEntityId: string } | null {
  if (normalized.caseId) return { sourceEntityType: 'case', sourceEntityId: normalized.caseId };
  if (normalized.leadId) return { sourceEntityType: 'lead', sourceEntityId: normalized.leadId };
  if (normalized.clientId) return { sourceEntityType: 'client', sourceEntityId: normalized.clientId };
  return null;
}

function workItemMatchesSource(normalized: ReturnType<typeof normalizeWorkItem>, source: { sourceEntityType: 'lead' | 'case' | 'client'; sourceEntityId: string }) {
  if (source.sourceEntityType === 'case') return normalized.caseId === source.sourceEntityId;
  if (source.sourceEntityType === 'lead') return normalized.leadId === source.sourceEntityId;
  return normalized.clientId === source.sourceEntityId;
}

function hasOpenPlannedActionForNoteSource(input: {
  source: { sourceEntityType: 'lead' | 'case' | 'client'; sourceEntityId: string };
  noteId: string;
  items: unknown[];
}) {
  for (const candidate of input.items) {
    if (isOwnerMissingControlItem(candidate)) continue;
    const normalized = normalizeWorkItem(candidate);
    if (!normalized.id || normalized.id === input.noteId) continue;
    if (normalized.type === 'note') continue;
    if (!normalized.dateAt) continue;
    if (isClosedWorkItemStatus(normalized.status)) continue;
    if (workItemMatchesSource(normalized, input.source)) return true;
  }
  return false;
}

export function buildNoteWithoutFollowUpOwnerControlItems(input: { items?: unknown[]; now?: Date }): OwnerControlItem[] {
  const deduped = new Map<string, OwnerControlItem>();
  void input.now;
  const items = input.items || [];

  for (const raw of items) {
    if (isOwnerMissingControlItem(raw)) continue;
    const normalized = normalizeWorkItem(raw);
    if (!normalized.id || normalized.type !== 'note') continue;
    if (isClosedWorkItemStatus(normalized.status)) continue;
    const source = resolveNoteSource(normalized);
    if (!source) continue;
    if (hasOpenPlannedActionForNoteSource({ source, noteId: normalized.id, items })) continue;

    const sourceLabel = getOwnerControlSourceLabel(source.sourceEntityType);
    const sourceKey = `${source.sourceEntityType}:${source.sourceEntityId}:${normalized.id}`;
    deduped.set(sourceKey, {
      key: `note-without-followup:${sourceKey}`,
      entityType: source.sourceEntityType,
      entityId: source.sourceEntityId,
      title: normalized.title || 'Notatka bez follow-upu',
      href: getOwnerControlSourceHref(source.sourceEntityType, source.sourceEntityId),
      severity: 'warning',
      priority: 125,
      reason: `${sourceLabel}: notatka nie ma powiazanego zadania ani follow-upu.`,
      suggestedAction: 'Otworz zrodlo i dodaj konkretny nastepny ruch albo swiadomie zamknij temat.',
      statusLabel: `[${sourceLabel}] Notatka bez follow-upu`,
      silentDays: null,
      valuePln: 0,
      nextMoveAt: normalized.createdAt || normalized.updatedAt || normalized.dateAt,
      signals: ['Notatka bez zadania/follow-upu', `Zrodlo: ${sourceLabel}`],
      sourceEntityType: source.sourceEntityType,
      sourceEntityId: source.sourceEntityId,
      sourceItemId: normalized.id,
      sourceBadge: sourceLabel,
      gapCloseKind: 'note_without_followup',
    });
  }

  return [...deduped.values()];
}

function buildRecordItem(input: {
  entityType: 'lead' | 'case';
  record: Record<string, unknown>;
  relatedCaseIds?: string[];
  workItems: unknown[];
  settings: OwnerRiskSettings;
  now: Date;
}): OwnerControlItem | null {
  const id = readString(input.record, ['id']);
  if (!id || isClosedRecord(input.record)) return null;

  const nearestAction = getNearestPlannedAction({
    recordType: input.entityType,
    recordId: id,
    relatedCaseIds: input.relatedCaseIds,
    items: input.workItems,
  });
  const nextMove = buildNextMoveContract({
    entityType: input.entityType,
    entityId: id,
    status: readString(input.record, ['status']),
    nearestAction,
    now: input.now,
  });
  const activity = buildActivityTruth({
    entityType: input.entityType,
    entityId: id,
    record: input.record,
    now: input.now,
  });
  const silentDays = activity.contactSilentDays ?? activity.activitySilentDays;
  const silenceSeverity = classifySilence(silentDays, input.settings);
  const valuePln = input.entityType === 'case' ? getCaseFinanceValue(input.record) : getValue(input.record);
  const signals: string[] = [];
  if (nextMove.isMissing) pushSignal(signals, 'Brak następnego kroku');
  if (nextMove.isOverdue) pushSignal(signals, 'Następny krok jest zaległy');
  if (silenceSeverity === 'critical') pushSignal(signals, `${silentDays} dni bez kontaktu lub ruchu`);
  if (silenceSeverity === 'warning') pushSignal(signals, `${silentDays} dni bez kontaktu lub ruchu`);
  if (valuePln >= input.settings.highValueThresholdPln && (nextMove.isMissing || nextMove.isOverdue || silenceSeverity)) {
    pushSignal(signals, 'Wysoka wartość bez bezpiecznego ruchu');
  }

  if (!signals.length && !nextMove.isToday) return null;

  let severity: OwnerControlSeverity = 'normal';
  let priority = 50;
  let statusLabel = 'Dzisiaj';
  let reason = nextMove.reason;
  let suggestedAction = 'Wykonaj zaplanowany ruch.';

  if (nextMove.isMissing || nextMove.isOverdue) {
    severity = 'critical';
    priority = 120;
    statusLabel = nextMove.isMissing ? 'Brak next step' : 'Zaległe';
    reason = nextMove.reason;
    suggestedAction = nextMove.isMissing
      ? 'Ustaw konkretny następny krok albo świadomie zamknij temat.'
      : 'Wykonaj zaległy ruch albo ustaw nowy realny termin.';
  } else if (valuePln >= input.settings.highValueThresholdPln && silenceSeverity) {
    severity = 'critical';
    priority = 110;
    statusLabel = 'Pieniądze bez ruchu';
    reason = `Wartość ${Math.round(valuePln)} PLN wymaga reakcji.`;
    suggestedAction = 'Skontaktuj się i potwierdź kolejny krok.';
  } else if (silenceSeverity === 'critical') {
    severity = 'critical';
    priority = 90;
    statusLabel = `Cisza ${input.settings.criticalDays}+ dni`;
    reason = `${silentDays} dni bez potwierdzonego kontaktu lub świeżego ruchu.`;
    suggestedAction = 'Skontaktuj się dzisiaj albo zamknij nieaktualny temat.';
  } else if (silenceSeverity === 'warning') {
    severity = 'warning';
    priority = 80;
    statusLabel = `Cisza ${input.settings.warningDays}+ dni`;
    reason = `${silentDays} dni bez potwierdzonego kontaktu lub świeżego ruchu.`;
    suggestedAction = 'Sprawdź status i zaplanuj następny kontakt.';
  }

  return {
    key: `${input.entityType}:${id}`,
    entityType: input.entityType,
    entityId: id,
    title: readString(input.record, input.entityType === 'lead' ? ['name', 'company', 'title'] : ['title', 'clientName', 'client_name', 'name'], input.entityType === 'lead' ? 'Lead' : 'Sprawa'),
    href: input.entityType === 'lead' ? `/leads/${encodeURIComponent(id)}` : `/case/${encodeURIComponent(id)}`,
    severity,
    priority,
    reason,
    suggestedAction,
    statusLabel,
    silentDays,
    valuePln,
    nextMoveAt: nextMove.nextMoveAt,
    signals,
  };
}

function buildWorkItem(input: { item: unknown; kind: 'task' | 'event'; now: Date }): OwnerControlItem | null {
  const record = asRecord(input.item);
  if (isOwnerMissingControlItem(record)) return null;
  const normalized = normalizeWorkItem(record);
  if (!normalized.id || !normalized.dateAt || isClosedWorkItemStatus(normalized.status)) return null;
  if (normalized.type === 'note') return null;
  const when = new Date(normalized.dateAt);
  if (!Number.isFinite(when.getTime())) return null;

  const startToday = new Date(input.now);
  startToday.setHours(0, 0, 0, 0);
  const endToday = new Date(startToday);
  endToday.setDate(endToday.getDate() + 1);
  if (when.getTime() >= endToday.getTime()) return null;

  const overdue = when.getTime() < startToday.getTime();
  return {
    key: `${input.kind}:${normalized.id}`,
    entityType: input.kind,
    entityId: normalized.id,
    title: normalized.title || (input.kind === 'task' ? 'Zadanie' : 'Wydarzenie'),
    href: input.kind === 'task' ? `/tasks?id=${encodeURIComponent(normalized.id)}` : '/calendar',
    severity: overdue ? 'critical' : 'normal',
    priority: overdue ? 115 : 50,
    reason: overdue ? 'Termin minął i rekord nadal jest otwarty.' : 'Termin przypada dzisiaj.',
    suggestedAction: input.kind === 'task' ? 'Wykonaj zadanie albo ustaw realny nowy termin.' : 'Obsłuż wydarzenie albo przełóż je świadomie.',
    statusLabel: overdue ? 'Zaległe' : 'Dzisiaj',
    silentDays: null,
    valuePln: 0,
    nextMoveAt: normalized.dateAt,
    signals: [overdue ? 'Zaległy termin' : 'Zaplanowane na dzisiaj'],
  };
}

export function buildOwnerControlBaseline(input: BuildOwnerControlBaselineInput): OwnerControlBaseline {
  const now = input.now || new Date();
  const settings = normalizeOwnerRiskSettings(input.settings || {});
  const leads = (input.leads || []).map(asRecord);
  const cases = (input.cases || []).map(asRecord);
  const tasks = input.tasks || [];
  const events = input.events || [];
  const workItems = [...tasks, ...events];
  const caseIdsByLeadId = new Map<string, string[]>();

  for (const caseRecord of cases) {
    const leadId = readString(caseRecord, ['leadId', 'lead_id']);
    const caseId = readString(caseRecord, ['id']);
    if (!leadId || !caseId) continue;
    caseIdsByLeadId.set(leadId, [...(caseIdsByLeadId.get(leadId) || []), caseId]);
  }

  const candidates: Array<OwnerControlItem | null> = [
    ...buildMissingOwnerControlItems({ tasks, now }),
    ...buildNoteWithoutFollowUpOwnerControlItems({ items: workItems, now }),
    ...leads.map((record) => buildRecordItem({
      entityType: 'lead', record, relatedCaseIds: caseIdsByLeadId.get(readString(record, ['id'])) || [], workItems, settings, now,
    })),
    ...cases.map((record) => buildRecordItem({ entityType: 'case', record, workItems, settings, now })),
    ...tasks.map((item) => buildWorkItem({ item, kind: 'task', now })),
    ...events.map((item) => buildWorkItem({ item, kind: 'event', now })),
  ];

  const deduped = new Map<string, OwnerControlItem>();
  for (const item of candidates) {
    if (!item) continue;
    const current = deduped.get(item.key);
    if (!current || item.priority > current.priority) deduped.set(item.key, item);
  }

  const items = [...deduped.values()].sort((left, right) => {
    if (right.priority !== left.priority) return right.priority - left.priority;
    if ((right.silentDays || 0) !== (left.silentDays || 0)) return (right.silentDays || 0) - (left.silentDays || 0);
    if (right.valuePln !== left.valuePln) return right.valuePln - left.valuePln;
    return left.key.localeCompare(right.key);
  });

  return {
    generatedAt: now.toISOString(),
    settings,
    items,
    counts: {
      critical: items.filter((item) => item.severity === 'critical').length,
      warning: items.filter((item) => item.severity === 'warning').length,
      normal: items.filter((item) => item.severity === 'normal').length,
      missingNextStep: items.filter((item) => item.signals.includes('Brak następnego kroku')).length,
      stale: items.filter((item) => typeof item.silentDays === 'number' && item.silentDays >= settings.warningDays).length,
    },
  };
}
