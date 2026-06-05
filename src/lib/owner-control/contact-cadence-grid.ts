import { buildActivityTruth } from './activity-truth';
import { SALES_SILENCE_THRESHOLDS_DAYS } from './owner-risk-rules';

export type ContactCadenceBucketKey =
  | 'today'
  | 'silent_1'
  | 'silent_2'
  | 'silent_3'
  | 'silent_5'
  | 'silent_7'
  | 'silent_14_plus'
  | 'unknown';

export type ContactCadenceSeverity = 'none' | 'low' | 'medium' | 'high';

export type ContactCadenceBucket = {
  key: ContactCadenceBucketKey;
  label: string;
  shortLabel: string;
  description: string;
  severity: ContactCadenceSeverity;
  minDays: number | null;
  maxDays: number | null;
};

export type ContactCadenceRow = {
  id: string;
  entityType: 'lead' | 'client';
  entityId: string;
  title: string;
  subtitle: string;
  href: string;
  lastContactAt: string | null;
  contactSilentDays: number | null;
  bucketKey: ContactCadenceBucketKey;
  isFallback: boolean;
  badges: string[];
  rescueCandidate: boolean;
  rescueReason: string | null;
};

export type ContactCadenceGrid = {
  generatedAt: string;
  buckets: Record<ContactCadenceBucketKey, ContactCadenceRow[]>;
  counts: Record<ContactCadenceBucketKey, number>;
};

export const CONTACT_CADENCE_BUCKETS: ContactCadenceBucket[] = [
  { key: 'today', label: 'Kontakt dziś', shortLabel: 'Dziś', description: 'Rekordy z kontaktem dzisiaj.', severity: 'none', minDays: 0, maxDays: 0 },
  { key: 'silent_1', label: '1 dzień ciszy', shortLabel: '1 dzień', description: 'Minął 1 dzień od ostatniego kontaktu.', severity: 'low', minDays: 1, maxDays: 1 },
  { key: 'silent_2', label: '2 dni ciszy', shortLabel: '2 dni', description: 'Minęły 2 dni od ostatniego kontaktu.', severity: 'low', minDays: 2, maxDays: 2 },
  { key: 'silent_3', label: '3 dni ciszy', shortLabel: '3 dni', description: 'Minęły 3 dni od ostatniego kontaktu.', severity: 'medium', minDays: 3, maxDays: 3 },
  { key: 'silent_5', label: '5 dni ciszy', shortLabel: '5 dni', description: 'Minęło 4-5 dni od ostatniego kontaktu.', severity: 'medium', minDays: 4, maxDays: 5 },
  { key: 'silent_7', label: '7+ dni ciszy', shortLabel: '7+ dni', description: 'Minęło 6-13 dni od ostatniego kontaktu.', severity: 'high', minDays: 6, maxDays: 13 },
  { key: 'silent_14_plus', label: '14+ dni ciszy', shortLabel: '14+ dni', description: 'Minęło co najmniej 14 dni od ostatniego kontaktu.', severity: 'high', minDays: 14, maxDays: null },
  { key: 'unknown', label: 'Brak daty kontaktu', shortLabel: 'Brak daty', description: 'Brak pewnej daty prawdziwego kontaktu.', severity: 'medium', minDays: null, maxDays: null },
];

const CONTACT_CADENCE_BUCKET_KEYS = CONTACT_CADENCE_BUCKETS.map((bucket) => bucket.key) as ContactCadenceBucketKey[];
const STAGE225_CONTACT_CADENCE_GRID = 'Contact cadence grid uses activity-truth and imported SALES_SILENCE_THRESHOLDS_DAYS';
void STAGE225_CONTACT_CADENCE_GRID;
void SALES_SILENCE_THRESHOLDS_DAYS;

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

function getRecordId(record: Record<string, unknown>) {
  return readString(record, ['id', 'leadId', 'lead_id', 'clientId', 'client_id']);
}

function getRecordTitle(record: Record<string, unknown>, entityType: 'lead' | 'client') {
  return readString(record, ['name', 'title', 'company', 'email', 'phone']) || (entityType === 'lead' ? 'Lead bez nazwy' : 'Klient');
}

