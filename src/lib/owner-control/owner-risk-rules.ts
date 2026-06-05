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
};

const DAY_MS = 86_400_000;
const STAGE222_OWNER_RISK_RULES_FOUNDATION = 'one source of truth for owner risk rules, badges and high value threshold';
void STAGE222_OWNER_RISK_RULES_FOUNDATION;

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

function readString(record: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'string' && value.trim()) return value.trim();
    if (typeof value === 'number' && Number.isFinite(value)) return String(value);
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

function readMoment(record: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'string' && value.trim()) return value.trim();
    if (value instanceof Date) return value.toISOString();
  }
  return '';
}

function parseDate(value: string) {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isFinite(parsed.getTime()) ? parsed : null;
}

function getBestActivityMoment(record: Record<string, unknown>) {
  return readMoment(record, [
    'lastContactAt',
    'last_contact_at',
    'lastActivityAt',
    'last_activity_at',
    'updatedAt',
    'updated_at',
    'modifiedAt',
    'modified_at',
    'createdAt',
    'created_at',
    'scheduledAt',
    'scheduled_at',
    'dueAt',
    'due_at',
    'dateAt',
    'date_at',
    'startAt',
    'start_at',
    'date',
  ]);
}

function getLatestActivityAt(records: unknown[]) {
  let latest = 0;
  let latestIso = '';

  for (const input of records) {
    const record = asRecord(input);
    const raw = getBestActivityMoment(record);
    const parsed = parseDate(raw);
    if (!parsed) continue;
    const time = parsed.getTime();
    if (time > latest) {
      latest = time;
      latestIso = parsed.toISOString();
    }
  }

  return latestIso;
}

function daysSince(iso: string, now: Date) {
  const parsed = parseDate(iso);
  if (!parsed) return null;
  return Math.max(0, Math.floor((now.getTime() - parsed.getTime()) / DAY_MS));
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

function buildSilenceBadge(prefix: 'Cisza' | 'Sprawa bez ruchu', silentDays: number): OwnerRiskBadge | null {
  if (silentDays >= 14) {
    return {
      key: prefix === 'Cisza' ? 'lead-silence-14' : 'case-silence-14',
      label: prefix === 'Cisza' ? 'Cisza 14+ dni' : 'Sprawa bez ruchu 14+ dni',
      severity: 'high',
      reason: 'Brak świeżego ruchu od co najmniej 14 dni.',
    };
  }

  if (silentDays >= 7) {
    return {
      key: prefix === 'Cisza' ? 'lead-silence-7' : 'case-silence-7',
      label: prefix === 'Cisza' ? 'Cisza 7+ dni' : 'Sprawa bez ruchu 7+ dni',
      severity: 'medium',
      reason: 'Brak świeżego ruchu od co najmniej 7 dni.',
    };
  }

  return null;
}

export function getLeadOwnerRiskBadges(lead: unknown, context: OwnerRiskContext = {}): OwnerRiskBadge[] {
  const now = context.now || new Date();
  const record = asRecord(lead);
  const relatedRecords = Array.isArray(context.relatedRecords) ? context.relatedRecords : [];
  const latestActivityAt = getLatestActivityAt([record, ...relatedRecords]);
  const silentDays = daysSince(latestActivityAt, now);
  const settings = getContextSettings(context);
  const value = getValue(record);

  const badges: OwnerRiskBadge[] = [];

  if (value >= settings.highValueThresholdPln) {
    badges.push({
      key: 'lead-high-value',
      label: 'Wysoka wartość',
      severity: 'medium',
      reason: 'Lead przekracza próg wysokiej wartości: ' + settings.highValueThresholdPln + ' PLN.',
    });
  }

  if (context.hasNextStep === false) {
    badges.push({
      key: 'lead-missing-next-action',
      label: 'Brak następnej akcji',
      severity: value >= settings.highValueThresholdPln ? 'high' : 'medium',
      reason: 'Lead nie ma najbliższej zaplanowanej akcji.',
    });
  }

  if (typeof silentDays === 'number') {
    const silence = buildSilenceBadge('Cisza', silentDays);
    if (silence) badges.push(silence);
  }

  return dedupeBadges(badges);
}

export function getCaseOwnerRiskBadges(caseRecord: unknown, context: OwnerRiskContext = {}): OwnerRiskBadge[] {
  const now = context.now || new Date();
  const record = asRecord(caseRecord);
  const relatedRecords = Array.isArray(context.relatedRecords) ? context.relatedRecords : [];
  const latestActivityAt = getLatestActivityAt([record, ...relatedRecords]);
  const silentDays = daysSince(latestActivityAt, now);
  const settings = getContextSettings(context);
  const value = getValue(record);

  const badges: OwnerRiskBadge[] = [];

  if (value >= settings.highValueThresholdPln) {
    badges.push({
      key: 'case-high-value-risk',
      label: 'Wysoka wartość / ryzyko',
      severity: 'medium',
      reason: 'Sprawa przekracza próg wysokiej wartości: ' + settings.highValueThresholdPln + ' PLN.',
    });
  }

  if (context.hasNextStep === false) {
    badges.push({
      key: 'case-missing-next-move',
      label: 'Brak następnego ruchu',
      severity: value >= settings.highValueThresholdPln ? 'high' : 'medium',
      reason: 'Sprawa nie ma najbliższego zaplanowanego ruchu.',
    });
  }

  if (typeof silentDays === 'number') {
    const silence = buildSilenceBadge('Sprawa bez ruchu', silentDays);
    if (silence) badges.push(silence);
  }

  if (value >= settings.highValueThresholdPln && context.hasNextStep === false) {
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
  const badges: OwnerRiskBadge[] = [];

  if (value >= settings.highValueThresholdPln && context.hasNextStep === false) {
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
