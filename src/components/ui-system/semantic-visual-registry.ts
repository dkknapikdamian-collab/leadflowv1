export const CLOSEFLOW_SEMANTIC_VISUAL_REGISTRY_VS2D = 'CLOSEFLOW_SEMANTIC_VISUAL_REGISTRY_VS2D';

export type CloseflowSemanticVisualName =
  | 'danger-delete'
  | 'session-logout'
  | 'alert-error'
  | 'alert-warning'
  | 'status-open'
  | 'status-done'
  | 'status-overdue'
  | 'entity-client'
  | 'entity-lead'
  | 'entity-case'
  | 'payment-paid'
  | 'payment-due'
  | 'commission-due'
  | 'commission-paid';

export type CloseflowSemanticVisualTone =
  | 'danger'
  | 'warning'
  | 'success'
  | 'status'
  | 'entity'
  | 'payment'
  | 'commission';

export type CloseflowSemanticVisualClasses = {
  text: string;
  subtleText: string;
  icon: string;
  surface: string;
  surfaceStrong: string;
  border: string;
  badge: string;
  ring: string;
};

export type CloseflowSemanticVisualEntry = {
  name: CloseflowSemanticVisualName;
  tone: CloseflowSemanticVisualTone;
  label: string;
  meaning: string;
  allowedUse: string;
  forbiddenUse: string;
  classes: CloseflowSemanticVisualClasses;
};

export const closeflowSemanticVisualRegistry: Record<
  CloseflowSemanticVisualName,
  CloseflowSemanticVisualEntry
