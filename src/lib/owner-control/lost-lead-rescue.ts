import { buildContactCadenceGrid } from './contact-cadence-grid';
import { buildRecordOperationalBadges } from '../record-operational-badges';

export type LostLeadRescueReasonKey =
  | 'silent_14_plus'
  | 'silent_7_plus_no_next_move'
  | 'high_value_no_next_move'
  | 'high_value_silent'
  | 'missing_contact_date'
  | 'missing_next_move'
  | 'waiting_too_long';

export type LostLeadRescueSeverity = 'medium' | 'high' | 'critical';

export type LostLeadRescueRow = {
  id: string;
  leadId: string;
  title: string;
  subtitle: string;
  href: string;

  severity: LostLeadRescueSeverity;
  reasonKey: LostLeadRescueReasonKey;
  reasonLabel: string;
  reasonDetail: string;

  lastContactAt: string | null;
  contactSilentDays: number | null;

  nextMoveAt: string | null;
  nextMoveTitle: string | null;
  hasNextMove: boolean;

  valueAmount: number | null;
  valueCurrency: string | null;

  badges: string[];
};

export type LostLeadRescueSummary = {
  generatedAt: string;
  total: number;
  critical: number;
  high: number;
  medium: number;
  rows: LostLeadRescueRow[];
};

type NextMove = {
  at: string | null;
  title: string | null;
};

const STAGE226_LOST_LEAD_RESCUE_SOURCE = 'Lost Lead Rescue uses Contact Cadence Grid and record operational badges as source of truth';
const HIGH_VALUE_THRESHOLD = 5000;
void STAGE226_LOST_LEAD_RESCUE_SOURCE;

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' ? value as Record<string, unknown> : {};
}

function readString(record: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'string' && value.trim()) return value.trim();
    if (typeof value === 'number' && Number.isFinite(value)) return String(value);
    if (value instanceof Date) return value.toISOString();
  }
  return '';
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

function parseDate(value: string | null) {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isFinite(parsed.getTime()) ? parsed : null;
}

function getLeadId(record: Record<string, unknown>) {
  return readString(record, ['id', 'leadId', 'lead_id']);
}

function getLeadTitle(record: Record<string, unknown>) {
  return readString(record, ['name', 'title', 'company', 'email', 'phone']) || 'Lead bez nazwy';
}

function getLeadSubtitle(record: Record<string, unknown>) {
  return [
    readString(record, ['company']),
    readString(record, ['email']),
    readString(record, ['phone']),
  ].filter(Boolean).slice(0, 3).join(' - ');
}

function getValueAmount(record: Record<string, unknown>) {
  const value = readNumber(record, [
    'contractValue',
    'contract_value',
    'expectedRevenue',
    'expected_revenue',
    'caseValue',
    'case_value',
    'dealValue',
    'deal_value',
    'estimatedValue',
    'estimated_value',
    'value',
    'amount',
    'budget',
    'price',
    'total',
    'commission',
    'commissionAmount',
    'commission_amount',
  ]);
  return value > 0 ? value : null;
}

function getValueCurrency(record: Record<string, unknown>, valueAmount: number | null) {
  const currency = readString(record, ['currency', 'valueCurrency', 'value_currency', 'caseCurrency', 'case_currency']).toUpperCase();
  if (/^[A-Z]{3}$/.test(currency)) return currency;
  return valueAmount ? 'PLN' : null;
}

function isOpenRelatedRecord(record: Record<string, unknown>) {
  const status = readString(record, ['status', 'state']).toLowerCase();
  return !['done', 'completed', 'cancelled', 'canceled', 'archived'].includes(status);
}

