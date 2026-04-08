import test from "node:test"
import assert from "node:assert/strict"
import { addLeadSnapshot, revokeClientPortalTokenSnapshot, startCaseFromLeadSnapshot } from "../lib/snapshot"
import { createInitialSnapshot } from "../lib/seed"

test("token klienta można odwołać dla konkretnej sprawy", () => {
  const withLead = addLeadSnapshot(createInitialSnapshot(), {
    name: "Klient portalowy",
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

  const lead = withLead.leads[0]!
  const started = startCaseFromLeadSnapshot(withLead, {
    leadId: lead.id,
    mode: "template_with_link",
  })
  const caseId = started.cases?.[0]?.id
  assert.ok(caseId)
  assert.equal((started.clientPortalTokens ?? []).length > 0, true)
  assert.equal((started.clientPortalTokens ?? [])[0]?.revokedAt, null)

  const revoked = revokeClientPortalTokenSnapshot(started, caseId!)
  const activeForCase = (revoked.clientPortalTokens ?? []).filter((token) => token.caseId === caseId && !token.revokedAt)

  assert.equal(activeForCase.length, 0)
  assert.equal((revoked.clientPortalTokens ?? [])[0]?.revokedAt !== null, true)
})
