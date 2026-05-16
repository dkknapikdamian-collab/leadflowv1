export const CLOSEFLOW_SEMANTIC_VISUAL_REGISTRY_VS2D = 'CLOSEFLOW_SEMANTIC_VISUAL_REGISTRY_VS2D';

export type CloseflowSemanticVisualTone =
  | 'danger'
  | 'warning'
  | 'success'
  | 'status'
  | 'entity'
  | 'payment'
  | 'commission';

export type CloseflowSemanticVisualIntent =
  | 'destructive-action'
  | 'session-action'
  | 'system-alert'
  | 'status-state'
  | 'entity-identity'
  | 'money-state';

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
  intent: CloseflowSemanticVisualIntent;
  label: string;
  meaning: string;
  allowedUse: string;
  forbiddenUse: string;
  classes: CloseflowSemanticVisualClasses;
};

const RED_CLASSES: CloseflowSemanticVisualClasses = {
  text: 'text-red-700',
  subtleText: 'text-red-600',
  icon: 'text-red-600',
  surface: 'bg-red-50',
  surfaceStrong: 'bg-red-100',
  border: 'border-red-200',
  badge: 'bg-red-50 text-red-700 border border-red-200',
  ring: 'focus-visible:ring-red-500',
};

const ROSE_CLASSES: CloseflowSemanticVisualClasses = {
  text: 'text-rose-700',
  subtleText: 'text-rose-600',
  icon: 'text-rose-600',
  surface: 'bg-rose-50',
  surfaceStrong: 'bg-rose-100',
  border: 'border-rose-200',
  badge: 'bg-rose-50 text-rose-700 border border-rose-200',
  ring: 'focus-visible:ring-rose-500',
};

const AMBER_CLASSES: CloseflowSemanticVisualClasses = {
  text: 'text-amber-800',
  subtleText: 'text-amber-700',
  icon: 'text-amber-600',
  surface: 'bg-amber-50',
  surfaceStrong: 'bg-amber-100',
  border: 'border-amber-200',
  badge: 'bg-amber-50 text-amber-800 border border-amber-200',
  ring: 'focus-visible:ring-amber-500',
};

const EMERALD_CLASSES: CloseflowSemanticVisualClasses = {
  text: 'text-emerald-700',
  subtleText: 'text-emerald-600',
  icon: 'text-emerald-600',
  surface: 'bg-emerald-50',
  surfaceStrong: 'bg-emerald-100',
  border: 'border-emerald-200',
  badge: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  ring: 'focus-visible:ring-emerald-500',
};

