import { getNearestPlannedAction as getNearestWorkItemAction } from '../work-items/planned-actions';
import { normalizeWorkItem } from '../work-items/normalize';
import { buildRecordOperationalBadges } from '../record-operational-badges';
import { getCaseFinanceSummary } from '../finance/case-finance-source';
import { buildActivityTruth } from './activity-truth';
import { buildContactCadenceGrid } from './contact-cadence-grid';
import { buildLostLeadRescue } from './lost-lead-rescue';

export type SalesFunnelMovementRiskLevel = 'low' | 'medium' | 'high' | 'critical';

export type SalesFunnelMovementCard = {
  id: string;
  entityType: 'lead' | 'case';
  entityId: string;
  title: string;
  subtitle: string;
  href: string;

  stageKey: string;
  stageLabel: string;

  lastContactAt: string | null;
  silenceDays: number | null;

  nextMoveAt: string | null;
  nextMoveTitle: string | null;
  hasNextMove: boolean;

  valueAmount: number;
  valueCurrency: string;

  riskLevel: SalesFunnelMovementRiskLevel;
  riskReasons: string[];
};

export type SalesFunnelMovementColumn = {
  key: string;
  label: string;
  cards: SalesFunnelMovementCard[];
};

export type SalesFunnelMovementView = {
  columns: SalesFunnelMovementColumn[];
  summary: {
    noNextMoveCount: number;
    silence7dCount: number;
    highRiskCount: number;
    totalValueAmount: number;
    currency: string;
  };
};

type AnyRecord = Record<string, unknown>;

type NextMove = {
  at: string | null;
  title: string | null;
};

const STAGE227A_SALES_FUNNEL_MOVEMENT_SOURCE = 'Stage227A funnel reuses activity truth, cadence grid, lost lead rescue, work-items and case finance source helpers';
void STAGE227A_SALES_FUNNEL_MOVEMENT_SOURCE;

const DAY_MS = 86_400_000;

const FUNNEL_COLUMNS = [
  { key: 'new', label: 'Nowe' },
  { key: 'contact', label: 'Kontakt' },
  { key: 'qualification', label: 'Kwalifikacja' },
  { key: 'proposal_sent', label: 'Oferta wysłana' },
  { key: 'waiting_response', label: 'Czeka na odpowiedź' },
  { key: 'negotiation', label: 'Negocjacje' },
  { key: 'service', label: 'Do obsługi' },
  { key: 'lost', label: 'Utracone' },
  { key: 'other', label: 'Inne' },
] as const;

const COLUMN_LABELS = new Map(FUNNEL_COLUMNS.map((column) => [column.key, column.label]));
const RISK_RANK: Record<SalesFunnelMovementRiskLevel, number> = {
  low: 0,
  medium: 1,
  high: 2,
  critical: 3,
};

function asRecord(value: unknown): AnyRecord {
  return value && typeof value === 'object' ? value as AnyRecord : {};
}

function readString(record: AnyRecord, keys: string[]) {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'string' && value.trim()) return value.trim();
    if (typeof value === 'number' && Number.isFinite(value)) return String(value);
    if (value instanceof Date) return value.toISOString();
  }
  return '';
}

function readNumber(record: AnyRecord, keys: string[]) {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'number' && Number.isFinite(value)) return Math.max(0, Math.round(value * 100) / 100);
    if (typeof value === 'string' && value.trim()) {
      const parsed = Number(value.replace(/\s+/g, '').replace(',', '.').replace(/[^0-9.-]/g, ''));
      if (Number.isFinite(parsed)) return Math.max(0, Math.round(parsed * 100) / 100);
    }
  }
  return 0;
}

function parseDate(value: string | null | undefined) {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isFinite(parsed.getTime()) ? parsed : null;
}

function daysSince(iso: string | null, now: Date) {
  const parsed = parseDate(iso || '');
  if (!parsed) return null;
  return Math.max(0, Math.floor((now.getTime() - parsed.getTime()) / DAY_MS));
}

function getId(record: AnyRecord, keys = ['id', 'leadId', 'lead_id', 'caseId', 'case_id']) {
  return readString(record, keys);
}

function normalizeStatus(value: unknown) {
  return String(value || '').trim().toLowerCase();
}

function getLeadTitle(record: AnyRecord) {
  return readString(record, ['name', 'title', 'company', 'email', 'phone']) || 'Lead bez nazwy';
}

