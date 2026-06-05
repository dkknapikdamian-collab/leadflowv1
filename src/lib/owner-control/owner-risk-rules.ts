import { buildActivityTruth, type ActivityTruth } from './activity-truth';
import { buildNextMoveContract, type NextMoveContract } from './next-move-contract';

export const DEFAULT_HIGH_VALUE_THRESHOLD_PLN = 5000;

export const SALES_SILENCE_THRESHOLDS_DAYS = [1, 2, 3, 5, 7, 14] as const;

export type OwnerRiskSeverity = 'low' | 'medium' | 'high';

export type OwnerRiskBadge = {
  key: string;
  label: string;
  severity: OwnerRiskSeverity;
  reason: string;
};

export type OwnerRiskSettings = {
  highValueThresholdPln: number;
};

export type OwnerRiskContext = {
  settings?: Partial<OwnerRiskSettings> | null;
  now?: Date;
  relatedRecords?: unknown[];
  hasNextStep?: boolean;
  nextMove?: NextMoveContract | null;
  activityTruth?: ActivityTruth | null;
};

const STAGE222_OWNER_RISK_RULES_FOUNDATION = 'one source of truth for owner risk rules, badges and high value threshold';
const STAGE223_OWNER_MOVEMENT_RISK_SYSTEM = 'owner risk rules use next-move-contract and activity-truth';
void STAGE222_OWNER_RISK_RULES_FOUNDATION;
void STAGE223_OWNER_MOVEMENT_RISK_SYSTEM;

export function normalizeOwnerRiskSettings(input: unknown): OwnerRiskSettings {
  const raw = input && typeof input === 'object' ? input as Record<string, unknown> : {};
  const candidate = raw.highValueThresholdPln ?? raw.high_value_threshold_pln ?? raw.highValueThreshold ?? raw.high_value_threshold;
  const parsed = typeof candidate === 'number'
    ? candidate
    : typeof candidate === 'string'
      ? Number(candidate.replace(/\s+/g, '').replace(',', '.').replace(/[^0-9.-]/g, ''))
      : DEFAULT_HIGH_VALUE_THRESHOLD_PLN;

  return {
    highValueThresholdPln: Number.isFinite(parsed) && parsed >= 0 ? Math.round(parsed) : DEFAULT_HIGH_VALUE_THRESHOLD_PLN,
  };
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' ? value as Record<string, unknown> : {};
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

function readString(record: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'string' && value.trim()) return value.trim();
    if (typeof value === 'number' && Number.isFinite(value)) return String(value);
  }
  return '';
}

