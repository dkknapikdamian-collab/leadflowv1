import { Calendar, CalendarDays, CircleDot, FileText, type LucideIcon, MessageSquareReply, Phone, UserRound } from 'lucide-react';

export {
  LEAD_SOURCE_OPTIONS as SOURCE_OPTIONS,
  LEAD_STATUS_OPTIONS as STATUS_OPTIONS,
} from './source-of-truth/lead-options';

export const TASK_TYPES = [
  { value: 'follow_up', label: 'Follow-up', icon: MessageSquareReply },
  { value: 'phone', label: 'Telefon', icon: Phone },
  { value: 'reply', label: 'OdpisaĂ„â€ˇ', icon: MessageSquareReply },
  { value: 'send_offer', label: 'WyÄąâ€şlij ofertĂ„â„˘', icon: FileText },
  { value: 'meeting', label: 'Spotkanie', icon: CalendarDays },
  { value: 'other', label: 'Inne', icon: CircleDot },
];

export const EVENT_TYPES = [
  { value: 'meeting', label: 'Spotkanie', icon: CalendarDays },
  { value: 'phone_call', label: 'Rozmowa', icon: Phone },
  { value: 'follow_up', label: 'Follow-up', icon: MessageSquareReply },
  { value: 'deadline', label: 'Deadline', icon: FileText },
  { value: 'custom', label: 'WÄąâ€šasne wydarzenie', icon: CircleDot },
];

export const RECURRENCE_OPTIONS = [
  { value: 'none', label: 'Brak' },
  { value: 'daily', label: 'Codziennie' },
  { value: 'weekly', label: 'Co tydzieÄąâ€ž' },
  { value: 'monthly', label: 'Co miesiĂ„â€¦c' },
];

export const REMINDER_MODE_OPTIONS = [
  { value: 'none', label: 'Brak' },
  { value: 'once', label: 'Jednorazowe' },
  { value: 'recurring', label: 'Przypominaj cyklicznie' },
];

export const REMINDER_OFFSET_OPTIONS = [
  { value: 540, label: 'Tego samego dnia o 09:00' },
  { value: 1440, label: 'DzieÄąâ€ž wczeÄąâ€şniej o 09:00' },
  { value: 2880, label: '2 dni wczeÄąâ€şniej o 09:00' },
  { value: 10080, label: '1 tydzieÄąâ€ž wczeÄąâ€şniej o 09:00' },
];

export const GOOGLE_CALENDAR_REMINDER_METHOD_OPTIONS = [
  { value: 'default', label: 'DomyÄąâ€şlne z Google Calendar' },
  { value: 'popup', label: 'Powiadomienie w Google Calendar' },
  { value: 'email', label: 'E-mail z Google Calendar' },
  { value: 'popup_email', label: 'Powiadomienie + e-mail' },
];

export const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Niski' },
  { value: 'medium', label: 'ÄąĹˇredni' },
  { value: 'high', label: 'Wysoki' },
];

export function getScheduleEntryIcon(kind: 'event' | 'task' | 'lead', type?: string): LucideIcon {
  if (kind === 'lead') return UserRound;
  if (kind === 'event') return EVENT_TYPES.find((entry) => entry.value === type)?.icon ?? CalendarDays;
  return TASK_TYPES.find((entry) => entry.value === type)?.icon ?? CircleDot;
}
