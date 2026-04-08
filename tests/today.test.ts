import test from "node:test"
import assert from "node:assert/strict"
import { createDemoSnapshot, createInitialSnapshot } from "../lib/seed"
import { addLeadSnapshot } from "../lib/snapshot"
import type { WorkItem } from "../lib/types"
import {
  buildTodaySections,
  buildTodayTopStats,
  buildTodayViewModel,
  getEffectiveCollapsed,
  getSectionKeyFromTopStat,
  getTodaySectionMeta,
  moveSectionToTop,
  TODAY_DEFAULT_COLLAPSED,
  TODAY_SECTION_ORDER,
} from "../lib/today"
import { getCalendarItems, getTaskListItems } from "../lib/utils"

test("Today ma egzekucyjną kolejność sekcji zgodną z etapem", () => {
  assert.deepEqual(TODAY_SECTION_ORDER, [
    "overdue",
    "missing_next_step",
    "waiting_too_long",
    "today",
    "this_week",
    "high_value_at_risk",
    "stale",
    "top_moves_today",
  ])
})

test("demo snapshot daje oczekiwane liczniki sekcji po przebudowie Today", () => {
  const snapshot = createDemoSnapshot()
  const sections = buildTodaySections(snapshot)

  const counts = Object.fromEntries(sections.map((section) => [section.key, section.count]))

  assert.equal(counts.overdue, 2)
  assert.equal(counts.missing_next_step, 2)
  assert.equal(counts.waiting_too_long, 2)
  assert.equal(counts.today, 3)
  assert.equal(counts.this_week, 2)
  assert.equal(counts.high_value_at_risk, 2)
  assert.equal(counts.stale, 1)
  assert.equal(counts.top_moves_today, 5)
})

test("item nie dubluje się bez sensu między overdue, today i this_week", () => {
  const snapshot = createDemoSnapshot()
  const sections = buildTodaySections(snapshot)
  const overdueSection = sections.find((section) => section.key === "overdue")
  const todaySection = sections.find((section) => section.key === "today")
  const thisWeekSection = sections.find((section) => section.key === "this_week")

  const overdueIds = new Set(overdueSection?.kind === "items" ? overdueSection.items.map((item) => item.id) : [])
  const todayIds = new Set(todaySection?.kind === "items" ? todaySection.items.map((item) => item.id) : [])
  const thisWeekIds = new Set(thisWeekSection?.kind === "items" ? thisWeekSection.items.map((item) => item.id) : [])

  overdueIds.forEach((id) => {
    assert.equal(todayIds.has(id), false)
    assert.equal(thisWeekIds.has(id), false)
  })

  todayIds.forEach((id) => {
    assert.equal(thisWeekIds.has(id), false)
  })
})

test("leady mają jedno główne miejsce alarmowe poza rankingiem najważniejszych ruchów", () => {
  const snapshot = createDemoSnapshot()
  const sections = buildTodaySections(snapshot)
  const primarySections = sections.filter((section) =>
    ["missing_next_step", "waiting_too_long", "high_value_at_risk", "stale"].includes(section.key),
  )

  const seen = new Set<string>()

  primarySections.forEach((section) => {
    if (section.kind !== "leads") return

    section.leads.forEach((lead) => {
      assert.equal(seen.has(lead.id), false)
      seen.add(lead.id)
    })
  })
})

test("buildTodaySections i overdue działają po lokalnym dniu użytkownika, nie po surowym UTC", () => {
  const snapshot = createDemoSnapshot()
  snapshot.settings.timezone = "Europe/Warsaw"
  snapshot.items = [
    {
      ...snapshot.items[0]!,
      id: "late-night-task",
      type: "task",
      title: "Nocny task",
      status: "todo",
      showInTasks: true,
      showInCalendar: true,
      startAt: "2026-04-05T22:30:00.000Z",
      scheduledAt: "",
      createdAt: "2026-04-05T20:00:00.000Z",
      updatedAt: "2026-04-05T20:00:00.000Z",
    },
  ]

  const sections = buildTodaySections(snapshot, { now: "2026-04-05T22:45:00.000Z" })
  const todaySection = sections.find((section) => section.key === "today")
  const overdueSection = sections.find((section) => section.key === "overdue")

  assert.equal(todaySection?.count, 1)
  assert.equal(overdueSection?.count, 0)
})

