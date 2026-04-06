import test from "node:test"
import assert from "node:assert/strict"
import { createInitialSnapshot } from "../lib/seed"
import { choosePreferredSnapshot } from "../lib/data/snapshot-selection"

function createSnapshotWithLead(updatedAt: string) {
  const snapshot = createInitialSnapshot()
  snapshot.leads = [
    {
      id: "lead-1",
      workspaceId: "workspace-1",
      name: "Lead testowy",
      company: "Firma",
      email: "",
      phone: "",
      source: "Inne",
      value: 0,
      summary: "",
      notes: "",
      status: "new",
      priority: "medium",
      nextActionTitle: "",
      nextActionAt: "",
      nextActionItemId: null,
      createdAt: updatedAt,
      updatedAt,
    },
  ]
  return snapshot
}

test("choosePreferredSnapshot wybiera lokalny snapshot, gdy zdalny nie istnieje", () => {
  const local = createSnapshotWithLead("2026-04-06T10:00:00.000Z")
  const result = choosePreferredSnapshot(null, local)

  assert.equal(result.source, "local")
  assert.equal(result.snapshot.leads.length, 1)
})

test("choosePreferredSnapshot wybiera lokalny snapshot, gdy zdalny jest pusty", () => {
  const local = createSnapshotWithLead("2026-04-06T10:00:00.000Z")
  const remote = createInitialSnapshot()
  const result = choosePreferredSnapshot(remote, local)

  assert.equal(result.source, "local")
  assert.equal(result.snapshot.leads.length, 1)
})

test("choosePreferredSnapshot wybiera zdalny snapshot, gdy lokalny jest pusty", () => {
  const local = createInitialSnapshot()
  const remote = createSnapshotWithLead("2026-04-06T10:00:00.000Z")
  const result = choosePreferredSnapshot(remote, local)

  assert.equal(result.source, "remote")
  assert.equal(result.snapshot.leads.length, 1)
})

test("choosePreferredSnapshot wybiera nowszy lokalny snapshot, gdy oba mają dane", () => {
  const local = createSnapshotWithLead("2026-04-07T10:00:00.000Z")
  const remote = createSnapshotWithLead("2026-04-06T10:00:00.000Z")
  const result = choosePreferredSnapshot(remote, local)

  assert.equal(result.source, "local")
  assert.equal(result.snapshot.leads[0]?.updatedAt, "2026-04-07T10:00:00.000Z")
})

test("choosePreferredSnapshot wybiera zdalny snapshot, gdy jest nowszy od lokalnego", () => {
  const local = createSnapshotWithLead("2026-04-06T10:00:00.000Z")
  const remote = createSnapshotWithLead("2026-04-07T10:00:00.000Z")
  const result = choosePreferredSnapshot(remote, local)

  assert.equal(result.source, "remote")
  assert.equal(result.snapshot.leads[0]?.updatedAt, "2026-04-07T10:00:00.000Z")
})
