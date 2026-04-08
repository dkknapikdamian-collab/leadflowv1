import type {
  AppTheme,
  ApprovalStatus,
  CaseItemStatus,
  CaseTemplateServiceType,
  CaseStatus,
  ItemType,
  LeadStatus,
  Priority,
  ReminderRule,
  SourceOption,
} from "./types"

export const SOURCE_OPTIONS: SourceOption[] = [
  "Instagram",
  "Facebook",
  "Messenger",
  "WhatsApp",
  "E-mail",
  "Formularz",
  "Telefon",
  "Polecenie",
  "Cold outreach",
  "LinkedIn",
  "Strona www",
  "Inne",
]

export const LEAD_STATUS_OPTIONS: { value: LeadStatus; label: string }[] = [
  { value: "new", label: "Nowy" },
  { value: "contacted", label: "Skontaktowany" },
  { value: "qualification", label: "Kwalifikacja" },
  { value: "offer_sent", label: "Oferta wyslana" },
  { value: "follow_up", label: "Follow-up" },
  { value: "won", label: "Wygrany" },
  { value: "lost", label: "Przegrany" },
]

export const CASE_OPERATIONAL_STATUS_OPTIONS: { value: CaseStatus; label: string }[] = [
  { value: "not_started", label: "Nieuruchomiona" },
  { value: "collecting_materials", label: "Zbieranie materialow" },
  { value: "waiting_for_client", label: "Czeka na klienta" },
  { value: "under_review", label: "Do weryfikacji" },
  { value: "ready_to_start", label: "Gotowe do startu" },
  { value: "in_progress", label: "W realizacji" },
  { value: "blocked", label: "Zablokowane" },
  { value: "closed", label: "Zamkniete" },
]

export const CASE_CHECKLIST_STATUS_OPTIONS: { value: CaseItemStatus; label: string }[] = [
  { value: "none", label: "Brak" },
  { value: "request_sent", label: "Wyslano prosbe" },
  { value: "delivered", label: "Doslane" },
  { value: "under_review", label: "Do weryfikacji" },
  { value: "needs_correction", label: "Do poprawy" },
  { value: "accepted", label: "Zaakceptowane" },
  { value: "not_applicable", label: "Nie dotyczy" },
]

export const CASE_TEMPLATE_SERVICE_TYPE_OPTIONS: { value: CaseTemplateServiceType; label: string }[] = [
  { value: "website", label: "Strona www" },
  { value: "branding", label: "Branding" },
  { value: "ads_campaign", label: "Kampania reklamowa" },
  { value: "client_onboarding", label: "Onboarding klienta" },
  { value: "custom", label: "Niestandardowe" },
]

export const CASE_TEMPLATE_ITEM_KIND_OPTIONS: Array<{
  value: "file" | "decision" | "approval" | "response" | "access"
  label: string
}> = [
  { value: "file", label: "Plik" },
  { value: "decision", label: "Decyzja" },
  { value: "approval", label: "Akceptacja" },
  { value: "response", label: "Odpowiedz" },
  { value: "access", label: "Dostep" },
]

export const REQUEST_STATUS_OPTIONS: { value: ApprovalStatus; label: string }[] = [
  { value: "not_sent", label: "Niewyslana" },
  { value: "sent", label: "Wyslana" },
  { value: "reminder_sent", label: "Przypomnienie wyslane" },
  { value: "answered", label: "Odpowiedziano" },
  { value: "overdue", label: "Przeterminowana" },
  { value: "accepted", label: "Zaakceptowano" },
  { value: "rejected", label: "Odrzucono" },
  { value: "needs_changes", label: "Wymaga zmian" },
]

export const PRIORITY_OPTIONS: { value: Priority; label: string }[] = [
  { value: "high", label: "Wysoki" },
  { value: "medium", label: "Sredni" },
  { value: "low", label: "Niski" },
]

export const ITEM_TYPE_OPTIONS: { value: ItemType; label: string; icon: string }[] = [
  { value: "follow_up", label: "Follow-up", icon: "↩" },
  { value: "call", label: "Rozmowa", icon: "◯" },
  { value: "reply", label: "Odpisac", icon: "✉" },
  { value: "proposal", label: "Oferta", icon: "▣" },
  { value: "check_reply", label: "Sprawdzic odpowiedz", icon: "◆" },
  { value: "meeting", label: "Spotkanie", icon: "⊞" },
  { value: "deadline", label: "Przypomnienie", icon: "◷" },
  { value: "task", label: "Zadanie", icon: "☑" },
  { value: "note", label: "Notatka", icon: "✎" },
  { value: "other", label: "Wlasne wydarzenie", icon: "•" },
]

export const REMINDER_OPTIONS: { value: ReminderRule; label: string }[] = [
  { value: "none", label: "Brak" },
  { value: "at_time", label: "W czasie wpisu" },
  { value: "1h_before", label: "Godzine wczesniej" },
  { value: "tomorrow", label: "Jutro" },
  { value: "daily", label: "Codziennie" },
  { value: "every_2_days", label: "Co 2 dni" },
  { value: "weekly", label: "Co tydzien" },
  { value: "monthly", label: "Co miesiac" },
  { value: "friday", label: "W kazdy piatek" },
]

export const THEME_OPTIONS: { value: AppTheme; label: string; description: string }[] = [
  { value: "classic", label: "Klasyczny", description: "Ciemny wyglad z obecnym zlotym akcentem." },
  { value: "midnight", label: "Nocny blekit", description: "Czern, granat, biel i niebieskie akcenty." },
]