function getCaseTitle(record: AnyRecord) {
  return readString(record, ['title', 'name', 'caseTitle', 'case_title', 'clientName', 'client_name']) || 'Sprawa bez nazwy';
}

function getSubtitle(record: AnyRecord, fallback = '') {
  return [
    readString(record, ['company', 'clientCompany', 'client_company']),
    readString(record, ['clientName', 'client_name', 'email']),
    readString(record, ['phone', 'clientPhone', 'client_phone']),
  ].filter(Boolean).slice(0, 3).join(' · ') || fallback;
}

function normalizeFunnelStage(status: unknown, entityType: 'lead' | 'case') {
  const value = normalizeStatus(status);
  if (!value) return 'other';

  if (['new', 'open', 'incoming', 'inbox', 'todo'].includes(value)) return 'new';
  if (['contacted', 'contact', 'called', 'skontaktowany'].includes(value)) return 'contact';
  if (['qualification', 'qualified', 'kwalifikacja'].includes(value)) return 'qualification';
  if (['proposal_sent', 'offer_sent', 'proposal', 'offered', 'oferta'].includes(value)) return 'proposal_sent';
  if (['waiting_response', 'waiting_on_client', 'awaiting_reply', 'blocked', 'pending'].includes(value)) return 'waiting_response';
  if (['negotiation', 'negotiations', 'negocjacje'].includes(value)) return 'negotiation';
  if (['accepted', 'won', 'moved_to_service', 'in_progress', 'active', 'ready_to_start', 'to_approve'].includes(value)) return 'service';
  if (['lost', 'closed_lost', 'rejected', 'archived', 'dead'].includes(value)) return 'lost';
  if (entityType === 'case' && ['completed', 'done', 'closed'].includes(value)) return 'service';
  return 'other';
}

function getLeadValue(record: AnyRecord) {
  return readNumber(record, [
    'commissionAmount',
    'commission_amount',
    'expectedRevenue',
    'expected_revenue',
    'dealValue',
    'deal_value',
    'estimatedValue',
    'estimated_value',
    'value',
  ]);
}

function getCurrency(record: AnyRecord, fallback = 'PLN') {
  const value = readString(record, ['currency', 'valueCurrency', 'value_currency', 'caseCurrency', 'case_currency']).toUpperCase();
  return /^[A-Z]{3}$/.test(value) ? value : fallback;
}

function sanitizeTruthRecord(record: unknown) {
  const row = { ...asRecord(record) };
  delete row.updatedAt;
  delete row.updated_at;
  delete row.createdAt;
  delete row.created_at;
  delete row.modifiedAt;
  delete row.modified_at;
  return row;
}

function makeWorkItems(tasks: unknown[], events: unknown[]) {
  return [
    ...(Array.isArray(tasks) ? tasks : []).map((task) => ({ ...asRecord(task), record_type: 'task' })),
    ...(Array.isArray(events) ? events : []).map((event) => ({ ...asRecord(event), record_type: 'event', type: readString(asRecord(event), ['type']) || 'event' })),
  ].map((item) => normalizeWorkItem(item));
}

function buildCasesByLead(cases: unknown[]) {
  const map = new Map<string, string[]>();
  for (const caseItem of Array.isArray(cases) ? cases : []) {
    const row = asRecord(caseItem);
    const caseId = getId(row, ['id', 'caseId', 'case_id']);
    const leadId = readString(row, ['leadId', 'lead_id']);
    if (!caseId || !leadId) continue;
    const existing = map.get(leadId) || [];
    existing.push(caseId);
    map.set(leadId, existing);
  }
  return map;
}

function buildRelatedMapById(input: {
  entityType: 'lead' | 'case';
  records: unknown[];
  tasks: unknown[];
  events: unknown[];
  payments: unknown[];
  casesByLeadId?: Map<string, string[]>;
}) {
  const map = new Map<string, unknown[]>();
  const taskRows = Array.isArray(input.tasks) ? input.tasks : [];
  const eventRows = Array.isArray(input.events) ? input.events : [];
  const paymentRows = Array.isArray(input.payments) ? input.payments : [];

  for (const item of Array.isArray(input.records) ? input.records : []) {
    const record = asRecord(item);
    const id = getId(record);
    if (!id) continue;
    const relatedCaseIds = new Set(input.casesByLeadId?.get(id) || []);
    const related = [
      ...taskRows.filter((task) => isRelatedToEntity(task, input.entityType, id, relatedCaseIds)),
      ...eventRows.filter((event) => isRelatedToEntity(event, input.entityType, id, relatedCaseIds)),
      ...paymentRows.filter((payment) => isRelatedToEntity(payment, input.entityType, id, relatedCaseIds)),
    ].map(sanitizeTruthRecord);
    map.set(id, related);
  }

  return map;
}

