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
  {
    key: 'today',
    label: 'Kontakt dziĹ›',
    shortLabel: 'DziĹ›',
    description: 'Rekordy z prawdziwym kontaktem dzisiaj.',
    severity: 'none',
    minDays: 0,
    maxDays: 0,
  },
  {
    key: 'silent_1',
    label: '1 dzieĹ„ ciszy',
    shortLabel: '1 dzieĹ„',
    description: 'MinÄ…Ĺ‚ 1 dzieĹ„ od ostatniego kontaktu.',
    severity: 'low',
    minDays: 1,
    maxDays: 1,
  },
  {
    key: 'silent_2',
    label: '2 dni ciszy',
    shortLabel: '2 dni',
    description: 'MinÄ™Ĺ‚y 2 dni od ostatniego kontaktu.',
    severity: 'low',
    minDays: 2,
    maxDays: 2,
  },
  {
    key: 'silent_3',
    label: '3 dni ciszy',
    shortLabel: '3 dni',
    description: 'MinÄ™Ĺ‚y 3 dni od ostatniego kontaktu.',
    severity: 'medium',
    minDays: 3,
    maxDays: 3,
  },
  {
    key: 'silent_5',
    label: '5 dni ciszy',
    shortLabel: '5 dni',
    description: 'MinÄ™Ĺ‚y 4-5 dni od ostatniego kontaktu.',
    severity: 'medium',
    minDays: 4,
    maxDays: 5,
  },
  {
    key: 'silent_7',
    label: '7+ dni ciszy',
    shortLabel: '7+ dni',
    description: 'MinÄ™Ĺ‚o 6-13 dni od ostatniego kontaktu.',
    severity: 'high',
    minDays: 6,
    maxDays: 13,
  },
  {
    key: 'silent_14_plus',
    label: '14+ dni ciszy',
    shortLabel: '14+ dni',
    description: 'MinÄ™Ĺ‚o co najmniej 14 dni od ostatniego kontaktu.',
    severity: 'high',
    minDays: 14,
    maxDays: null,
  },
  {
    key: 'unknown',
    label: 'Brak daty kontaktu',
    shortLabel: 'Brak daty',
    description: 'Nie ma pewnej daty prawdziwego kontaktu. Nie liczymy tego z updatedAt.',
    severity: 'medium',
    minDays: null,
    maxDays: null,
  },
];

const CONTACT_CADENCE_BUCKET_KEYS = CONTACT_CADENCE_BUCKETS.map((bucket) => bucket.key) as ContactCadenceBucketKey[];
const STAGE225_CONTACT_CADENCE_GRID = 'Contact cadence grid uses activity-truth and SALES_SILENCE_THRESHOLDS_DAYS; no local UI silence math';
void STAGE225_CONTACT_CADENCE_GRID;

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

function getRecordId(record: Record<string, unknown>) {
  return readString(record, ['id', 'leadId', 'lead_id', 'clientId', 'client_id']);
}

function getTitle(entityType: 'lead' | 'client', record: Record<string, unknown>) {
  return readString(record, ['name', 'title', 'company', 'email', 'phone']) || (entityType === 'lead' ? 'Lead bez nazwy' : 'Klient');
}

function getSubtitle(record: Record<string, unknown>) {
  return [
    readString(record, ['company']),
    readString(record, ['email']),
    readString(record, ['phone']),
    readString(record, ['source']),
  ].filter(Boolean).slice(0, 3).join(' Â· ');
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
    'budget',
    'price',
    'total',
  ]);
}

export function classifyContactCadenceBucket(contactSilentDays: number | null): ContactCadenceBucketKey {
  if (typeof contactSilentDays !== 'number' || !Number.isFinite(contactSilentDays)) return 'unknown';
  if (contactSilentDays <= 0) return 'today';
  if (contactSilentDays === SALES_SILENCE_THRESHOLDS_DAYS[0]) return 'silent_1';
  if (contactSilentDays === SALES_SILENCE_THRESHOLDS_DAYS[1]) return 'silent_2';
  if (contactSilentDays === SALES_SILENCE_THRESHOLDS_DAYS[2]) return 'silent_3';
  if (contactSilentDays <= SALES_SILENCE_THRESHOLDS_DAYS[3]) return 'silent_5';
  if (contactSilentDays < SALES_SILENCE_THRESHOLDS_DAYS[5]) return 'silent_7';
  return 'silent_14_plus';
}

