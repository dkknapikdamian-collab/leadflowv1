import test from "node:test"
import assert from "node:assert/strict"
import { stripPortalTokenPublicValues, verifyPortalTokenValue } from "../lib/security/portal-token"
import { addLeadSnapshot, revokeClientPortalTokenSnapshot, startCaseFromLeadSnapshot } from "../lib/snapshot"
import { createInitialSnapshot } from "../lib/seed"

function createSnapshotWithPortalToken() {
  const withLead = addLeadSnapshot(createInitialSnapshot(), {
    name: "Klient token",
    company: "Firma",
    email: "",
    phone: "",
    source: "Inne",
    value: 1200,
    summary: "",
    notes: "",
    status: "won",
    priority: "medium",
    nextActionTitle: "Start",
    nextActionAt: "2026-04-08T10:00:00.000Z",
  })

  return startCaseFromLeadSnapshot(withLead, {
    leadId: withLead.leads[0]!.id,
    mode: "template_with_link",
  })
}

test("token portalu w snapshot ma hash i publiczna wartosc tylko do jednorazowego wydania", () => {
  const snapshot = createSnapshotWithPortalToken()
  const token = snapshot.clientPortalTokens?.[0]

  assert.ok(token)
  assert.ok(token?.tokenValue)
  assert.notEqual(token?.tokenHash, token?.tokenValue)
  assert.equal(
    verifyPortalTokenValue({
      presentedToken: token?.tokenValue ?? "",
      storedTokenHash: token?.tokenHash ?? "",
    }),
    true,
  )
})

test("stripPortalTokenPublicValues usuwa publiczny token przed zapisem do bazy", () => {
  const snapshot = createSnapshotWithPortalToken()
  const stripped = stripPortalTokenPublicValues(snapshot)

  assert.equal((stripped.clientPortalTokens ?? [])[0]?.tokenValue, undefined)
  assert.ok((stripped.clientPortalTokens ?? [])[0]?.tokenHash)
})

test("revokeClientPortalTokenSnapshot zapisuje audit portal_token_revoked", () => {
  const snapshot = createSnapshotWithPortalToken()
  const caseId = snapshot.cases?.[0]?.id
  assert.ok(caseId)

  const revoked = revokeClientPortalTokenSnapshot(snapshot, caseId!)
  assert.equal((revoked.clientPortalTokens ?? []).some((token) => token.caseId === caseId && !token.revokedAt), false)
  assert.equal((revoked.activityLog ?? []).some((entry) => entry.type === "portal_token_revoked" && entry.caseId === caseId), true)
})