test("moveSectionToTop przenosi wskazaną sekcję na początek bez duplikatów", () => {
  const result = moveSectionToTop(TODAY_SECTION_ORDER, "overdue")
  assert.deepEqual(result, [
    "overdue",
    "missing_next_step",
    "waiting_too_long",
    "today",
    "this_week",
    "high_value_at_risk",
    "stale",
    "top_moves_today",
  ])
})

test("górne liczniki Today mapują się do sekcji egzekucyjnych", () => {
  const snapshot = createDemoSnapshot()
  const topStats = buildTodayTopStats(snapshot)

  assert.deepEqual(topStats, [
    {
      key: "overdue",
      label: "Zaległe",
      value: 2,
      color: "#f87171",
    },
    {
      key: "missing_next_step",
      label: "Bez next step",
      value: 2,
      color: "#fb7185",
    },
    {
      key: "waiting_too_long",
      label: "Bez odpowiedzi",
      value: 2,
      color: "#f97316",
    },
    {
      key: "today",
      label: "Dziś",
      value: 3,
      color: "#f59e0b",
    },
    {
      key: "high_value_at_risk",
      label: "High value at risk",
      value: 2,
      color: "#facc15",
    },
  ])
})

test("po oznaczeniu wpisów jako done liczniki operacyjne spadają", () => {
  const snapshot = createDemoSnapshot()
  const overdueItem = snapshot.items.find((item) => item.title === "Zadzwonić w sprawie oferty")
  const todayItem = snapshot.items.find((item) => item.title === "Przygotować brief rebrandingowy")
  const callItem = snapshot.items.find((item) => item.title === "Rozmowa wstępna — Tomasz")

  assert.ok(overdueItem)
  assert.ok(todayItem)
  assert.ok(callItem)

  overdueItem!.status = "done"
  todayItem!.status = "done"
  callItem!.status = "done"

  const values = Object.fromEntries(buildTodayTopStats(snapshot).map((stat) => [stat.key, stat.value]))

  assert.equal(values.overdue, 1)
  assert.equal(values.today, 1)
})

test("kliknięcie górnego licznika mapuje się na właściwą sekcję", () => {
  assert.equal(getSectionKeyFromTopStat("overdue"), "overdue")
  assert.equal(getSectionKeyFromTopStat("missing_next_step"), "missing_next_step")
  assert.equal(getSectionKeyFromTopStat("waiting_too_long"), "waiting_too_long")
  assert.equal(getSectionKeyFromTopStat("today"), "today")
  assert.equal(getSectionKeyFromTopStat("high_value_at_risk"), "high_value_at_risk")
})

test("górne liczniki sekcji mają kolory zgodne z nagłówkami sekcji", () => {
  const snapshot = createDemoSnapshot()
  const topStats = buildTodayTopStats(snapshot)

  const expected = {
    overdue: getTodaySectionMeta("overdue").color,
    missing_next_step: getTodaySectionMeta("missing_next_step").color,
    waiting_too_long: getTodaySectionMeta("waiting_too_long").color,
    today: getTodaySectionMeta("today").color,
    high_value_at_risk: getTodaySectionMeta("high_value_at_risk").color,
  }

  assert.equal(topStats.find((stat) => stat.key === "overdue")?.color, expected.overdue)
  assert.equal(topStats.find((stat) => stat.key === "missing_next_step")?.color, expected.missing_next_step)
  assert.equal(topStats.find((stat) => stat.key === "waiting_too_long")?.color, expected.waiting_too_long)
  assert.equal(topStats.find((stat) => stat.key === "today")?.color, expected.today)
  assert.equal(topStats.find((stat) => stat.key === "high_value_at_risk")?.color, expected.high_value_at_risk)
})

