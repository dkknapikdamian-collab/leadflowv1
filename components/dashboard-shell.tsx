"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { type PropsWithChildren, useEffect, useMemo, useState } from "react"
import { AccountStatusBanner } from "@/components/account-status-panel"
import { resolveSnapshotAccessPolicy } from "@/lib/access/policy"
import { ItemModal, LeadModal } from "@/components/views"
import { useAuthSession } from "@/lib/auth/session-provider"
import { useAppStore, type AppSyncStatus } from "@/lib/store"
import {
  getCalendarItems,
  getCurrentDateKey,
  getDayOfMonth,
  getItemPrimaryDate,
  getMonthGrid,
  getMonthIndex,
  initials,
  toDateKey,
} from "@/lib/utils"

type NavItem = {
  href: string
  label: string
  icon: string
}

const NAV_ITEMS: NavItem[] = [
  { href: "/today", label: "Dziś", icon: "◌" },
  { href: "/leads", label: "Leady", icon: "◎" },
  { href: "/cases", label: "Sprawy", icon: "▣" },
  { href: "/tasks", label: "Zadania", icon: "☰" },
  { href: "/calendar", label: "Kalendarz", icon: "◫" },
  { href: "/activity", label: "Aktywność", icon: "◍" },
  { href: "/operator", label: "Operator+", icon: "◉" },
  { href: "/templates", label: "Szablony", icon: "◧" },
  { href: "/billing", label: "Rozliczenia", icon: "◈" },
  { href: "/settings", label: "Ustawienia", icon: "⚙" },
]

const MOBILE_PRIMARY_NAV: NavItem[] = [
  { href: "/today", label: "Dziś", icon: "◌" },
  { href: "/leads", label: "Leady", icon: "◎" },
  { href: "/cases", label: "Sprawy", icon: "▣" },
  { href: "/tasks", label: "Zadania", icon: "☰" },
]

const MOBILE_SECONDARY_NAV: NavItem[] = [
  { href: "/operator", label: "Operator+", icon: "◉" },
  { href: "/templates", label: "Szablony", icon: "◧" },
  { href: "/calendar", label: "Kalendarz", icon: "◫" },
  { href: "/activity", label: "Aktywność", icon: "◍" },
  { href: "/billing", label: "Rozliczenia", icon: "◈" },
  { href: "/settings", label: "Ustawienia", icon: "⚙" },
]

const GENERIC_USER_NAMES = new Set(["demo", "twoje konto", "konto", "uzytkownik"])

function getUserAvatarLabel(userName: string, workspaceName: string) {
  const normalizedUserName = userName.trim().toLowerCase()

  if (!userName.trim() || GENERIC_USER_NAMES.has(normalizedUserName)) {
    return "CP"
  }

  const label = initials(userName)
  return label || initials(workspaceName) || "CP"
}

function isNavItemActive(pathname: string, href: string) {
  if (href === "/leads") {
    return pathname === "/leads"
  }

  return pathname === href || pathname.startsWith(`${href}/`)
}

function formatSyncTime(value: string | null) {
  if (!value) return ""

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ""

  return new Intl.DateTimeFormat("pl-PL", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

function getSyncPresentation(syncStatus: AppSyncStatus, lastSyncedAt: string | null) {
  if (syncStatus === "syncing") {
    return {
      label: "Synchronizacja…",
      detail: "Trwa zapis lub pobieranie",
      border: "1px solid rgba(245, 158, 11, 0.22)",
      background: "rgba(245, 158, 11, 0.08)",
      color: "#b45309",
    }
  }

  if (syncStatus === "error") {
    return {
      label: "Błąd sync",
      detail: "Sprawdź połączenie i odśwież",
      border: "1px solid rgba(239, 68, 68, 0.22)",
      background: "rgba(239, 68, 68, 0.08)",
      color: "#b91c1c",
    }
  }

  if (syncStatus === "saved") {
    const timeLabel = formatSyncTime(lastSyncedAt)
    return {
      label: "Zapisano",
      detail: timeLabel ? `Ostatnio ${timeLabel}` : "Dane są w chmurze",
      border: "1px solid rgba(34, 197, 94, 0.22)",
      background: "rgba(34, 197, 94, 0.08)",
      color: "#15803d",
    }
  }

  return {
    label: "Lokalnie",
    detail: "Czeka na pierwszy sync",
    border: "1px solid var(--border)",
    background: "var(--card)",
    color: "var(--muted)",
  }
}

function SyncStatusPill({ syncStatus, lastSyncedAt }: { syncStatus: AppSyncStatus; lastSyncedAt: string | null }) {
  const presentation = getSyncPresentation(syncStatus, lastSyncedAt)

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        minHeight: 34,
        padding: "7px 10px",
        borderRadius: 999,
        border: presentation.border,
        background: presentation.background,
        color: presentation.color,
      }}
      aria-label={`Status synchronizacji: ${presentation.label}`}
      title={presentation.detail}
    >
      <span style={{ fontWeight: 800, fontSize: 12 }}>{presentation.label}</span>
      <span style={{ fontSize: 11, opacity: 0.9 }}>{presentation.detail}</span>
    </div>
  )
}

