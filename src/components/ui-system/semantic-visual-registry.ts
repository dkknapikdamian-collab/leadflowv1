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
    meaning: 'Czerwony oznacza destrukcyjnÄ… akcjÄ™: usuwa, kasuje albo przenosi rekord do kosza.',
    allowedUse: 'Przyciski UsuĹ„, UsuĹ„ rekord, PrzenieĹ› do kosza oraz potwierdzenia usuwania.',
    forbiddenUse: 'Nie uĹĽywaÄ‡ dla zwykĹ‚ego bĹ‚Ä™du, zalegĹ‚ego terminu, wylogowania ani statusu biznesowego.',
    classes: RED_CLASSES,
  },
  'session-logout': {
    tone: 'danger',
    intent: 'session-action',
    label: 'Wylogowanie',
    meaning: 'Rose oznacza zakoĹ„czenie sesji uĹĽytkownika. To nie jest usuniÄ™cie danych.',
    allowedUse: 'Wyloguj, zakoĹ„czenie sesji, komunikat o utracie aktywnej sesji.',
    forbiddenUse: 'Nie uĹĽywaÄ‡ dla delete, bĹ‚Ä™du API, zalegĹ‚oĹ›ci albo pĹ‚atnoĹ›ci.',
    classes: ROSE_CLASSES,
  },
  'alert-error': {
    tone: 'danger',
    intent: 'system-alert',
    label: 'BĹ‚Ä…d',
    meaning: 'Czerwony oznacza bĹ‚Ä…d systemu, blokadÄ™ albo walidacjÄ™ uniemoĹĽliwiajÄ…cÄ… wykonanie akcji.',
    allowedUse: 'BĹ‚Ä™dy API, bĹ‚Ä™dy walidacji, brak uprawnieĹ„, awarie i krytyczne alerty.',
    forbiddenUse: 'Nie uĹĽywaÄ‡ dla delete, overdue, logout ani zwykĹ‚ego priorytetu.',
    classes: RED_CLASSES,
  },
  'alert-warning': {
    tone: 'warning',
    intent: 'system-alert',
    label: 'OstrzeĹĽenie',
    meaning: 'Amber oznacza stan wymagajÄ…cy uwagi, ale jeszcze nie bĹ‚Ä…d blokujÄ…cy.',
    allowedUse: 'Brak konfiguracji, ryzyko, dane do uzupeĹ‚nienia, ostrzeĹĽenie przed skutkiem akcji.',
    forbiddenUse: 'Nie uĹĽywaÄ‡ dla sukcesu, delete, bĹ‚Ä™du krytycznego ani pĹ‚atnoĹ›ci po terminie.',
    classes: AMBER_CLASSES,
  },
  'status-open': {
    tone: 'status',
    intent: 'status-state',
    label: 'Otwarte',
    meaning: 'Rekord jest aktywny i wymaga dalszej pracy.',
    allowedUse: 'Otwarte leady, sprawy, zadania, tickety i szkice.',
    forbiddenUse: 'Nie uĹĽywaÄ‡ dla encji klienta, pĹ‚atnoĹ›ci, prowizji ani zakoĹ„czenia.',
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
    meaning: 'Zielony oznacza ukoĹ„czony rekord albo poprawnie wykonanÄ… akcjÄ™.',
    allowedUse: 'Zadanie zrobione, sprawa zakoĹ„czona, pozytywne potwierdzenie wykonania.',
    forbiddenUse: 'Nie uĹĽywaÄ‡ dla pĹ‚atnoĹ›ci ani prowizji, bo one majÄ… osobne semantyki finansowe.',
    classes: EMERALD_CLASSES,
  },
  'status-overdue': {
    tone: 'danger',
    intent: 'status-state',
    label: 'ZalegĹ‚e',
    meaning: 'Czerwony oznacza przekroczony termin. To nie jest delete ani bĹ‚Ä…d systemowy.',
    allowedUse: 'ZalegĹ‚e zadania, wydarzenia, follow-upy, terminy i aktywnoĹ›ci po czasie.',
    forbiddenUse: 'Nie uĹĽywaÄ‡ dla usuwania danych, bĹ‚Ä™du API, logout ani pĹ‚atnoĹ›ci po terminie.',
    classes: RED_CLASSES,
  },
  'entity-client': {
    tone: 'entity',
    intent: 'entity-identity',
    label: 'Klient',
    meaning: 'Kolor oznacza encjÄ™ klienta: osobÄ™ albo firmÄ™ w tle Ĺ‚Ä…czÄ…cÄ… leady i sprawy.',
    allowedUse: 'Ikony, piguĹ‚ki, nagĹ‚Ăłwki i subtelne wyrĂłĹĽnienia encji klienta.',
    forbiddenUse: 'Nie uĹĽywaÄ‡ jako status, bĹ‚Ä…d, pĹ‚atnoĹ›Ä‡ ani prowizja.',
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
    meaning: 'Kolor oznacza encjÄ™ leada: temat do pozyskania i pracy sprzedaĹĽowej.',
    allowedUse: 'Ikony, piguĹ‚ki, nagĹ‚Ăłwki i subtelne wyrĂłĹĽnienia encji leada.',
    forbiddenUse: 'Nie uĹĽywaÄ‡ jako alert, pĹ‚atnoĹ›Ä‡, delete ani status wykonania.',
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
    meaning: 'Kolor oznacza encjÄ™ sprawy: temat prowadzony operacyjnie.',
    allowedUse: 'Ikony, piguĹ‚ki, nagĹ‚Ăłwki i subtelne wyrĂłĹĽnienia encji sprawy.',
    forbiddenUse: 'Nie uĹĽywaÄ‡ jako alert, pĹ‚atnoĹ›Ä‡, delete ani status wykonania.',
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
    label: 'PĹ‚atnoĹ›Ä‡ zapĹ‚acona',
    meaning: 'Zielony oznacza, ĹĽe pĹ‚atnoĹ›Ä‡ klienta zostaĹ‚a uregulowana.',
    allowedUse: 'Status wpĹ‚aty, opĹ‚aconej raty, rozliczonej pozycji pĹ‚atnoĹ›ci.',
    forbiddenUse: 'Nie uĹĽywaÄ‡ dla ogĂłlnego done ani dla prowizji.',
    classes: EMERALD_CLASSES,
  },
  'payment-due': {
    tone: 'payment',
    intent: 'money-state',
    label: 'PĹ‚atnoĹ›Ä‡ do pobrania',
    meaning: 'Amber oznacza naleĹĽnÄ… pĹ‚atnoĹ›Ä‡, ktĂłrej termin jeszcze nie jest po czasie.',
    allowedUse: 'Raty, kwoty do pobrania, zaplanowane pĹ‚atnoĹ›ci i naleĹĽnoĹ›ci przed terminem.',
    forbiddenUse: 'Nie uĹĽywaÄ‡ dla prowizji, zwykĹ‚ego ostrzeĹĽenia ani overdue po terminie.',
    classes: AMBER_CLASSES,
  },
  'payment-overdue': {
    tone: 'danger',
    intent: 'money-state',
    label: 'PĹ‚atnoĹ›Ä‡ po terminie',
    meaning: 'Czerwony oznacza zalegĹ‚Ä… pĹ‚atnoĹ›Ä‡ klienta. To osobna semantyka od status-overdue.',
    allowedUse: 'PĹ‚atnoĹ›ci po terminie, zalegĹ‚e raty, kwoty klienta wymagajÄ…ce pilnej reakcji.',
    forbiddenUse: 'Nie uĹĽywaÄ‡ dla delete, bĹ‚Ä™du API, zwykĹ‚ego taska overdue ani prowizji.',
    classes: RED_CLASSES,
  },
  'commission-due': {
    tone: 'commission',
    intent: 'money-state',
    label: 'Prowizja do pobrania',
    meaning: 'Amber oznacza naleĹĽnÄ… prowizjÄ™ albo fee, ktĂłre wymaga obsĹ‚ugi.',
    allowedUse: 'Prowizje, fee i kwoty naleĹĽne operatorowi przed pobraniem.',
    forbiddenUse: 'Nie uĹĽywaÄ‡ dla pĹ‚atnoĹ›ci klienta ani zwykĹ‚ego ostrzeĹĽenia.',
    classes: AMBER_CLASSES,
  },
  'commission-paid': {
    tone: 'commission',
    intent: 'money-state',
    label: 'Prowizja pobrana',
    meaning: 'Zielony oznacza rozliczonÄ… albo pobranÄ… prowizjÄ™.',
    allowedUse: 'Rozliczone prowizje, pobrane fee i zamkniÄ™te rozliczenia operatora.',
    forbiddenUse: 'Nie uĹĽywaÄ‡ dla zwykĹ‚ego done ani pĹ‚atnoĹ›ci klienta.',
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