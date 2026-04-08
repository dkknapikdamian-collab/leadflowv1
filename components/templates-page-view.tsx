"use client"

import { useEffect, useMemo, useState } from "react"
import { ViewState } from "@/components/ui/view-state"
import { CASE_TEMPLATE_ITEM_KIND_OPTIONS, CASE_TEMPLATE_SERVICE_TYPE_OPTIONS } from "@/lib/constants"
import { useAppStore } from "@/lib/store"
import type { CaseTemplateServiceType, TemplateItem } from "@/lib/types"

function serviceTypeLabel(serviceType: CaseTemplateServiceType) {
  return CASE_TEMPLATE_SERVICE_TYPE_OPTIONS.find((entry) => entry.value === serviceType)?.label ?? serviceType
}

export function TemplatesPageView() {
  const {
    snapshot,
    addCaseTemplate,
    updateCaseTemplate,
    duplicateCaseTemplate,
    setDefaultCaseTemplate,
    addTemplateItem,
    updateTemplateItem,
    deleteTemplateItem,
  } = useAppStore()
  const templates = snapshot.caseTemplates ?? []
  const templateItems = snapshot.templateItems ?? []

  const [serviceType, setServiceType] = useState<CaseTemplateServiceType>("website")
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("")
  const [newTemplateTitle, setNewTemplateTitle] = useState("")
  const [newTemplateDescription, setNewTemplateDescription] = useState("")
  const [newItemTitle, setNewItemTitle] = useState("")
  const [newItemDescription, setNewItemDescription] = useState("")
  const [newItemKind, setNewItemKind] = useState<"file" | "decision" | "approval" | "response" | "access">("file")
  const [newItemRequired, setNewItemRequired] = useState(true)
  const [feedback, setFeedback] = useState<string | null>(null)

  const templatesForType = useMemo(
    () => templates.filter((entry) => entry.serviceType === serviceType),
    [serviceType, templates],
  )

  useEffect(() => {
    const preferred = templatesForType.find((entry) => entry.isDefault) ?? templatesForType[0] ?? null
    setSelectedTemplateId(preferred?.id ?? "")
  }, [templatesForType])

  const selectedTemplate = templates.find((entry) => entry.id === selectedTemplateId) ?? null
  const selectedItems = useMemo(
    () =>
      templateItems
        .filter((entry) => entry.templateId === selectedTemplateId)
        .sort((left, right) => left.sortOrder - right.sortOrder),
    [selectedTemplateId, templateItems],
  )

  function createTemplate() {
    const title = newTemplateTitle.trim()
    if (!title) {
      setFeedback("Podaj nazwe szablonu.")
      return
    }
    addCaseTemplate({ title, description: newTemplateDescription, serviceType })
    setNewTemplateTitle("")
    setNewTemplateDescription("")
    setFeedback("Szablon dodany.")
  }

  function addItemToTemplate() {
    if (!selectedTemplate) {
      setFeedback("Najpierw wybierz szablon.")
      return
    }
    const title = newItemTitle.trim()
    if (!title) {
      setFeedback("Podaj nazwe pozycji checklisty.")
      return
    }
    addTemplateItem({
      templateId: selectedTemplate.id,
      title,
      description: newItemDescription,
      kind: newItemKind,
      required: newItemRequired,
    })
    setNewItemTitle("")
    setNewItemDescription("")
    setNewItemKind("file")
    setNewItemRequired(true)
    setFeedback("Pozycja dodana.")
  }

  return (
    <section className="single-column-page">
      <div className="hero-row">
        <div>
          <h1 className="page-title">Szablony</h1>
          <p className="page-subtitle">Gotowe checklisty, by uruchamiać sprawy bez klikania od zera.</p>
        </div>
      </div>

      <div className="panel-card" style={{ display: "grid", gap: 12 }}>
        <label className="field-block">
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
        </label>

        <div className="case-template-grid">
          <section className="info-card" style={{ display: "grid", gap: 10 }}>
            <div className="drawer-title" style={{ fontSize: 18 }}>Szablony dla typu</div>
            {templatesForType.length === 0 ? (
              <ViewState title="Brak szablonow" description="Dodaj pierwszy szablon dla wybranego typu sprawy." />
            ) : (
              templatesForType.map((template) => (
                <button
                  key={template.id}
                  type="button"
                  className="timeline-row"
                  onClick={() => setSelectedTemplateId(template.id)}
                  style={template.id === selectedTemplateId ? { borderColor: "var(--accent)" } : undefined}
                >
                  <div>
                    <div className="timeline-title">{template.title}</div>
                    <div className="muted-small">{serviceTypeLabel(template.serviceType)}</div>
                  </div>
                  <span className={`badge ${template.isDefault ? "status-won" : "status-not_started"}`}>
                    {template.isDefault ? "Domyslny" : "Aktywny"}
                  </span>
                </button>
              ))
            )}
          </section>

          <section className="info-card" style={{ display: "grid", gap: 10 }}>
            <div className="drawer-title" style={{ fontSize: 18 }}>Nowy szablon</div>
            <label className="field-block">
              <span>Nazwa szablonu</span>
              <input
                className="text-input"
                value={newTemplateTitle}
                onChange={(event) => setNewTemplateTitle(event.target.value)}
                placeholder="Np. Strona www - sprint startowy"
              />
            </label>
            <label className="field-block">
              <span>Opis</span>
              <textarea
                className="text-area"
                value={newTemplateDescription}
                onChange={(event) => setNewTemplateDescription(event.target.value)}
                placeholder="Kiedy uzywac tego szablonu..."
              />
            </label>
            <button type="button" className="primary-button" onClick={createTemplate}>
              Dodaj szablon
            </button>
          </section>
        </div>
      </div>

      <div className="panel-card" style={{ display: "grid", gap: 12 }}>
        <div className="drawer-title" style={{ fontSize: 18 }}>Edycja szablonu</div>
        {!selectedTemplate ? (
          <ViewState title="Wybierz szablon" description="Po wyborze zobaczysz jego checklistę i akcje edycji." />
        ) : (
          <>
            <div className="case-template-grid">
              <label className="field-block">
                <span>Nazwa</span>
                <input
                  className="text-input"
                  value={selectedTemplate.title}
                  onChange={(event) => updateCaseTemplate(selectedTemplate.id, { title: event.target.value })}
                />
              </label>
              <label className="field-block">
                <span>Typ sprawy</span>
                <select
                  className="select-input"
                  value={selectedTemplate.serviceType}
                  onChange={(event) =>
                    updateCaseTemplate(selectedTemplate.id, { serviceType: event.target.value as CaseTemplateServiceType })
                  }
                >
                  {CASE_TEMPLATE_SERVICE_TYPE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </label>
            </div>

            <label className="field-block">
              <span>Opis</span>
              <textarea
                className="text-area"
                value={selectedTemplate.description}
                onChange={(event) => updateCaseTemplate(selectedTemplate.id, { description: event.target.value })}
              />
            </label>

            <div className="drawer-actions wrap">
              <button type="button" className="ghost-button" onClick={() => duplicateCaseTemplate(selectedTemplate.id)}>
                Skopiuj szablon
              </button>
              <button type="button" className="ghost-button" onClick={() => setDefaultCaseTemplate(selectedTemplate.id)}>
                Ustaw domyslny dla typu
              </button>
            </div>

            <div className="info-card" style={{ display: "grid", gap: 10 }}>
              <div className="drawer-title" style={{ fontSize: 18 }}>Lista itemow</div>
              {selectedItems.length === 0 ? <div className="empty-box">Brak pozycji checklisty w tym szablonie.</div> : null}
              {selectedItems.map((item) => (
                <div key={item.id} className="case-checklist-row">
                  <div className="case-checklist-main">
                    <input
                      className="text-input"
                      value={item.title}
                      onChange={(event) => updateTemplateItem(item.id, { title: event.target.value })}
                    />
                    <textarea
                      className="text-area"
                      value={item.description}
                      onChange={(event) => updateTemplateItem(item.id, { description: event.target.value })}
                    />
                    <div className="muted-small">Kolejnosc: {item.sortOrder}</div>
                  </div>
                  <div className="case-checklist-actions">
                    <select
                      className="select-input"
                      value={item.kind}
                      onChange={(event) => updateTemplateItem(item.id, { kind: event.target.value as TemplateItem["kind"] })}
                    >
                      {CASE_TEMPLATE_ITEM_KIND_OPTIONS.map((kindOption) => (
                        <option key={kindOption.value} value={kindOption.value}>{kindOption.label}</option>
                      ))}
                    </select>
                    <label className="switch-row">
                      <input
                        type="checkbox"
                        checked={item.required}
                        onChange={(event) => updateTemplateItem(item.id, { required: event.target.checked })}
                      />
                      <span>Obowiazkowe</span>
                    </label>
                    <span className={`badge ${item.required ? "status-blocked" : "status-not_started"}`}>
                      {item.required ? "Wymagane" : "Opcjonalne"}
                    </span>
                    <button type="button" className="danger-button small" onClick={() => deleteTemplateItem(item.id)}>
                      Usun
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="info-card" style={{ display: "grid", gap: 10 }}>
              <div className="drawer-title" style={{ fontSize: 18 }}>Dodaj pozycje</div>
              <label className="field-block">
                <span>Nazwa</span>
                <input
                  className="text-input"
                  value={newItemTitle}
                  onChange={(event) => setNewItemTitle(event.target.value)}
                  placeholder="Np. Dostep do konta reklamowego"
                />
              </label>
              <label className="field-block">
                <span>Typ itemu</span>
                <select
                  className="select-input"
                  value={newItemKind}
                  onChange={(event) => setNewItemKind(event.target.value as typeof newItemKind)}
                >
                  {CASE_TEMPLATE_ITEM_KIND_OPTIONS.map((kindOption) => (
                    <option key={kindOption.value} value={kindOption.value}>{kindOption.label}</option>
                  ))}
                </select>
              </label>
              <label className="field-block">
                <span>Opis</span>
                <textarea
                  className="text-area"
                  value={newItemDescription}
                  onChange={(event) => setNewItemDescription(event.target.value)}
                />
              </label>
              <label className="switch-row">
                <input type="checkbox" checked={newItemRequired} onChange={(event) => setNewItemRequired(event.target.checked)} />
                <span>Pozycja obowiazkowa</span>
              </label>
              <button type="button" className="primary-button" onClick={addItemToTemplate}>
                Dodaj pozycje
              </button>
            </div>
          </>
        )}
        {feedback ? <div className="muted-small">{feedback}</div> : null}
      </div>
    </section>
  )
}