function useAutoViewProfile() {
  const { snapshot, updateSettings } = useAppStore()

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 899px), (pointer: coarse)")

    const syncProfile = () => {
      const nextProfile = mediaQuery.matches ? "mobile" : "desktop"
      if (snapshot.settings.viewProfile !== nextProfile) {
        updateSettings({ viewProfile: nextProfile })
      }
    }

    syncProfile()
    mediaQuery.addEventListener("change", syncProfile)
    window.addEventListener("resize", syncProfile)

    return () => {
      mediaQuery.removeEventListener("change", syncProfile)
      window.removeEventListener("resize", syncProfile)
    }
  }, [snapshot.settings.viewProfile, updateSettings])
}

function useOverlayBodyLock(isLocked: boolean) {
  useEffect(() => {
    if (!isLocked) return

    const previousOverflow = document.body.style.overflow
    const previousTouchAction = document.body.style.touchAction

    document.body.style.overflow = "hidden"
    document.body.style.touchAction = "none"

    return () => {
      document.body.style.overflow = previousOverflow
      document.body.style.touchAction = previousTouchAction
    }
  }, [isLocked])
}

function SidebarMiniCalendar() {
  const { snapshot } = useAppStore()
  const dateOptions = useMemo(() => ({ timeZone: snapshot.settings.timezone }), [snapshot.settings.timezone])
  const todayKey = useMemo(() => getCurrentDateKey(dateOptions), [dateOptions])
  const monthGrid = useMemo(() => getMonthGrid(todayKey, dateOptions), [dateOptions, todayKey])
  const currentMonth = getMonthIndex(todayKey, dateOptions)
  const itemDates = useMemo(
    () =>
      new Set(
        getCalendarItems(snapshot.items)
          .map((item) => toDateKey(getItemPrimaryDate(item), dateOptions))
          .filter(Boolean),
      ),
    [dateOptions, snapshot.items],
  )

  return (
    <section className="sidebar-block card mini-calendar-card" aria-label="Mini kalendarz miesięczny">
      <div className="block-head">
        <span className="eyebrow">Kalendarz</span>
        <span className="mini-dot hot" />
      </div>
      <div className="sidebar-mini-month-grid">
        {monthGrid.map((cell) => {
          const dayKey = toDateKey(cell, dateOptions)
          const isCurrentMonth = getMonthIndex(cell, dateOptions) === currentMonth
          const hasItems = itemDates.has(dayKey)
          const isToday = dayKey === todayKey

          return (
            <Link
              key={cell}
              href={`/calendar?day=${dayKey}`}
              className={`sidebar-mini-month-cell ${!isCurrentMonth ? "dimmed" : ""} ${isToday ? "today" : ""}`}
              aria-label={`Pokaż tydzień z dnia ${dayKey}`}
            >
              <span className="sidebar-mini-month-number">{getDayOfMonth(cell)}</span>
              {hasItems ? <span className="sidebar-mini-month-dot" /> : null}
            </Link>
          )
        })}
      </div>
    </section>
  )
}

