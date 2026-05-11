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
expect('component uses PAGE_HEADER_CONTENT', component.includes('PAGE_HEADER_CONTENT[pageKey]'));
expect('component renders v2 classes', component.includes('cf-page-header-v2__copy'));
expect('v2 css exists', css.includes('CLOSEFLOW_PAGE_HEADER_V2_SURGERY_2026_05_11'));
expect('v2 css has left copy', css.includes('place-self: center start'));
expect('v2 css has ai violet', css.includes('--cf-ph-v2-ai-text: #7c3aed'));
expect('v2 css has trash token', css.includes('var(--cf-trash-icon-color'));

const targets = [
  ['src/pages/TasksStable.tsx', 'tasks'],
  ['src/pages/Templates.tsx', 'templates'],
  ['src/pages/Activity.tsx', 'activity'],
  ['src/pages/Clients.tsx', 'clients'],
];

for (const [rel, pageKey] of targets) {
  const text = read(rel);
  expect(`${rel} imports component`, text.includes("CloseFlowPageHeaderV2"));
  expect(`${rel} imports v2 css`, text.includes("closeflow-page-header-v2.css"));
  expect(`${rel} uses page key`, text.includes(`pageKey="${pageKey}"`));
  expect(`${rel} no legacy data-cf header`, !text.includes('data-cf-page-header="true"'));
  expect(`${rel} no legacy cf-page-header class`, !text.includes('className="cf-page-header'));
  expect(`${rel} no page-head header class`, !text.includes('page-head'));
  expect(`${rel} no cf-page-header-row`, !text.includes('cf-page-header-row'));
  expect(`${rel} no old lock css imports`, !text.includes('closeflow-page-header-copy-left-only.css') && !text.includes('closeflow-page-header-structure-lock.css') && !text.includes('closeflow-page-header-final-lock.css') && !text.includes('closeflow-page-header-card-source-truth.css'));
}

if (failures.length) {
  console.error('CLOSEFLOW_PAGE_HEADER_V2_SURGERY_CHECK_FAILED');
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log('CLOSEFLOW_PAGE_HEADER_V2_SURGERY_CHECK_OK');
