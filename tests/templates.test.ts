import test from "node:test"
import assert from "node:assert/strict"
import { createInitialSnapshot } from "../lib/seed"
import {
  addCaseTemplateSnapshot,
  addLeadSnapshot,
  duplicateCaseTemplateSnapshot,
  setDefaultCaseTemplateSnapshot,
  startCaseFromLeadSnapshot,
} from "../lib/snapshot"

test("createInitialSnapshot ma bazowe szablony startowe", () => {
  const snapshot = createInitialSnapshot()
  const titles = (snapshot.caseTemplates ?? []).map((entry) => entry.title)

  assert.equal(titles.includes("Strona www"), true)
  assert.equal(titles.includes("Branding"), true)
  assert.equal(titles.includes("Kampania reklamowa"), true)
  assert.equal(titles.includes("Onboarding klienta"), true)
  assert.equal((snapshot.templateItems ?? []).length > 0, true)
})

test("można skopiować szablon i ustawić domyślny per typ", () => {
  const snapshot = createInitialSnapshot()
  const source = snapshot.caseTemplates?.find((entry) => entry.serviceType === "website")
  assert.ok(source)

  const copied = duplicateCaseTemplateSnapshot(snapshot, source!.id)
  const copies = copied.caseTemplates?.filter((entry) => entry.serviceType === "website") ?? []
  assert.equal(copies.length >= 2, true)

  const newestCopy = copies.find((entry) => entry.title.includes("(kopia)"))
  assert.ok(newestCopy)

  const withDefault = setDefaultCaseTemplateSnapshot(copied, newestCopy!.id)
  const websiteDefaults = (withDefault.caseTemplates ?? []).filter((entry) => entry.serviceType === "website" && entry.isDefault)
  assert.equal(websiteDefaults.length, 1)
  assert.equal(websiteDefaults[0]?.id, newestCopy!.id)
})

test("tworzenie sprawy z szablonu dodaje checklistę i templateId", () => {
  const base = addLeadSnapshot(createInitialSnapshot(), {
    name: "Lead szablonowy",
    company: "Firma testowa",
    email: "",
    phone: "",
    source: "Inne",
    value: 1000,
    summary: "",
    notes: "",
    status: "won",
    priority: "medium",
    nextActionTitle: "Start",
    nextActionAt: "2026-04-08T10:00:00.000Z",
  })
  const lead = base.leads[0]!
  const websiteTemplate = base.caseTemplates?.find((entry) => entry.serviceType === "website")
  assert.ok(websiteTemplate)

  const started = startCaseFromLeadSnapshot(base, {
    leadId: lead.id,
    mode: "template",
    templateId: websiteTemplate!.id,
  })

  const createdCase = started.cases?.[0]
  assert.ok(createdCase)
  assert.equal(createdCase?.templateId, websiteTemplate!.id)
  assert.equal((started.caseItems ?? []).filter((item) => item.caseId === createdCase?.id).length > 0, true)
})

test("można dodać nowy szablon dla konkretnego typu", () => {
  const snapshot = addCaseTemplateSnapshot(createInitialSnapshot(), {
    title: "Onboarding premium",
    description: "Szybszy start dla klientów enterprise.",
    serviceType: "client_onboarding",
  })

  assert.equal(
    (snapshot.caseTemplates ?? []).some((entry) => entry.title === "Onboarding premium" && entry.serviceType === "client_onboarding"),
    true,
  )
})
