import { evaluateAccessStatusDecision } from "@/lib/access/decision"
import type { AccessStatusRow } from "@/lib/supabase/access-status"
import type { AppSnapshot, BillingState } from "@/lib/types"

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
  const decision = evaluateAccessStatusDecision({
    accessStatus: {
      accessStatus: row.accessStatus,
      trialEnd: row.trialEnd,
      paidUntil: row.paidUntil,
    },
    now,
  })

  if (row.accessStatus === "trial_active" && decision.allowed) {
    return "trial"
  }

  if ((row.accessStatus === "paid_active" || row.accessStatus === "canceled") && decision.allowed) {
    return "active"
  }

  return "past_due"
}

export function buildBillingStateFromAccessStatus(
  current: BillingState,
  row: AccessStatusRow,
  now: Date = new Date(),
): BillingState {
  const billingStatus = deriveBillingStatus(row, now)
  const canCreate = billingStatus === "trial" || billingStatus === "active"

  return {
    ...current,
    planName: row.planName || current.planName,
    status: billingStatus,
    renewAt: row.paidUntil ?? current.renewAt,
    trialEndsAt: row.trialEnd || current.trialEndsAt,
    canCreate,
  }
}

export function applyAccessStatusToSnapshot(
  snapshot: AppSnapshot,
  row: AccessStatusRow,
  now: Date = new Date(),
): AppSnapshot {
  const billing = buildBillingStateFromAccessStatus(snapshot.billing, row, now)

  return {
    ...snapshot,
    context: {
      ...snapshot.context,
      userId: row.userId || snapshot.context.userId,
      workspaceId: row.workspaceId || snapshot.context.workspaceId,
      accessStatus: row.accessStatus,
      billingStatus: billing.status,
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
  const effectiveStatus = getEffectiveAccessStatus(snapshot)
  const planName = snapshot.billing.planName || "Solo"
  const trialEndLabel = formatAccountStatusDate(snapshot.billing.trialEndsAt, options.timeZone)
  const paidUntilLabel = formatAccountStatusDate(snapshot.billing.renewAt, options.timeZone)
  const trialDaysLeft = getDaysUntil(snapshot.billing.trialEndsAt, now)
  const planDaysLeft = getDaysUntil(snapshot.billing.renewAt, now)

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
        isBlocked: false,
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
        isBlocked: false,
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
        isBlocked: !(planDaysLeft !== null && planDaysLeft >= 0),
        isExpiringSoon: planDaysLeft !== null && planDaysLeft >= 0 && planDaysLeft <= 3,
      }
    case "payment_failed":
      return {
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
    case "local":
    default:
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
}
