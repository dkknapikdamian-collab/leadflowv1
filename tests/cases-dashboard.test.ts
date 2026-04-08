import assert from "node:assert/strict"
import test from "node:test"
import { buildCasesDashboard } from "../lib/repository/cases-dashboard"
import { createInitialSnapshot } from "../lib/seed"

test("buildCasesDashboard liczy statystyki i filtry dla spraw", () => {
  const snapshot = createInitialSnapshot()
  snapshot.leads = [
    {
      id: "lead-1",
      workspaceId: "ws-1",
      name: "Anna",
      company: "Studio A",
      email: "",
      phone: "",
      source: "LinkedIn",
      contactId: "contact-1",
      caseId: "case-1",
      value: 1000,
      summary: "",
      notes: "szablon",
      status: "won",
      priority: "high",
      nextActionTitle: "Dopisac brakujace materialy",
      nextActionAt: "2026-04-10T10:00:00.000Z",
      nextActionItemId: null,
      createdAt: "2026-04-08T10:00:00.000Z",
      updatedAt: "2026-04-08T10:00:00.000Z",
    },
    {
      id: "lead-2",
      workspaceId: "ws-1",
      name: "Bartek",
      company: "Studio B",
      email: "",
      phone: "",
      source: "Polecenie",
      contactId: "contact-2",
      caseId: "case-2",
      value: 2000,
      summary: "",
      notes: "",
      status: "ready_to_start",
      priority: "medium",
      nextActionTitle: "Start realizacji",
      nextActionAt: "2026-04-11T10:00:00.000Z",
      nextActionItemId: null,
      createdAt: "2026-04-08T10:00:00.000Z",
      updatedAt: "2026-04-08T10:00:00.000Z",
    },
  ]

  snapshot.items = [
    {
      id: "item-1",
      workspaceId: "ws-1",
      leadId: "lead-1",
      leadLabel: "Anna",
      recordType: "task",
      type: "task",
      title: "Czeka na klienta: doslanie plikow",
      description: "",
      status: "todo",
      priority: "high",
      scheduledAt: "2026-04-07T10:00:00.000Z",
      startAt: "",
      endAt: "",
      recurrence: "none",
      reminder: "1h_before",
      createdAt: "2026-04-08T10:00:00.000Z",
      updatedAt: "2026-04-08T10:00:00.000Z",
      showInTasks: true,
      showInCalendar: false,
    },
    {
      id: "item-2",
      workspaceId: "ws-1",
      leadId: "lead-2",
      leadLabel: "Bartek",
      recordType: "task",
      type: "task",
      title: "Checklista gotowa",
      description: "",
      status: "done",
      priority: "medium",
      scheduledAt: "2026-04-08T10:00:00.000Z",
      startAt: "",
      endAt: "",
      recurrence: "none",
      reminder: "none",
      createdAt: "2026-04-08T10:00:00.000Z",
      updatedAt: "2026-04-08T10:00:00.000Z",
      showInTasks: true,
      showInCalendar: false,
    },
  ]

  const all = buildCasesDashboard(snapshot, "all")
  assert.equal(all.all.length, 2)
  assert.equal(all.stats.active, 2)
  assert.ok(all.requiresMoveToday.length >= 1)

  const blocked = buildCasesDashboard(snapshot, "blocked")
  assert.ok(blocked.filtered.every((entry) => entry.operationalStatus === "blocked"))
})