function isRelatedToEntity(item: unknown, entityType: 'lead' | 'case', entityId: string, relatedCaseIds = new Set<string>()) {
  const row = asRecord(item);
  const leadId = readString(row, ['leadId', 'lead_id']);
  const caseId = readString(row, ['caseId', 'case_id', 'relatedCaseId', 'related_case_id']);
  if (entityType === 'lead') return leadId === entityId || Boolean(caseId && relatedCaseIds.has(caseId));
  return caseId === entityId;
}

function getDirectNextMove(record: AnyRecord): NextMove {
  const at = readString(record, ['nextActionAt', 'next_action_at', 'nextMoveAt', 'next_move_at', 'nextFollowUpAt', 'next_follow_up_at']);
  if (!parseDate(at)) return { at: null, title: null };
  return {
    at: parseDate(at)?.toISOString() || at,
    title: readString(record, ['nextActionTitle', 'next_action_title', 'nextMoveTitle', 'next_move_title']) || 'Zaplanowany ruch',
  };
}

function getNextMove(input: {
  record: AnyRecord;
  entityType: 'lead' | 'case';
  entityId: string;
  workItems: unknown[];
  relatedCaseIds?: string[];
}) {
  const direct = getDirectNextMove(input.record);
  if (direct.at) return direct;

  const nearest = getNearestWorkItemAction({
    recordType: input.entityType,
    recordId: input.entityId,
    items: input.workItems,
    relatedCaseIds: input.relatedCaseIds,
  });

  return nearest?.when
    ? { at: nearest.when, title: nearest.title || 'Zaplanowany ruch' }
    : { at: null, title: null };
}

function unique(items: string[]) {
  return Array.from(new Set(items.map((item) => item.trim()).filter(Boolean)));
}

function buildBadgeReasons(input: {
  entityType: 'lead' | 'case';
  record: AnyRecord;
  relatedRecords: unknown[];
  hasNextMove: boolean;
  now: Date;
}) {
  try {
    return buildRecordOperationalBadges({
      entityType: input.entityType,
      record: input.record,
      relatedRecords: input.relatedRecords,
      hasNextStep: input.hasNextMove,
      now: input.now,
    } as any).map((badge: any) => String(badge?.label || '')).filter(Boolean);
  } catch {
    return [];
  }
}

function resolveRisk(input: {
  entityType: 'lead' | 'case';
  status: string;
  silenceDays: number | null;
  lastContactAt: string | null;
  hasNextMove: boolean;
  valueAmount: number;
  rescueReason?: string | null;
  badgeReasons?: string[];
}) {
  const reasons: string[] = [];
  const silenceDays = input.silenceDays;
  const waitingLike = ['waiting_response', 'proposal_sent', 'qualification', 'negotiation', 'waiting_on_client', 'blocked'].includes(input.status);

  if (!input.lastContactAt) reasons.push('brak pewnej daty ostatniego kontaktu');
  if (!input.hasNextMove) reasons.push('brak następnego kroku');
  if (typeof silenceDays === 'number' && silenceDays >= 14) reasons.push('cisza 14+ dni');
  else if (typeof silenceDays === 'number' && silenceDays >= 7) reasons.push('cisza 7+ dni');
  if (input.valueAmount > 0 && !input.hasNextMove) reasons.push('pieniądze bez kolejnego kroku');
  if (input.rescueReason) reasons.push(input.rescueReason);
  for (const reason of input.badgeReasons || []) reasons.push(reason);

  let riskLevel: SalesFunnelMovementRiskLevel = 'low';
  if ((typeof silenceDays === 'number' && silenceDays >= 14 && !input.hasNextMove) || (input.valueAmount > 0 && !input.hasNextMove && waitingLike)) {
    riskLevel = 'critical';
  } else if ((typeof silenceDays === 'number' && silenceDays >= 14) || (typeof silenceDays === 'number' && silenceDays >= 7 && !input.hasNextMove) || (waitingLike && !input.hasNextMove)) {
    riskLevel = 'high';
  } else if (!input.lastContactAt || !input.hasNextMove || (typeof silenceDays === 'number' && silenceDays >= 7)) {
    riskLevel = 'medium';
  }

  return { riskLevel, riskReasons: unique(reasons) };
}

