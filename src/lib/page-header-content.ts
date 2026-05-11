export type CloseFlowPageHeaderId =
  | 'leads'
  | 'clients'
  | 'cases'
  | 'tasks'
  | 'calendar'
  | 'templates'
  | 'responseTemplates'
  | 'activity'
  | 'aiDrafts'
  | 'notifications'
  | 'billing'
  | 'support'
  | 'settings'
  | 'adminAi';

export type CloseFlowPageHeaderConfig = {
  id: CloseFlowPageHeaderId;
  paths: string[];
  title: string;
  kicker: string;
  description: string;
  selectors: string[];
};

export const CLOSEFLOW_PAGE_HEADERS: Record<CloseFlowPageHeaderId, CloseFlowPageHeaderConfig> = {
  leads: {
    id: 'leads',
    paths: ['/leads'],
    kicker: 'Leady',
    title: 'Leady',
    description:
      'Lista aktywnych tematów sprzedażowych. Tu zapisujesz kontakty, pilnujesz wartości i szybko widzisz, które leady wymagają ruchu.',
    selectors: ['.main-leads-html .page-head', '.page-head'],
  },
  clients: {
    id: 'clients',
    paths: ['/clients'],
    kicker: 'Baza relacji',
    title: 'Klienci',
    description:
      'Baza osób i firm w tle. Klient łączy kontakt, leady, sprawy i historię relacji.',
    selectors: ['.main-clients-html .page-head', '.page-head'],
  },
  cases: {
    id: 'cases',
    paths: ['/cases'],
    kicker: 'Centrum obsługi',
    title: 'Sprawy',
    description:
      'Tematy już prowadzone operacyjnie. Tutaj pilnujesz obsługi, blokad, checklist i kolejnych działań po pozyskaniu klienta.',
    selectors: ['.main-cases-html .page-head', '.page-head'],
  },
  tasks: {
    id: 'tasks',
    paths: ['/tasks'],
    kicker: 'Zadania',
    title: 'Zadania',
    description:
      'Konkretne rzeczy do wykonania. Zadania mają pilnować ruchu, a nie leżeć jako martwe notatki.',
    selectors: ['.cf-page-hero', '.page-head', 'header'],
  },
  calendar: {
    id: 'calendar',
    paths: ['/calendar'],
    kicker: 'Terminy',
    title: 'Kalendarz',
    description:
      'Tydzień, spotkania i deadline’y w jednym miejscu. Terminy mają być widoczne bez szukania po modułach.',
    selectors: ['.main-calendar-html .page-head', '.page-head'],
  },
  templates: {
    id: 'templates',
    paths: ['/templates'],
    kicker: 'Szablony spraw',
    title: 'Szablony spraw',
    description:
      'Gotowe checklisty i układy spraw. Używasz ich, żeby po rozpoczęciu obsługi nie składać procesu od zera.',
    selectors: ['.cf-html-view header', 'header', '.page-head'],
  },
  responseTemplates: {
    id: 'responseTemplates',
    paths: ['/response-templates'],
    kicker: 'Szablony odpowiedzi',
    title: 'Szablony odpowiedzi',
    description:
      'Biblioteka gotowych wiadomości do follow-upów, przypomnień i odpowiedzi do klientów. AI może pomóc je dopasować, ale źródłem są Twoje szablony.',
    selectors: ['.cf-html-view header', 'header', '.page-head'],
  },
  activity: {
    id: 'activity',
    paths: ['/activity'],
    kicker: 'Aktywność',
    title: 'Aktywność',
    description:
      'Historia ruchów w aplikacji. Tu sprawdzasz, co zostało dodane, zmienione, wykonane albo przeniesione do obsługi.',
    selectors: ['.activity-vnext-page .activity-page-header', '.activity-page-header', 'header'],
  },
  aiDrafts: {
    id: 'aiDrafts',
    paths: ['/ai-drafts'],
    kicker: 'Szkice do sprawdzenia',
    title: 'Szkice AI',
    description:
      'Inbox rzeczy do akceptacji. AI może przygotować szkic, ale finalny zapis dzieje się dopiero po Twoim zatwierdzeniu.',
    selectors: ['.ai-drafts-vnext-page .ai-drafts-page-header', '.ai-drafts-page-header', 'header'],
  },
  notifications: {
    id: 'notifications',
    paths: ['/notifications'],
    kicker: 'Powiadomienia',
    title: 'Powiadomienia',
    description:
      'Przypomnienia i alerty z aplikacji. Tu widzisz zaległe rzeczy, nadchodzące terminy i sprawy, których nie można przegapić.',
    selectors: ['.notifications-vnext-page .notifications-page-header', '.notifications-page-header', 'header'],
  },
  billing: {
    id: 'billing',
    paths: ['/billing'],
    kicker: 'Rozliczenia',
    title: 'Rozliczenia',
    description:
      'Status dostępu i planu. Sprawdzasz trial, limity i funkcje dostępne w obecnym pakiecie.',
    selectors: ['.billing-vnext-page .billing-header', '.billing-header', 'header'],
  },
  support: {
    id: 'support',
    paths: ['/help', '/support'],
    kicker: 'Pomoc',
    title: 'Pomoc',
    description:
      'Zgłoszenia i odpowiedzi dotyczące aplikacji. Tu opisujesz problem, sprawdzasz status i wracasz do wcześniejszych zgłoszeń.',
    selectors: ['.support-vnext-page .support-header', '.support-header', 'header'],
  },
  settings: {
    id: 'settings',
    paths: ['/settings'],
    kicker: 'Ustawienia',
    title: 'Ustawienia',
    description:
      'Konfiguracja konta, workspace i pracy aplikacji. Zmieniaj tylko to, co ma wpływ na codzienne działanie systemu.',
    selectors: ['.settings-vnext-page .settings-header', '.settings-header', 'header'],
  },
  adminAi: {
    id: 'adminAi',
    paths: ['/settings/ai'],
    kicker: 'AI admin',
    title: 'Konfiguracja AI',
    description:
      'Techniczne ustawienia warstwy AI. To miejsce do kontroli providerów, limitów i diagnostyki, nie ekran codziennej pracy operatora.',
    selectors: ['header', '.page-head'],
  },
};

export const CLOSEFLOW_PAGE_HEADER_ORDER: CloseFlowPageHeaderId[] = [
  'adminAi',
  'responseTemplates',
  'aiDrafts',
  'notifications',
  'templates',
  'billing',
  'support',
  'settings',
  'activity',
  'calendar',
  'clients',
  'cases',
  'tasks',
  'leads',
];

export function getCloseFlowPageHeaderByPath(pathname: string): CloseFlowPageHeaderConfig | null {
  const normalizedPath = pathname.replace(/\/+$/, '') || '/';

  for (const id of CLOSEFLOW_PAGE_HEADER_ORDER) {
    const config = CLOSEFLOW_PAGE_HEADERS[id];
    if (config.paths.some((path) => normalizedPath === path)) {
      return config;
    }
  }

  return null;
}
