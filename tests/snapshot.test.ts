import test from "node:test"
import assert from "node:assert/strict"
import { createDemoSnapshot, createInitialSnapshot } from "../lib/seed"
import { buildTodaySections } from "../lib/today"

function createNonLegacyDemoSnapshot() {
  const snapshot = createDemoSnapshot()
  return {
    ...snapshot,
    user: {
      ...snapshot.user,
      name: "Tester",
      email: "tester@example.com",
    },
    context: {
      ...snapshot.context,
      seedKind: undefined,
    },
  }
}

import {
  addItemSnapshot,
  addLeadSnapshot,
  deleteItemSnapshot,
  deleteLeadSnapshot,
  loadSnapshot,
  snoozeItemSnapshot,
  toggleItemDoneSnapshot,
  updateItemSnapshot,
  updateLeadSnapshot,
} from "../lib/snapshot"
import { addDaysAt, getItemPrimaryDate, getLeadActiveItemStats, getMonthGrid, getWeekDays, toDateKey } from "../lib/utils"

test("addLeadSnapshot dodaje leada i tworzy prawdziwe powiązane działanie next action", () => {
  const snapshot = createInitialSnapshot()
  const updated = addLeadSnapshot(snapshot, {
    name: "Nowy Lead",
    company: "Firma Test",
    email: "test@example.com",
    phone: "+48 000 000 000",
    source: "Inne",
    value: 4200,
    summary: "",
    notes: "",
    status: "new",
    priority: "medium",
    nextActionTitle: "Oddzwonić",
    nextActionAt: addDaysAt(0, 13, 0),
  })

  const lead = updated.leads[0]!
  const linkedItem = updated.items.find((item) => item.id === lead.nextActionItemId)

  assert.equal(updated.leads.length, 1)
  assert.equal(lead.name, "Nowy Lead")
  assert.equal(lead.value, 4200)
  assert.ok(lead.nextActionItemId)
  assert.equal(linkedItem?.leadId, lead.id)
  assert.equal(linkedItem?.title, "Oddzwonić")
  assert.equal(linkedItem?.showInTasks, true)
  assert.equal(linkedItem?.showInCalendar, true)
})

test("updateLeadSnapshot aktualizuje powiązane działanie next action zamiast drugiego świata danych", () => {
  const snapshot = addLeadSnapshot(createInitialSnapshot(), {
    name: "Lead z akcją",
    company: "",
    email: "",
    phone: "",
    source: "Inne",
    value: 0,
    summary: "",
    notes: "",
    status: "new",
    priority: "medium",
    nextActionTitle: "Pierwsza akcja",
    nextActionAt: addDaysAt(0, 10, 0),
  })

  const lead = snapshot.leads[0]!
  const linkedItemId = lead.nextActionItemId!
  const updated = updateLeadSnapshot(snapshot, lead.id, {
    nextActionTitle: "Druga akcja",
    nextActionAt: addDaysAt(1, 16, 0),
  })

  const updatedLead = updated.leads.find((entry) => entry.id === lead.id)!
  const updatedItem = updated.items.find((item) => item.id === linkedItemId)!

  assert.equal(updatedLead.nextActionItemId, linkedItemId)
  assert.equal(updatedLead.nextActionTitle, "Druga akcja")
  assert.equal(updatedItem.title, "Druga akcja")
  assert.equal(getItemPrimaryDate(updatedItem), addDaysAt(1, 16, 0))
})

test("deleteLeadSnapshot usuwa leada i jego powiązane wpisy", () => {
  const snapshot = addLeadSnapshot(createInitialSnapshot(), {
    name: "Lead do usunięcia",
    company: "",
    email: "",
    phone: "",
    source: "Inne",
    value: 0,
    summary: "",
    notes: "",
    status: "new",
    priority: "medium",
    nextActionTitle: "Zadzwonić",
    nextActionAt: addDaysAt(0, 15, 0),
  })
  const leadId = snapshot.leads[0]!.id

  const updated = deleteLeadSnapshot(snapshot, leadId)

  assert.equal(updated.leads.some((lead) => lead.id === leadId), false)
  assert.equal(updated.items.filter((item) => item.leadId === leadId).length, 0)
})