function getNextMove(record: Record<string, unknown>, relatedRecords: unknown[]): NextMove {
  const directAt = readString(record, ['nextActionAt', 'next_action_at', 'nextMoveAt', 'next_move_at', 'nextFollowUpAt', 'next_follow_up_at']);
  if (directAt) {
    return {
      at: parseDate(directAt)?.toISOString() || directAt,
      title: readString(record, ['nextActionTitle', 'next_action_title', 'nextMoveTitle', 'next_move_title']) || 'Zaplanowany ruch',
    };
  }

  const candidates = relatedRecords
    .map((item) => asRecord(item))
    .filter(isOpenRelatedRecord)
    .map((item) => {
      const rawAt = readString(item, ['dueAt', 'due_at', 'scheduledAt', 'scheduled_at', 'startAt', 'start_at', 'dateAt', 'date_at', 'date']);
      const parsed = parseDate(rawAt);
      if (!parsed) return null;
      return {
        at: parsed.toISOString(),
        title: readString(item, ['title', 'name', 'summary', 'description']) || 'Zaplanowany ruch',
      };
    })
    .filter(Boolean) as { at: string; title: string }[];

  const nearest = candidates.sort((left, right) => {
    return (parseDate(left.at)?.getTime() || 0) - (parseDate(right.at)?.getTime() || 0);
  })[0];

  return nearest ? { at: nearest.at, title: nearest.title } : { at: null, title: null };
}

function resolveReason(input: {
  contactSilentDays: number | null;
  hasContactDate: boolean;
  hasNextMove: boolean;
  valueAmount: number | null;
  status: string;
}): { severity: LostLeadRescueSeverity; reasonKey: LostLeadRescueReasonKey; reasonLabel: string; reasonDetail: string } | null {
  const days = input.contactSilentDays;
  const highValue = (input.valueAmount || 0) >= HIGH_VALUE_THRESHOLD;
  const waitingStatus = ['waiting_response', 'proposal_sent', 'qualification', 'negotiation'].includes(input.status);

  if (typeof days === 'number' && days >= 14 && !input.hasNextMove) {
    return {
      severity: 'critical',
      reasonKey: 'silent_14_plus',
      reasonLabel: 'Cisza 14+ dni i brak następnego ruchu',
      reasonDetail: 'Lead ma co najmniej 14 dni ciszy i nie ma zaplanowanej kolejnej akcji.',
    };
  }

  if (highValue && typeof days === 'number' && days >= 14) {
    return {
      severity: 'critical',
      reasonKey: 'high_value_silent',
      reasonLabel: 'Wysoka wartość i cisza 14+ dni',
      reasonDetail: 'Lead ma wysoką wartość i dawno nie było realnego kontaktu.',
    };
  }

  if (!input.hasContactDate) {
    return {
      severity: 'medium',
      reasonKey: 'missing_contact_date',
      reasonLabel: 'Brak daty kontaktu',
      reasonDetail: 'Brakuje pewnej daty ostatniego kontaktu. To wymaga uzupełnienia, ale nie udaje ciszy 14+ dni.',
    };
  }

  if (highValue && !input.hasNextMove) {
    return {
      severity: 'critical',
      reasonKey: 'high_value_no_next_move',
      reasonLabel: 'Wysoka wartość bez następnego ruchu',
      reasonDetail: 'Lead ma wysoką wartość, ale nie ma zaplanowanej kolejnej akcji.',
    };
  }

  if (typeof days === 'number' && days >= 14) {
    return {
      severity: 'high',
      reasonKey: 'silent_14_plus',
      reasonLabel: 'Cisza 14+ dni',
      reasonDetail: 'Lead ma co najmniej 14 dni ciszy od ostatniego kontaktu.',
    };
  }

  if (typeof days === 'number' && days >= 7 && !input.hasNextMove) {
    return {
      severity: 'high',
      reasonKey: 'silent_7_plus_no_next_move',
      reasonLabel: 'Cisza 7+ dni i brak następnego ruchu',
      reasonDetail: 'Lead ma 7+ dni ciszy i nie ma zaplanowanej kolejnej akcji.',
    };
  }

  if (waitingStatus && !input.hasNextMove) {
    return {
      severity: 'high',
      reasonKey: 'waiting_too_long',
      reasonLabel: 'Lead czeka bez następnego ruchu',
      reasonDetail: 'Status sugeruje oczekiwanie albo ofertę, ale brak zaplanowanej kolejnej akcji.',
    };
  }

  if (!input.hasNextMove && typeof days === 'number' && days > 0) {
    return {
      severity: 'medium',
      reasonKey: 'missing_next_move',
      reasonLabel: 'Brak następnej akcji',
      reasonDetail: 'Lead nie jest świeżo dodany dzisiaj i nie ma zaplanowanego kolejnego ruchu.',
    };
  }

  return null;
}