test("sekcja top_moves_today daje się przenieść na początek jak pozostałe sekcje", () => {
  const result = moveSectionToTop(TODAY_SECTION_ORDER, "top_moves_today")
  assert.deepEqual(result, [
    "top_moves_today",
    "overdue",
    "missing_next_step",
    "waiting_too_long",
    "today",
    "this_week",
    "high_value_at_risk",
    "stale",
  ])
})

test("sekcja otwarta tymczasowo z licznika zwija się po kliknięciu innej sekcji, jeśli była domyślnie zwinięta", () => {
  const manualCollapsed = {
    overdue: true,
    missing_next_step: false,
    waiting_too_long: false,
    today: true,
    this_week: false,
    high_value_at_risk: false,
    stale: false,
    top_moves_today: false,
  }

  assert.equal(getEffectiveCollapsed(manualCollapsed, "overdue", "overdue"), false)
  assert.equal(getEffectiveCollapsed(manualCollapsed, "today", "overdue"), true)
  assert.equal(getEffectiveCollapsed(manualCollapsed, "today", "today"), false)
})

test("sekcja ręcznie rozwinięta zostaje otwarta nawet po klikaniu innych liczników", () => {
  const manualCollapsed = {
    overdue: true,
    missing_next_step: false,
    waiting_too_long: false,
    today: false,
    this_week: false,
    high_value_at_risk: false,
    stale: false,
    top_moves_today: false,
  }

  assert.equal(getEffectiveCollapsed(manualCollapsed, "overdue", "today"), false)
  assert.equal(getEffectiveCollapsed(manualCollapsed, "today", "today"), false)
})

test("lead z next action trafia do Today z jednego wspólnego modelu WorkItem", () => {
  const snapshot = addLeadSnapshot(createInitialSnapshot(), {
    name: "Lead z Today",
    company: "",
    email: "",
    phone: "",
    source: "Inne",
    value: 0,
    summary: "",
    notes: "",
    status: "new",
    priority: "medium",
    nextActionTitle: "Oddzwonić dziś",
    nextActionAt: "2026-04-05T10:00:00.000Z",
  })

  const sections = buildTodaySections(snapshot, { now: "2026-04-05T08:30:00.000Z", timeZone: snapshot.settings.timezone })
  const todaySection = sections.find((section) => section.key === "today")

  assert.equal(todaySection?.kind, "items")
  assert.equal(todaySection?.count, 1)
  assert.equal(todaySection?.kind === "items" ? todaySection.items[0]?.title : "", "Oddzwonić dziś")
  assert.equal(todaySection?.kind === "items" ? todaySection.items[0]?.leadId : null, snapshot.leads[0]?.id)
})

test("calendar visibility filtruje weekly i mini-month tylko po showInCalendar", () => {
  const snapshot = createInitialSnapshot()
  const visibleCalendarItem: WorkItem = {
    id: "calendar-visible",
    workspaceId: null,
    leadId: null,
    leadLabel: "",
    recordType: "task",
    type: "task",
    title: "Widoczne w kalendarzu",
    description: "",
    status: "todo",
    priority: "medium",
    scheduledAt: "2026-04-05T09:00:00.000Z",
    startAt: "",
    endAt: "",
    recurrence: "none",
    reminder: "none",
    createdAt: "2026-04-05T08:00:00.000Z",
    updatedAt: "2026-04-05T08:00:00.000Z",
    showInTasks: true,
    showInCalendar: true,
  }
  const hiddenCalendarItem: WorkItem = {
    ...visibleCalendarItem,
    id: "calendar-hidden",
    title: "Ukryte w kalendarzu",
    showInCalendar: false,
  }

  snapshot.items = [visibleCalendarItem, hiddenCalendarItem]

  assert.deepEqual(
    getCalendarItems(snapshot.items).map((item) => item.id),
    ["calendar-visible"],
  )
})