export const SEMANTIC_VISUAL_MAP = {
  'danger-delete': {
    tone: 'danger',
    intent: 'destructive-action',
    label: 'Usuwanie',
    meaning: 'Czerwony oznacza destrukcyjną akcję: usuwa, kasuje albo przenosi rekord do kosza.',
    allowedUse: 'Przyciski Usuń, Usuń rekord, Przenieś do kosza oraz potwierdzenia usuwania.',
    forbiddenUse: 'Nie używać dla zwykłego błędu, zaległego terminu, wylogowania ani statusu biznesowego.',
    classes: RED_CLASSES,
  },
  'session-logout': {
    tone: 'danger',
    intent: 'session-action',
    label: 'Wylogowanie',
    meaning: 'Rose oznacza zakończenie sesji użytkownika. To nie jest usunięcie danych.',
    allowedUse: 'Wyloguj, zakończenie sesji, komunikat o utracie aktywnej sesji.',
    forbiddenUse: 'Nie używać dla delete, błędu API, zaległości albo płatności.',
    classes: ROSE_CLASSES,
  },
  'alert-error': {
    tone: 'danger',
    intent: 'system-alert',
    label: 'Błąd',
    meaning: 'Czerwony oznacza błąd systemu, blokadę albo walidację uniemożliwiającą wykonanie akcji.',
    allowedUse: 'Błędy API, błędy walidacji, brak uprawnień, awarie i krytyczne alerty.',
    forbiddenUse: 'Nie używać dla delete, overdue, logout ani zwykłego priorytetu.',
    classes: RED_CLASSES,
  },
  'alert-warning': {
    tone: 'warning',
    intent: 'system-alert',
    label: 'Ostrzeżenie',
    meaning: 'Amber oznacza stan wymagający uwagi, ale jeszcze nie błąd blokujący.',
    allowedUse: 'Brak konfiguracji, ryzyko, dane do uzupełnienia, ostrzeżenie przed skutkiem akcji.',
    forbiddenUse: 'Nie używać dla sukcesu, delete, błędu krytycznego ani płatności po terminie.',
    classes: AMBER_CLASSES,
  },
  'status-open': {
    tone: 'status',
    intent: 'status-state',
    label: 'Otwarte',
    meaning: 'Rekord jest aktywny i wymaga dalszej pracy.',
    allowedUse: 'Otwarte leady, sprawy, zadania, tickety i szkice.',
    forbiddenUse: 'Nie używać dla encji klienta, płatności, prowizji ani zakończenia.',
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
    tone: 'success',
    intent: 'status-state',
    label: 'Zrobione',
    meaning: 'Zielony oznacza ukończony rekord albo poprawnie wykonaną akcję.',
    allowedUse: 'Zadanie zrobione, sprawa zakończona, pozytywne potwierdzenie wykonania.',
    forbiddenUse: 'Nie używać dla płatności ani prowizji, bo one mają osobne semantyki finansowe.',
    classes: EMERALD_CLASSES,
  },
  'status-overdue': {
    tone: 'danger',
    intent: 'status-state',
    label: 'Zaległe',
    meaning: 'Czerwony oznacza przekroczony termin. To nie jest delete ani błąd systemowy.',
    allowedUse: 'Zaległe zadania, wydarzenia, follow-upy, terminy i aktywności po czasie.',
    forbiddenUse: 'Nie używać dla usuwania danych, błędu API, logout ani płatności po terminie.',
    classes: RED_CLASSES,
  },
  'entity-client': {
    tone: 'entity',
    intent: 'entity-identity',
    label: 'Klient',
    meaning: 'Kolor oznacza encję klienta: osobę albo firmę w tle łączącą leady i sprawy.',
    allowedUse: 'Ikony, pigułki, nagłówki i subtelne wyróżnienia encji klienta.',
    forbiddenUse: 'Nie używać jako status, błąd, płatność ani prowizja.',
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
    tone: 'entity',
    intent: 'entity-identity',
    label: 'Lead',
    meaning: 'Kolor oznacza encję leada: temat do pozyskania i pracy sprzedażowej.',
    allowedUse: 'Ikony, pigułki, nagłówki i subtelne wyróżnienia encji leada.',
    forbiddenUse: 'Nie używać jako alert, płatność, delete ani status wykonania.',
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
    tone: 'entity',
    intent: 'entity-identity',
    label: 'Sprawa',
    meaning: 'Kolor oznacza encję sprawy: temat prowadzony operacyjnie.',
    allowedUse: 'Ikony, pigułki, nagłówki i subtelne wyróżnienia encji sprawy.',
    forbiddenUse: 'Nie używać jako alert, płatność, delete ani status wykonania.',
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
    tone: 'payment',
    intent: 'money-state',
    label: 'Płatność zapłacona',
    meaning: 'Zielony oznacza, że płatność klienta została uregulowana.',
    allowedUse: 'Status wpłaty, opłaconej raty, rozliczonej pozycji płatności.',
    forbiddenUse: 'Nie używać dla ogólnego done ani dla prowizji.',
    classes: EMERALD_CLASSES,
  },
  'payment-due': {
    tone: 'payment',
    intent: 'money-state',
    label: 'Płatność do pobrania',
    meaning: 'Amber oznacza należną płatność, której termin jeszcze nie jest po czasie.',
    allowedUse: 'Raty, kwoty do pobrania, zaplanowane płatności i należności przed terminem.',
    forbiddenUse: 'Nie używać dla prowizji, zwykłego ostrzeżenia ani overdue po terminie.',
    classes: AMBER_CLASSES,
  },
  'payment-overdue': {
    tone: 'danger',
    intent: 'money-state',
    label: 'Płatność po terminie',
    meaning: 'Czerwony oznacza zaległą płatność klienta. To osobna semantyka od status-overdue.',
    allowedUse: 'Płatności po terminie, zaległe raty, kwoty klienta wymagające pilnej reakcji.',
    forbiddenUse: 'Nie używać dla delete, błędu API, zwykłego taska overdue ani prowizji.',
    classes: RED_CLASSES,
  },
  'commission-due': {
    tone: 'commission',
    intent: 'money-state',
    label: 'Prowizja do pobrania',
    meaning: 'Amber oznacza należną prowizję albo fee, które wymaga obsługi.',
    allowedUse: 'Prowizje, fee i kwoty należne operatorowi przed pobraniem.',
    forbiddenUse: 'Nie używać dla płatności klienta ani zwykłego ostrzeżenia.',
    classes: AMBER_CLASSES,
  },
  'commission-paid': {
    tone: 'commission',
    intent: 'money-state',
    label: 'Prowizja pobrana',
    meaning: 'Zielony oznacza rozliczoną albo pobraną prowizję.',
    allowedUse: 'Rozliczone prowizje, pobrane fee i zamknięte rozliczenia operatora.',
    forbiddenUse: 'Nie używać dla zwykłego done ani płatności klienta.',
    classes: EMERALD_CLASSES,
  },
} satisfies Record<string, Omit<CloseflowSemanticVisualEntry, 'name'>>;

export type CloseflowSemanticVisualName = keyof typeof SEMANTIC_VISUAL_MAP;

export const closeflowSemanticVisualRegistry = Object.fromEntries(
  (Object.keys(SEMANTIC_VISUAL_MAP) as CloseflowSemanticVisualName[]).map((name) => [
    name,
    {
      name,
      ...SEMANTIC_VISUAL_MAP[name],
    },
  ]),
) as Record<CloseflowSemanticVisualName, CloseflowSemanticVisualEntry>;

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

export function getCloseflowSemanticVisualMeaning(name: CloseflowSemanticVisualName): string {
  return getCloseflowSemanticVisual(name).meaning;
}

/* CLOSEFLOW_SEMANTIC_VISUAL_REGISTRY_VS2D_RULES
   Red is not one meaning:
   - danger-delete = destructive data action,
   - alert-error = system/API/validation error,
   - status-overdue = overdue work item,
   - payment-overdue = overdue money state,
   - session-logout = session ending, not deletion.
*/
