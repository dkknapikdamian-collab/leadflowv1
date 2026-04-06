import { resolveAccessState } from "@/lib/access/machine"
import type { AccessStatusRow } from "@/lib/supabase/access-status"
import type { AccessOverrideStatus, AppSnapshot, BillingState } from "@/lib/types"

export type AccountStatusTone = "neutral" | "success" | "warning" | "danger"

export interface AccountStatusPresentation {
  tone: AccountStatusTone
  badgeLabel: string
  title: string
  description: string
  primaryDateLabel: string | null
  secondaryDateLabel: string | null
  ctaLabel: string
  isBlocked: boolean
  isExpiringSoon: boolean
}

function toTimestamp(value: string | null | undefined) {
  if (!value) return null
  const parsed = Date.parse(value)
  return Number.isNaN(parsed) ? null : parsed
}

function getDaysUntil(value: string | null | undefined, now: Date) {
  const timestamp = toTimestamp(value)
  if (timestamp === null) return null
  return Math.ceil((timestamp - now.getTime()) / 86_400_000)
}

function isActiveUntil(value: string | null | undefined, now: Date) {
  const timestamp = toTimestamp(value)
  return timestamp !== null && timestamp >= now.getTime()
}

function getActiveOverrideFromSnapshot(snapshot: AppSnapshot, now: Date): AccessOverrideStatus | null {
  const mode = snapshot.context.accessOverrideMode ?? null
  if (!mode) return null

  if (!snapshot.context.accessOverrideExpiresAt) {
    return mode
  }

  return isActiveUntil(snapshot.context.accessOverrideExpiresAt, now) ? mode : null
}