test("meeting-like item widoczny w kalendarzu trafia do sekcji today, a nie do zaległych przy terminie bieżącym", () => {
  const snapshot = createInitialSnapshot()
  snapshot.items = [
    {
      id: "meeting-visible",
      workspaceId: null,
      leadId: null,
      leadLabel: "",
      recordType: "event",
      type: "meeting",
      title: "Spotkanie demo",
      description: "",
      status: "todo",
      priority: "high",
      scheduledAt: "",
      startAt: "2026-04-05T10:00:00.000Z",
      endAt: "2026-04-05T10:30:00.000Z",
      recurrence: "none",
      reminder: "none",
      createdAt: "2026-04-05T08:00:00.000Z",
      updatedAt: "2026-04-05T08:00:00.000Z",
      showInTasks: true,
      showInCalendar: true,
    },
  ]

  const sections = buildTodaySections(snapshot, { now: "2026-04-05T07:00:00.000Z", timeZone: snapshot.settings.timezone })
  const overdueSection = sections.find((section) => section.key === "overdue")
  const todaySection = sections.find((section) => section.key === "today")

  assert.deepEqual(overdueSection?.kind === "items" ? overdueSection.items.map((item) => item.id) : [], [])
  assert.deepEqual(todaySection?.kind === "items" ? todaySection.items.map((item) => item.id) : [""], ["meeting-visible"])
  assert.deepEqual(getTaskListItems(snapshot.items).map((item) => item.id), [])
})

test("meeting-like item ukryty z kalendarza może działać jako task-only bez wejścia do widoków kalendarzowych", () => {
  const snapshot = createInitialSnapshot()
  snapshot.items = [
    {
      id: "meeting-task-only",
      workspaceId: null,
      leadId: null,
      leadLabel: "",
      recordType: "task",
      type: "meeting",
      title: "Spotkanie zapisane jako task-only",
      description: "",
      status: "todo",
      priority: "medium",
      scheduledAt: "2026-04-05T11:00:00.000Z",
      startAt: "",
      endAt: "",
      recurrence: "none",
      reminder: "none",
      createdAt: "2026-04-05T08:00:00.000Z",
      updatedAt: "2026-04-05T08:00:00.000Z",
      showInTasks: true,
      showInCalendar: false,
    },
  ]

  const sections = buildTodaySections(snapshot, { now: "2026-04-05T07:00:00.000Z", timeZone: snapshot.settings.timezone })
  const todaySection = sections.find((section) => section.key === "today")

  assert.deepEqual(getCalendarItems(snapshot.items).map((item) => item.id), [])
  assert.deepEqual(getTaskListItems(snapshot.items).map((item) => item.id), ["meeting-task-only"])
  assert.deepEqual(todaySection?.kind === "items" ? todaySection.items.map((item) => item.id) : [], ["meeting-task-only"])
})

test("task-only item zostaje poza kalendarzem, ale jest widoczny na task surfaces", () => {
  const snapshot = createInitialSnapshot()
  snapshot.items = [
    {
      id: "task-only",
      workspaceId: null,
      leadId: null,
      leadLabel: "",
      recordType: "task",
      type: "task",
      title: "Task only",
      description: "",
      status: "todo",
      priority: "medium",
      scheduledAt: "2026-04-05T12:00:00.000Z",
      startAt: "",
      endAt: "",
      recurrence: "none",
      reminder: "none",
      createdAt: "2026-04-05T08:00:00.000Z",
      updatedAt: "2026-04-05T08:00:00.000Z",
      showInTasks: true,
      showInCalendar: false,
    },
  ]

  assert.deepEqual(getCalendarItems(snapshot.items).map((item) => item.id), [])
  assert.deepEqual(getTaskListItems(snapshot.items).map((item) => item.id), ["task-only"])
})

