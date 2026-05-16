#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const repo = process.cwd();
const stage = 'VS-4';
const jsonPath = path.join(repo, 'docs/ui/closeflow-active-screen-layout-matrix.generated.json');
const docPath = path.join(repo, 'docs/ui/CLOSEFLOW_ACTIVE_SCREEN_LAYOUT_MATRIX_2026-05-09.md');

function file(rel) { return path.join(repo, rel); }
function exists(rel) { return fs.existsSync(file(rel)); }
function read(rel) { return exists(rel) ? fs.readFileSync(file(rel), 'utf8') : ''; }
function ensureDir(rel) { fs.mkdirSync(path.dirname(file(rel)), { recursive: true }); }

const SCREEN_TARGETS = [
  { screen: 'TodayStable', route: '/, /today', file: 'src/pages/TodayStable.tsx', nextMigrationStage: 'VS-5A decision hub screen adapter audit' },
  { screen: 'TasksStable', route: '/tasks', file: 'src/pages/TasksStable.tsx', nextMigrationStage: 'VS-5B tasks list component migration' },
  { screen: 'Leads', route: '/leads', file: 'src/pages/Leads.tsx', nextMigrationStage: 'VS-5C leads list component migration' },
  { screen: 'Clients', route: '/clients', file: 'src/pages/Clients.tsx', nextMigrationStage: 'VS-5D clients list component migration' },
  { screen: 'Cases', route: '/cases', file: 'src/pages/Cases.tsx', nextMigrationStage: 'VS-5E cases list component migration' },
  { screen: 'Calendar', route: '/calendar', file: 'src/pages/Calendar.tsx', nextMigrationStage: 'VS-5F calendar surface migration' },
  { screen: 'AiDrafts', route: '/ai-drafts', file: 'src/pages/AiDrafts.tsx', nextMigrationStage: 'VS-5G AI drafts screen registry alignment' },
  { screen: 'NotificationsCenter', route: '/notifications', file: 'src/pages/NotificationsCenter.tsx', nextMigrationStage: 'VS-5H notifications list registry alignment' },
  { screen: 'Templates', route: '/templates', file: 'src/pages/Templates.tsx', nextMigrationStage: 'VS-5I templates screen registry alignment' },
  { screen: 'Activity', route: '/activity', file: 'src/pages/Activity.tsx', nextMigrationStage: 'VS-5J activity list registry alignment' },
  { screen: 'LeadDetail', route: '/leads/:leadId', file: 'src/pages/LeadDetail.tsx', nextMigrationStage: 'VS-6A lead detail heavy screen migration' },
  { screen: 'ClientDetail', route: '/clients/:clientId', file: 'src/pages/ClientDetail.tsx', nextMigrationStage: 'VS-6B client detail heavy screen migration' },
  { screen: 'CaseDetail', route: '/case/:caseId, /cases/:caseId', file: 'src/pages/CaseDetail.tsx', nextMigrationStage: 'VS-6C case detail heavy screen migration' },
  { screen: 'Billing', route: '/billing', file: 'src/pages/Billing.tsx', nextMigrationStage: 'VS-5K billing finance semantic alignment' },
  { screen: 'Settings', route: '/settings', file: 'src/pages/Settings.tsx', nextMigrationStage: 'VS-5L settings actions and forms alignment' },
  { screen: 'SupportCenter', route: '/help, /support', file: 'src/pages/SupportCenter.tsx', nextMigrationStage: 'VS-5M support center surface/list alignment' },
];

const LEGACY_CSS_HINTS = {
  TodayStable: ['page-adapters: visual-stage02-today.css', 'page-adapters: visual-stage21-today-final-lock.css', 'temporary: stageA24/stageA25 today relations'],
  TasksStable: ['page-adapters: visual-stage20-tasks-safe-css.css', 'page-adapters: visual-stage28-tasks-vnext.css', 'page-adapters: visual-stage30-tasks-compact-after-calendar.css', 'page-adapters: tasks-header-stage45b-cleanup.css'],
  Leads: ['page-adapters: visual-stage03-leads.css', 'page-adapters: visual-stage18/25/26 leads CSS'],
  Clients: ['page-adapters: visual-stage05-clients.css', 'temporary: stage35 clients cleanup'],
  Cases: ['page-adapters: visual-stage07-cases.css', 'page-adapters: visual-stage27-cases-vnext.css'],
  Calendar: ['page-adapters: visual-stage29-calendar-vnext.css', 'temporary: stage34 calendar readability', 'emergency: calendar week/card readability'],
  AiDrafts: ['temporary: stage33 AI drafts text contrast', 'emergency: ai drafts right rail hotfixes'],
  NotificationsCenter: ['core/metric contracts only unless local page classes detected'],
  Templates: ['core/page shell contracts only unless local page classes detected'],
  Activity: ['emergency: activity right rail hotfixes'],
  LeadDetail: ['page-adapters: visual-stage04-lead-detail.css', 'emergency: lead right rail wrappers'],
  ClientDetail: ['page-adapters: visual-stage06-client-detail.css', 'emergency: client note/event/lead visibility finalizer'],
  CaseDetail: ['page-adapters: visual-stage08-case-detail.css', 'page-adapters: visual-stage13-case-detail-vnext.css', 'legacy: case-detail-simplified/stage2'],
  Billing: ['finance semantics pending VS-5K'],
  Settings: ['core/settings icon/action contracts pending VS-5L'],
  SupportCenter: ['support surface contracts pending VS-5M'],
};

