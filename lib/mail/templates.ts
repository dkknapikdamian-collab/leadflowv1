export type AccountStatusEmailKind =
  | "trial_ends_3d"
  | "trial_ends_1d"
  | "account_active_until"
  | "plan_expired"
  | "payment_failed"

export interface AccountStatusEmailTemplateInput {
  kind: AccountStatusEmailKind
  displayName: string
  planName: string
  dateLabel: string
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

export function formatPolishDate(value: string | null) {
  if (!value) return "brak daty"

  const date = new Date(value)
  return new Intl.DateTimeFormat("pl-PL", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date)
}

export function buildAccountStatusEmailTemplate(input: AccountStatusEmailTemplateInput) {
  const safeName = escapeHtml(input.displayName || "Użytkowniku")
  const safePlanName = escapeHtml(input.planName || "Twój plan")
  const safeDateLabel = escapeHtml(input.dateLabel)

  switch (input.kind) {
    case "trial_ends_3d":
      return {
        subject: "Trial kończy się za 3 dni",
        text: `Cześć ${input.displayName},\n\nTwój trial kończy się ${input.dateLabel}. Opłać plan, żeby zachować dostęp do aplikacji.\n\nClientPilot`,
        html: `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#111"><p>Cześć ${safeName},</p><p>Twój trial kończy się <strong>${safeDateLabel}</strong>.</p><p>Opłać plan, żeby zachować dostęp do aplikacji.</p><p>ClientPilot</p></div>`,
      }
    case "trial_ends_1d":
      return {
        subject: "Trial kończy się jutro",
        text: `Cześć ${input.displayName},\n\nTwój trial kończy się jutro, ${input.dateLabel}. Opłać plan, żeby nie stracić dostępu do aplikacji.\n\nClientPilot`,
        html: `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#111"><p>Cześć ${safeName},</p><p>Twój trial kończy się jutro, <strong>${safeDateLabel}</strong>.</p><p>Opłać plan, żeby nie stracić dostępu do aplikacji.</p><p>ClientPilot</p></div>`,
      }
    case "account_active_until":
      return {
        subject: "Konto aktywne do dnia X",
        text: `Cześć ${input.displayName},\n\nTwój plan ${input.planName} jest aktywny do ${input.dateLabel}.\n\nClientPilot`,
        html: `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#111"><p>Cześć ${safeName},</p><p>Twój plan <strong>${safePlanName}</strong> jest aktywny do <strong>${safeDateLabel}</strong>.</p><p>ClientPilot</p></div>`,
      }
    case "payment_failed":
      return {
        subject: "Płatność nieudana",
        text: `Cześć ${input.displayName},\n\nNie udało się pobrać płatności za plan ${input.planName}. Uzupełnij płatność, żeby odzyskać pełny dostęp do aplikacji.\n\nClientPilot`,
        html: `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#111"><p>Cześć ${safeName},</p><p>Nie udało się pobrać płatności za plan <strong>${safePlanName}</strong>.</p><p>Uzupełnij płatność, żeby odzyskać pełny dostęp do aplikacji.</p><p>ClientPilot</p></div>`,
      }
    case "plan_expired":
    default:
      return {
        subject: "Plan wygasł",
        text: `Cześć ${input.displayName},\n\nTwój dostęp do aplikacji wygasł ${input.dateLabel}. Opłać plan, żeby wrócić do pracy.\n\nClientPilot`,
        html: `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#111"><p>Cześć ${safeName},</p><p>Twój dostęp do aplikacji wygasł <strong>${safeDateLabel}</strong>.</p><p>Opłać plan, żeby wrócić do pracy.</p><p>ClientPilot</p></div>`,
      }
  }
}

