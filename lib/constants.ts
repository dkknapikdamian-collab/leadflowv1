import type { AppTheme, ItemType, LeadStatus, Priority, ReminderRule, SourceOption } from "./types"

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
  { value: "contacted", label: "Odpisane" },
  { value: "waiting", label: "Czeka" },
  { value: "followup_needed", label: "Follow-up dziś" },
  { value: "meeting_scheduled", label: "Spotkanie umówione" },
  { value: "won", label: "Wygrany" },
  { value: "lost", label: "Stracony" },
]

export const PRIORITY_OPTIONS: { value: Priority; label: string }[] = [
  { value: "high", label: "Wysoki" },
  { value: "medium", label: "Średni" },
  { value: "low", label: "Niski" },
]

export const ITEM_TYPE_OPTIONS: { value: ItemType; label: string; icon: string }[] = [
  { value: "follow_up", label: "Follow-up", icon: "↩" },
  { value: "call", label: "Rozmowa", icon: "◎" },
  { value: "reply", label: "Odpisać", icon: "✉" },
  { value: "proposal", label: "Oferta", icon: "▣" },
  { value: "check_reply", label: "Sprawdzić odpowiedź", icon: "◈" },
  { value: "meeting", label: "Spotkanie", icon: "⊞" },
  { value: "deadline", label: "Przypomnienie", icon: "◷" },
  { value: "task", label: "Zadanie", icon: "☑" },
  { value: "note", label: "Notatka", icon: "✎" },
  { value: "other", label: "Własne wydarzenie", icon: "•" },
]

export const REMINDER_OPTIONS: { value: ReminderRule; label: string }[] = [
  { value: "none", label: "Brak" },
  { value: "at_time", label: "W czasie wpisu" },
  { value: "1h_before", label: "Godzinę wcześniej" },
  { value: "tomorrow", label: "Jutro" },
  { value: "daily", label: "Codziennie" },
  { value: "every_2_days", label: "Co 2 dni" },
  { value: "weekly", label: "Co tydzień" },
  { value: "monthly", label: "Co miesiąc" },
  { value: "friday", label: "W każdy piątek" },
]

export const THEME_OPTIONS: { value: AppTheme; label: string; description: string }[] = [
  { value: "classic", label: "Klasyczny", description: "Ciemny wygląd z obecnym złotym akcentem." },
  { value: "midnight", label: "Nocny błękit", description: "Czerń, granat, biel i niebieskie akcenty." },
]