test("deleteItemSnapshot czyści nextAction leada po usunięciu powiązanego działania", () => {
  const snapshot = addLeadSnapshot(createInitialSnapshot(), {
    name: "Lead z jednym taskiem",
    company: "",
    email: "",
    phone: "",
    source: "Inne",
    value: 0,
    summary: "",
    notes: "",
    status: "new",
    priority: "medium",
    nextActionTitle: "Zrobić task",
    nextActionAt: addDaysAt(0, 9, 0),
  })

  const lead = snapshot.leads[0]!
  const updated = deleteItemSnapshot(snapshot, lead.nextActionItemId!)
  const updatedLead = updated.leads.find((entry) => entry.id === lead.id)!

  assert.equal(updatedLead.nextActionItemId, null)
  assert.equal(updatedLead.nextActionTitle, "")
  assert.equal(updatedLead.nextActionAt, "")
})

test("toggleItemDoneSnapshot przełącza status wpisu", () => {
  const snapshot = createDemoSnapshot()
  const itemId = snapshot.items[0]!.id

  const done = toggleItemDoneSnapshot(snapshot, itemId)
  assert.equal(done.items.find((item) => item.id === itemId)?.status, "done")

  const restored = toggleItemDoneSnapshot(done, itemId)
  assert.equal(restored.items.find((item) => item.id === itemId)?.status, "todo")
})

test("snoozeItemSnapshot odkłada task na nowy termin", () => {
  const snapshot = createDemoSnapshot()
  const task = snapshot.items.find((item) => item.startAt === "" && item.status === "todo")!
  const nextDate = addDaysAt(2, 18, 0)

  const updated = snoozeItemSnapshot(snapshot, task.id, nextDate)
  const changed = updated.items.find((item) => item.id === task.id)!

  assert.equal(changed.status, "snoozed")
  assert.equal(changed.scheduledAt, nextDate)
  assert.equal(changed.startAt, "")
  assert.equal(changed.endAt, "")
})

test("snoozeItemSnapshot przesuwa event i zachowuje jego długość", () => {
  const snapshot = createDemoSnapshot()
  const event = snapshot.items.find((item) => item.recordType === "event")!
  const nextDate = addDaysAt(3, 12, 15)
  const previousDuration = Date.parse(event.endAt) - Date.parse(event.startAt)

  const updated = snoozeItemSnapshot(snapshot, event.id, nextDate)
  const changed = updated.items.find((item) => item.id === event.id)!

  assert.equal(changed.status, "snoozed")
  assert.equal(changed.startAt, nextDate)
  assert.equal(Date.parse(changed.endAt) - Date.parse(changed.startAt), previousDuration)
})

test("snoozeItemSnapshot daje eventowi dodatnią długość nawet po błędnym końcu", () => {
  const snapshot = createDemoSnapshot()
  const event = snapshot.items.find((item) => item.recordType === "event")!
  const broken = {
    ...snapshot,
    items: snapshot.items.map((item) =>
      item.id === event.id
        ? {
            ...item,
            endAt: item.startAt,
          }
        : item,
    ),
  }
  const nextDate = addDaysAt(4, 8, 45)

  const updated = snoozeItemSnapshot(broken, event.id, nextDate)
  const changed = updated.items.find((item) => item.id === event.id)!

  assert.ok(Date.parse(changed.endAt) > Date.parse(changed.startAt))
})

test("snoozeItemSnapshot aktualizuje nextActionAt powiązanego leada", () => {
  const snapshot = addLeadSnapshot(createInitialSnapshot(), {
    name: "Lead ze snoozem",
    company: "",
    email: "",
    phone: "",
    source: "Inne",
    value: 0,
    summary: "",
    notes: "",
    status: "new",
    priority: "medium",
    nextActionTitle: "Oddzwonić",
    nextActionAt: addDaysAt(0, 14, 0),
  })
  const lead = snapshot.leads[0]!
  const nextDate = addDaysAt(2, 19, 0)

  const updated = snoozeItemSnapshot(snapshot, lead.nextActionItemId!, nextDate)
  const changedLead = updated.leads.find((entry) => entry.id === lead.id)!

  assert.equal(changedLead.nextActionAt, nextDate)
})

