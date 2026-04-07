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

test("sekcje Dziś mają oczekiwane liczniki z paczki startowej po deduplikacji", () => {
  const snapshot = createDemoSnapshot()
  const sections = buildTodaySections(snapshot)

  const counts = Object.fromEntries(sections.map((section) => [section.key, section.count]))

  assert.equal(counts.meetings, 1)
  assert.equal(counts.overdue, 2)
  assert.equal(counts.missing_next_step, 2)
  assert.equal(counts.waiting_too_long, 1)
  assert.equal(counts.today, 2)
  assert.equal(counts.high_value_at_risk, 4)
  assert.equal(counts.stale, 7)
  assert.equal(counts.all_leads, 8)
  assert.equal(typeof counts.this_week, "number")
})

test("w Dziś ten sam wpis nie pojawia się równocześnie w sekcji spotkań i zadań dziś", () => {
  const snapshot = createDemoSnapshot()
  const sections = buildTodaySections(snapshot)
  const meetingsSection = sections.find((section) => section.key === "meetings")
  const todaySection = sections.find((section) => section.key === "today")
  const meetingIds = new Set(
    meetingsSection?.kind === "items" ? meetingsSection.items.map((item) => item.id) : [],
  )
  const todayIds = new Set(todaySection?.kind === "items" ? todaySection.items.map((item) => item.id) : [])

  meetingIds.forEach((id) => {
    assert.equal(todayIds.has(id), false)
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
    "meetings",
    "missing_next_step",
    "waiting_too_long",
    "today",
    "this_week",
    "high_value_at_risk",
    "stale",
    "all_leads",
  ])
})

test("górne liczniki Dziś mają oczekiwane wartości i kolejność", () => {
  const snapshot = createDemoSnapshot()
  const topStats = buildTodayTopStats(snapshot)

  assert.deepEqual(topStats, [
    {
      key: "all_leads",
      label: "Wszystkie leady",
      value: 8,
      color: "#f0ede8",
    },
    {
      key: "today",
      label: "Zadania dziś",
      value: 2,
      color: "#f59e0b",
    },
    {
      key: "overdue",
      label: "Zaległe",
      value: 2,
      color: "#f87171",
    },
    {
      key: "meetings",
      label: "Spotkania dziś",
      value: 1,
      color: "#a78bfa",
    },
    {
      key: "stale",
      label: "Bez kontaktu",
      value: 7,
      color: "#6b7280",
    },
  ])
})

test("górne liczniki Dziś aktualizują się po oznaczeniu wpisów jako zrobione", () => {
  const snapshot = createDemoSnapshot()
  const overdueItem = snapshot.items.find((item) => item.title === "Zadzwonić w sprawie oferty")
  const todayItem = snapshot.items.find((item) => item.title === "Przygotować brief rebrandingowy")
  const meetingItem = snapshot.items.find((item) => item.title === "Rozmowa wstępna — Tomasz")

  assert.ok(overdueItem)
  assert.ok(todayItem)
  assert.ok(meetingItem)

  overdueItem!.status = "done"
  todayItem!.status = "done"
  meetingItem!.status = "done"

  const topStats = buildTodayTopStats(snapshot)
  const values = Object.fromEntries(topStats.map((stat) => [stat.key, stat.value]))

  assert.deepEqual(values, {
    all_leads: 8,
    today: 1,
    overdue: 1,
    meetings: 0,
    stale: 6,
  })
})

test("kliknięcie górnego licznika mapuje się na właściwą sekcję", () => {
  assert.equal(getSectionKeyFromTopStat("all_leads"), "all_leads")
  assert.equal(getSectionKeyFromTopStat("meetings"), "meetings")
  assert.equal(getSectionKeyFromTopStat("overdue"), "overdue")
  assert.equal(getSectionKeyFromTopStat("today"), "today")
  assert.equal(getSectionKeyFromTopStat("stale"), "stale")
})

test("górne liczniki sekcji mają kolory zgodne z nagłówkami sekcji", () => {
  const snapshot = createDemoSnapshot()
  const topStats = buildTodayTopStats(snapshot)

  const expected = {
    today: getTodaySectionMeta("today").color,
    overdue: getTodaySectionMeta("overdue").color,
    meetings: getTodaySectionMeta("meetings").color,
    stale: getTodaySectionMeta("stale").color,
  }

  assert.equal(topStats.find((stat) => stat.key === "today")?.color, expected.today)
  assert.equal(topStats.find((stat) => stat.key === "overdue")?.color, expected.overdue)
  assert.equal(topStats.find((stat) => stat.key === "meetings")?.color, expected.meetings)
  assert.equal(topStats.find((stat) => stat.key === "stale")?.color, expected.stale)
})

