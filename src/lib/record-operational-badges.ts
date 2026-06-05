import {
  getLeadOwnerRiskBadges,
  ownerRiskTone,
  type OwnerRiskBadge,
} from './owner-control/owner-risk-rules';
import { buildActivityTruth } from './owner-control/activity-truth';
import { buildNextMoveContract } from './owner-control/next-move-contract';
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

const STAGE222_R4_RECORD_OPERATIONAL_BADGES = 'lead/client rows show operational silence and missing contact as record-level badges';
const STAGE222_R2_RECORD_OPERATIONAL_BADGES_OWNER_RULES = 'record operational badges reuse owner-risk-rules source of truth';
const STAGE223_RECORD_OPERATIONAL_BADGES_ACTIVITY_TRUTH = 'lead badges distinguish real contact silence from generic activity fallback';
void STAGE222_R4_RECORD_OPERATIONAL_BADGES;
void STAGE222_R2_RECORD_OPERATIONAL_BADGES_OWNER_RULES;
void STAGE223_RECORD_OPERATIONAL_BADGES_ACTIVITY_TRUTH;

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
  const recordId = readString(record, ['id']);
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
    const nextMove = buildNextMoveContract({
      entityType: 'lead',
      entityId: recordId,
      status: readString(record, ['status']),
      nearestAction: input.hasNextStep === false ? null : undefined,
      now,
    });
    const activityTruth = buildActivityTruth({
      entityType: 'lead',
      entityId: recordId,
      record,
      activities: relatedRecords,
      tasks: relatedRecords,
      events: relatedRecords,
      payments: relatedRecords,
      now,
    });

    badges.push(...getLeadOwnerRiskBadges(record, {
      settings: readOwnerRiskSettings(),
      relatedRecords,
      hasNextStep: input.hasNextStep,
      nextMove,
      activityTruth,
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
  }

  return dedupeBadges(badges).slice(0, 4);
}
