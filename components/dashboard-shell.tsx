"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { type PropsWithChildren, useEffect, useMemo, useState } from "react"
import { AccountStatusBanner } from "@/components/account-status-panel"
import { ItemModal, LeadModal } from "@/components/views"
import { useAuthSession } from "@/lib/auth/session-provider"
import { useAppStore } from "@/lib/store"
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
  { href: "/today", label: "Dziś", icon: "◈" },
  { href: "/leads", label: "Leady", icon: "◉" },
  { href: "/leads/pipeline", label: "Pipeline", icon: "⇄" },
  { href: "/cases", label: "Sprawy", icon: "▣" },
  { href: "/tasks", label: "Zadania", icon: "☑" },
  { href: "/calendar", label: "Kalendarz", icon: "⊞" },
  { href: "/activity", label: "Aktywność", icon: "◎" },
  { href: "/billing", label: "Billing", icon: "¤" },
  { href: "/settings", label: "Ustawienia", icon: "⚙" },
]

const MOBILE_PRIMARY_NAV: NavItem[] = [
  { href: "/today", label: "Dziś", icon: "◈" },
  { href: "/leads", label: "Leady", icon: "◉" },
  { href: "/cases", label: "Sprawy", icon: "▣" },
  { href: "/tasks", label: "Zadania", icon: "☑" },
]

const MOBILE_SECONDARY_NAV: NavItem[] = [
  { href: "/leads/pipeline", label: "Pipeline", icon: "⇄" },
  { href: "/calendar", label: "Kalendarz", icon: "⊞" },
  { href: "/activity", label: "Aktywność", icon: "◎" },
  { href: "/billing", label: "Billing", icon: "¤" },
  { href: "/settings", label: "Ustawienia", icon: "⚙" },
]

const GENERIC_USER_NAMES = new Set(["demo", "twoje konto", "konto", "użytkownik", "uzytkownik"])

function getUserAvatarLabel(userName: string, workspaceName: string) {
  const normalizedUserName = userName.trim().toLowerCase()

  if (!userName.trim() || GENERIC_USER_NAMES.has(normalizedUserName)) {
    return "LF"
  }

  const label = initials(userName)
  return label || initials(workspaceName) || "LF"
}

function isNavItemActive(pathname: string, href: string) {
  if (href === "/leads") {
    return pathname === "/leads"
  }

  return pathname === href || pathname.startsWith(`${href}/`)
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
    <section className="sidebar-mini-calendar" aria-label="Mini kalendarz miesięczny">
      <div className="sidebar-mini-calendar-label muted-small">Kalendarz</div>
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
  const { snapshot, isReady } = useAppStore()
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
    return ordered.find((item) => isNavItemActive(pathname, item.href))?.label ?? "LeadFlow"
  }, [pathname])

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

  if (!isReady || !isSessionReady) {
    return <div className="app-shell-loading">Ładowanie aplikacji…</div>
  }

  if (!session) {
    return <div className="app-shell-loading">Przekierowuję do logowania…</div>
  }

  return (
    <div className={`app-shell ${snapshot.settings.viewProfile === "mobile" ? "app-shell-mobile-preview" : ""}`}>
      <aside className="sidebar desktop-only">
        <div className="brand-box">
          <div className="brand-title">
            Lead<span>Flow</span>
          </div>
          <div className="brand-subtitle">Domykanie i uruchamianie klienta</div>
        </div>

        <nav className="nav-list">
          {NAV_ITEMS.map((item) => {
            const active = isNavItemActive(pathname, item.href)
            return (
              <Link key={item.href} href={item.href} className={`nav-link ${active ? "active" : ""}`} aria-current={active ? "page" : undefined}>
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <SidebarMiniCalendar />

        <div className="sidebar-footer">
          <button className="ghost-button" onClick={() => setLeadModalOpen(true)}>
            + Dodaj lead
          </button>
          <button className="ghost-button" onClick={() => setItemModalOpen(true)}>
            + Dodaj działanie
          </button>
          <button className="ghost-button" onClick={handleLogout} disabled={isLoggingOut}>
            {isLoggingOut ? "Wylogowywanie..." : "Wyloguj"}
          </button>
          <div className="user-box">
            <div className="user-avatar">{getUserAvatarLabel(displayUserName, snapshot.settings.workspaceName)}</div>
            <div>
              <div className="user-name">{displayUserName}</div>
              <div className="muted-small">{displayUserEmail || snapshot.settings.workspaceName}</div>
            </div>
          </div>
        </div>
      </aside>

      <div className="main-column">
        <header className="mobile-header mobile-only">
          <div className="mobile-header-main">
            <button
              className="icon-button mobile-menu-trigger"
              onClick={() => setMobileMenuOpen(true)}
              type="button"
              aria-label="Otwórz menu mobilne"
              aria-expanded={mobileMenuOpen}
              aria-controls="leadflow-mobile-menu"
            >
              ☰
            </button>
            <div>
              <div className="mobile-title">{pageLabel}</div>
              <div className="muted-small">{snapshot.settings.workspaceName}</div>
            </div>
          </div>
          <div className="header-actions mobile-header-actions">
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
            aria-controls="leadflow-mobile-menu"
          >
            <span>⋯</span>
            <span>Więcej</span>
          </button>
        </nav>
      </div>

      {mobileMenuOpen ? (
        <div id="leadflow-mobile-menu">
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