test("addItemSnapshot dodaje nowe działanie na początek listy", () => {
  const snapshot = createDemoSnapshot()
  const updated = addItemSnapshot(snapshot, {
    leadId: snapshot.leads[0]!.id,
    recordType: "task",
    type: "task",
    title: "Nowe działanie testowe",
    description: "",
    status: "todo",
    priority: "medium",
    scheduledAt: addDaysAt(0, 17, 0),
    startAt: "",
    endAt: "",
    recurrence: "none",
    reminder: "none",
    showInTasks: true,
    showInCalendar: false,
  })

  assert.equal(updated.items[0]?.title, "Nowe działanie testowe")
  assert.equal(updated.items.length, snapshot.items.length + 1)
})

test("loadSnapshot migruje stary next action leada do prawdziwego rekordu działania", () => {
  const legacy = JSON.stringify({
    ...createInitialSnapshot(),
    leads: [
      {
        id: "lead_legacy",
        name: "Lead legacy",
        company: "",
        email: "",
        phone: "",
        source: "Inne",
        value: 0,
        summary: "",
        notes: "",
        status: "new",
        priority: "medium",
        nextActionTitle: "Legacy task",
        nextActionAt: addDaysAt(1, 12, 0),
        createdAt: addDaysAt(-1, 8, 0),
        updatedAt: addDaysAt(-1, 8, 0),
      },
    ],
    items: [],
  })

  const loaded = loadSnapshot(legacy)
  const lead = loaded.leads[0]!
  const linkedItem = loaded.items.find((item) => item.id === lead.nextActionItemId)

  assert.ok(linkedItem)
  assert.equal(linkedItem?.leadId, lead.id)
  assert.equal(linkedItem?.title, "Legacy task")
  assert.equal(lead.nextActionTitle, "Legacy task")
})

test("loadSnapshot daje bezpieczne domyślne pola i kontekst w starszym zapisie bez przecieku z demo", () => {
  const snapshot = createNonLegacyDemoSnapshot()
  const legacy = JSON.stringify({
    ...snapshot,
    context: undefined,
    leads: snapshot.leads.map(({ value, nextActionItemId, ...lead }) => lead),
  })

  const loaded = loadSnapshot(legacy)
  assert.equal(loaded.leads[0]?.value, 0)
  assert.ok(loaded.leads[0]?.nextActionItemId)
  assert.equal(loaded.context.userId, null)
  assert.equal(loaded.context.workspaceId, null)
  assert.equal(loaded.context.accessStatus, "local")
})

test("loadSnapshot uzupełnia brakującą skalę czcionki i profil widoku w starszym zapisie", () => {
  const snapshot = createNonLegacyDemoSnapshot()
  const legacy = JSON.stringify({
    ...snapshot,
    settings: {
      timezone: snapshot.settings.timezone,
      inAppReminders: snapshot.settings.inAppReminders,
      emailReminders: snapshot.settings.emailReminders,
      defaultReminder: snapshot.settings.defaultReminder,
      defaultSnooze: snapshot.settings.defaultSnooze,
      workspaceName: snapshot.settings.workspaceName,
    },
  })

  const loaded = loadSnapshot(legacy)
  assert.equal(loaded.settings.fontScale, "compact")
  assert.equal(loaded.settings.viewProfile, "desktop")
  assert.equal(loaded.settings.theme, "classic")
})

test("loadSnapshot nie buduje relacji po samym leadLabel", () => {
  const snapshot = createInitialSnapshot()
  const raw = JSON.stringify({
    ...snapshot,
    leads: [],
    items: [
      {
        id: "item_label_only",
        leadId: null,
        leadLabel: "Marcin Kowalski",
        recordType: "task",
        type: "task",
        title: "Tekstowy wpis",
        description: "",
        status: "todo",
        priority: "medium",
        scheduledAt: addDaysAt(0, 9, 0),
        startAt: "",
        endAt: "",
        recurrence: "none",
        reminder: "none",
        createdAt: addDaysAt(-1, 8, 0),
        updatedAt: addDaysAt(-1, 8, 0),
        showInTasks: true,
        showInCalendar: false,
      },
    ],
  })

  const loaded = loadSnapshot(raw)
  const item = loaded.items.find((entry) => entry.id === "item_label_only")!

  assert.equal(item.leadId, null)
  assert.equal(item.leadLabel, "")
})