const TEMPORARY_HINTS = {
  TodayStable: ['stageA24-today-relations-label-align.css', 'stageA25-today-relations-lead-badge-inline.css'],
  Clients: ['stage35-clients-value-detail-cleanup.css'],
  Calendar: ['stage34-calendar-readability-status-forms.css', 'stage34b-calendar-complete-polish.css'],
  AiDrafts: ['stage33a-ai-drafts-generated-text-contrast.css'],
  Settings: ['sidebar/settings polish inherited from temporary overrides'],
};

function includesAny(text, needles) {
  return needles.some((needle) => text.includes(needle));
}

function sourceFor(text, component, options = {}) {
  const importNeedles = [
    `components/ui-system`,
    `ui-system/${component}`,
    `./ui-system`,
  ];
  if (text.includes(component) && includesAny(text, importNeedles)) return `ui-system/${component}`;
  if (options.legacy && includesAny(text, options.legacy)) return options.legacyLabel || 'legacy/local';
  if (options.local && includesAny(text, options.local)) return options.localLabel || 'local JSX';
  return 'not_detected';
}

function metricSource(text) {
  if (includesAny(text, ['OperatorMetricTiles', 'OperatorMetricTile', 'MetricGrid', 'MetricTile']) && text.includes('ui-system')) return 'ui-system metric components';
  if (text.includes('StatShortcutCard')) return 'shared adapter: StatShortcutCard -> OperatorMetricTile';
  if (includesAny(text, ['metric', 'Metric', 'stat', 'Stat', 'kpi', 'Kpi'])) return 'local/legacy metric markup';
  return 'not_detected';
}

function entityIconSource(text) {
  if (includesAny(text, ['EntityIcon', 'ClientEntityIcon', 'LeadEntityIcon', 'CaseEntityIcon']) && text.includes('ui-system')) return 'ui-system/EntityIcon registry';
  if (text.includes('lucide-react') && includesAny(text, ['UserRound', 'Target', 'Briefcase', 'ClipboardList', 'Calendar', 'Wallet', 'CreditCard', 'Sparkles'])) return 'direct lucide entity icons';
  return 'not_detected';
}

function actionIconSource(text) {
  if (includesAny(text, ['ActionIcon', 'AddActionIcon', 'EditActionIcon', 'DeleteActionIcon']) && text.includes('ui-system')) return 'ui-system/ActionIcon registry';
  if (text.includes('lucide-react') && includesAny(text, ['Plus', 'Trash2', 'Pencil', 'Search', 'Save', 'X', 'RefreshCw', 'Archive'])) return 'direct lucide action icons';
  return 'not_detected';
}

function financeSource(text, screen) {
  const financeNeedles = ['payment', 'Payment', 'commission', 'Commission', 'billing', 'Billing', 'settlement', 'Settlement', 'invoice', 'Invoice', 'amount', 'Amount', 'warto', 'p\u0142at', 'plat', 'prowiz'];
  if (screen === 'Billing') return 'billing screen finance UI, semantic finance registry pending';
  if (includesAny(text, financeNeedles)) return 'local finance/status markup detected';
  return 'none';
}

function pageShellSource(text) {
  if (text.includes('PageShell') && text.includes('ui-system')) return 'ui-system/PageShell';
  if (includesAny(text, ['<Layout', 'AppLayout', 'PageLayout'])) return 'legacy/shared layout wrapper';
  if (includesAny(text, ['className="main-', 'className="page', 'min-h-screen', 'app-shell'])) return 'local page wrapper classes';
  return 'not_detected';
}

function pageHeroSource(text) {
  if (text.includes('PageHero') && text.includes('ui-system')) return 'ui-system/PageHero';
  if (includesAny(text, ['page-head', 'PageHeader', '<h1', 'header'])) return 'local/legacy header markup';
  return 'not_detected';
}

