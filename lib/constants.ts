import type {
  AppTheme,
  CaseItemStatus,
  CaseOperationalStatus,
  ItemType,
  LeadStatus,
  Priority,
  ReminderRule,
  RequestStatus,
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
  { value: "proposal_sent", label: "Oferta wyslana" },
  { value: "follow_up", label: "Follow-up" },
  { value: "won", label: "Wygrany" },
  { value: "ready_to_start", label: "Gotowy do startu" },
  { value: "lost", label: "Przegrany" },
]

export const CASE_OPERATIONAL_STATUS_OPTIONS: { value: CaseOperationalStatus; label: string }[] = [
  { value: "not_started", label: "Nieuruchomiona" },
  { value: "collecting_materials", label: "Zbieranie materialow" },
  { value: "waiting_for_client", label: "Czeka na klienta" },
  { value: "for_review", label: "Do weryfikacji" },
  { value: "ready_to_start", label: "Gotowe do startu" },
  { value: "in_progress", label: "W realizacji" },
  { value: "blocked", label: "Zablokowane" },
  { value: "closed", label: "Zamkniete" },
]

export const CHECKLIST_ITEM_STATUS_OPTIONS: { value: CaseItemStatus; label: string }[] = [
  { value: "none", label: "Brak" },
  { value: "request_sent", label: "Wyslano prosbe" },
  { value: "submitted", label: "Doslane" },
  { value: "for_review", label: "Do weryfikacji" },
  { value: "needs_fix", label: "Do poprawy" },
  { value: "approved", label: "Zaakceptowane" },
  { value: "not_applicable", label: "Nie dotyczy" },
]

export const REQUEST_STATUS_OPTIONS: { value: RequestStatus; label: string }[] = [
  { value: "not_sent", label: "Niewyslana" },
  { value: "sent", label: "Wyslana" },
  { value: "reminder_sent", label: "Przypomnienie wyslane" },
  { value: "responded", label: "Odpowiedziano" },
  { value: "overdue", label: "Przeterminowana" },
]

export const PRIORITY_OPTIONS: { value: Priority; label: string }[] = [
  { value: "high", label: "Wysoki" },
  { value: "medium", label: "Sredni" },
  { value: "low", label: "Niski" },
]

export const ITEM_TYPE_OPTIONS: { value: ItemType; label: string; icon: string }[] = [
  { value: "follow_up", label: "Follow-up", icon: "F" },
  { value: "call", label: "Rozmowa", icon: "C" },
  { value: "reply", label: "Odpisac", icon: "R" },
  { value: "proposal", label: "Oferta", icon: "O" },
  { value: "check_reply", label: "Sprawdzic odpowiedz", icon: "S" },
  { value: "meeting", label: "Spotkanie", icon: "M" },
  { value: "deadline", label: "Przypomnienie", icon: "P" },
  { value: "task", label: "Zadanie", icon: "Z" },
  { value: "note", label: "Notatka", icon: "N" },
  { value: "other", label: "Wlasne wydarzenie", icon: "*" },
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