test("addItemSnapshot czyści pół-relację po samym leadLabel", () => {
  const snapshot = createDemoSnapshot()
  const itemWithMatchingLabel = addItemSnapshot(snapshot, {
    leadId: null,
    leadLabel: snapshot.leads[0]!.name,
    recordType: "task",
    type: "task",
    title: "Tekstowy wpis",
    description: "",
    status: "todo",
    priority: "medium",
    scheduledAt: addDaysAt(0, 9, 0),
    startAt: "",
    endAt: "",
    recurrence: "none",
    reminder: "none",
    showInTasks: true,
    showInCalendar: true,
  })

  assert.equal(itemWithMatchingLabel.items[0]?.leadId, null)
  assert.equal(itemWithMatchingLabel.items[0]?.leadLabel, "")
})

test("loadSnapshot synchronizuje leadLabel z prawdziwym leadId", () => {
  const snapshot = createNonLegacyDemoSnapshot()
  const targetLead = snapshot.leads[0]!
  const legacy = JSON.stringify({
    ...snapshot,
    items: [
      {
        ...snapshot.items[0]!,
        id: "item_with_ghost",
        leadId: targetLead.id,
        leadLabel: "Stary ghost label",
      },
    ],
  })

  const loaded = loadSnapshot(legacy)
  const item = loaded.items.find((entry) => entry.id === "item_with_ghost")!
  assert.equal(item.leadId, targetLead.id)
  assert.equal(item.leadLabel, targetLead.name)
})

test("updateLeadSnapshot odświeża helper leadLabel dla itemów z leadId po zmianie nazwy leada", () => {
  const snapshot = addLeadSnapshot(createInitialSnapshot(), {
    name: "Lead do zmiany nazwy",
    company: "",
    email: "",
    phone: "",
    source: "Inne",
    value: 0,
    summary: "",
    notes: "",
    status: "new",
    priority: "medium",
    nextActionTitle: "Zadzwonić",
    nextActionAt: addDaysAt(0, 9, 0),
  })

  const lead = snapshot.leads[0]!
  const updated = updateLeadSnapshot(snapshot, lead.id, { name: "Nowa nazwa leada" })
  const item = updated.items.find((entry) => entry.id === lead.nextActionItemId)!

  assert.equal(item.leadId, lead.id)
  assert.equal(item.leadLabel, "Nowa nazwa leada")
})

test("createInitialSnapshot zwraca pusty stan startowy aplikacji", () => {
  const snapshot = createInitialSnapshot()

  assert.equal(snapshot.leads.length, 0)
  assert.equal(snapshot.items.length, 0)
  assert.equal(snapshot.settings.workspaceName, "ClientPilot")
  assert.equal(snapshot.settings.theme, "classic")
  assert.equal(snapshot.context.accessStatus, "local")
})

test("loadSnapshot bez danych startuje od pustej aplikacji, a nie od demo", () => {
  const loaded = loadSnapshot(null)

  assert.equal(loaded.leads.length, 0)
  assert.equal(loaded.items.length, 0)
})


test("loadSnapshot czyści nietknięty legacy demo snapshot i zwraca pusty start", () => {
  const raw = JSON.stringify(createDemoSnapshot())
  const snapshot = loadSnapshot(raw)

  assert.equal(snapshot.leads.length, 0)
  assert.equal(snapshot.items.length, 0)
  assert.equal(snapshot.user.name, "Twoje konto")
})

test("loadSnapshot nie dziedziczy pól z demo przy częściowo zapisanym leadzie", () => {
  const raw = JSON.stringify({
    leads: [
      {
        id: "lead_partial",
        name: "Nowy lead",
      },
    ],
    items: [],
  })

  const snapshot = loadSnapshot(raw)

  assert.equal(snapshot.leads.length, 1)
  assert.equal(snapshot.leads[0]?.name, "Nowy lead")
  assert.equal(snapshot.leads[0]?.company, "")
  assert.equal(snapshot.leads[0]?.email, "")
  assert.equal(snapshot.leads[0]?.source, "Inne")
  assert.equal(snapshot.leads[0]?.nextActionTitle, "")
})


