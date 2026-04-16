export const LEAD_SOURCE_OPTIONS = [
  { value: 'instagram', label: 'Instagram' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'messenger', label: 'Messenger' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'email', label: 'E-mail' },
  { value: 'form', label: 'Formularz' },
  { value: 'phone', label: 'Telefon' },
  { value: 'referral', label: 'Polecenie' },
  { value: 'cold_outreach', label: 'Zimny kontakt' },
  { value: 'other', label: 'Inne' },
] as const;

const SOURCE_LABELS = new Map<string, string>(
  LEAD_SOURCE_OPTIONS.map((option) => [option.value, option.label])
);

export function getLeadSourceLabel(source?: string | null) {
  if (!source) return 'Nie określono';
  return SOURCE_LABELS.get(source) ?? source;
}
