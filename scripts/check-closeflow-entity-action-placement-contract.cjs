#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');

function fail(message) {
  console.error(`[closeflow-entity-action-placement-contract] FAIL: ${message}`);
  process.exit(1);
}

const files = {
  lead: 'src/pages/LeadDetail.tsx',
  client: 'src/pages/ClientDetail.tsx',
  case: 'src/pages/CaseDetail.tsx',
  actions: 'src/components/entity-actions.tsx',
  css: 'src/styles/closeflow-action-clusters.css',
  app: 'src/App.tsx',
  dangerCss: 'src/styles/closeflow-action-tokens.css',
};

for (const file of Object.values(files)) {
  if (!fs.existsSync(path.join(root, file))) fail(`missing required file: ${file}`);
}

const badMarkers = [
  'onClick={() = data-cf-action-region',
  '= data-cf-action-region=',
  'action-fix',
  'action-v2',
  'action-repair',
];

const mojibakeFragments = ['Ä', 'Å', 'Ĺ', '�', 'Ã', 'Â', 'â€', 'â€™', 'â€œ', 'â€ť', '?ród', 'Cykliczno?', 'Otw?rz'];
const detailFiles = [files.lead, files.client, files.case];

for (const file of detailFiles) {
  const text = read(file);
  for (const marker of badMarkers) {
    if (text.includes(marker)) fail(`${file} contains forbidden local/broken marker: ${marker}`);
  }
  for (const marker of mojibakeFragments) {
    if (text.includes(marker)) fail(`${file} contains mojibake fragment: ${marker}`);
  }
  if (!text.includes('actionButtonClass')) fail(`${file} must use actionButtonClass from shared entity action contract`);
  if (!text.includes('CLOSEFLOW_ENTITY_ACTION_PLACEMENT_CONTRACT_')) fail(`${file} must declare entity action placement contract map`);
  for (const region of [
    'entity-header-action-cluster',
    'activity-panel-header',
    'tasks-panel-header',
    'events-panel-header',
    'danger-action-zone',
    'info-row-inline-action',
  ]) {
    if (!text.includes(region)) fail(`${file} missing action placement region: ${region}`);
  }
}

const actions = read(files.actions);
for (const token of [
  'EntityActionButton',
  'EntityActionIcon',
  'actionButtonClass',
  'actionIconClass',
  'entityActionClusterClass',
  'panelHeaderActionsClass',
  'panelActionRowClass',
  'dangerActionZoneClass',
]) {
  if (!actions.includes(token)) fail(`entity-actions.tsx missing shared helper/component: ${token}`);
}

const css = read(files.css);
for (const className of ['.cf-entity-action-cluster', '.cf-panel-action-row', '.cf-panel-header-actions', '.cf-danger-action-zone', '.cf-inline-secondary-action']) {
  if (!css.includes(className)) fail(`closeflow-action-clusters.css missing ${className}`);
}

const app = read(files.app);
if (!app.includes("import './styles/closeflow-action-clusters.css';")) fail('App.tsx must import closeflow-action-clusters.css');

const dangerCss = read(files.dangerCss);
if (!dangerCss.includes('.cf-entity-action-danger') || !dangerCss.includes('--cf-action-danger-text')) {
  fail('danger/delete action styling must remain routed through existing danger contract');
}

console.log('[closeflow-entity-action-placement-contract] OK: entity detail action placement and cluster contract is clean');
