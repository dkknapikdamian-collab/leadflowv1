"use client"

import { useEffect } from "react"
import { useAppStore } from "@/lib/store"

type UiSkin = "classic" | "graphite" | "midnight" | "obsidian"

const UI_SKIN_STORAGE_KEY = "clientpilot_skin"

function normalizeUiSkin(value: string | null | undefined): UiSkin {
  if (value === "graphite" || value === "midnight" || value === "obsidian") {
    return value
  }

  return "classic"
}

export function UiShellEffects() {
  const { snapshot } = useAppStore()

  useEffect(() => {
    const storedSkin = normalizeUiSkin(window.localStorage.getItem(UI_SKIN_STORAGE_KEY))
    const viewProfile = snapshot.settings.viewProfile || "desktop"

    document.documentElement.dataset.theme = storedSkin
    document.body.dataset.theme = storedSkin
    document.documentElement.dataset.viewProfile = viewProfile
    document.body.dataset.viewProfile = viewProfile
  }, [snapshot.settings.viewProfile])

  return null
}
