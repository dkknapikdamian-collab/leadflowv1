"use client"

import { useEffect, useMemo, useState } from "react"
import { CASE_TEMPLATE_SERVICE_TYPE_OPTIONS } from "@/lib/constants"
import { useAppStore } from "@/lib/store"
import type { CaseTemplateServiceType, Lead } from "@/lib/types"

type StartMode = "empty" | "template" | "template_with_link"

export function CaseCreateModal({
  lead,
  onClose,
}: {
  lead: Lead
  onClose: () => void
}) {
  const { snapshot, startCaseFromLead } = useAppStore()
  const templates = snapshot.caseTemplates ?? []
  const [startMode, setStartMode] = useState<StartMode>("template")
  const [serviceType, setServiceType] = useState<CaseTemplateServiceType>("website")
  const [selectedTemplateId, setSelectedTemplateId] = useState("")

  const filteredTemplates = useMemo(
    () => templates.filter((entry) => entry.serviceType === serviceType),
    [serviceType, templates],
  )
  const selectedTemplate = filteredTemplates.find((entry) => entry.id === selectedTemplateId) ?? null
  const selectedTemplateItems = (snapshot.templateItems ?? [])
    .filter((entry) => entry.templateId === selectedTemplateId)
    .sort((left, right) => left.sortOrder - right.sortOrder)

  useEffect(() => {
    const defaultForType = filteredTemplates.find((entry) => entry.isDefault) ?? filteredTemplates[0] ?? null
    setSelectedTemplateId(defaultForType?.id ?? "")
  }, [filteredTemplates])

  function handleCreateCase() {
    const templateId = startMode === "empty" ? null : selectedTemplateId || null
    startCaseFromLead(lead.id, startMode, templateId)
    onClose()
  }

  const needsTemplate = startMode !== "empty"
  const canCreate = startMode === "empty" || Boolean(selectedTemplateId)

  return (
    <div className="modal-backdrop" role="presentation">
      <div className="modal-card modal-card-compact" role="dialog" aria-modal="true" aria-label="Tworzenie sprawy">
        <div className="modal-header">
          <h2>Nowa sprawa</h2>
          <button className="close-button" onClick={onClose} type="button" aria-label="Zamknij">
            x
          </button>
        </div>

        <div className="modal-form">
          <div className="info-card" style={{ display: "grid", gap: 8 }}>
            <div className="info-row"><strong>Lead</strong><span>{lead.name}</span></div>
            <div className="info-row"><strong>Firma</strong><span>{lead.company || "Brak firmy"}</span></div>
            <div className="info-row"><strong>Status sprzedazowy</strong><span>{lead.status}</span></div>
          </div>

          <div className="field-block">
            <span>Tryb utworzenia sprawy</span>
            <label className="switch-row">
              <input type="radio" checked={startMode === "empty"} onChange={() => setStartMode("empty")} />
              <span>Z pustej</span>
            </label>
            <label className="switch-row">
              <input type="radio" checked={startMode === "template"} onChange={() => setStartMode("template")} />
              <span>Z szablonu</span>
            </label>
            <label className="switch-row">
              <input type="radio" checked={startMode === "template_with_link"} onChange={() => setStartMode("template_with_link")} />
              <span>Z szablonu + link klienta</span>
            </label>
          </div>

          {needsTemplate ? (
            <div className="field-block">
              <span>Typ sprawy</span>
              <select
                className="select-input"
                value={serviceType}
                onChange={(event) => setServiceType(event.target.value as CaseTemplateServiceType)}
              >
                {CASE_TEMPLATE_SERVICE_TYPE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>

              <span>Szablon</span>
              <select
                className="select-input"
                value={selectedTemplateId}
                onChange={(event) => setSelectedTemplateId(event.target.value)}
                disabled={filteredTemplates.length === 0}
              >
                {filteredTemplates.length === 0 ? <option value="">Brak szablonow dla typu</option> : null}
                {filteredTemplates.map((entry) => (
                  <option key={entry.id} value={entry.id}>
                    {entry.title}{entry.isDefault ? " (domyslny)" : ""}
                  </option>
                ))}
              </select>

              {selectedTemplate ? <div className="muted-small">{selectedTemplate.description || "Bez opisu."}</div> : null}
              <div className="muted-small">
                {selectedTemplateItems.length} pozycji checklisty zostanie dodanych automatycznie.
              </div>
            </div>
          ) : null}

          <div className="toolbar-row end">
            <button type="button" className="ghost-button" onClick={onClose}>Anuluj</button>
            <button type="button" className="primary-button" onClick={handleCreateCase} disabled={!canCreate}>
              Utworz sprawe
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