test("buildTodayViewModel jest jednym source of truth dla sekcji i liczników Today", () => {
  const snapshot = createDemoSnapshot()
  const viewModel = buildTodayViewModel(snapshot, { timeZone: snapshot.settings.timezone, now: "2026-04-05T08:30:00.000Z" })
  const countsFromSections = Object.fromEntries(viewModel.sections.map((section) => [section.key, section.count]))
  const countsFromTopStats = Object.fromEntries(viewModel.topStats.map((stat) => [stat.key, stat.value]))

  assert.equal(viewModel.isEmptyWorkspace, false)
  assert.equal(typeof viewModel.dateLabel, "string")
  assert.ok(viewModel.dateLabel.length > 0)
  assert.equal(countsFromTopStats.overdue, countsFromSections.overdue)
  assert.equal(countsFromTopStats.missing_next_step, countsFromSections.missing_next_step)
  assert.equal(countsFromTopStats.waiting_too_long, countsFromSections.waiting_too_long)
  assert.equal(countsFromTopStats.today, countsFromSections.today)
  assert.equal(countsFromTopStats.high_value_at_risk, countsFromSections.high_value_at_risk)
})

test("pusty workspace dostaje pusty view-model Today bez alternatywnej ścieżki demo", () => {
  const snapshot = createInitialSnapshot()
  const viewModel = buildTodayViewModel(snapshot, { timeZone: snapshot.settings.timezone, now: "2026-04-05T08:30:00.000Z" })

  assert.equal(viewModel.isEmptyWorkspace, true)
  assert.deepEqual(
    Object.fromEntries(viewModel.sections.map((section) => [section.key, section.count])),
    {
      overdue: 0,
      missing_next_step: 0,
      waiting_too_long: 0,
      today: 0,
      this_week: 0,
      high_value_at_risk: 0,
      stale: 0,
      top_moves_today: 0,
    },
  )
  assert.deepEqual(
    Object.fromEntries(viewModel.topStats.map((stat) => [stat.key, stat.value])),
    {
      overdue: 0,
      missing_next_step: 0,
      waiting_too_long: 0,
      today: 0,
      high_value_at_risk: 0,
    },
  )
})

test("Today korzysta ze wspólnego domyślnego stanu zwijania sekcji", () => {
  assert.deepEqual(TODAY_DEFAULT_COLLAPSED, {
    overdue: false,
    missing_next_step: false,
    waiting_too_long: false,
    today: false,
    this_week: false,
    high_value_at_risk: false,
    stale: false,
    top_moves_today: false,
  })
})

test("buildTodayViewModel buduje etykietę dnia z lokalnego day key bez przesunięcia przez UTC", () => {
  const snapshot = createInitialSnapshot()
  snapshot.settings.timezone = "America/Los_Angeles"

  const viewModel = buildTodayViewModel(snapshot, {
    timeZone: snapshot.settings.timezone,
    now: "2026-04-06T06:30:00.000Z",
  })

  assert.match(viewModel.dateLabel, /5 kwietnia 2026/)
})

test("lead bez next step trafia do sekcji missing_next_step", () => {
  const snapshot = createInitialSnapshot()
  snapshot.leads = [
    {
      id: "lead_missing",
      workspaceId: null,
      name: "Lead bez kroku",
      company: "",
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
      createdAt: "2026-04-01T09:00:00.000Z",
      updatedAt: "2026-04-01T09:00:00.000Z",
    },
  ]

  const sections = buildTodaySections(snapshot, { now: "2026-04-07T08:00:00.000Z", timeZone: snapshot.settings.timezone })
  const section = sections.find((entry) => entry.key === "missing_next_step")

  assert.equal(section?.kind, "leads")
  assert.equal(section?.count, 1)
})

