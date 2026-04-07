import test from "node:test"
import assert from "node:assert/strict"
import { createDemoSnapshot } from "../lib/seed"
import {
  findLeadByText,
  formatDateKeyLong,
  formatDateKeyWeekday,
  formatRelativeDateTimeShort,
  formatTime,
  fromInputValue,
  getNextDaySnoozeAtPreferredTime,
  getNextSnoozeByHours,
  getCurrentDateKey,
  getItemLeadLabel,
  getMonthGrid,
  getRelativeDayLabel,
  getWeekDays,
  getWeekOffsetFromCurrent,
  toDateKey,
  toInputValue,
} from "../lib/utils"

test("getRelativeDayLabel zwraca dziś, wczoraj i jutro", () => {
  const now = "2026-04-05T12:00:00.000Z"
  assert.equal(getRelativeDayLabel("2026-04-05T15:00:00.000Z", { now }), "dziś")
  assert.equal(getRelativeDayLabel("2026-04-04T10:00:00.000Z", { now }), "wczoraj")
  assert.equal(getRelativeDayLabel("2026-04-06T11:00:00.000Z", { now }), "jutro")
})

test("formatRelativeDateTimeShort dokleja godzinę do etykiety względnej", () => {
  const value = formatRelativeDateTimeShort("2026-04-03T12:00:00.000Z", {
    now: "2026-04-05T12:00:00.000Z",
    timeZone: "UTC",
  })
  assert.match(value, /^2 dni temu 12:00$/)
})

test("toDateKey zwraca poprawny klucz dnia w lokalnym formacie YYYY-MM-DD", () => {
  const iso = "2026-04-05T09:30:00.000Z"
  assert.equal(toDateKey(iso).length, 10)
  assert.match(toDateKey(iso), /^\d{4}-\d{2}-\d{2}$/)
})

test("toDateKey respektuje lokalny dzień użytkownika i nie opiera się na surowym UTC", () => {
  const iso = "2026-04-05T22:30:00.000Z"
  assert.equal(toDateKey(iso, { timeZone: "Europe/Warsaw" }), "2026-04-06")
  assert.equal(toDateKey(iso, { timeZone: "America/Los_Angeles" }), "2026-04-05")
})



test("toDateKey zachowuje gotowy date key bez ponownego przeliczania przez strefę czasową", () => {
  assert.equal(toDateKey("2026-04-06", { timeZone: "America/Los_Angeles" }), "2026-04-06")
  assert.equal(toDateKey("2026-04-06", { timeZone: "Europe/Warsaw" }), "2026-04-06")
})

test("getWeekDays i getMonthGrid zachowują anchor będący już lokalnym date key", () => {
  const losAngeles = { timeZone: "America/Los_Angeles" }

  const week = getWeekDays(0, "2026-04-06", losAngeles)
  assert.deepEqual(week, [
    "2026-04-06",
    "2026-04-07",
    "2026-04-08",
    "2026-04-09",
    "2026-04-10",
    "2026-04-11",
    "2026-04-12",
  ])

  const grid = getMonthGrid("2026-04-06", losAngeles)
  assert.ok(grid.includes("2026-04-06"))
  assert.ok(grid.includes("2026-04-30"))
})

test("getCurrentDateKey i getRelativeDayLabel poprawnie liczą przypadki 00:30 i 23:30 lokalnie", () => {
  const warsawAfterMidnight = { timeZone: "Europe/Warsaw", now: "2026-04-05T22:30:00.000Z" }
  assert.equal(getCurrentDateKey(warsawAfterMidnight), "2026-04-06")
  assert.equal(getRelativeDayLabel("2026-04-05T23:30:00.000Z", warsawAfterMidnight), "dziś")
  assert.equal(getRelativeDayLabel("2026-04-05T21:30:00.000Z", warsawAfterMidnight), "wczoraj")

  const warsawLateEvening = { timeZone: "Europe/Warsaw", now: "2026-04-05T21:30:00.000Z" }
  assert.equal(getCurrentDateKey(warsawLateEvening), "2026-04-05")
  assert.equal(getRelativeDayLabel("2026-04-05T22:30:00.000Z", warsawLateEvening), "jutro")
})

test("getWeekDays buduje poprawny lokalny tydzień i przechodzi między tygodniami bez przesunięć UTC", () => {
  const options = { timeZone: "Europe/Warsaw" }
  const week = getWeekDays(0, "2026-04-05T22:30:00.000Z", options)
  assert.deepEqual(week, [
    "2026-04-06",
    "2026-04-07",
    "2026-04-08",
    "2026-04-09",
    "2026-04-10",
    "2026-04-11",
    "2026-04-12",
  ])
  const nextWeek = getWeekDays(1, "2026-04-05T22:30:00.000Z", options)
  assert.equal(nextWeek[0], "2026-04-13")
  assert.equal(nextWeek[6], "2026-04-19")
})

test("getMonthGrid buduje spójny mini miesiąc bez przesuwania dnia przez UTC", () => {
  const options = { timeZone: "Europe/Warsaw" }
  const grid = getMonthGrid("2026-04-05T22:30:00.000Z", options)
  assert.equal(grid[0], "2026-03-30")
  assert.equal(grid[6], "2026-04-05")
  assert.ok(grid.includes("2026-04-30"))
})