export function formatAccountStatusDate(value: string | null | undefined, timeZone: string) {
  if (!value) return "—"

  const parsed = Date.parse(value)
  if (Number.isNaN(parsed)) return "—"

  return new Intl.DateTimeFormat("pl-PL", {
    timeZone,
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(parsed))
}

function deriveBillingStatus(row: AccessStatusRow, now: Date): BillingState["status"] {
  const accessState = resolveAccessState({
    accessStatus: row,
    isEmailVerified: true,
    now,
  })

  if (!accessState.canUseApp) {
    return "past_due"
  }

  if (accessState.accessOverrideActive) {
    return "active"
  }

  return row.accessStatus === "trial_active" ? "trial" : "active"
}

export function buildBillingStateFromAccessStatus(
  current: BillingState,
  row: AccessStatusRow,
  now: Date = new Date(),
): BillingState {
  const accessState = resolveAccessState({
    accessStatus: row,
    isEmailVerified: true,
    now,
  })
  const billingStatus = deriveBillingStatus(row, now)

  return {
    ...current,
    planName: row.planName || current.planName,
    status: billingStatus,
    renewAt: row.paidUntil ?? current.renewAt,
    trialEndsAt: row.trialEnd || current.trialEndsAt,
    canCreate: accessState.canUseApp,
  }
}

export function applyAccessStatusToSnapshot(
  snapshot: AppSnapshot,
  row: AccessStatusRow,
  now: Date = new Date(),
): AppSnapshot {
  const billing = buildBillingStateFromAccessStatus(snapshot.billing, row, now)

  // Intentionally update only access-related metadata.
  // Leads, tasks, settings, and the rest of the snapshot must survive temporary access loss.
  return {
    ...snapshot,
    context: {
      ...snapshot.context,
      userId: row.userId || snapshot.context.userId,
      workspaceId: row.workspaceId || snapshot.context.workspaceId,
      accessStatus: row.accessStatus,
      billingStatus: billing.status,
      accessOverrideMode: row.accessOverrideMode ?? null,
      accessOverrideExpiresAt: row.accessOverrideExpiresAt ?? null,
      accessOverrideNote: row.accessOverrideNote ?? null,
    },
    billing,
  }
}

function getEffectiveAccessStatus(snapshot: AppSnapshot) {
  if (snapshot.context.accessStatus !== "local") {
    return snapshot.context.accessStatus
  }

  if (snapshot.billing.status === "trial") return "trial_active"
  if (snapshot.billing.status === "active") return "paid_active"
  if (snapshot.billing.status === "past_due") return "trial_expired"
  return "local"
}

export function getAccountStatusPresentation(
  snapshot: AppSnapshot,
  options: { timeZone: string; now?: Date } = { timeZone: "Europe/Warsaw" },
): AccountStatusPresentation {
  const now = options.now ?? new Date()
  const activeOverride = getActiveOverrideFromSnapshot(snapshot, now)
  const effectiveStatus = getEffectiveAccessStatus(snapshot)
  const planName = snapshot.billing.planName || "Solo"
  const trialEndLabel = formatAccountStatusDate(snapshot.billing.trialEndsAt, options.timeZone)
  const paidUntilLabel = formatAccountStatusDate(snapshot.billing.renewAt, options.timeZone)
  const overrideUntilLabel = formatAccountStatusDate(snapshot.context.accessOverrideExpiresAt, options.timeZone)
  const trialDaysLeft = getDaysUntil(snapshot.billing.trialEndsAt, now)
  const planDaysLeft = getDaysUntil(snapshot.billing.renewAt, now)
  const overrideDaysLeft = getDaysUntil(snapshot.context.accessOverrideExpiresAt, now)

  if (activeOverride === "admin_unlimited") {
    return {
      tone: "success",
      badgeLabel: "Admin unlimited",
      title: "Stały dostęp administratora",
      description:
        snapshot.context.accessOverrideNote ||
        "To konto ma stały bypass administratora i nie podlega normalnej logice triala ani płatności.",
      primaryDateLabel: null,
      secondaryDateLabel: paidUntilLabel !== "—" ? `Ostatni znany termin planu: ${paidUntilLabel}` : null,
      ctaLabel: "Otwórz billing",
      isBlocked: false,
      isExpiringSoon: false,
    }
  }

  if (activeOverride === "tester_unlimited") {
    return {
      tone: overrideDaysLeft !== null && overrideDaysLeft <= 3 ? "warning" : "success",
      badgeLabel: "Tester access",
      title: snapshot.context.accessOverrideExpiresAt ? "Dostęp testowy aktywny do wybranej daty" : "Dostęp testowy aktywny",
      description:
        snapshot.context.accessOverrideNote ||
        (snapshot.context.accessOverrideExpiresAt
          ? "To konto ma aktywny override testowy i nie wpada teraz w zwykły trial ani blokadę płatności."
          : "To konto ma aktywny testowy no-limit access i nie wpada teraz w zwykły trial ani blokadę płatności."),
      primaryDateLabel: snapshot.context.accessOverrideExpiresAt && overrideUntilLabel !== "—" ? `Dostęp testowy do: ${overrideUntilLabel}` : "Dostęp testowy bez limitu czasu",
      secondaryDateLabel: paidUntilLabel !== "—" ? `Ostatni znany termin planu: ${paidUntilLabel}` : null,
      ctaLabel: "Otwórz billing",
      isBlocked: false,
      isExpiringSoon: overrideDaysLeft !== null && overrideDaysLeft >= 0 && overrideDaysLeft <= 3,
    }
  }

  if (effectiveStatus === "local") {
    return {
      tone: "neutral",
      badgeLabel: "Status lokalny",
      title: "Brak statusu z serwera",
      description: "To środowisko działa lokalnie i nie ma jeszcze podpiętego prawdziwego statusu konta.",
      primaryDateLabel: null,
      secondaryDateLabel: null,
      ctaLabel: "Zobacz billing",
      isBlocked: false,
      isExpiringSoon: false,
    }
  }

  const accessState = resolveAccessState({
    isEmailVerified: true,
    accessStatus: {
      accessStatus: effectiveStatus,
      trialEnd: snapshot.billing.trialEndsAt,
      paidUntil: snapshot.billing.renewAt,
    },
    now,
  })

  switch (effectiveStatus) {
    case "trial_active":
      return {
        tone: trialDaysLeft !== null && trialDaysLeft <= 3 ? "warning" : "neutral",
        badgeLabel: "Trial",
        title: trialDaysLeft !== null && trialDaysLeft <= 3 ? "Trial kończy się wkrótce" : "Trial aktywny",
        description:
          trialEndLabel !== "—"
            ? `Masz pełny dostęp do aplikacji do ${trialEndLabel}.`
            : "Masz aktywny okres próbny i pełny dostęp do aplikacji.",
        primaryDateLabel: trialEndLabel !== "—" ? `Koniec triala: ${trialEndLabel}` : null,
        secondaryDateLabel: null,
        ctaLabel: "Zobacz billing",
        isBlocked: !accessState.canUseApp,
        isExpiringSoon: trialDaysLeft !== null && trialDaysLeft >= 0 && trialDaysLeft <= 3,
      }
    case "paid_active":
      return {
        tone: "success",
        badgeLabel: "Aktywne konto",
        title: "Plan aktywny",
        description:
          paidUntilLabel !== "—"
            ? `Plan ${planName} jest aktywny do ${paidUntilLabel}.`
            : `Plan ${planName} jest aktywny.`,
        primaryDateLabel: paidUntilLabel !== "—" ? `Aktywne do: ${paidUntilLabel}` : null,
        secondaryDateLabel: null,
        ctaLabel: "Otwórz billing",
        isBlocked: !accessState.canUseApp,
        isExpiringSoon: false,
      }
    case "canceled":
      return {
        tone: planDaysLeft !== null && planDaysLeft >= 0 ? "warning" : "danger",
        badgeLabel: "Kończy się z końcem okresu",
        title: planDaysLeft !== null && planDaysLeft >= 0 ? "Plan nie odnowi się automatycznie" : "Plan wygasł",
        description:
          paidUntilLabel !== "—"
            ? `Masz dostęp do aplikacji do ${paidUntilLabel}, potem konto zostanie zablokowane.`
            : "Plan został anulowany i konto wymaga odnowienia.",
        primaryDateLabel: paidUntilLabel !== "—" ? `Dostęp do: ${paidUntilLabel}` : null,
        secondaryDateLabel: null,
        ctaLabel: "Sprawdź billing",
        isBlocked: !accessState.canUseApp,
        isExpiringSoon: planDaysLeft !== null && planDaysLeft >= 0 && planDaysLeft <= 3,
      }
    case "payment_failed":
      return accessState.canUseApp
        ? {
            tone: "warning",
            badgeLabel: "Bufor po problemie z płatnością",
            title: "Dostęp działa tymczasowo",
            description:
              "Wystąpił problem z płatnością, ale aplikacja nadal działa w miękkim buforze. Uzupełnij płatność, zanim dostęp zostanie zablokowany.",
            primaryDateLabel: paidUntilLabel !== "—" ? `Ostatni znany termin planu: ${paidUntilLabel}` : null,
            secondaryDateLabel: null,
            ctaLabel: "Napraw płatność",
            isBlocked: false,
            isExpiringSoon: true,
          }
        : {
            tone: "danger",
            badgeLabel: "Problem z płatnością",
            title: "Płatność wymaga uwagi",
            description: "Dostęp do normalnego używania aplikacji jest wstrzymany do czasu poprawy płatności.",
            primaryDateLabel: paidUntilLabel !== "—" ? `Ostatni znany termin: ${paidUntilLabel}` : null,
            secondaryDateLabel: null,
            ctaLabel: "Napraw płatność",
            isBlocked: true,
            isExpiringSoon: false,
          }
    case "trial_expired":
    default:
      return {
        tone: "danger",
        badgeLabel: "Trial wygasł",
        title: "Okres próbny się skończył",
        description:
          trialEndLabel !== "—"
            ? `Trial wygasł ${trialEndLabel}. Opłać dostęp, żeby wrócić do normalnej pracy.`
            : "Okres próbny się skończył. Opłać dostęp, żeby wrócić do normalnej pracy.",
        primaryDateLabel: trialEndLabel !== "—" ? `Koniec triala: ${trialEndLabel}` : null,
        secondaryDateLabel: null,
        ctaLabel: "Przejdź do billing",
        isBlocked: true,
        isExpiringSoon: false,
      }
  }
}