test("lead waiting za długo trafia do sekcji waiting_too_long", () => {
  const snapshot = createInitialSnapshot()
  snapshot.leads = [
    {
      id: "lead_waiting",
      workspaceId: null,
      name: "Lead waiting",
      company: "",
      email: "",
      phone: "",
      source: "Inne",
      value: 0,
      summary: "",
      notes: "",
      status: "offer_sent",
      priority: "medium",
      nextActionTitle: "",
      nextActionAt: "",
      nextActionItemId: null,
      createdAt: "2026-04-01T09:00:00.000Z",
      updatedAt: "2026-04-01T09:00:00.000Z",
    },
  ]
  snapshot.items = [
    {
      id: "reply_done",
      workspaceId: null,
      leadId: "lead_waiting",
      leadLabel: "Lead waiting",
      recordType: "task",
      type: "reply",
      title: "Odpowiedź",
      description: "",
      status: "done",
      priority: "medium",
      scheduledAt: "2026-04-03T09:00:00.000Z",
      startAt: "",
      endAt: "",
      recurrence: "none",
      reminder: "none",
      createdAt: "2026-04-03T09:00:00.000Z",
      updatedAt: "2026-04-03T10:00:00.000Z",
      showInTasks: true,
      showInCalendar: false,
    },
    {
      id: "follow_up_overdue",
      workspaceId: null,
      leadId: "lead_waiting",
      leadLabel: "Lead waiting",
      recordType: "task",
      type: "follow_up",
      title: "Follow-up",
      description: "",
      status: "todo",
      priority: "medium",
      scheduledAt: "2026-04-04T09:00:00.000Z",
      startAt: "",
      endAt: "",
      recurrence: "none",
      reminder: "none",
      createdAt: "2026-04-04T09:00:00.000Z",
      updatedAt: "2026-04-04T09:00:00.000Z",
      showInTasks: true,
      showInCalendar: false,
    },
  ]

  const sections = buildTodaySections(snapshot, { now: "2026-04-07T08:00:00.000Z", timeZone: snapshot.settings.timezone })
  const section = sections.find((entry) => entry.key === "waiting_too_long")

  assert.equal(section?.kind, "leads")
  assert.equal(section?.count, 1)
})

test("item z tego tygodnia trafia do sekcji this_week", () => {
  const snapshot = createInitialSnapshot()
  snapshot.items = [
    {
      id: "week_item",
      workspaceId: null,
      leadId: null,
      leadLabel: "",
      recordType: "task",
      type: "task",
      title: "Task w tym tygodniu",
      description: "",
      status: "todo",
      priority: "medium",
      scheduledAt: "2026-04-09T10:00:00.000Z",
      startAt: "",
      endAt: "",
      recurrence: "none",
      reminder: "none",
      createdAt: "2026-04-07T08:00:00.000Z",
      updatedAt: "2026-04-07T08:00:00.000Z",
      showInTasks: true,
      showInCalendar: false,
    },
  ]

  const sections = buildTodaySections(snapshot, { now: "2026-04-07T08:00:00.000Z", timeZone: snapshot.settings.timezone })
  const section = sections.find((entry) => entry.key === "this_week")

  assert.equal(section?.kind, "items")
  assert.equal(section?.count, 1)
})

test("najważniejsze ruchy dziś są sortowane malejąco po dailyPriorityScore", () => {
  const snapshot = createDemoSnapshot()
  const sections = buildTodaySections(snapshot)
  const section = sections.find((entry) => entry.key === "top_moves_today")

  assert.equal(section?.kind, "leads")
  assert.ok((section?.kind === "leads" ? section.leads.length : 0) > 0)

  if (section?.kind === "leads") {
    const scores = section.leads.map((lead) => lead.computed.dailyPriorityScore)
    const sortedScores = [...scores].sort((left, right) => right - left)
    assert.deepEqual(scores, sortedScores)
  }
})


