export type {
  CloseFlowStatusTone,
  LeadStatusConfig,
} from '../source-of-truth/lead-options';

export {
  LEAD_STATUS_META_BY_VALUE as LEAD_STATUS_CONFIG,
  LEAD_STATUS_OPTIONS,
  getLeadStatusMeta as getLeadStatusConfig,
  getLeadStatusLabel,
  getLeadStatusTone,
  getLeadStatusPillClass,
} from '../source-of-truth/lead-options';
