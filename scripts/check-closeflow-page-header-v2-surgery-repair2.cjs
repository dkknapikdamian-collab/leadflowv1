const fs = require('fs');
const path = require('path');

const repo = process.argv[2] || process.cwd();
const failures = [];

function read(rel) {
  const file = path.join(repo, rel);
  return fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
}

function expect(name, ok) {
  if (!ok) failures.push(name);
}

const component = read('src/components/CloseFlowPageHeaderV2.tsx');
const css = read('src/styles/closeflow-page-header-v2.css');

expect('component exists', component.includes('CloseFlowPageHeaderV2'));
expect('component uses content source truth', component.includes('PAGE_HEADER_CONTENT[pageKey]'));
expect('v2 css repair marker', css.includes('CLOSEFLOW_PAGE_HEADER_V2_SURGERY_REPAIR2_2026_05_11'));
expect('v2 copy left', css.includes('place-self: center start'));
expect('v2 uses only v2 selectors for layout', css.includes('.cf-page-header-v2__copy'));

const targets = [
  ['src/pages/TasksStable.tsx', 'tasks'],
  ['src/pages/Templates.tsx', 'templates'],
  ['src/pages/Activity.tsx', 'activity'],
  ['src/pages/Clients.tsx', 'clients'],
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

function hasLegacyHeader(text) {
  return (
    text.includes('data-cf-page-header="true"') ||
    text.includes('className="cf-page-header') ||
    text.includes('cf-page-header-row') ||
    text.includes('cf-page-hero-layout') ||
    text.includes('activity-page-header')
  );
}

for (const [rel, pageKey] of targets) {
  const text = read(rel);
  expect(`${rel} imports v2 component`, text.includes("CloseFlowPageHeaderV2"));
  expect(`${rel} imports v2 css`, text.includes("closeflow-page-header-v2.css"));
  expect(`${rel} uses v2 page key`, text.includes(`pageKey="${pageKey}"`));
  expect(`${rel} no legacy header structure`, !hasLegacyHeader(text));
  expect(`${rel} no old page header css imports`, oldImports.every((item) => !text.includes(item)));
}

if (failures.length) {
  console.error('CLOSEFLOW_PAGE_HEADER_V2_SURGERY_REPAIR2_CHECK_FAILED');
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log('CLOSEFLOW_PAGE_HEADER_V2_SURGERY_REPAIR2_CHECK_OK');
