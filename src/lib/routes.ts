export type CloseFlowRouteStatus = 'canonical' | 'alias' | 'legacy' | 'unknown';

export type CloseFlowRouteDefinition = {
  screen: string;
  path: string;
  status: CloseFlowRouteStatus;
  page: string;
  layout: string;
  aliasFor?: string;
};

export const CLOSEFLOW_ROUTES = {
  root: '/',
  today: '/today',
  dashboard: '/dashboard',
  leads: '/leads',
  leadDetail: '/leads/:leadId',
  clients: '/clients',
  clientDetail: '/clients/:clientId',
  cases: '/cases',
  caseDetail: '/cases/:caseId',
  legacyCaseDetail: '/case/:caseId',
  funnel: '/funnel',
  devFunnel: '/dev/funnel',
  calendar: '/calendar',
  tasks: '/tasks',
  settings: '/settings',
  billing: '/billing',
  activity: '/activity',
  templates: '/templates',
  responseTemplates: '/response-templates',
  login: '/login',
  start: '/start',
  clientPortal: '/portal/:caseId/:token',
  privacy: '/privacy',
  terms: '/terms',
  aiDrafts: '/ai-drafts',
  notifications: '/notifications',
  support: '/support',
  help: '/help',
  adminAiSettings: '/settings/ai',
  caseTemplates: '/case-templates',
  uiPreviewVNext: '/ui-preview-vnext',
  uiPreviewVNextFull: '/ui-preview-vnext-full',
} as const;

export const CLOSEFLOW_ROUTE_MAP: CloseFlowRouteDefinition[] = [
  { screen: 'Today', path: CLOSEFLOW_ROUTES.root, status: 'canonical', page: 'src/pages/TodayStable.tsx', layout: 'src/components/Layout.tsx' },
  { screen: 'Today', path: CLOSEFLOW_ROUTES.today, status: 'alias', page: 'src/pages/TodayStable.tsx', layout: 'src/components/Layout.tsx', aliasFor: CLOSEFLOW_ROUTES.root },
  { screen: 'Dashboard', path: CLOSEFLOW_ROUTES.dashboard, status: 'legacy', page: 'src/pages/Dashboard.tsx', layout: 'unknown' },
  { screen: 'Leads', path: CLOSEFLOW_ROUTES.leads, status: 'canonical', page: 'src/pages/Leads.tsx', layout: 'src/components/Layout.tsx' },
  { screen: 'Lead Detail', path: CLOSEFLOW_ROUTES.leadDetail, status: 'canonical', page: 'src/pages/LeadDetail.tsx', layout: 'src/components/Layout.tsx' },
  { screen: 'Clients', path: CLOSEFLOW_ROUTES.clients, status: 'canonical', page: 'src/pages/Clients.tsx', layout: 'src/components/Layout.tsx' },
  { screen: 'Client Detail', path: CLOSEFLOW_ROUTES.clientDetail, status: 'canonical', page: 'src/pages/ClientDetail.tsx', layout: 'src/components/Layout.tsx' },
  { screen: 'Cases', path: CLOSEFLOW_ROUTES.cases, status: 'canonical', page: 'src/pages/Cases.tsx', layout: 'src/components/Layout.tsx' },
  { screen: 'Case Detail', path: CLOSEFLOW_ROUTES.caseDetail, status: 'canonical', page: 'src/pages/CaseDetail.tsx', layout: 'src/components/Layout.tsx' },
  { screen: 'Case Detail', path: CLOSEFLOW_ROUTES.legacyCaseDetail, status: 'alias', page: 'LegacyCaseRedirect', layout: 'src/components/Layout.tsx', aliasFor: CLOSEFLOW_ROUTES.caseDetail },
  { screen: 'Funnel', path: CLOSEFLOW_ROUTES.funnel, status: 'canonical', page: 'src/pages/SalesFunnel.tsx', layout: 'src/components/Layout.tsx' },
  { screen: 'Funnel', path: CLOSEFLOW_ROUTES.devFunnel, status: 'legacy', page: 'src/pages/SalesFunnel.tsx', layout: 'src/components/Layout.tsx', aliasFor: CLOSEFLOW_ROUTES.funnel },
  { screen: 'Calendar', path: CLOSEFLOW_ROUTES.calendar, status: 'canonical', page: 'src/pages/Calendar.tsx', layout: 'src/components/Layout.tsx' },
  { screen: 'Tasks', path: CLOSEFLOW_ROUTES.tasks, status: 'canonical', page: 'src/pages/TasksStable.tsx', layout: 'src/components/Layout.tsx' },
  { screen: 'Settings', path: CLOSEFLOW_ROUTES.settings, status: 'canonical', page: 'src/pages/Settings.tsx', layout: 'src/components/Layout.tsx' },
  { screen: 'Billing', path: CLOSEFLOW_ROUTES.billing, status: 'canonical', page: 'src/pages/Billing.tsx', layout: 'src/components/Layout.tsx' },
  { screen: 'Activity', path: CLOSEFLOW_ROUTES.activity, status: 'canonical', page: 'src/pages/Activity.tsx', layout: 'src/components/Layout.tsx' },
  { screen: 'Templates', path: CLOSEFLOW_ROUTES.templates, status: 'canonical', page: 'src/pages/Templates.tsx', layout: 'src/components/Layout.tsx' },
  { screen: 'Templates', path: CLOSEFLOW_ROUTES.caseTemplates, status: 'alias', page: 'Navigate', layout: 'src/components/Layout.tsx', aliasFor: CLOSEFLOW_ROUTES.templates },
  { screen: 'Response Templates', path: CLOSEFLOW_ROUTES.responseTemplates, status: 'canonical', page: 'src/pages/ResponseTemplates.tsx', layout: 'src/components/Layout.tsx' },
  { screen: 'Login', path: CLOSEFLOW_ROUTES.login, status: 'canonical', page: 'src/pages/Login.tsx', layout: 'none' },
  { screen: 'Login', path: CLOSEFLOW_ROUTES.start, status: 'alias', page: 'src/pages/Login.tsx', layout: 'none', aliasFor: CLOSEFLOW_ROUTES.login },
  { screen: 'Client Portal', path: CLOSEFLOW_ROUTES.clientPortal, status: 'canonical', page: 'src/pages/ClientPortal.tsx', layout: 'none' },
  { screen: 'Support', path: CLOSEFLOW_ROUTES.help, status: 'canonical', page: 'src/pages/SupportCenter.tsx', layout: 'src/components/Layout.tsx' },
  { screen: 'Support', path: CLOSEFLOW_ROUTES.support, status: 'alias', page: 'src/pages/SupportCenter.tsx', layout: 'src/components/Layout.tsx', aliasFor: CLOSEFLOW_ROUTES.help },
  { screen: 'Admin AI Settings', path: CLOSEFLOW_ROUTES.adminAiSettings, status: 'canonical', page: 'src/pages/AdminAiSettings.tsx', layout: 'src/components/Layout.tsx' },
  { screen: 'AI Drafts', path: CLOSEFLOW_ROUTES.aiDrafts, status: 'canonical', page: 'src/pages/AiDrafts.tsx', layout: 'src/components/Layout.tsx' },
  { screen: 'Notifications', path: CLOSEFLOW_ROUTES.notifications, status: 'canonical', page: 'src/pages/NotificationsCenter.tsx', layout: 'src/components/Layout.tsx' },
  { screen: 'Legal Privacy', path: CLOSEFLOW_ROUTES.privacy, status: 'canonical', page: 'src/pages/LegalPrivacy.tsx', layout: 'none' },
  { screen: 'Legal Terms', path: CLOSEFLOW_ROUTES.terms, status: 'canonical', page: 'src/pages/LegalTerms.tsx', layout: 'none' },
  { screen: 'UI Preview VNext', path: CLOSEFLOW_ROUTES.uiPreviewVNext, status: 'legacy', page: 'src/pages/UiPreviewVNext.tsx', layout: 'unknown' },
  { screen: 'UI Preview VNext Full', path: CLOSEFLOW_ROUTES.uiPreviewVNextFull, status: 'legacy', page: 'src/pages/UiPreviewVNextFull.tsx', layout: 'unknown' },
];

