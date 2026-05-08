const fs = require('fs');
const path = require('path');

const root = process.cwd();
const marker = 'CLOSEFLOW_DETAIL_ACTION_VISUAL_QA_STAGE19_2026_05_08';
const commandName = 'check:closeflow-detail-action-visual-qa';
const commandValue = 'node scripts/check-closeflow-detail-action-visual-qa.cjs';

const files = {
  lead: 'src/pages/LeadDetail.tsx',
  client: 'src/pages/ClientDetail.tsx',
  case: 'src/pages/CaseDetail.tsx',
  entityActions: 'src/components/entity-actions.tsx',
  clusters: 'src/styles/closeflow-action-clusters.css',
  doc: 'docs/ui/CLOSEFLOW_DETAIL_ACTION_VISUAL_QA_STAGE19_2026-05-08.md',
  script: 'scripts/check-closeflow-detail-action-visual-qa.cjs',
  packageJson: 'package.json',
};

const perPage = [
  { key: 'lead', name: 'LEAD', file: files.lead },
  { key: 'client', name: 'CLIENT', file: files.client },
  { key: 'case', name: 'CASE', file: files.case },
];

const expectedPlacements = {
  addNote: 'activity-panel-header',
  dictateNote: 'activity-panel-header',
  addTask: 'tasks-panel-header',
  addEvent: 'events-panel-header',
  editRecord: 'entity-header-action-cluster',
  deleteRecord: 'danger-action-zone',
  copy: 'info-row-inline-action',
};

function fail(message) {
  console.error('[closeflow-detail-action-visual-qa] FAIL: ' + message);
  process.exit(1);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function abs(rel) {
  return path.join(root, rel);
}

function exists(rel) {
  return fs.existsSync(abs(rel));
}

function read(rel) {
  return fs.readFileSync(abs(rel), 'utf8');
}

function readBytes(rel) {
  return fs.readFileSync(abs(rel));
}

function assertNoBom(rel) {
  const bytes = readBytes(rel);
  const hasBom = bytes.length >= 3 && bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf;
  assert(!hasBom, rel + ' must be UTF-8 without BOM');
}

function assertNoControl(rel, text) {
  assert(!/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/.test(text), rel + ' contains control chars');
}

function assertNoMojibake(rel, text) {
  const markers = [
    String.fromCharCode(0x00c4),
    String.fromCharCode(0x00c5),
    String.fromCharCode(0x0139),
    String.fromCharCode(0xfffd),
  ];
  for (const item of markers) {
    assert(!text.includes(item), rel + ' contains mojibake-like marker U+' + item.charCodeAt(0).toString(16).toUpperCase());
  }
}

for (const rel of [files.doc, files.script, files.packageJson]) {
  assert(exists(rel), 'Missing required file: ' + rel);
  assertNoBom(rel);
  const text = read(rel);
  assertNoControl(rel, text);
  assertNoMojibake(rel, text);
}

for (const rel of [files.lead, files.client, files.case, files.entityActions, files.clusters]) {
  assert(exists(rel), 'Missing required source file: ' + rel);
}

const doc = read(files.doc);
const script = read(files.script);
const pkg = JSON.parse(read(files.packageJson));
const entityActions = read(files.entityActions);
const clusters = read(files.clusters);

assert(doc.includes(marker), 'Stage19 document missing marker');
assert(script.includes(marker), 'Stage19 check missing marker');
assert(pkg.scripts && pkg.scripts[commandName] === commandValue, 'package.json missing ' + commandName);

for (const token of [
  'Mapa PRZED Stage19',
  'Mapa PO Stage19',
  'Dodaj notatke',
  'Dodaj zadanie',
  'Dodaj wydarzenie',
  'Edytuj',
  'Usun',
  'Mobile',
  'DO_POTWIERDZENIA_SCREENSHOTEM',
]) {
  assert(doc.includes(token), 'Stage19 document missing QA token: ' + token);
}

assert(entityActions.includes('ENTITY_DETAIL_ACTION_PLACEMENT_CONTRACT'), 'entity-actions missing shared placement contract');
for (const [action, region] of Object.entries({
  editRecord: 'entity-header-action-cluster',
  addNote: 'activity-panel-header',
  dictateNote: 'activity-panel-header',
  addTask: 'tasks-panel-header',
  addEvent: 'events-panel-header',
  deleteRecord: 'danger-action-zone',
  copyInline: 'info-row-inline-action',
})) {
  assert(entityActions.includes(action), 'entity-actions missing action key: ' + action);
  assert(entityActions.includes(region), 'entity-actions missing region: ' + region);
}

for (const helper of [
  'actionButtonClass',
  'EntityActionButton',
  'EntityActionCluster',
  'PanelHeaderActions',
  'PanelActionRow',
  'DangerActionZone',
]) {
  assert(entityActions.includes(helper), 'entity-actions missing helper: ' + helper);
}

for (const cssClass of [
  '.cf-entity-action-cluster',
  '.cf-panel-header-actions',
  '.cf-panel-action-row',
  '.cf-danger-action-zone',
  '.cf-inline-secondary-action',
  '@media (max-width: 640px)',
  'justify-content: stretch',
]) {
  assert(clusters.includes(cssClass), 'action cluster CSS missing token: ' + cssClass);
}

for (const page of perPage) {
  const source = read(page.file);
  const contractName = 'CLOSEFLOW_ENTITY_ACTION_PLACEMENT_CONTRACT_' + page.name;
  assert(source.includes(contractName), page.file + ' missing ' + contractName);
  assert(source.includes("entity: '" + page.key + "'"), page.file + ' missing entity key ' + page.key);
  assert(source.includes("actionButtonClass('neutral', 'cf-entity-action-cluster')"), page.file + ' missing header action cluster class');
  assert(source.includes("actionButtonClass('neutral', 'cf-panel-header-actions')"), page.file + ' missing panel header actions class');
  assert(source.includes("actionButtonClass('neutral', 'cf-panel-action-row')"), page.file + ' missing panel action row class');
  assert(source.includes("actionButtonClass('danger', 'cf-danger-action-zone')"), page.file + ' missing danger action zone class');
  assert(source.includes("actionButtonClass('neutral', 'cf-inline-secondary-action')"), page.file + ' missing inline secondary action class');

  for (const [action, region] of Object.entries(expectedPlacements)) {
    const actionPattern = new RegExp(action + "\\s*:\\s*['\"]" + region + "['\"]");
    assert(actionPattern.test(source), page.file + ' missing placement ' + action + ' -> ' + region);
  }
}

const detailRows = ['LeadDetail', 'ClientDetail', 'CaseDetail'];
for (const row of detailRows) {
  assert(doc.includes(row), 'Stage19 document missing detail page row: ' + row);
}

console.log('CLOSEFLOW_DETAIL_ACTION_VISUAL_QA_STAGE19_OK: detail action placement map is documented and source contracts match');