test("sekcja bez kontaktu daje się przenieść na początek jak pozostałe sekcje", () => {
  const result = moveSectionToTop(TODAY_SECTION_ORDER, "stale")
  assert.deepEqual(result, [
    "stale",
    "meetings",
    "overdue",
    "missing_next_step",
    "waiting_too_long",
    "today",
    "this_week",
    "high_value_at_risk",
    "all_leads",
  ])
})

test("sekcja otwarta tymczasowo z licznika zwija się po kliknięciu innej sekcji, jeśli była domyślnie zwinięta", () => {
  const manualCollapsed = {
    all_leads: true,
    meetings: false,
    overdue: true,
    missing_next_step: false,
    waiting_too_long: false,
    today: true,
    this_week: false,
    high_value_at_risk: false,
    stale: false,
  }

  assert.equal(getEffectiveCollapsed(manualCollapsed, "overdue", "overdue"), false)
  assert.equal(getEffectiveCollapsed(manualCollapsed, "today", "overdue"), true)
  assert.equal(getEffectiveCollapsed(manualCollapsed, "today", "today"), false)
})

test("sekcja ręcznie rozwinięta zostaje otwarta nawet po klikaniu innych liczników", () => {
  const manualCollapsed = {
    all_leads: false,
    meetings: false,
    overdue: true,
    missing_next_step: false,
    waiting_too_long: false,
    today: true,
    this_week: false,
    high_value_at_risk: false,
    stale: false,
  }

  assert.equal(getEffectiveCollapsed(manualCollapsed, "overdue", "all_leads"), false)
  assert.equal(getEffectiveCollapsed(manualCollapsed, "today", "all_leads"), false)
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

test("meeting-like item widoczny w kalendarzu trafia tylko do sekcji spotkań, a nie do zwykłego Dziś ani listy tasków", () => {
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
  const meetingsSection = sections.find((section) => section.key === "meetings")
  const todaySection = sections.find((section) => section.key === "today")

  assert.equal(meetingsSection?.kind, "items")
  assert.deepEqual(meetingsSection?.kind === "items" ? meetingsSection.items.map((item) => item.id) : [], ["meeting-visible"])
  assert.deepEqual(todaySection?.kind === "items" ? todaySection.items.map((item) => item.id) : [], [])
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
  const meetingsSection = sections.find((section) => section.key === "meetings")
  const todaySection = sections.find((section) => section.key === "today")

  assert.deepEqual(getCalendarItems(snapshot.items).map((item) => item.id), [])
  assert.deepEqual(getTaskListItems(snapshot.items).map((item) => item.id), ["meeting-task-only"])
  assert.deepEqual(meetingsSection?.kind === "items" ? meetingsSection.items.map((item) => item.id) : [], [])
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
  assert.equal(countsFromTopStats.all_leads, countsFromSections.all_leads)
  assert.equal(countsFromTopStats.meetings, countsFromSections.meetings)
  assert.equal(countsFromTopStats.overdue, countsFromSections.overdue)
  assert.equal(countsFromTopStats.today, countsFromSections.today)
  assert.equal(countsFromTopStats.stale, countsFromSections.stale)
})

test("pusty workspace dostaje pusty view-model Today bez alternatywnej ścieżki demo", () => {
  const snapshot = createInitialSnapshot()
  const viewModel = buildTodayViewModel(snapshot, { timeZone: snapshot.settings.timezone, now: "2026-04-05T08:30:00.000Z" })

  assert.equal(viewModel.isEmptyWorkspace, true)
  assert.deepEqual(
    Object.fromEntries(viewModel.sections.map((section) => [section.key, section.count])),
    {
      meetings: 0,
      overdue: 0,
      missing_next_step: 0,
      waiting_too_long: 0,
      today: 0,
      this_week: 0,
      high_value_at_risk: 0,
      stale: 0,
      all_leads: 0,
    },
  )
  assert.deepEqual(
    Object.fromEntries(viewModel.topStats.map((stat) => [stat.key, stat.value])),
    {
      all_leads: 0,
      today: 0,
      overdue: 0,
      meetings: 0,
      stale: 0,
    },
  )
})

test("Today korzysta ze wspólnego domyślnego stanu zwijania sekcji", () => {
  assert.deepEqual(TODAY_DEFAULT_COLLAPSED, {
    all_leads: true,
    meetings: false,
    overdue: false,
    missing_next_step: false,
    waiting_too_long: false,
    today: false,
    this_week: false,
    high_value_at_risk: false,
    stale: false,
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
      status: "waiting",
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