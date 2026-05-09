const fs = require('fs');
const path = require('path');

const root = process.cwd();
const stage = 'CLOSEFLOW_SCREEN_PLACEMENT_SLOTS_VS7_2026_05_09';

function read(rel) {
  const file = path.join(root, rel);
  if (!fs.existsSync(file)) throw new Error(`Missing file: ${rel}`);
  return fs.readFileSync(file, 'utf8');
}

function mustInclude(rel, needle) {
  const text = read(rel);
  if (!text.includes(needle)) throw new Error(`${rel} missing: ${needle}`);
}

function mustMatch(rel, regex, label) {
  const text = read(rel);
  if (!regex.test(text)) throw new Error(`${rel} missing pattern: ${label}`);
}

const slots = [
  'page.primaryActions',
  'page.secondaryActions',
  'detail.headerActions',
  'detail.quickActions',
  'detail.dangerZone',
  'detail.financePanel',
  'detail.notesPanel',
  'detail.tasksPanel',
  'detail.eventsPanel',
  'list.filters',
  'list.search',
  'list.rows',
];

const contractRel = 'src/components/ui-system/screen-slots.ts';
const docsRel = 'docs/ui/CLOSEFLOW_SCREEN_PLACEMENT_SLOTS_2026-05-09.md';

mustInclude(contractRel, stage);
mustInclude(contractRel, 'CLOSEFLOW_SCREEN_PLACEMENT_SLOTS_STAGE');
mustInclude(contractRel, 'CLOSEFLOW_SCREEN_PLACEMENT_SLOTS');
mustInclude(contractRel, 'CloseflowScreenPlacementSlot');
mustInclude(contractRel, 'CloseflowScreenPlacementZone');
mustInclude(contractRel, 'CloseflowCoreEntityPlacementTarget');
mustInclude(contractRel, 'CLOSEFLOW_SCREEN_PLACEMENT_SLOT_GROUPS');
mustInclude(contractRel, 'CLOSEFLOW_CORE_ENTITY_PLACEMENT_CONTRACT');
mustInclude(contractRel, 'isCloseflowScreenPlacementSlot');
mustInclude(contractRel, 'getCloseflowScreenPlacementZone');
mustInclude(contractRel, 'getCloseflowCoreEntityPlacementSlots');

for (const slot of slots) {
  mustInclude(contractRel, `'${slot}'`);
  mustInclude(docsRel, `\`${slot}\``);
}

for (const entity of ['lead', 'client', 'case']) {
  mustInclude(contractRel, `${entity}: CLOSEFLOW_SCREEN_PLACEMENT_SLOTS`);
}

mustMatch(contractRel, /page:\s*\[\s*'page\.primaryActions',\s*'page\.secondaryActions'\s*\]/s, 'page slot group');
mustMatch(contractRel, /list:\s*\[\s*'list\.filters',\s*'list\.search',\s*'list\.rows'\s*\]/s, 'list slot group');
mustInclude('src/components/ui-system/index.ts', "export * from './screen-slots';");

mustInclude(docsRel, 'VS-7');
mustInclude(docsRel, 'Lead / Client / Case mają akcje w tych samych logicznych miejscach.');
mustInclude(docsRel, 'Nie przepinać jeszcze konkretnych ekranów na siłę.');
mustInclude(docsRel, 'npm.cmd run check:closeflow-screen-placement-slots');

const pkg = JSON.parse(read('package.json'));
if (!pkg.scripts || pkg.scripts['check:closeflow-screen-placement-slots'] !== 'node scripts/check-closeflow-screen-placement-slots.cjs') {
  throw new Error('package.json missing script check:closeflow-screen-placement-slots');
}

console.log('CLOSEFLOW_SCREEN_PLACEMENT_SLOTS_VS7_CHECK_OK');
console.log(`slots=${slots.length}`);
console.log('entities=lead,client,case');
console.log('contract=screen-slots.ts');
