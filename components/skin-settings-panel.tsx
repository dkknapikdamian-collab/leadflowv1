"use client"

import { useEffect, useState } from "react"
import { useAppStore } from "@/lib/store"

type UiSkin = "classic" | "graphite" | "midnight" | "obsidian"

const UI_SKIN_STORAGE_KEY = "clientpilot_skin"

const SKIN_OPTIONS: Array<{
  value: UiSkin
  label: string
  description: string
  previewClassName: string
}> = [
  {
    value: "classic",
    label: "Classic Amber",
    description: "Ciepły, kontrastowy dark z bursztynowym akcentem.",
    previewClassName: "theme-card-preview-classic",
  },
  {
    value: "graphite",
    label: "Graphite Minimal",
    description: "Jaśniejsza czerń, spokojniejszy minimal i czystsze karty.",
    previewClassName: "theme-card-preview-graphite",
  },
  {
    value: "midnight",
    label: "Midnight Blue",
    description: "Chłodny, nowoczesny dark pod bardziej premium workflow.",
    previewClassName: "theme-card-preview-midnight",
  },
  {
    value: "obsidian",
    label: "Obsidian Pulse",
    description: "Głębsza czerń z mocniejszym kontrastem i neonowym akcentem.",
    previewClassName: "theme-card-preview-obsidian",
  },
]

function normalizeUiSkin(value: string | null | undefined): UiSkin {
  if (value === "graphite" || value === "midnight" || value === "obsidian") {
    return value
  }

  return "classic"
}

function applyUiSkin(nextSkin: UiSkin) {
  window.localStorage.setItem(UI_SKIN_STORAGE_KEY, nextSkin)
  document.documentElement.dataset.theme = nextSkin
  document.body.dataset.theme = nextSkin
}

export function SkinSettingsPanel() {
  const { snapshot } = useAppStore()
  const [skin, setSkin] = useState<UiSkin>("classic")

  useEffect(() => {
    const nextSkin = normalizeUiSkin(window.localStorage.getItem(UI_SKIN_STORAGE_KEY))
    setSkin(nextSkin)
    applyUiSkin(nextSkin)
  }, [])

  return (
    <section className="panel-card settings-grid">
      <div className="field-block full-span">
        <strong>Skórki</strong>
        <div className="muted-small">
          Wybierz układ wizualny aplikacji. Funkcje zostają te same, zmienia się klimat i czytelność interfejsu.
        </div>
      </div>

      <div className="field-block full-span">
        <div className="theme-picker-grid">
          {SKIN_OPTIONS.map((option) => {
            const isActive = skin === option.value
            return (
              <button
                key={option.value}
                type="button"
                className={`theme-card ${isActive ? "active" : ""}`}
                onClick={() => {
                  setSkin(option.value)
                  applyUiSkin(option.value)
                }}
              >
                <div className={`theme-card-preview ${option.previewClassName}`} aria-hidden="true">
                  <span className="theme-card-swatch" />
                  <span className="theme-card-swatch" />
                  <span className="theme-card-swatch" />
                  <span className="theme-card-swatch" />
                </div>
                <div className="theme-card-title-row">
                  <strong>{option.label}</strong>
                  {isActive ? <span className="badge theme-card-badge">Aktywna</span> : null}
                </div>
                <div className="muted-small">{option.description}</div>
              </button>
            )
          })}
        </div>
      </div>

      <div className="field-block full-span">
        <strong>Automatyczne dopasowanie do telefonu</strong>
        <div className="muted-small">
          Aplikacja wykrywa urządzenie i sama przełącza układ. Obecnie wykryty widok: {snapshot.settings.viewProfile === "mobile" ? "telefon / tablet" : "laptop / desktop"}.
        </div>
      </div>
    </section>
  )
}