> = {
  'danger-delete': {
    name: 'danger-delete',
    tone: 'danger',
    label: 'Usuwanie',
    meaning: 'Akcja usuwa, kasuje albo przenosi rekord do kosza.',
    allowedUse: 'Przyciski i komunikaty związane z usuwaniem danych.',
    forbiddenUse: 'Zwykły status, priorytet, wyróżnienie marketingowe albo dekoracja.',
    classes: {
      text: 'text-red-700',
      subtleText: 'text-red-600',
      icon: 'text-red-600',
      surface: 'bg-red-50',
      surfaceStrong: 'bg-red-100',
      border: 'border-red-200',
      badge: 'bg-red-50 text-red-700 border border-red-200',
      ring: 'focus-visible:ring-red-500',
    },
  },
  'session-logout': {
    name: 'session-logout',
    tone: 'danger',
    label: 'Wylogowanie',
    meaning: 'Akcja kończy sesję użytkownika, ale nie usuwa danych.',
    allowedUse: 'Wylogowanie, zakończenie sesji, utrata aktywnej sesji.',
    forbiddenUse: 'Usuwanie rekordu albo błąd systemowy.',
    classes: {
      text: 'text-rose-700',
      subtleText: 'text-rose-600',
      icon: 'text-rose-600',
      surface: 'bg-rose-50',
      surfaceStrong: 'bg-rose-100',
      border: 'border-rose-200',
      badge: 'bg-rose-50 text-rose-700 border border-rose-200',
      ring: 'focus-visible:ring-rose-500',
    },
  },
  'alert-error': {
    name: 'alert-error',
    tone: 'danger',
    label: 'Błąd',
    meaning: 'Systemowy błąd, blokada, awaria albo walidacja uniemożliwiająca wykonanie akcji.',
    allowedUse: 'Alerty błędu, błędy API, błędy walidacji, krytyczne ostrzeżenia.',
    forbiddenUse: 'Priorytet sprzedażowy, zwykła etykieta albo akcja usuwania.',
    classes: {
      text: 'text-red-700',
      subtleText: 'text-red-600',
      icon: 'text-red-600',
      surface: 'bg-red-50',
      surfaceStrong: 'bg-red-100',
      border: 'border-red-200',
      badge: 'bg-red-50 text-red-700 border border-red-200',
      ring: 'focus-visible:ring-red-500',
    },
  },
  'alert-warning': {
    name: 'alert-warning',
    tone: 'warning',
    label: 'Ostrzeżenie',
    meaning: 'Stan wymaga uwagi, ale nie jest jeszcze błędem ani usunięciem.',
    allowedUse: 'Ryzyko, niepełna konfiguracja, zbliżający się termin, brakujące dane.',
    forbiddenUse: 'Błąd krytyczny, sukces albo zwykła dekoracja.',
    classes: {
      text: 'text-amber-800',
      subtleText: 'text-amber-700',
      icon: 'text-amber-600',
      surface: 'bg-amber-50',
      surfaceStrong: 'bg-amber-100',
      border: 'border-amber-200',
      badge: 'bg-amber-50 text-amber-800 border border-amber-200',
      ring: 'focus-visible:ring-amber-500',
    },
  },
  'status-open': {
    name: 'status-open',
    tone: 'status',
    label: 'Otwarte',
    meaning: 'Rekord jest aktywny i wymaga dalszej pracy.',
    allowedUse: 'Otwarte leady, sprawy, zadania, tickety i szkice.',
    forbiddenUse: 'Encja klienta, płatność albo status zakończony.',
    classes: {
      text: 'text-sky-700',
      subtleText: 'text-sky-600',
      icon: 'text-sky-600',
      surface: 'bg-sky-50',
      surfaceStrong: 'bg-sky-100',
      border: 'border-sky-200',
      badge: 'bg-sky-50 text-sky-700 border border-sky-200',
      ring: 'focus-visible:ring-sky-500',
    },
  },
  'status-done': {
    name: 'status-done',
    tone: 'success',
    label: 'Zrobione',
    meaning: 'Rekord albo akcja została ukończona poprawnie.',
    allowedUse: 'Zadania zrobione, sprawy zakończone, pozytywne potwierdzenia.',
    forbiddenUse: 'Płatność, prowizja albo status encji bez zakończenia.',
    classes: {
      text: 'text-emerald-700',
      subtleText: 'text-emerald-600',
      icon: 'text-emerald-600',
      surface: 'bg-emerald-50',
      surfaceStrong: 'bg-emerald-100',
      border: 'border-emerald-200',
      badge: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      ring: 'focus-visible:ring-emerald-500',
    },
  },
  'status-overdue': {
    name: 'status-overdue',
    tone: 'danger',
    label: 'Zaległe',
    meaning: 'Termin minął i element wymaga reakcji.',
    allowedUse: 'Zaległe zadania, wydarzenia, follow-upy i terminy.',
    forbiddenUse: 'Usuwanie danych, zwykły wysoki priorytet albo błąd API.',
    classes: {
      text: 'text-red-700',
      subtleText: 'text-red-600',
      icon: 'text-red-600',
      surface: 'bg-red-50',
      surfaceStrong: 'bg-red-100',
      border: 'border-red-200',
      badge: 'bg-red-50 text-red-700 border border-red-200',
      ring: 'focus-visible:ring-red-500',
    },
  },
  'entity-client': {
    name: 'entity-client',
    tone: 'entity',
    label: 'Klient',
    meaning: 'Osoba albo firma w tle, łącząca leady i sprawy.',
    allowedUse: 'Ikony, pigułki, nagłówki i subtelne wyróżnienia encji klienta.',
    forbiddenUse: 'Status, błąd, płatność albo prowizja.',
    classes: {
      text: 'text-indigo-700',
      subtleText: 'text-indigo-600',
      icon: 'text-indigo-600',
      surface: 'bg-indigo-50',
      surfaceStrong: 'bg-indigo-100',
      border: 'border-indigo-200',
      badge: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
      ring: 'focus-visible:ring-indigo-500',
    },
  },
  'entity-lead': {
    name: 'entity-lead',
    tone: 'entity',
    label: 'Lead',
    meaning: 'Temat do pozyskania, wymagający ruchu sprzedażowego.',
    allowedUse: 'Ikony, pigułki, nagłówki i subtelne wyróżnienia encji leada.',
    forbiddenUse: 'Alert, płatność albo status wykonania.',
    classes: {
      text: 'text-violet-700',
      subtleText: 'text-violet-600',
      icon: 'text-violet-600',
      surface: 'bg-violet-50',
      surfaceStrong: 'bg-violet-100',
      border: 'border-violet-200',
      badge: 'bg-violet-50 text-violet-700 border border-violet-200',
      ring: 'focus-visible:ring-violet-500',
    },
  },
  'entity-case': {
    name: 'entity-case',
    tone: 'entity',
    label: 'Sprawa',
    meaning: 'Temat już prowadzony operacyjnie.',
    allowedUse: 'Ikony, pigułki, nagłówki i subtelne wyróżnienia encji sprawy.',
    forbiddenUse: 'Alert, płatność albo status wykonania.',
    classes: {
      text: 'text-blue-700',
      subtleText: 'text-blue-600',
      icon: 'text-blue-600',
      surface: 'bg-blue-50',
      surfaceStrong: 'bg-blue-100',
      border: 'border-blue-200',
      badge: 'bg-blue-50 text-blue-700 border border-blue-200',
      ring: 'focus-visible:ring-blue-500',
    },
  },
  'payment-paid': {
    name: 'payment-paid',
    tone: 'payment',
    label: 'Zapłacone',
    meaning: 'Płatność została uregulowana.',
    allowedUse: 'Statusy wpłat, rozliczeń i opłaconych pozycji.',
    forbiddenUse: 'Zwykłe zakończenie zadania albo status encji.',
    classes: {
      text: 'text-emerald-700',
      subtleText: 'text-emerald-600',
      icon: 'text-emerald-600',
      surface: 'bg-emerald-50',
      surfaceStrong: 'bg-emerald-100',
      border: 'border-emerald-200',
      badge: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      ring: 'focus-visible:ring-emerald-500',
    },
  },
  'payment-due': {
    name: 'payment-due',
    tone: 'payment',
    label: 'Płatność do pobrania',
    meaning: 'Płatność jest należna, ale nie została jeszcze pobrana.',
    allowedUse: 'Rozliczenia, raty, kwoty do pobrania i zaległe płatności.',
    forbiddenUse: 'Zwykłe ostrzeżenie niezwiązane z pieniędzmi.',
    classes: {
      text: 'text-amber-800',
      subtleText: 'text-amber-700',
      icon: 'text-amber-600',
      surface: 'bg-amber-50',
      surfaceStrong: 'bg-amber-100',
      border: 'border-amber-200',
      badge: 'bg-amber-50 text-amber-800 border border-amber-200',
      ring: 'focus-visible:ring-amber-500',
    },
  },
  'commission-due': {
    name: 'commission-due',
    tone: 'commission',
    label: 'Prowizja do pobrania',
    meaning: 'Prowizja jest należna i wymaga obsługi.',
    allowedUse: 'Prowizje, fee, kwoty należne operatorowi.',
    forbiddenUse: 'Ogólna płatność klienta albo zwykłe ostrzeżenie.',
    classes: {
      text: 'text-amber-800',
      subtleText: 'text-amber-700',
      icon: 'text-amber-600',
      surface: 'bg-amber-50',
      surfaceStrong: 'bg-amber-100',
      border: 'border-amber-200',
      badge: 'bg-amber-50 text-amber-800 border border-amber-200',
      ring: 'focus-visible:ring-amber-500',
    },
  },
  'commission-paid': {
    name: 'commission-paid',
    tone: 'commission',
    label: 'Prowizja pobrana',
    meaning: 'Prowizja została pobrana albo rozliczona.',
    allowedUse: 'Rozliczone prowizje i fee.',
    forbiddenUse: 'Zwykłe zakończenie zadania albo płatność klienta bez prowizji.',
    classes: {
      text: 'text-emerald-700',
      subtleText: 'text-emerald-600',
      icon: 'text-emerald-600',
      surface: 'bg-emerald-50',
      surfaceStrong: 'bg-emerald-100',
      border: 'border-emerald-200',
      badge: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      ring: 'focus-visible:ring-emerald-500',
    },
  },
};

export const closeflowDefaultSemanticVisual: CloseflowSemanticVisualName = 'status-open';

export function getCloseflowSemanticVisual(
  name: CloseflowSemanticVisualName,
): CloseflowSemanticVisualEntry {
  return closeflowSemanticVisualRegistry[name] || closeflowSemanticVisualRegistry[closeflowDefaultSemanticVisual];
}

export function getCloseflowSemanticVisualClasses(
  name: CloseflowSemanticVisualName,
): CloseflowSemanticVisualClasses {
  return getCloseflowSemanticVisual(name).classes;
}
