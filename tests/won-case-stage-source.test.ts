import test from "node:test"
import assert from "node:assert/strict"
import {
  POST_SALE_ACTIVE_RECORD,
  SALES_HISTORY_RECORD,
  WON_CASE_ALLOWED_ACTIONS,
  WON_CASE_ENTRY_STATUS,
  canEnterOperationalStageFromWon,
  getPostSaleProcessOwner,
  leadMustStayInSalesHistoryAfterWon,
} from "../lib/domain/won-case-stage-source"

test("ETAP 3 wpuszcza do etapu operacyjnego tylko po won", () => {
  assert.equal(WON_CASE_ENTRY_STATUS, "won")
  assert.equal(canEnterOperationalStageFromWon("won"), true)
  assert.equal(canEnterOperationalStageFromWon("contacted"), false)
  assert.equal(canEnterOperationalStageFromWon("offer_sent"), false)
})

test("po won lead zostaje w historii sprzedaży, ale aktywnym rekordem staje się case", () => {
  assert.equal(SALES_HISTORY_RECORD, "lead")
  assert.equal(POST_SALE_ACTIVE_RECORD, "case")
  assert.equal(leadMustStayInSalesHistoryAfterWon(), true)
  assert.equal(getPostSaleProcessOwner({ leadStatus: "won", hasCaseId: true }), "case")
  assert.equal(getPostSaleProcessOwner({ leadStatus: "won", hasCaseId: false }), "lead")
})

test("ETAP 3 ma poprawny zestaw akcji po won", () => {
  assert.deepEqual(WON_CASE_ALLOWED_ACTIONS, [
    "create_case",
    "attach_case_to_lead",
    "start_checklist",
    "generate_client_link",
  ])
})
