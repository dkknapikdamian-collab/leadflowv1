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

export type WorkflowEmailKind =
  | "client_link_sent"
  | "client_missing_items_reminder"
  | "client_due_soon"
  | "client_decision_needed"
  | "operator_case_ready_to_start"
  | "operator_case_blocked"
  | "operator_needs_verification"
  | "operator_client_idle"
  | "operator_client_uploaded_file"
  | "operator_case_created"

export interface WorkflowEmailTemplateInput {
  kind: string
  recipientLabel?: string
  title: string
  message: string
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
        text: `Cześć ${input.displayName},\n\nTwój trial kończy się ${input.dateLabel}. Opłać plan, żeby zachować dostęp do aplikacji.\n\nLeadFlow`,
        html: `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#111"><p>Cześć ${safeName},</p><p>Twój trial kończy się <strong>${safeDateLabel}</strong>.</p><p>Opłać plan, żeby zachować dostęp do aplikacji.</p><p>LeadFlow</p></div>`,
      }
    case "trial_ends_1d":
      return {
        subject: "Trial kończy się jutro",
        text: `Cześć ${input.displayName},\n\nTwój trial kończy się jutro, ${input.dateLabel}. Opłać plan, żeby nie stracić dostępu do aplikacji.\n\nLeadFlow`,
        html: `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#111"><p>Cześć ${safeName},</p><p>Twój trial kończy się jutro, <strong>${safeDateLabel}</strong>.</p><p>Opłać plan, żeby nie stracić dostępu do aplikacji.</p><p>LeadFlow</p></div>`,
      }
    case "account_active_until":
      return {
        subject: "Konto aktywne do dnia X",
        text: `Cześć ${input.displayName},\n\nTwój plan ${input.planName} jest aktywny do ${input.dateLabel}.\n\nLeadFlow`,
        html: `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#111"><p>Cześć ${safeName},</p><p>Twój plan <strong>${safePlanName}</strong> jest aktywny do <strong>${safeDateLabel}</strong>.</p><p>LeadFlow</p></div>`,
      }
    case "payment_failed":
      return {
        subject: "Płatność nieudana",
        text: `Cześć ${input.displayName},\n\nNie udało się pobrać płatności za plan ${input.planName}. Uzupełnij płatność, żeby odzyskać pełny dostęp do aplikacji.\n\nLeadFlow`,
        html: `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#111"><p>Cześć ${safeName},</p><p>Nie udało się pobrać płatności za plan <strong>${safePlanName}</strong>.</p><p>Uzupełnij płatność, żeby odzyskać pełny dostęp do aplikacji.</p><p>LeadFlow</p></div>`,
      }
    case "plan_expired":
    default:
      return {
        subject: "Plan wygasł",
        text: `Cześć ${input.displayName},\n\nTwój dostęp do aplikacji wygasł ${input.dateLabel}. Opłać plan, żeby wrócić do pracy.\n\nLeadFlow`,
        html: `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#111"><p>Cześć ${safeName},</p><p>Twój dostęp do aplikacji wygasł <strong>${safeDateLabel}</strong>.</p><p>Opłać plan, żeby wrócić do pracy.</p><p>LeadFlow</p></div>`,
      }
  }
}

export function buildWorkflowEmailTemplate(input: WorkflowEmailTemplateInput) {
  const recipient = escapeHtml(input.recipientLabel?.trim() || "Uzytkowniku")
  const safeTitle = escapeHtml(input.title || "Powiadomienie")
  const safeMessage = escapeHtml(input.message || "Masz nowe powiadomienie w systemie.")

  const byKind: Record<string, { subject: string; intro: string }> = {
    client_link_sent: {
      subject: "Twoj link do panelu sprawy",
      intro: "Link do panelu klienta zostal wygenerowany.",
    },
    client_missing_items_reminder: {
      subject: "Przypomnienie o brakujacych elementach",
      intro: "Sprawa nadal czeka na brakujace materialy.",
    },
    client_due_soon: {
      subject: "Termin mija wkrotce",
      intro: "Jeden z wymaganych elementow ma bliski termin.",
    },
    client_decision_needed: {
      subject: "Decyzja lub odpowiedz jest potrzebna",
      intro: "W panelu czeka krok wymagajacy Twojej reakcji.",
    },
    operator_case_ready_to_start: {
      subject: "Sprawa gotowa do startu",
      intro: "Kompletnosc sprawy osiagnela wymagany poziom.",
    },
    operator_case_blocked: {
      subject: "Sprawa zablokowana",
      intro: "Sprawa ma braki i wymaga ruchu.",
    },
    operator_needs_verification: {
      subject: "Wymagana weryfikacja",
      intro: "Klient doslal lub odpowiedzial. Sprawdz elementy.",
    },
    operator_client_idle: {
      subject: "Klient nic nie doslal",
      intro: "Od dluzszego czasu brak ruchu po stronie klienta.",
    },
    operator_client_uploaded_file: {
      subject: "Klient doslal plik",
      intro: "Pojawil sie nowy plik od klienta.",
    },
    operator_case_created: {
      subject: "Utworzono nowa sprawe",
      intro: "Lead przeszedl do sprawy operacyjnej.",
    },
  }

  const preset = byKind[input.kind] ?? { subject: safeTitle, intro: safeMessage }
  return {
    subject: preset.subject,
    text: `Czesc ${input.recipientLabel || "Uzytkowniku"},\n\n${preset.intro}\n${input.title}\n${input.message}\n\nLeadFlow`,
    html: `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#111"><p>Czesc ${recipient},</p><p>${escapeHtml(
      preset.intro,
    )}</p><p><strong>${safeTitle}</strong></p><p>${safeMessage}</p><p>LeadFlow</p></div>`,
  }
}
