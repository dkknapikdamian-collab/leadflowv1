// STAGE232G_R1B_TODAY_USES_OPERATIONAL_ENTRY_CONTRACT
// Today-specific adapter over the shared Calendar/Today operational entry contract.
// Pure helper: no React, no Supabase, no Google sync, no SQL.

import {
  STAGE232G_R1A_CALENDAR_TODAY_OPERATIONAL_ENTRY_CONTRACT,
  buildCalendarTodayParityFingerprint,
  buildOperationalEntryContract,
  getOperationalRecordMomentRaw,
  toOperationalDayKey,
  type CalendarTodayOperationalEntryContract,
  type OperationalEntryKind,
} from './calendar-operational-entry-contract';

export const STAGE232G_R1B_TODAY_USES_OPERATIONAL_ENTRY_CONTRACT = 'STAGE232G_R1B_TODAY_USES_OPERATIONAL_ENTRY_CONTRACT';

export type TodayOperationalEntryKind = OperationalEntryKind;
export type TodayOperationalEntryContract = CalendarTodayOperationalEntryContract;

export function getTodayOperationalMomentRaw(kind: OperationalEntryKind, record: unknown): string | null {
  return getOperationalRecordMomentRaw(record, kind);
}

export function getTodayTaskMomentRaw(record: unknown): string | null {
  return getTodayOperationalMomentRaw('task', record);
}

export function getTodayEventMomentRaw(record: unknown): string | null {
  return getTodayOperationalMomentRaw('event', record);
}

export function getTodayLeadMomentRaw(record: unknown): string | null {
  return getTodayOperationalMomentRaw('lead', record);
}

export function getTodayOperationalDayKey(value: unknown): string | null {
  return toOperationalDayKey(value);
}

export function getTodayOperationalRecordDayKey(kind: OperationalEntryKind, record: unknown): string | null {
  return toOperationalDayKey(getTodayOperationalMomentRaw(kind, record));
}

export function buildTodayOperationalEntry(kind: OperationalEntryKind, record: unknown): TodayOperationalEntryContract {
  return buildOperationalEntryContract(kind, record);
}

export function buildTodayOperationalParityFingerprint(kind: OperationalEntryKind, record: unknown): string {
  return buildCalendarTodayParityFingerprint(buildTodayOperationalEntry(kind, record));
}

export function assertTodayUsesR1AContract(): typeof STAGE232G_R1A_CALENDAR_TODAY_OPERATIONAL_ENTRY_CONTRACT {
  return STAGE232G_R1A_CALENDAR_TODAY_OPERATIONAL_ENTRY_CONTRACT;
}