function MobileMenuSheet({
  pathname,
  workspaceName,
  userName,
  userEmail,
  isLoggingOut,
  onClose,
  onOpenLeadModal,
  onOpenItemModal,
  onLogout,
}: {
  pathname: string
  workspaceName: string
  userName: string
  userEmail: string
  isLoggingOut: boolean
  onClose: () => void
  onOpenLeadModal: () => void
  onOpenItemModal: () => void
  onLogout: () => void
}) {
  return (
    <div className="mobile-menu-backdrop mobile-only" role="presentation">
      <div className="mobile-menu-sheet" role="dialog" aria-modal="true" aria-label="Menu mobilne">
        <div className="mobile-menu-header">
          <div>
            <div className="mobile-menu-title">Więcej</div>
            <div className="muted-small">{workspaceName}</div>
          </div>
          <button className="close-button" onClick={onClose} type="button" aria-label="Zamknij menu mobilne">
            ×
          </button>
        </div>

        <div className="mobile-menu-user">
          <div className="user-avatar">{getUserAvatarLabel(userName, workspaceName)}</div>
          <div>
            <div className="user-name">{userName}</div>
            <div className="muted-small">{userEmail || workspaceName}</div>
          </div>
        </div>

        <div className="mobile-menu-actions">
          <button className="ghost-button" type="button" onClick={onOpenLeadModal}>
            + Dodaj lead
          </button>
          <button className="ghost-button" type="button" onClick={onOpenItemModal}>
            + Dodaj działanie
          </button>
          <button className="ghost-button" type="button" onClick={onLogout} disabled={isLoggingOut}>
            {isLoggingOut ? "Wylogowywanie..." : "Wyloguj"}
          </button>
        </div>

        <nav className="mobile-menu-list" aria-label="Pozostałe sekcje">
          {MOBILE_SECONDARY_NAV.map((item) => {
            const active = isNavItemActive(pathname, item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`mobile-menu-link ${active ? "active" : ""}`}
                onClick={onClose}
                aria-current={active ? "page" : undefined}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}

export function DashboardShell({ children }: PropsWithChildren) {
  const pathname = usePathname()
  const router = useRouter()
  const { session, isReady: isSessionReady, clear } = useAuthSession()
  const { snapshot, isReady, syncStatus, lastSyncedAt } = useAppStore()
  const [leadModalOpen, setLeadModalOpen] = useState(false)
  const [itemModalOpen, setItemModalOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  useAutoViewProfile()
  useOverlayBodyLock(leadModalOpen || itemModalOpen || mobileMenuOpen)

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    if (isSessionReady && !session) {
      router.replace("/login")
    }
  }, [isSessionReady, router, session])

  const pageLabel = useMemo(() => {
    const ordered = [...NAV_ITEMS].sort((left, right) => right.href.length - left.href.length)
    return ordered.find((item) => isNavItemActive(pathname, item.href))?.label ?? "ClientPilot"
  }, [pathname])

  const accessPolicy = useMemo(() => resolveSnapshotAccessPolicy(snapshot), [snapshot])
  const displayUserName = session?.user.displayName || snapshot.user.name || "Twoje konto"
  const displayUserEmail = session?.user.email || snapshot.user.email || ""

  async function handleLogout() {
    if (isLoggingOut) return

    setIsLoggingOut(true)

    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "same-origin",
      })
    } finally {
      clear()
      setMobileMenuOpen(false)
      setLeadModalOpen(false)
      setItemModalOpen(false)
      router.replace("/login")
      router.refresh()
      setIsLoggingOut(false)
    }
  }

  function openLeadModal() {
    setMobileMenuOpen(false)
    setLeadModalOpen(true)
  }

  function openItemModal() {
    setMobileMenuOpen(false)
    setItemModalOpen(true)
  }

  function handleRefresh() {
    router.refresh()
  }

  if (!isReady || !isSessionReady) {
    return <div className="app-shell-loading">Ładowanie aplikacji…</div>
  }

  if (!session) {
    return <div className="app-shell-loading">Przekierowuję do logowania…</div>
  }

  return (
    <div className={`app-shell variant-b-shell ${snapshot.settings.viewProfile === "mobile" ? "app-shell-mobile-preview" : ""}`}>
      <aside className="sidebar desktop-only">
        <div className="workspace-card card">
          <div className="workspace-head">
            <div>
              <div className="eyebrow">Workspace</div>
              <div className="workspace-name">{snapshot.settings.workspaceName}</div>
            </div>
            <span className="status-badge success">
              {snapshot.billing.status === "active" ? "Plan aktywny" : snapshot.billing.status === "trial" ? "Trial active" : "Wymaga płatności"}
            </span>
          </div>
          <div className="workspace-copy">Jeden system do domykania i uruchamiania klienta.</div>
        </div>

        <nav className="nav card" aria-label="Główna nawigacja">
          {NAV_ITEMS.map((item) => {
            const active = isNavItemActive(pathname, item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-link ${active ? "active" : ""}`}
                aria-current={active ? "page" : undefined}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="sidebar-block card">
          <div className="block-head">
            <span className="eyebrow">Priorytet dnia</span>
            <span className="mini-dot hot" />
          </div>
          <div className="priority-item">
            <strong>Zacznij od Today. Operator traktuj pomocniczo.</strong>
            <span>Najpierw sprawdź Today, potem ruszaj leady bez next stepu, overdue i sprawy ready to start. Operator+ zostaw jako ekran pomocniczy.</span>
          </div>
        </div>

        <SidebarMiniCalendar />

        <div className="sidebar-block card profile-card">
          <div className="profile-row">
            <div className="avatar">{getUserAvatarLabel(displayUserName, snapshot.settings.workspaceName)}</div>
            <div>
              <strong>{displayUserName}</strong>
              <span>{displayUserEmail || "owner"}</span>
            </div>
          </div>
        </div>

        <div className="sidebar-footer card">
          <button className="ghost-button" type="button" onClick={openLeadModal}>
            + Dodaj lead
          </button>
          <button className="ghost-button" type="button" onClick={openItemModal}>
            + Dodaj działanie
          </button>
          <button className="ghost-button" type="button" onClick={handleLogout} disabled={isLoggingOut}>
            {isLoggingOut ? "Wylogowywanie..." : "Wyloguj"}
          </button>
        </div>
      </aside>

      <div className="main-column">
        <header className="desktop-shell-topbar desktop-only">
          <div className="brand-pill">
            <span className="brand-dot" />
            <div>
              <strong>{pageLabel}</strong>
              <span>{snapshot.settings.workspaceName} • nowoczesny workflow operacyjny</span>
            </div>
          </div>

          <div className="top-actions">
            <SyncStatusPill syncStatus={syncStatus} lastSyncedAt={lastSyncedAt} />
            <button className="ghost-button small" type="button" onClick={handleRefresh}>
              Odśwież
            </button>
            <button className="ghost-button small" type="button" onClick={openLeadModal}>
              Dodaj lead
            </button>
            <button className="primary-button small" type="button" onClick={openItemModal}>
              Dodaj działanie
            </button>
          </div>
        </header>

        {!accessPolicy.canWork ? (
          <section className="preview-banner">
            <div className="preview-banner-title">Tryb podglądu danych</div>
            <div className="preview-banner-copy">
              Widzisz dane i historię modułów, ale normalna praca jest zablokowana do czasu odnowienia planu.
            </div>
            <div className="preview-banner-link">
              <Link href="/billing">Otwórz billing i przywróć pełny dostęp</Link>
            </div>
          </section>
        ) : null}

        <header className="mobile-header mobile-only">
          <div className="mobile-header-main">
            <button
              className="icon-button mobile-menu-trigger"
              onClick={() => setMobileMenuOpen(true)}
              type="button"
              aria-label="Otwórz menu mobilne"
              aria-expanded={mobileMenuOpen}
              aria-controls="clientpilot-mobile-menu"
            >
              ⋯
            </button>
            <div>
              <div className="mobile-title">{pageLabel}</div>
              <div className="muted-small">{snapshot.settings.workspaceName}</div>
            </div>
          </div>
          <div className="header-actions mobile-header-actions">
            <SyncStatusPill syncStatus={syncStatus} lastSyncedAt={lastSyncedAt} />
            <button className="icon-button" onClick={openLeadModal} type="button">
              + Lead
            </button>
            <button className="icon-button" onClick={openItemModal} type="button">
              + Akcja
            </button>
          </div>
        </header>

        <AccountStatusBanner />

        <main className="page-content">{children}</main>

        <nav className="bottom-nav mobile-only" aria-label="Główna nawigacja mobilna">
          {MOBILE_PRIMARY_NAV.map((item) => {
            const active = isNavItemActive(pathname, item.href)
            return (
              <Link key={item.href} href={item.href} className={`bottom-link ${active ? "active" : ""}`} aria-current={active ? "page" : undefined}>
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            )
          })}
          <button
            className={`bottom-link bottom-link-button ${mobileMenuOpen ? "active" : ""}`}
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            aria-haspopup="dialog"
            aria-expanded={mobileMenuOpen}
            aria-controls="clientpilot-mobile-menu"
          >
            <span>⋯</span>
            <span>Więcej</span>
          </button>
        </nav>
      </div>

      {mobileMenuOpen ? (
        <div id="clientpilot-mobile-menu">
          <MobileMenuSheet
            pathname={pathname}
            workspaceName={snapshot.settings.workspaceName}
            userName={displayUserName}
            userEmail={displayUserEmail}
            isLoggingOut={isLoggingOut}
            onClose={() => setMobileMenuOpen(false)}
            onOpenLeadModal={openLeadModal}
            onOpenItemModal={openItemModal}
            onLogout={handleLogout}
          />
        </div>
      ) : null}

      {leadModalOpen ? <LeadModal onClose={() => setLeadModalOpen(false)} /> : null}
      {itemModalOpen ? <ItemModal onClose={() => setItemModalOpen(false)} /> : null}
    </div>
  )
}
