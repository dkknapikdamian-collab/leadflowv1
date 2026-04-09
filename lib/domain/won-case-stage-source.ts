export const WON_CASE_ENTRY_STATUS = "won" as const

export const POST_SALE_ACTIVE_RECORD = "case" as const
export const SALES_HISTORY_RECORD = "lead" as const

export const WON_CASE_ALLOWED_ACTIONS = [
  "create_case",
  "attach_case_to_lead",
  "start_checklist",
  "generate_client_link",
] as const

export function canEnterOperationalStageFromWon(status: string) {
  return status === WON_CASE_ENTRY_STATUS
}

export function getPostSaleProcessOwner(params: { leadStatus: string; hasCaseId: boolean }) {
  if (params.leadStatus === WON_CASE_ENTRY_STATUS && params.hasCaseId) {
    return POST_SALE_ACTIVE_RECORD
  }

  return SALES_HISTORY_RECORD
}

export function leadMustStayInSalesHistoryAfterWon() {
  return true
}