function statusFor(screen, text, row) {
  if (!text) return 'OUT_OF_SCOPE';
  const heavyLegacyScreens = new Set(['TodayStable', 'LeadDetail', 'ClientDetail', 'CaseDetail']);
  if (heavyLegacyScreens.has(screen)) return 'LEGACY';
  const registryHits = [row.pageShellSource, row.pageHeroSource, row.metricSource, row.entityIconSource, row.actionIconSource, row.surfaceCardSource, row.listRowSource, row.actionClusterSource, row.formFooterSource]
    .filter((value) => typeof value === 'string' && value.startsWith('ui-system')).length;
  if (registryHits >= 5 && !String(row.legacyCss).includes('visual-stage')) return 'OK';
  return 'MIGRATE';
}

function analyzeScreen(target) {
  const text = read(target.file);
  const existsFile = Boolean(text);
  const row = {
    screen: target.screen,
    route: target.route,
    file: target.file,
    pageShellSource: existsFile ? pageShellSource(text) : 'file_missing',
    pageHeroSource: existsFile ? pageHeroSource(text) : 'file_missing',
    metricSource: existsFile ? metricSource(text) : 'file_missing',
    entityIconSource: existsFile ? entityIconSource(text) : 'file_missing',
    actionIconSource: existsFile ? actionIconSource(text) : 'file_missing',
    surfaceCardSource: existsFile ? sourceFor(text, 'SurfaceCard', { local: ['card', 'Card', 'panel', 'right-card'], localLabel: 'local/legacy card or panel markup' }) : 'file_missing',
    listRowSource: existsFile ? sourceFor(text, 'ListRow', { local: ['row', 'Row', 'map(('], localLabel: 'local/legacy list row markup' }) : 'file_missing',
    actionClusterSource: existsFile ? sourceFor(text, 'ActionCluster', { local: ['EntityActionCluster', 'PanelHeaderActions', 'head-actions', 'button'], localLabel: 'local/entity action cluster markup' }) : 'file_missing',
    formFooterSource: existsFile ? sourceFor(text, 'FormFooter', { local: ['modalFooterClass', 'formActionsClass', 'DialogFooter', 'footer'], localLabel: 'local/shared footer markup' }) : 'file_missing',
    financeSource: existsFile ? financeSource(text, target.screen) : 'file_missing',
    legacyCss: (LEGACY_CSS_HINTS[target.screen] || ['not_mapped']).join('; '),
    temporaryOverrides: (TEMPORARY_HINTS[target.screen] || ['none']).join('; '),
    status: 'MIGRATE',
    nextMigrationStage: existsFile ? target.nextMigrationStage : 'OUT_OF_SCOPE - file missing or inactive',
  };
  row.status = statusFor(target.screen, text, row);
  return row;
}

function markdownTable(rows) {
  const headers = [
    'Route', 'File', 'PageShell source', 'PageHero source', 'Metric source', 'EntityIcon source', 'ActionIcon source', 'SurfaceCard source', 'ListRow source', 'ActionCluster source', 'FormFooter source', 'Finance source', 'Legacy CSS', 'Temporary overrides', 'Status', 'Next migration stage',
  ];
  const keys = [
    'route', 'file', 'pageShellSource', 'pageHeroSource', 'metricSource', 'entityIconSource', 'actionIconSource', 'surfaceCardSource', 'listRowSource', 'actionClusterSource', 'formFooterSource', 'financeSource', 'legacyCss', 'temporaryOverrides', 'status', 'nextMigrationStage',
  ];
  const escape = (value) => String(value ?? '').replace(/\|/g, '\\|').replace(/\n/g, '<br>');
  return [
    `| ${headers.join(' | ')} |`,
    `| ${headers.map(() => '---').join(' | ')} |`,
    ...rows.map((row) => `| ${keys.map((key) => escape(row[key])).join(' | ')} |`),
  ].join('\n');
}

const app = read('src/App.tsx');
const rows = SCREEN_TARGETS.map(analyzeScreen);
const statusCounts = rows.reduce((acc, row) => {
  acc[row.status] = (acc[row.status] || 0) + 1;
  return acc;
}, {});

const generated = {
  stage,
  marker: 'CLOSEFLOW_ACTIVE_SCREEN_LAYOUT_MATRIX_VS4',
  generatedAt: new Date().toISOString(),
  appFile: 'src/App.tsx',
  sourceOfTruth: 'routes from src/App.tsx plus active screens listed in VS-4 package',
  screensChecked: rows.length,
  statusAllowedValues: ['OK', 'MIGRATE', 'LEGACY', 'OUT_OF_SCOPE'],
  statusCounts,
  matrix: rows,
};

