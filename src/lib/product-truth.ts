export type ProductTruthStatus =
  | 'active'
  | 'requires_config'
  | 'beta'
  | 'coming_soon'
  | 'disabled_by_plan'
  | 'internal_only';

export type ProductTruthItem = {
  key: string;
  label: string;
  status: ProductTruthStatus;
  userCopy: string;
  operatorNote: string;
};

// FAZA1_ETAP11_PRODUCT_TRUTH_REGISTRY_2026_05_03
// Jedno miejsce z prawdą produktu. UI nie może obiecywać więcej niż ten status.
export const PRODUCT_TRUTH_STATUS: ProductTruthItem[] = [
  {
    key: 'lead_client_case_workflow',
    label: 'Lead → klient → sprawa',
    status: 'active',
    userCopy: 'Aktywny workflow sprzedażowo-operacyjny.',
    operatorNote: 'Podstawowy workflow może być testowany ręcznie po deployu.',
  },
  {
    key: 'stripe_billing',
    label: 'Stripe / BLIK / subskrypcje',
    status: 'requires_config',
    userCopy: 'Płatności wymagają konfiguracji Stripe i webhooka w środowisku produkcyjnym.',
    operatorNote: 'Nie pokazywać jako gotowe bez STRIPE_SECRET_KEY, price ID i webhook secret.',
  },
  {
    key: 'daily_digest_email',
    label: 'Poranny digest e-mail',
    status: 'requires_config',
    userCopy: 'Digest wymaga konfiguracji mail providera i adresu nadawcy.',
    operatorNote: 'Bez RESEND_API_KEY / DIGEST_FROM_EMAIL nie obiecywać fizycznej wysyłki.',
  },
  {
    key: 'google_calendar',
    label: 'Google Calendar',
    status: 'requires_config',
    userCopy: 'Integracja Google Calendar wymaga OAuth, ENV i aktywnego poĹ‚Ä…czenia uĹĽytkownika.',
    operatorNote: 'DostÄ™pne jako pĹ‚atna funkcja po konfiguracji GOOGLE_CLIENT_ID/SECRET/REDIRECT_URI i token encryption.',
  },
  {
    key: 'ai_assistant',
    label: 'Asystent AI',
    status: 'beta',
    userCopy: 'AI przygotowuje szkic albo odpowiedź na podstawie danych aplikacji. Zapis wymaga potwierdzenia użytkownika.',
    operatorNote: 'Zakaz claimu automatycznego finalnego zapisu przez AI.',
  },
  {
    key: 'ai_admin_settings',
    label: 'Admin AI',
    status: 'internal_only',
    userCopy: 'Diagnostyka AI jest widoczna tylko dla admina.',
    operatorNote: 'Zwykły user nie powinien widzieć menu Admin AI.',
  },
  {
    key: 'pwa_install',
    label: 'PWA / dodanie do ekranu telefonu',
    status: 'active',
    userCopy: 'To aplikacja webowa możliwa do dodania do ekranu głównego, nie natywna aplikacja ze sklepu.',
    operatorNote: 'Nie obiecywać App Store / Google Play.',
  },
  {
    key: 'soc_security_claims',
    label: 'SOC/security claims',
    status: 'disabled_by_plan',
    userCopy: 'Nie składamy publicznych claimów typu SOC 2 certified, jeśli nie ma certyfikatu i dokumentu dowodowego.',
    operatorNote: 'Każdy claim security/legal musi mieć dokument i dowód.',
  },
];

export function getProductTruthItem(key: string) {
  return PRODUCT_TRUTH_STATUS.find((item) => item.key === key) || null;
}