function buildRescueState(input: {
  contactSilentDays: number | null;
  hasNextStep: boolean;
  value: number;
  hasContact: boolean;
}) {
  const highValue = input.value >= 5000;

  if (typeof input.contactSilentDays === 'number' && input.contactSilentDays >= 14) {
    return { rescueCandidate: true, rescueReason: '14+ dni ciszy od prawdziwego kontaktu.' };
  }

  if (typeof input.contactSilentDays === 'number' && input.contactSilentDays >= 7 && !input.hasNextStep) {
    return { rescueCandidate: true, rescueReason: '7+ dni ciszy i brak nastÄ™pnego ruchu.' };
  }

  if (typeof input.contactSilentDays === 'number' && input.contactSilentDays >= 7 && highValue) {
    return { rescueCandidate: true, rescueReason: 'Wysoka wartoĹ›Ä‡ i 7+ dni ciszy.' };
  }

  if (!input.hasContact && !input.hasNextStep) {
    return { rescueCandidate: true, rescueReason: 'Brak daty kontaktu i brak nastÄ™pnego kroku.' };
  }

  return { rescueCandidate: false, rescueReason: null };
}

function makeEmptyBuckets(): Record<ContactCadenceBucketKey, ContactCadenceRow[]> {
  return CONTACT_CADENCE_BUCKET_KEYS.reduce((acc, key) => {
    acc[key] = [];
    return acc;
  }, {} as Record<ContactCadenceBucketKey, ContactCadenceRow[]>);
}

function makeEmptyCounts(): Record<ContactCadenceBucketKey, number> {
  return CONTACT_CADENCE_BUCKET_KEYS.reduce((acc, key) => {
    acc[key] = 0;
    return acc;
  }, {} as Record<ContactCadenceBucketKey, number>);
}

export function buildContactCadenceGrid(input: {
  entityType: 'lead' | 'client';
  records: unknown[];
  relatedRecordsById?: Map<string, unknown[]>;
  now?: Date;
}): ContactCadenceGrid {
  const now = input.now || new Date();
  const buckets = makeEmptyBuckets();
  const counts = makeEmptyCounts();

  for (const item of Array.isArray(input.records) ? input.records : []) {
    const record = asRecord(item);
    const entityId = getRecordId(record);
    if (!entityId) continue;

    const relatedRecords = input.relatedRecordsById?.get(entityId) || [];
    const truth = buildActivityTruth({
      entityType: input.entityType,
      entityId,
      record,
      activities: relatedRecords,
      tasks: relatedRecords,
      events: relatedRecords,
      payments: relatedRecords,
      now,
    });

    const bucketKey = classifyContactCadenceBucket(truth.contactSilentDays);
    const hasNextStep = hasPlannedNextStep(record, relatedRecords);
    const rescue = buildRescueState({
      contactSilentDays: truth.contactSilentDays,
      hasNextStep,
      value: getValue(record),
      hasContact: Boolean(truth.lastContactAt),
    });

    const badges: string[] = [];
    if (bucketKey === 'silent_14_plus') badges.push('Cisza 14+ dni');
    else if (bucketKey === 'silent_7') badges.push('Cisza 7+ dni');
    else if (bucketKey === 'unknown') badges.push('Brak daty kontaktu');
    if (rescue.rescueCandidate) badges.push('Kandydat do odzyskania');

    const row: ContactCadenceRow = {
      id: input.entityType + ':' + entityId,
      entityType: input.entityType,
      entityId,
      title: getTitle(input.entityType, record),
      subtitle: getSubtitle(record),
      href: input.entityType === 'lead' ? '/leads/' + encodeURIComponent(entityId) : '/clients/' + encodeURIComponent(entityId),
      lastContactAt: truth.lastContactAt,
      contactSilentDays: truth.contactSilentDays,
      bucketKey,
      isFallback: Boolean(truth.lastContactIsFallback),
      badges,
      rescueCandidate: rescue.rescueCandidate,
      rescueReason: rescue.rescueReason,
    };

    buckets[bucketKey].push(row);
    counts[bucketKey] += 1;
  }

  return {
    generatedAt: now.toISOString(),
    buckets,
    counts,
  };
}
