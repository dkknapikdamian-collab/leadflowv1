export type {
  CaseItemStatusMeta,
  CaseItemStatusValue,
  CaseStatusConfig,
  CaseStatusMeta,
  CaseStatusValue,
} from '../source-of-truth/case-options';

export {
  CASE_CLOSED_STATUSES,
  CASE_ITEM_STATUS_LABELS,
  CASE_ITEM_STATUS_META_BY_VALUE,
  CASE_ITEM_STATUS_OPTIONS,
  CASE_STATUS_META_BY_VALUE as CASE_STATUS_CONFIG,
  CASE_STATUS_META_BY_VALUE,
  CASE_STATUS_OPTIONS,
  caseStatusBadgeVariant,
  getCaseClientPillClass,
  getCaseDetailPillClass,
  getCaseItemStatusLabel,
  getCaseItemStatusMeta,
  getCaseStatusHint,
  getCaseStatusLabel,
  getCaseStatusMeta as getCaseStatusConfig,
  getCaseStatusMeta,
  getCaseStatusTone,
  isClosedCaseStatus as isClosedCaseStatusValue,
  normalizeCaseItemStatus,
} from '../source-of-truth/case-options';