ensureDir('docs/ui/closeflow-active-screen-layout-matrix.generated.json');
fs.writeFileSync(jsonPath, JSON.stringify(generated, null, 2) + '\n');

const doc = `# CloseFlow Active Screen Layout Matrix

**Data:** 2026-05-09
**Etap:** VS-4 \u2014 Active screen layout matrix
**Status:** audyt \u017Ar\u00F3de\u0142 UI aktywnych ekran\u00F3w, bez migracji runtime

## Cel

Ka\u017Cdy aktywny ekran ma jawnie opisane \u017Ar\u00F3d\u0142a UI. Ten etap nie przepina ekran\u00F3w. Tworzy map\u0119, kt\u00F3ra m\u00F3wi, gdzie ekran u\u017Cywa aktualnego UI systemu, a gdzie nadal opiera si\u0119 o lokalny JSX, stare klasy, legacy CSS, temporary overrides albo emergency hotfixes.

## \u0179r\u00F3d\u0142a prawdy

- Route'y: \`src/App.tsx\`
- Ekrany: \`src/pages/*\`
- CSS warstwy: \`src/index.css\`, \`src/styles/core/*\`, \`src/styles/page-adapters/*\`, \`src/styles/legacy/*\`, \`src/styles/temporary/*\`, \`src/styles/emergency/*\`
- Wygenerowany JSON: \`docs/ui/closeflow-active-screen-layout-matrix.generated.json\`

## Statusy

| Status | Znaczenie |
|---|---|
| \`OK\` | Ekran w wi\u0119kszo\u015Bci u\u017Cywa \u017Ar\u00F3de\u0142 UI z rejestru i nie wymaga pilnej migracji. |
| \`MIGRATE\` | Ekran dzia\u0142a, ale ma lokalne lub mieszane \u017Ar\u00F3d\u0142a UI i powinien wej\u015B\u0107 do kolejnej migracji. |
| \`LEGACY\` | Ekran jest ci\u0119\u017Cki albo mocno oparty o stare CSS/JSX. Rusza\u0107 tylko osobnym etapem. |
| \`OUT_OF_SCOPE\` | Ekran nie jest aktywny albo plik nie istnieje w aktualnym branchu. |

## Wynik audytu

- Liczba ekran\u00F3w: **${rows.length}**
- OK: **${statusCounts.OK || 0}**
- MIGRATE: **${statusCounts.MIGRATE || 0}**
- LEGACY: **${statusCounts.LEGACY || 0}**
- OUT_OF_SCOPE: **${statusCounts.OUT_OF_SCOPE || 0}**

## Matrix

${markdownTable(rows)}

## Zasady po VS-4

1. Nie migrowa\u0107 kilku ci\u0119\u017Ckich ekran\u00F3w naraz.
2. Today, LeadDetail, ClientDetail i CaseDetail traktowa\u0107 jako ekrany wysokiego ryzyka.
3. Ka\u017Cda kolejna migracja ma wskaza\u0107, kt\u00F3ry wiersz z tej macierzy zmienia status.
4. Je\u015Bli ekran dostaje nowy lokalny kolor, ikon\u0119, kafelek, kart\u0119 albo row bez rejestru, check powinien zosta\u0107 rozszerzony.
5. Finance UI ma u\u017Cywa\u0107 semantyk z VS-2D, nie lokalnych kolor\u00F3w bez znaczenia.

## Weryfikacja

\`\`\`bash
npm run audit:closeflow-active-screen-layout-matrix
npm run check:closeflow-active-screen-layout-matrix
npm run build
\`\`\`

## Kryterium zako\u0144czenia

VS-4 jest zako\u0144czony, gdy:

1. dokument istnieje,
2. JSON generated istnieje,
3. ka\u017Cdy aktywny ekran z listy ma wpis,
4. ka\u017Cdy wpis ma status \`OK\`, \`MIGRATE\`, \`LEGACY\` albo \`OUT_OF_SCOPE\`,
5. check i build przechodz\u0105.
`;

fs.writeFileSync(docPath, doc);

console.log('CLOSEFLOW_ACTIVE_SCREEN_LAYOUT_MATRIX_VS4_AUDIT_OK');
console.log('screens_checked=' + rows.length);
console.log('status_counts=' + JSON.stringify(statusCounts));
console.log('doc=' + path.relative(repo, docPath).replace(/\\/g, '/'));
console.log('json=' + path.relative(repo, jsonPath).replace(/\\/g, '/'));