function encodeRouteId(value: string) {
  return encodeURIComponent(String(value || ''));
}

export function todayPath() {
  return CLOSEFLOW_ROUTES.root;
}

export function leadsPath() {
  return CLOSEFLOW_ROUTES.leads;
}

export function leadDetailPath(leadId: string) {
  return `${CLOSEFLOW_ROUTES.leads}/${encodeRouteId(leadId)}`;
}

export function clientsPath() {
  return CLOSEFLOW_ROUTES.clients;
}

export function clientDetailPath(clientId: string) {
  return `${CLOSEFLOW_ROUTES.clients}/${encodeRouteId(clientId)}`;
}

export function casesPath() {
  return CLOSEFLOW_ROUTES.cases;
}

export function caseDetailPath(caseId: string) {
  return `${CLOSEFLOW_ROUTES.cases}/${encodeRouteId(caseId)}`;
}

export function calendarPath() {
  return CLOSEFLOW_ROUTES.calendar;
}

export function funnelPath() {
  return CLOSEFLOW_ROUTES.funnel;
}

export function tasksPath() {
  return CLOSEFLOW_ROUTES.tasks;
}

export function settingsPath() {
  return CLOSEFLOW_ROUTES.settings;
}

export function billingPath() {
  return CLOSEFLOW_ROUTES.billing;
}

export function activityPath() {
  return CLOSEFLOW_ROUTES.activity;
}

export function templatesPath() {
  return CLOSEFLOW_ROUTES.templates;
}

export function loginPath() {
  return CLOSEFLOW_ROUTES.login;
}