test("lead next action tworzy task widoczny w Today, kalendarzu i licznikach leada", () => {
  const snapshot = addLeadSnapshot(createInitialSnapshot(), {
    name: "Lead z today i kalendarzem",
    company: "Firma",
    email: "",
    phone: "",
    source: "Inne",
    value: 1200,
    summary: "",
    notes: "",
    status: "new",
    priority: "high",
    nextActionTitle: "Telefon follow-up",
    nextActionAt: "2026-04-05T10:00:00.000Z",
  })

  const lead = snapshot.leads[0]!
  const item = snapshot.items.find((entry) => entry.id === lead.nextActionItemId)!
  const dateOptions = { timeZone: snapshot.settings.timezone, now: "2026-04-05T08:30:00.000Z" }
  const sections = buildTodaySections(snapshot, dateOptions)
  const todaySection = sections.find((section) => section.key === "today")
  const stats = getLeadActiveItemStats(lead.id, snapshot.items, dateOptions)
  const week = getWeekDays(0, lead.nextActionAt, dateOptions)
  const month = getMonthGrid(lead.nextActionAt, dateOptions)
  const itemDateKey = toDateKey(getItemPrimaryDate(item), dateOptions)

  assert.equal(item.recordType, "task")
  assert.equal(item.type, "task")
  assert.equal(item.showInTasks, true)
  assert.equal(item.showInCalendar, true)
  assert.equal(todaySection?.kind, "items")
  assert.equal(todaySection?.kind === "items" ? todaySection.items.some((entry) => entry.id === item.id) : false, true)
  assert.equal(stats.activeCount, 1)
  assert.equal(stats.overdueCount, 0)
  assert.equal(week.includes(itemDateKey), true)
  assert.equal(month.includes(itemDateKey), true)
})

test("edycja linked next action item nie może zamienić go w event ani ukryć z Today i kalendarza", () => {
  const snapshot = addLeadSnapshot(createInitialSnapshot(), {
    name: "Lead z twardą akcją",
    company: "",
    email: "",
    phone: "",
    source: "Inne",
    value: 0,
    summary: "",
    notes: "",
    status: "new",
    priority: "medium",
    nextActionTitle: "Akcja główna",
    nextActionAt: "2026-04-05T10:00:00.000Z",
  })

  const lead = snapshot.leads[0]!
  const updated = updateItemSnapshot(snapshot, lead.nextActionItemId!, {
    type: "meeting",
    recordType: "event",
    showInTasks: false,
    showInCalendar: false,
    leadId: null,
    leadLabel: "Luźny tekst",
  })

  const item = updated.items.find((entry) => entry.id === lead.nextActionItemId)!

  assert.equal(item.leadId, lead.id)
  assert.equal(item.leadLabel, lead.name)
  assert.equal(item.type, "task")
  assert.equal(item.recordType, "task")
  assert.equal(item.showInTasks, true)
  assert.equal(item.showInCalendar, true)
})


test("deleteItemSnapshot zapisuje tombstone usuniÄ™tego taska", () => {
  const snapshot = addLeadSnapshot(createInitialSnapshot(), {
    name: "Lead z tombstone",
    company: "",
    email: "",
    phone: "",
    source: "Inne",
    value: 0,
    summary: "",
    notes: "",
    status: "new",
    priority: "medium",
    nextActionTitle: "UsunÄ…Ä‡ task",
    nextActionAt: addDaysAt(0, 10, 0),
  })

  const lead = snapshot.leads[0]!
  const deletedItemId = lead.nextActionItemId!
  const updated = deleteItemSnapshot(snapshot, deletedItemId)
  const deletedWorkItemIds = updated.deletedWorkItemIds ?? []

  assert.equal(deletedWorkItemIds.includes(deletedItemId), true)
  assert.equal(updated.items.some((item) => item.id === deletedItemId), false)
})