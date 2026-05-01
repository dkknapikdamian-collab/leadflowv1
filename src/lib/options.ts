import {
  CalendarDays,
  CircleDot,
  FileText,
  MessageSquareReply,
  Phone,
  UserRound,
  type LucideIcon,
} from 'lucide-react';

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
  { value: 'reply', label: 'Odpisac', icon: MessageSquareReply },
  { value: 'send_offer', label: 'Wyslij oferte', icon: FileText },
  { value: 'meeting', label: 'Spotkanie', icon: CalendarDays },
  { value: 'other', label: 'Inne', icon: CircleDot },
];

export const EVENT_TYPES = [
  { value: 'meeting', label: 'Spotkanie', icon: CalendarDays },
  { value: 'phone_call', label: 'Rozmowa', icon: Phone },
  { value: 'follow_up', label: 'Follow-up', icon: MessageSquareReply },
  { value: 'deadline', label: 'Deadline', icon: FileText },
  { value: 'custom', label: 'Wlasne wydarzenie', icon: CircleDot },
];

export const RECURRENCE_OPTIONS = [
  { value: 'none', label: 'Brak' },
  { value: 'daily', label: 'Codziennie' },
  { value: 'weekly', label: 'Co tydzien' },
  { value: 'monthly', label: 'Co miesiac' },
];

export const REMINDER_MODE_OPTIONS = [
  { value: 'none', label: 'Brak' },
  { value: 'once', label: 'Jednorazowe' },
  { value: 'recurring', label: 'Przypominaj cyklicznie' },
];

export const REMINDER_OFFSET_OPTIONS = [
  { value: 0, label: 'W momencie terminu' },
  { value: 10, label: '10 minut wczesniej' },
  { value: 30, label: '30 minut wczesniej' },
  { value: 60, label: '1 godzine wczesniej' },
  { value: 1440, label: '1 dzien wczesniej' },
  { value: 10080, label: '1 tydzien wczesniej' },
];

export const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Niski' },
  { value: 'medium', label: 'Sredni' },
  { value: 'high', label: 'Wysoki' },
];

export function getScheduleEntryIcon(kind: 'event' | 'task' | 'lead', type?: string): LucideIcon {
  if (kind === 'lead') return UserRound;
  if (kind === 'event') return EVENT_TYPES.find((entry) => entry.value === type)?.icon ?? CalendarDays;
  return TASK_TYPES.find((entry) => entry.value === type)?.icon ?? CircleDot;
}