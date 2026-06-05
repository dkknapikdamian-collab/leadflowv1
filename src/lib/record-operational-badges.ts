import {
  getLeadOwnerRiskBadges,
  ownerRiskTone,
  type OwnerRiskBadge,
} from './owner-control/owner-risk-rules';
import { readOwnerRiskSettings } from './owner-control/owner-risk-settings';

export type RecordOperationalBadgeTone = 'red' | 'amber' | 'blue' | 'green' | 'neutral';

export type RecordOperationalBadge = {
  id: string;
  label: string;
  tone: RecordOperationalBadgeTone;
  title: string;
};

export type BuildRecordOperationalBadgesInput = {
  entityType: 'lead' | 'client';
  record: unknown;
  relatedRecords?: unknown[];
  hasNextStep?: boolean;
  now?: Date;
};

const DAY_MS = 86_400_000;
const STAGE222_R4_RECORD_OPERATIONAL_BADGES = 'lead/client rows show operational silence and missing contact as record-level badges';
const STAGE222_R2_RECORD_OPERATIONAL_BADGES_OWNER_RULES = 'record operational badges reuse owner-risk-rules source of truth';
void STAGE222_R4_RECORD_OPERATIONAL_BADGES;
void STAGE222_R2_RECORD_OPERATIONAL_BADGES_OWNER_RULES;

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

function hasContactData(record: Record<string, unknown>) {
  return Boolean(readString(record, ['phone', 'clientPhone', 'client_phone', 'mobile', 'tel'])
    || readString(record, ['email', 'clientEmail', 'client_email', 'mail']));
}

function dedupeBadges(badges: RecordOperationalBadge[]) {
  const seen = new Set<string>();
  return badges.filter((badge) => {
    if (seen.has(badge.id)) return false;
    seen.add(badge.id);
    return true;
  });
}

function fromOwnerRiskBadge(badge: OwnerRiskBadge): RecordOperationalBadge {
  return {
    id: badge.key,
    label: badge.label,
    tone: ownerRiskTone(badge.severity),
    title: badge.reason,
  };
}

export function buildRecordOperationalBadges(input: BuildRecordOperationalBadgesInput): RecordOperationalBadge[] {
  const now = input.now || new Date();
  const record = asRecord(input.record);
  const relatedRecords = Array.isArray(input.relatedRecords) ? input.relatedRecords : [];
  const latestActivityAt = getLatestActivityAt([record, ...relatedRecords]);
  const silentDays = daysSince(latestActivityAt, now);
  const badges: RecordOperationalBadge[] = [];

  if (!hasContactData(record)) {
    badges.push({
      id: 'missing-contact',
      label: 'brak kontaktu',
      tone: 'amber',
      title: input.entityType === 'client'
        ? 'Klient nie ma telefonu ani e-maila.'
        : 'Lead nie ma telefonu ani e-maila.',
    });
  }

  if (input.entityType === 'lead') {
    badges.push(...getLeadOwnerRiskBadges(record, {
      settings: readOwnerRiskSettings(),
      relatedRecords,
      hasNextStep: input.hasNextStep,
      now,
    }).map(fromOwnerRiskBadge));
  } else {
    if (input.hasNextStep === false) {
      badges.push({
        id: 'missing-next-step',
        label: 'brak akcji',
        tone: 'amber',
        title: 'Brak najbliższej zaplanowanej akcji.',
      });
    }

    if (typeof silentDays === 'number') {
      if (silentDays >= 14) {
        badges.push({
          id: 'silent-14',
          label: '14+ dni bez ruchu',
          tone: 'red',
          title: 'Rekord nie ma świeżego ruchu od co najmniej 14 dni.',
        });
      } else if (silentDays >= 7) {
        badges.push({
          id: 'silent-7',
          label: '7+ dni bez ruchu',
          tone: 'amber',
          title: 'Rekord nie ma świeżego ruchu od co najmniej 7 dni.',
        });
      }
    }
  }

  return dedupeBadges(badges).slice(0, 4);
}