function getValue(record: Record<string, unknown>) {
  return readNumber(record, [
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
}

function getContextSettings(context: OwnerRiskContext) {
  return normalizeOwnerRiskSettings(context.settings || {});
}

function dedupeBadges(badges: OwnerRiskBadge[]) {
  const seen = new Set<string>();
  return badges.filter((badge) => {
    if (seen.has(badge.key)) return false;
    seen.add(badge.key);
    return true;
  });
}

function resolveNextMove(entityType: 'lead' | 'case' | 'client', record: Record<string, unknown>, context: OwnerRiskContext) {
  if (context.nextMove) return context.nextMove;
  return buildNextMoveContract({
    entityType,
    entityId: readString(record, ['id']),
    status: readString(record, ['status']),
    nearestAction: context.hasNextStep === false ? null : undefined,
    now: context.now,
  });
}

function resolveActivityTruth(entityType: 'lead' | 'case' | 'client', record: Record<string, unknown>, context: OwnerRiskContext) {
  if (context.activityTruth) return context.activityTruth;
  return buildActivityTruth({
    entityType,
    entityId: readString(record, ['id']),
    record,
    activities: [],
    tasks: context.relatedRecords || [],
    events: context.relatedRecords || [],
    payments: context.relatedRecords || [],
    now: context.now,
  });
}

function buildSilenceBadge(entityType: 'lead' | 'case', truth: ActivityTruth): OwnerRiskBadge | null {
  if (typeof truth.contactSilentDays === 'number') {
    if (truth.contactSilentDays >= 14) {
      return {
        key: entityType + '-contact-silence-14',
        label: entityType === 'lead' ? 'Cisza 14+ dni' : 'Sprawa bez kontaktu 14+ dni',
        severity: 'high',
        reason: 'Brak prawdziwego kontaktu od co najmniej 14 dni.',
      };
    }
    if (truth.contactSilentDays >= 7) {
      return {
        key: entityType + '-contact-silence-7',
        label: entityType === 'lead' ? 'Cisza 7+ dni' : 'Sprawa bez kontaktu 7+ dni',
        severity: 'medium',
        reason: 'Brak prawdziwego kontaktu od co najmniej 7 dni.',
      };
    }
    return null;
  }

  if (typeof truth.activitySilentDays === 'number') {
    if (truth.activitySilentDays >= 14) {
      return {
        key: entityType + '-activity-silence-14',
        label: entityType === 'lead' ? 'Brak świeżego ruchu 14+ dni' : 'Sprawa bez ruchu 14+ dni',
        severity: 'high',
        reason: 'Nie znaleziono kontaktu; fallback pokazuje brak świeżej aktywności od co najmniej 14 dni.',
      };
    }
    if (truth.activitySilentDays >= 7) {
      return {
        key: entityType + '-activity-silence-7',
        label: entityType === 'lead' ? 'Brak świeżego ruchu 7+ dni' : 'Sprawa bez ruchu 7+ dni',
        severity: 'medium',
        reason: 'Nie znaleziono kontaktu; fallback pokazuje brak świeżej aktywności od co najmniej 7 dni.',
      };
    }
  }

  return null;
}

export function getLeadOwnerRiskBadges(lead: unknown, context: OwnerRiskContext = {}): OwnerRiskBadge[] {
  const record = asRecord(lead);
  const settings = getContextSettings(context);
  const value = getValue(record);
  const nextMove = resolveNextMove('lead', record, context);
  const activityTruth = resolveActivityTruth('lead', record, context);

  const badges: OwnerRiskBadge[] = [];

  if (value >= settings.highValueThresholdPln) {
    badges.push({
      key: 'lead-high-value',
      label: 'Wysoka wartość',
      severity: 'medium',
      reason: 'Lead przekracza próg wysokiej wartości: ' + settings.highValueThresholdPln + ' PLN.',
    });
  }

  if (nextMove.isMissing) {
    badges.push({
      key: 'lead-missing-next-action',
      label: 'Brak następnej akcji',
      severity: value >= settings.highValueThresholdPln ? 'high' : 'medium',
      reason: nextMove.reason,
    });
  }

  if (nextMove.isOverdue) {
    badges.push({
      key: 'lead-overdue-next-action',
      label: 'Następna akcja zaległa',
      severity: 'high',
      reason: nextMove.reason,
    });
  }

  const silence = buildSilenceBadge('lead', activityTruth);
  if (silence) badges.push(silence);

  return dedupeBadges(badges);
}

export function getCaseOwnerRiskBadges(caseRecord: unknown, context: OwnerRiskContext = {}): OwnerRiskBadge[] {
  const record = asRecord(caseRecord);
  const settings = getContextSettings(context);
  const value = getValue(record);
  const nextMove = resolveNextMove('case', record, context);
  const activityTruth = resolveActivityTruth('case', record, context);

  const badges: OwnerRiskBadge[] = [];

  if (value >= settings.highValueThresholdPln) {
    badges.push({
      key: 'case-high-value-risk',
      label: 'Wysoka wartość / ryzyko',
      severity: 'medium',
      reason: 'Sprawa przekracza próg wysokiej wartości: ' + settings.highValueThresholdPln + ' PLN.',
    });
  }

  if (nextMove.isMissing) {
    badges.push({
      key: 'case-missing-next-move',
      label: 'Brak następnego ruchu',
      severity: value >= settings.highValueThresholdPln ? 'high' : 'medium',
      reason: nextMove.reason,
    });
  }

  if (nextMove.isOverdue) {
    badges.push({
      key: 'case-overdue-next-move',
      label: 'Następny ruch zaległy',
      severity: 'high',
      reason: nextMove.reason,
    });
  }

  const silence = buildSilenceBadge('case', activityTruth);
  if (silence) badges.push(silence);

  if (value >= settings.highValueThresholdPln && (nextMove.isMissing || nextMove.isOverdue)) {
    badges.push({
      key: 'money-without-motion',
      label: 'Pieniądze bez ruchu',
      severity: 'high',
      reason: 'Wysoka wartość jest bez najbliższego ruchu.',
    });
  }

  return dedupeBadges(badges);
}

export function getMoneyOwnerRiskBadges(recordInput: unknown, context: OwnerRiskContext = {}): OwnerRiskBadge[] {
  const record = asRecord(recordInput);
  const settings = getContextSettings(context);
  const value = getValue(record);
  const nextMove = resolveNextMove('case', record, context);
  const badges: OwnerRiskBadge[] = [];

  if (value >= settings.highValueThresholdPln && (nextMove.isMissing || nextMove.isOverdue)) {
    badges.push({
      key: 'money-without-motion',
      label: 'Pieniądze bez ruchu',
      severity: 'high',
      reason: 'Kwota/prowizja przekracza próg i nie ma kolejnego ruchu.',
    });
  }

  return badges;
}

export function ownerRiskTone(severity: OwnerRiskSeverity): 'red' | 'amber' | 'blue' | 'neutral' {
  if (severity === 'high') return 'red';
  if (severity === 'medium') return 'amber';
  if (severity === 'low') return 'blue';
  return 'neutral';
}
