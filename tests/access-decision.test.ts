import test from "node:test"
import assert from "node:assert/strict"
import { evaluateAccessStatusDecision } from "../lib/access/decision"

test("trial_active z ważnym trialEnd wpuszcza usera", () => {
  const decision = evaluateAccessStatusDecision({
    accessStatus: {
      accessStatus: "trial_active",
      trialEnd: "2026-04-13T10:00:00.000Z",
      paidUntil: null,
    },
    now: "2026-04-10T10:00:00.000Z",
  })

  assert.deepEqual(decision, { allowed: true, reason: "ok" })
})

test("trial_active po końcu triala blokuje usera", () => {
  const decision = evaluateAccessStatusDecision({
    accessStatus: {
      accessStatus: "trial_active",
      trialEnd: "2026-04-13T10:00:00.000Z",
      paidUntil: null,
    },
    now: "2026-04-14T10:00:00.000Z",
  })

  assert.deepEqual(decision, { allowed: false, reason: "trial-expired" })
})

test("paid_active z ważnym paidUntil wpuszcza usera", () => {
  const decision = evaluateAccessStatusDecision({
    accessStatus: {
      accessStatus: "paid_active",
      trialEnd: "2026-04-13T10:00:00.000Z",
      paidUntil: "2026-05-10T10:00:00.000Z",
    },
    now: "2026-04-20T10:00:00.000Z",
  })

  assert.deepEqual(decision, { allowed: true, reason: "ok" })
})

test("paid_active po końcu planu blokuje usera", () => {
  const decision = evaluateAccessStatusDecision({
    accessStatus: {
      accessStatus: "paid_active",
      trialEnd: "2026-04-13T10:00:00.000Z",
      paidUntil: "2026-05-10T10:00:00.000Z",
    },
    now: "2026-05-11T10:00:00.000Z",
  })

  assert.deepEqual(decision, { allowed: false, reason: "plan-expired" })
})

test("payment_failed blokuje usera", () => {
  const decision = evaluateAccessStatusDecision({
    accessStatus: {
      accessStatus: "payment_failed",
      trialEnd: "2026-04-13T10:00:00.000Z",
      paidUntil: "2026-05-10T10:00:00.000Z",
    },
    now: "2026-04-20T10:00:00.000Z",
  })

  assert.deepEqual(decision, { allowed: false, reason: "payment-failed" })
})

test("canceled z przyszłym paidUntil dalej wpuszcza do końca okresu", () => {
  const decision = evaluateAccessStatusDecision({
    accessStatus: {
      accessStatus: "canceled",
      trialEnd: "2026-04-13T10:00:00.000Z",
      paidUntil: "2026-05-10T10:00:00.000Z",
    },
    now: "2026-04-20T10:00:00.000Z",
  })

  assert.deepEqual(decision, { allowed: true, reason: "ok" })
})

test("brak rekordu access_status blokuje usera", () => {
  const decision = evaluateAccessStatusDecision({
    accessStatus: null,
    now: "2026-04-20T10:00:00.000Z",
  })

  assert.deepEqual(decision, { allowed: false, reason: "missing-access-status" })
})