function sortCards(cards: SalesFunnelMovementCard[]) {
  return cards.slice().sort((left, right) => {
    const riskDiff = RISK_RANK[right.riskLevel] - RISK_RANK[left.riskLevel];
    if (riskDiff) return riskDiff;
    if (left.hasNextMove !== right.hasNextMove) return left.hasNextMove ? 1 : -1;
    const silenceDiff = (right.silenceDays ?? -1) - (left.silenceDays ?? -1);
    if (silenceDiff) return silenceDiff;
    return right.valueAmount - left.valueAmount;
  });
}

function getCasePayments(caseRecord: AnyRecord, payments: unknown[]) {
  const caseId = getId(caseRecord, ['id', 'caseId', 'case_id']);
  const clientId = readString(caseRecord, ['clientId', 'client_id']);
  return (Array.isArray(payments) ? payments : []).filter((payment) => {
    const row = asRecord(payment);
    const paymentCaseId = readString(row, ['caseId', 'case_id', 'relatedCaseId', 'related_case_id']);
    if (paymentCaseId) return paymentCaseId === caseId;
    const paymentClientId = readString(row, ['clientId', 'client_id', 'relatedClientId', 'related_client_id']);
    return Boolean(clientId && paymentClientId && paymentClientId === clientId);
  });
}

function clientNameById(clients: unknown[]) {
  const map = new Map<string, string>();
  for (const client of Array.isArray(clients) ? clients : []) {
    const row = asRecord(client);
    const id = getId(row, ['id', 'clientId', 'client_id']);
    const name = readString(row, ['name', 'company', 'email']);
    if (id && name) map.set(id, name);
  }
  return map;
}

