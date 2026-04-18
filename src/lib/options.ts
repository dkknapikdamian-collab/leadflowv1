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

export const STATUS_OPTIONS = [
  { value: 'new', label: 'Nowy', color: 'bg-blue-100 text-blue-700' },
  { value: 'contacted', label: 'Skontaktowany', color: 'bg-indigo-100 text-indigo-700' },
  { value: 'qualification', label: 'Kwalifikacja', color: 'bg-purple-100 text-purple-700' },
  { value: 'proposal_sent', label: 'Oferta wysłana', color: 'bg-amber-100 text-amber-700' },
  { value: 'follow_up', label: 'Follow-up', color: 'bg-orange-100 text-orange-700' },
  { value: 'negotiation', label: 'Negocjacje', color: 'bg-pink-100 text-pink-700' },
  { value: 'won', label: 'Wygrany', color: 'bg-emerald-100 text-emerald-700' },
  { value: 'lost', label: 'Przegrany', color: 'bg-slate-100 text-slate-700' },
];

export const TASK_TYPES = [
  { value: 'follow_up', label: 'Follow-up' },
  { value: 'phone', label: 'Telefon' },
  { value: 'reply', label: 'Odpisać' },
  { value: 'send_offer', label: 'Wysłać ofertę' },
  { value: 'meeting', label: 'Spotkanie' },
  { value: 'other', label: 'Inne' },
];

export const EVENT_TYPES = [
  { value: 'meeting', label: 'Spotkanie' },
  { value: 'phone_call', label: 'Rozmowa' },
  { value: 'follow_up', label: 'Follow-up' },
  { value: 'deadline', label: 'Deadline' },
  { value: 'custom', label: 'Własne wydarzenie' },
];

export const RECURRENCE_OPTIONS = [
  { value: 'none', label: 'Brak' },
  { value: 'daily', label: 'Codziennie' },
  { value: 'weekly', label: 'Co tydzień' },
  { value: 'monthly', label: 'Co miesiąc' },
];

export const REMINDER_MODE_OPTIONS = [
  { value: 'none', label: 'Brak' },
  { value: 'once', label: 'Przypomnij raz' },
  { value: 'recurring', label: 'Przypominaj cyklicznie' },
];

export const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Niski' },
  { value: 'medium', label: 'Średni' },
  { value: 'high', label: 'Wysoki' },
];