function severityRank(value: LostLeadRescueSeverity) {
  if (value === 'critical') return 3;
  if (value === 'high') return 2;
  return 1;
}

function buildBadgeLabels(record: Record<string, unknown>, relatedRecords: unknown[], hasNextMove: boolean, now: Date) {
  return buildRecordOperationalBadges({
    entityType: 'lead',
    record,
    relatedRecords,
    hasNextStep: hasNextMove,
    now,
  }).map((badge) => badge.label);
}

export function buildLostLeadRescue(input: {
  leads: unknown[];
  relatedRecordsById?: Map<string, unknown[]>;
  now?: Date;
}): LostLeadRescueSummary {
  const now = input.now || new Date();
  const leads = Array.isArray(input.leads) ? input.leads : [];
  const relatedRecordsById = input.relatedRecordsById || new Map<string, unknown[]>();
  const generatedAt = now.toISOString();
  const sourceGrid = buildContactCadenceGrid({
    entityType: 'lead',
    records: leads,
    relatedRecordsById,
    now,
  });
  const cadenceRowsByLeadId = new Map(
    Object.values(sourceGrid.buckets).flat().map((row) => [row.entityId, row]),
  );

  const rows: LostLeadRescueRow[] = [];

  for (const item of leads) {
    const record = asRecord(item);
    const leadId = getLeadId(record);
    if (!leadId) continue;

    const cadenceRow = cadenceRowsByLeadId.get(leadId);
    if (!cadenceRow) continue;

    const relatedRecords = relatedRecordsById.get(leadId) || [];
    const nextMove = getNextMove(record, relatedRecords);
    const hasNextMove = Boolean(nextMove.at);
    const valueAmount = getValueAmount(record);
    const valueCurrency = getValueCurrency(record, valueAmount);
    const status = readString(record, ['status', 'salesStatus', 'sales_status']).toLowerCase();
    const reason = resolveReason({
      contactSilentDays: cadenceRow.contactSilentDays,
      hasContactDate: Boolean(cadenceRow.lastContactAt),
      hasNextMove,
      valueAmount,
      status,
    });

    if (!reason) continue;

    rows.push({
      id: 'lead-rescue:' + leadId,
      leadId,
      title: getLeadTitle(record),
      subtitle: getLeadSubtitle(record),
      href: '/leads/' + encodeURIComponent(leadId),
      severity: reason.severity,
      reasonKey: reason.reasonKey,
      reasonLabel: reason.reasonLabel,
      reasonDetail: reason.reasonDetail,
      lastContactAt: cadenceRow.lastContactAt,
      contactSilentDays: cadenceRow.contactSilentDays,
      nextMoveAt: nextMove.at,
      nextMoveTitle: nextMove.title,
      hasNextMove,
      valueAmount,
      valueCurrency,
      badges: Array.from(new Set([...cadenceRow.badges, ...buildBadgeLabels(record, relatedRecords, hasNextMove, now)])),
    });
  }

  const sortedRows = rows.sort((left, right) => {
    const severityDiff = severityRank(right.severity) - severityRank(left.severity);
    if (severityDiff) return severityDiff;
    const leftDays = typeof left.contactSilentDays === 'number' ? left.contactSilentDays : -1;
    const rightDays = typeof right.contactSilentDays === 'number' ? right.contactSilentDays : -1;
    if (rightDays !== leftDays) return rightDays - leftDays;
    return (right.valueAmount || 0) - (left.valueAmount || 0);
  });

  return {
    generatedAt,
    total: sortedRows.length,
    critical: sortedRows.filter((row) => row.severity === 'critical').length,
    high: sortedRows.filter((row) => row.severity === 'high').length,
    medium: sortedRows.filter((row) => row.severity === 'medium').length,
    rows: sortedRows,
  };
}
