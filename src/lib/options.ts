import { Calendar, CalendarDays, CircleDot, FileText, type LucideIcon, MessageSquareReply, Phone, UserRound } from 'lucide-react';
import { LEAD_STATUS_OPTIONS } from './domain-statuses';

export const SOURCE_OPTIONS = [
  { value: 'instagram', label: 'Instagram' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'messenger', label: 'Messenger' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'email', label: 'E-mail' },
  { value: 'form', label: 'Formularz' },
  { value: 'phone', label: 'Telefon' },
  { value: 'referral', label: 'Polecenie' },
  { value: 'cold_outreach', label: 'Cold Outreach' },
  { value: 'other', label: 'Inne' },
];

export const STATUS_OPTIONS = LEAD_STATUS_OPTIONS;

export const TASK_TYPES = [
  { value: 'follow_up', label: 'Follow-up', icon: MessageSquareReply },
  { value: 'phone', label: 'Telefon', icon: Phone },
  { value: 'reply', label: 'Odpisać', icon: MessageSquareReply },
  { value: 'send_offer', label: 'Wyślij ofertę', icon: FileText },
  { value: 'meeting', label: 'Spotkanie', icon: CalendarDays },
  { value: 'other', label: 'Inne', icon: CircleDot },
];

export const EVENT_TYPES = [
  { value: 'meeting', label: 'Spotkanie', icon: CalendarDays },
  { value: 'phone_call', label: 'Rozmowa', icon: Phone },
  { value: 'follow_up', label: 'Follow-up', icon: MessageSquareReply },
  { value: 'deadline', label: 'Deadline', icon: FileText },
  { value: 'custom', label: 'Własne wydarzenie', icon: CircleDot },
];

export const RECURRENCE_OPTIONS = [
  { value: 'none', label: 'Brak' },
  { value: 'daily', label: 'Codziennie' },
  { value: 'weekly', label: 'Co tydzień' },
  { value: 'monthly', label: 'Co miesiąc' },
];

export const REMINDER_MODE_OPTIONS = [
  { value: 'none', label: 'Brak' },
  { value: 'once', label: 'Jednorazowe' },
  { value: 'recurring', label: 'Przypominaj cyklicznie' },
];

export const REMINDER_OFFSET_OPTIONS = [
  { value: 540, label: 'Tego samego dnia o 09:00' },
  { value: 1440, label: 'Dzień wcześniej o 09:00' },
  { value: 2880, label: '2 dni wcześniej o 09:00' },
  { value: 10080, label: '1 tydzień wcześniej o 09:00' },
];

export const GOOGLE_CALENDAR_REMINDER_METHOD_OPTIONS = [
  { value: 'default', label: 'Domyślne z Google Calendar' },
  { value: 'popup', label: 'Powiadomienie w Google Calendar' },
  { value: 'email', label: 'E-mail z Google Calendar' },
  { value: 'popup_email', label: 'Powiadomienie + e-mail' },
];

export const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Niski' },
  { value: 'medium', label: 'Średni' },
  { value: 'high', label: 'Wysoki' },
];

export function getScheduleEntryIcon(kind: 'event' | 'task' | 'lead', type?: string): LucideIcon {
  if (kind === 'lead') return UserRound;
  if (kind === 'event') return EVENT_TYPES.find((entry) => entry.value === type)?.icon ?? CalendarDays;
  return TASK_TYPES.find((entry) => entry.value === type)?.icon ?? CircleDot;
}