test("toInputValue i fromInputValue zachowują godzinę po wielokrotnym zapisie i edycji", () => {
  const first = fromInputValue("2026-04-11T10:00")
  const second = fromInputValue(toInputValue(first))
  assert.equal(toInputValue(first), "2026-04-11T10:00")
  assert.equal(toInputValue(second), "2026-04-11T10:00")
})

test("findLeadByText dopasowuje tylko dokładną nazwę leada, bez luźnego includes", () => {
  const snapshot = createDemoSnapshot()
  const lead = snapshot.leads[0]!

  assert.equal(findLeadByText(lead.name, snapshot.leads)?.id, lead.id)
  assert.equal(findLeadByText(lead.name.slice(0, 3), snapshot.leads), undefined)
  assert.equal(findLeadByText(lead.company, snapshot.leads), undefined)
})

test("findLeadByText ignoruje polskie znaki diakrytyczne przy dokładnym dopasowaniu", () => {
  const snapshot = createDemoSnapshot()
  const lead = snapshot.leads.find((entry) => entry.name === "Piotr Zając")!

  assert.equal(findLeadByText("Piotr Zajac", snapshot.leads)?.id, lead.id)
  assert.equal(findLeadByText("PIOTR ZAJĄC", snapshot.leads)?.id, lead.id)
})

test("getItemLeadLabel pokazuje nazwę z leadId przed pomocniczym leadLabel", () => {
  const snapshot = createDemoSnapshot()
  const lead = snapshot.leads[0]!
  const label = getItemLeadLabel(
    {
      ...snapshot.items[0]!,
      leadId: lead.id,
      leadLabel: "Stary ghost label",
    },
    snapshot.leads,
  )

  assert.equal(label, lead.name)
})


test("getItemLeadLabel nie pokazuje osieroconego leadLabel bez leadId", () => {
  const snapshot = createDemoSnapshot()
  const label = getItemLeadLabel(
    {
      ...snapshot.items[0]!,
      leadId: null,
      leadLabel: "Osierocony ghost label",
    },
    snapshot.leads,
  )

  assert.equal(label, "")
})


test("formatDateKeyLong i weekday operują na cywilnym kluczu dnia bez przesunięcia przez UTC", () => {
  assert.match(formatDateKeyLong("2026-04-06"), /6 kwietnia 2026/)
  assert.equal(formatDateKeyWeekday("2026-04-06", { weekday: "long" }), "poniedziałek")
})

test("getWeekOffsetFromCurrent liczy tydzień względem lokalnego dnia użytkownika", () => {
  const options = {
    timeZone: "Europe/Warsaw",
    now: "2026-04-05T22:30:00.000Z",
  }

  assert.equal(getWeekOffsetFromCurrent("2026-04-06", options), 0)
  assert.equal(getWeekOffsetFromCurrent("2026-04-12", options), 0)
  assert.equal(getWeekOffsetFromCurrent("2026-04-13", options), 1)
  assert.equal(getWeekOffsetFromCurrent("2026-03-30", options), -1)
})


test("getNextDaySnoozeAtPreferredTime przenosi wpis na kolejny lokalny dzień zamiast surowego +24h", () => {
  const options = {
    timeZone: "Europe/Warsaw",
    now: "2026-04-05T22:30:00.000Z",
  }

  const snoozed = getNextDaySnoozeAtPreferredTime("2026-04-05T21:00:00.000Z", options)

  assert.equal(toDateKey(snoozed, options), "2026-04-07")
  assert.equal(formatTime(snoozed, options), "23:00")
})

test("getNextDaySnoozeAtPreferredTime zachowuje godzinę wpisu, jeśli istnieje", () => {
  const options = { timeZone: "Europe/Warsaw", now: "2026-04-05T08:00:00.000Z" }
  const snoozed = getNextDaySnoozeAtPreferredTime("2026-04-05T12:30:00.000Z", options)
  assert.equal(toDateKey(snoozed, options), "2026-04-06")
  assert.equal(formatTime(snoozed, options), "14:30")
})

test("getNextDaySnoozeAtPreferredTime używa fallbacku 09:00, gdy brak jawnej godziny", () => {
  const options = { timeZone: "Europe/Warsaw", now: "2026-04-05T08:00:00.000Z" }
  const snoozed = getNextDaySnoozeAtPreferredTime("2026-04-05", options)
  assert.equal(toDateKey(snoozed, options), "2026-04-06")
  assert.equal(formatTime(snoozed, options), "09:00")
})

test("getNextSnoozeByHours nie cofa wpisu wstecz, jeśli termin już jest w przyszłości", () => {
  const snoozed = getNextSnoozeByHours("2026-04-07T10:00:00.000Z", 1, {
    timeZone: "Europe/Warsaw",
    now: "2026-04-05T08:00:00.000Z",
  })

  assert.equal(snoozed, "2026-04-07T11:00:00.000Z")
})