function getRecordSubtitle(record: Record<string, unknown>) {
  return [
    readString(record, ['company']),
    readString(record, ['email']),
    readString(record, ['phone']),
  ].filter(Boolean).slice(0, 3).join(' - ');
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

function hasPlannedNextStep(record: Record<string, unknown>, relatedRecords: unknown[]) {
  if (readString(record, ['nextActionAt', 'next_action_at', 'nextMoveAt', 'next_move_at', 'nextFollowUpAt', 'next_follow_up_at'])) {
    return true;
  }

  return relatedRecords.some((related) => {
    const row = asRecord(related);
    const status = readString(row, ['status', 'state']).toLowerCase();
    if (['done', 'completed', 'cancelled', 'canceled', 'archived'].includes(status)) return false;
    return Boolean(readString(row, ['dueAt', 'due_at', 'scheduledAt', 'scheduled_at', 'startAt', 'start_at', 'dateAt', 'date_at', 'date']));
  });
}

export function classifyContactCadenceBucket(contactSilentDays: number | null): ContactCadenceBucketKey {
  if (typeof contactSilentDays !== 'number' || !Number.isFinite(contactSilentDays)) return 'unknown';
  if (contactSilentDays <= 0) return 'today';
  if (contactSilentDays === 1) return 'silent_1';
  if (contactSilentDays === 2) return 'silent_2';
  if (contactSilentDays === 3) return 'silent_3';
  if (contactSilentDays <= 5) return 'silent_5';
  if (contactSilentDays < 14) return 'silent_7';
  return 'silent_14_plus';
}

function buildBadges(bucketKey: ContactCadenceBucketKey, contactSilentDays: number | null) {
  if (bucketKey === 'silent_14_plus') return ['14+ dni ciszy'];
  if (bucketKey === 'silent_7') return ['7+ dni ciszy'];
  if (bucketKey === 'unknown') return ['Brak daty kontaktu'];
  if (typeof contactSilentDays === 'number' && contactSilentDays > 0) return [String(contactSilentDays) + ' dni ciszy'];
  return [];
}

function resolveRescue(input: {
  contactSilentDays: number | null;
  hasContact: boolean;
  hasNextStep: boolean;
  value: number;
}) {
  if (typeof input.contactSilentDays === 'number' && input.contactSilentDays >= 14) {
    return { rescueCandidate: true, rescueReason: '14+ dni ciszy.' };
  }

  if (typeof input.contactSilentDays === 'number' && input.contactSilentDays >= 7 && !input.hasNextStep) {
    return { rescueCandidate: true, rescueReason: '7+ dni ciszy i brak następnego ruchu.' };
  }

  if (typeof input.contactSilentDays === 'number' && input.contactSilentDays >= 7 && input.value >= 5000) {
    return { rescueCandidate: true, rescueReason: 'Wysoka wartość i 7+ dni ciszy.' };
  }

  if (!input.hasContact && !input.hasNextStep) {
    return { rescueCandidate: true, rescueReason: 'Brak daty kontaktu i brak następnego kroku.' };
  }

  return { rescueCandidate: false, rescueReason: null };
}

function createEmptyGrid(generatedAt: string): ContactCadenceGrid {
  const buckets = {} as Record<ContactCadenceBucketKey, ContactCadenceRow[]>;
  const counts = {} as Record<ContactCadenceBucketKey, number>;
  for (const key of CONTACT_CADENCE_BUCKET_KEYS) {
    buckets[key] = [];
    counts[key] = 0;
  }
  return { generatedAt, buckets, counts };
}

export function buildContactCadenceGrid(input: {
  entityType: 'lead' | 'client';
  records: unknown[];
  relatedRecordsById?: Map<string, unknown[]>;
  now?: Date;
}): ContactCadenceGrid {
  const now = input.now || new Date();
  const grid = createEmptyGrid(now.toISOString());
  const records = Array.isArray(input.records) ? input.records : [];

  for (const item of records) {
    const record = asRecord(item);
    const id = getRecordId(record);
    if (!id) continue;

    const relatedRecords = input.relatedRecordsById?.get(id) || [];
    const truth = buildActivityTruth({
      entityType: input.entityType,
      entityId: id,
      record,
      activities: relatedRecords,
      tasks: relatedRecords,
      events: relatedRecords,
      payments: relatedRecords,
      now,
    });
    const bucketKey = classifyContactCadenceBucket(truth.contactSilentDays);
    const hasNextStep = hasPlannedNextStep(record, relatedRecords);
    const value = getValue(record);
    const rescue = resolveRescue({
      contactSilentDays: truth.contactSilentDays,
      hasContact: Boolean(truth.lastContactAt),
      hasNextStep,
      value,
    });

    const row: ContactCadenceRow = {
      id: input.entityType + ':' + id,
      entityType: input.entityType,
      entityId: id,
      title: getRecordTitle(record, input.entityType),
      subtitle: getRecordSubtitle(record),
      href: input.entityType === 'lead' ? '/leads/' + encodeURIComponent(id) : '/clients/' + encodeURIComponent(id),
      lastContactAt: truth.lastContactAt,
      contactSilentDays: truth.contactSilentDays,
      bucketKey,
      isFallback: truth.lastContactIsFallback,
      badges: buildBadges(bucketKey, truth.contactSilentDays),
      rescueCandidate: rescue.rescueCandidate,
      rescueReason: rescue.rescueReason,
    };

    grid.buckets[bucketKey].push(row);
    grid.counts[bucketKey] += 1;
  }

  return grid;
}