export function buildSalesFunnelMovementView(input: {
  leads: any[];
  cases: any[];
  clients: any[];
  tasks: any[];
  events: any[];
  payments?: any[];
  now?: Date;
}): SalesFunnelMovementView {
  const now = input.now || new Date();
  const leads = Array.isArray(input.leads) ? input.leads : [];
  const cases = Array.isArray(input.cases) ? input.cases : [];
  const clients = Array.isArray(input.clients) ? input.clients : [];
  const tasks = Array.isArray(input.tasks) ? input.tasks : [];
  const events = Array.isArray(input.events) ? input.events : [];
  const payments = Array.isArray(input.payments) ? input.payments : [];
  const workItems = makeWorkItems(tasks, events);
  const casesByLeadId = buildCasesByLead(cases);
  const relatedByLeadId = buildRelatedMapById({ entityType: 'lead', records: leads, tasks, events, payments, casesByLeadId });
  const relatedByCaseId = buildRelatedMapById({ entityType: 'case', records: cases, tasks, events, payments });
  const cadenceGrid = buildContactCadenceGrid({ entityType: 'lead', records: leads, relatedRecordsById: relatedByLeadId, now });
  const cadenceRowsByLeadId = new Map(
    Object.values(cadenceGrid.buckets).flat().map((row) => [row.entityId, row]),
  );
  const rescue = buildLostLeadRescue({ leads, relatedRecordsById: relatedByLeadId, now });
  const rescueByLeadId = new Map(rescue.rows.map((row) => [row.leadId, row]));
  const clientNames = clientNameById(clients);
  const cards: SalesFunnelMovementCard[] = [];

  for (const lead of leads) {
    const record = asRecord(lead);
    const leadId = getId(record, ['id', 'leadId', 'lead_id']);
    if (!leadId) continue;
    if (normalizeStatus(record.leadVisibility || record.visibility) === 'archived') continue;

    const stageKey = normalizeFunnelStage(record.status || record.salesStatus || record.sales_status, 'lead');
    const cadenceRow = cadenceRowsByLeadId.get(leadId);
    const relatedRecords = relatedByLeadId.get(leadId) || [];
    const nextMove = getNextMove({
      record,
      entityType: 'lead',
      entityId: leadId,
      workItems,
      relatedCaseIds: casesByLeadId.get(leadId) || [],
    });
    const hasNextMove = Boolean(nextMove.at);
    const valueAmount = getLeadValue(record);
    const rescueRow = rescueByLeadId.get(leadId);
    const status = normalizeStatus(record.status || record.salesStatus || record.sales_status);
    const risk = resolveRisk({
      entityType: 'lead',
      status,
      silenceDays: cadenceRow?.contactSilentDays ?? null,
      lastContactAt: cadenceRow?.lastContactAt ?? null,
      hasNextMove,
      valueAmount,
      rescueReason: rescueRow?.reasonLabel || rescueRow?.reasonDetail || null,
      badgeReasons: buildBadgeReasons({ entityType: 'lead', record, relatedRecords, hasNextMove, now }),
    });

    cards.push({
      id: 'lead:' + leadId,
      entityType: 'lead',
      entityId: leadId,
      title: getLeadTitle(record),
      subtitle: getSubtitle(record),
      href: '/leads/' + encodeURIComponent(leadId),
      stageKey,
      stageLabel: COLUMN_LABELS.get(stageKey) || 'Inne',
      lastContactAt: cadenceRow?.lastContactAt ?? null,
      silenceDays: cadenceRow?.contactSilentDays ?? null,
      nextMoveAt: nextMove.at,
      nextMoveTitle: nextMove.title,
      hasNextMove,
      valueAmount,
      valueCurrency: getCurrency(record),
      riskLevel: risk.riskLevel,
      riskReasons: risk.riskReasons,
    });
  }

  for (const caseItem of cases) {
    const record = asRecord(caseItem);
    const caseId = getId(record, ['id', 'caseId', 'case_id']);
    if (!caseId) continue;
    if (normalizeStatus(record.status) === 'archived') continue;

    const stageKey = normalizeFunnelStage(record.status, 'case');
    const relatedRecords = relatedByCaseId.get(caseId) || [];
    const truth = buildActivityTruth({
      entityType: 'case',
      entityId: caseId,
      record: {},
      tasks: relatedRecords,
      events: relatedRecords,
      payments: relatedRecords,
      now,
    });
    const nextMove = getNextMove({
      record,
      entityType: 'case',
      entityId: caseId,
      workItems,
    });
    const hasNextMove = Boolean(nextMove.at);
    const casePayments = getCasePayments(record, payments);
    const finance = getCaseFinanceSummary(record, casePayments);
    const valueAmount = Math.max(0, finance.commissionAmount || 0);
    const status = normalizeStatus(record.status);
    const fallbackSubtitle = clientNames.get(readString(record, ['clientId', 'client_id'])) || '';
    const risk = resolveRisk({
      entityType: 'case',
      status,
      silenceDays: daysSince(truth.lastContactAt, now),
      lastContactAt: truth.lastContactAt,
      hasNextMove,
      valueAmount,
      badgeReasons: buildBadgeReasons({ entityType: 'case', record, relatedRecords, hasNextMove, now }),
    });

    cards.push({
      id: 'case:' + caseId,
      entityType: 'case',
      entityId: caseId,
      title: getCaseTitle(record),
      subtitle: getSubtitle(record, fallbackSubtitle),
      href: '/cases/' + encodeURIComponent(caseId),
      stageKey,
      stageLabel: COLUMN_LABELS.get(stageKey) || 'Inne',
      lastContactAt: truth.lastContactAt,
      silenceDays: daysSince(truth.lastContactAt, now),
      nextMoveAt: nextMove.at,
      nextMoveTitle: nextMove.title,
      hasNextMove,
      valueAmount,
      valueCurrency: finance.currency || 'PLN',
      riskLevel: risk.riskLevel,
      riskReasons: risk.riskReasons,
    });
  }

  const columns = FUNNEL_COLUMNS.map((column) => ({
    key: column.key,
    label: column.label,
    cards: sortCards(cards.filter((card) => card.stageKey === column.key)),
  }));
  const allCards = columns.flatMap((column) => column.cards);
  const firstCurrency = allCards.find((card) => card.valueAmount > 0)?.valueCurrency || 'PLN';

  return {
    columns,
    summary: {
      noNextMoveCount: allCards.filter((card) => !card.hasNextMove).length,
      silence7dCount: allCards.filter((card) => typeof card.silenceDays === 'number' && card.silenceDays >= 7).length,
      highRiskCount: allCards.filter((card) => card.riskLevel === 'high' || card.riskLevel === 'critical').length,
      totalValueAmount: Math.round(allCards.reduce((sum, card) => sum + card.valueAmount, 0) * 100) / 100,
      currency: firstCurrency,
    },
  };
}
