const fs = require('fs');
const path = require('path');

const repo = process.argv[2] || process.cwd();
const failures = [];

function p(rel) {
  return path.join(repo, rel);
}
function read(rel) {
  return fs.existsSync(p(rel)) ? fs.readFileSync(p(rel), 'utf8') : '';
}
function expect(name, ok) {
  if (!ok) failures.push(name);
}

const css = read('src/styles/closeflow-page-header-v2.css');
const component = read('src/components/CloseFlowPageHeaderV2.tsx');

expect('v2 component exists', component.includes('CloseFlowPageHeaderV2'));
expect('v2 component reads PAGE_HEADER_CONTENT', component.includes('PAGE_HEADER_CONTENT[pageKey]'));
expect('repair4 css marker', css.includes('CLOSEFLOW_PAGE_HEADER_V2_ALL_HEADERS_REPAIR4_2026_05_11'));
expect('kicker blue text token', css.includes('--cf-ph-v2-kicker-text: #2563eb;'));
expect('kicker blue bg token', css.includes('--cf-ph-v2-kicker-bg: #eff6ff;'));
expect('kicker blue border token', css.includes('--cf-ph-v2-kicker-border: #bfdbfe;'));
expect('copy left token', css.includes('place-self: center start'));
expect('actions right token', css.includes('place-self: start end'));

const targets = [
  ['src/pages/TodayStable.tsx', 'today'],
  ['src/pages/Leads.tsx', 'leads'],
  ['src/pages/Clients.tsx', 'clients'],
  ['src/pages/Cases.tsx', 'cases'],
  ['src/pages/TasksStable.tsx', 'tasks'],
  ['src/pages/Calendar.tsx', 'calendar'],
  ['src/pages/Templates.tsx', 'templates'],
  ['src/pages/ResponseTemplates.tsx', 'responseTemplates'],
  ['src/pages/Activity.tsx', 'activity'],
  ['src/pages/AiDrafts.tsx', 'aiDrafts'],
  ['src/pages/NotificationsCenter.tsx', 'notifications'],
  ['src/pages/Billing.tsx', 'billing'],
  ['src/pages/SupportCenter.tsx', 'support'],
  ['src/pages/AdminAiSettings.tsx', 'adminAi'],
];

const oldImports = [
  'closeflow-page-header-card-source-truth.css',
  'closeflow-page-header-final-lock.css',
  'closeflow-page-header-structure-lock.css',
  'closeflow-page-header-copy-left-only.css',
  'closeflow-page-header-copy-source-truth.css',
  'closeflow-page-header-action-semantics-packet1.css',
  'closeflow-command-actions-source-truth.css',
];

for (const [rel, key] of targets) {
  const text = read(rel);
  expect(`${rel} exists`, Boolean(text));
  expect(`${rel} uses v2 key ${key}`, text.includes(`pageKey="${key}"`));
  expect(`${rel} imports v2 css`, text.includes('closeflow-page-header-v2.css'));
  expect(`${rel} has no old header imports`, oldImports.every((marker) => !text.includes(marker)));
  expect(`${rel} has no data-cf-page-header legacy attrs`, !text.includes('data-cf-page-header="true"'));
  expect(`${rel} has no data-cf-page-header-part attrs`, !text.includes('data-cf-page-header-part='));
  expect(`${rel} has no cf-page-header-row`, !text.includes('cf-page-header-row'));
  expect(`${rel} has no cf-page-hero-layout`, !text.includes('cf-page-hero-layout'));
  expect(`${rel} no page header content direct import`, !text.includes("import { PAGE_HEADER_CONTENT } from '../lib/page-header-content';"));
}

const duplicateTexts = [
  'Własne gotowce do follow-upów, przypomnień i wiadomości do klientów. AI może później pracować na tych szablonach, ale źródłem prawdy jest Twoja biblioteka.',
  'Sprawdź, popraw i zatwierdź szkice przed zapisem w CRM.',
  'Przypomnienia, zaległe rzeczy i alerty z aplikacji. Tu widzisz zaległe rzeczy, nadchodzące terminy i sprawy, których nie można przegapić.',
  'Ukryta warstwa diagnostyczna dla Quick Lead Capture. Użytkownik końcowy widzi tylko prosty szkic do potwierdzenia, nie providerów ani kluczy.',
];

const pageFiles = targets.map(([rel]) => rel).concat(['src/pages/Settings.tsx']);
for (const rel of pageFiles) {
  const text = read(rel);
  for (const dupe of duplicateTexts) {
    expect(`${rel} does not contain stale duplicate text`, !text.includes(dupe));
  }
}

const audit = read('docs/ui/CLOSEFLOW_PAGE_HEADER_V2_ALL_HEADERS_REPAIR4_AUDIT.generated.json');
expect('audit generated', audit.includes('CLOSEFLOW_PAGE_HEADER_V2_ALL_HEADERS_REPAIR4_PATCH_OK') || audit.includes('generatedAt'));

if (failures.length) {
  console.error('CLOSEFLOW_PAGE_HEADER_V2_ALL_HEADERS_REPAIR4_CHECK_FAILED');
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log('CLOSEFLOW_PAGE_HEADER_V2_ALL_HEADERS_REPAIR4_CHECK_OK');
