const fs = require('fs');
const path = require('path');
const repo = process.cwd();

function read(relativePath) {
  const target = path.join(repo, relativePath);
  if (!fs.existsSync(target)) throw new Error(`Missing required file: ${relativePath}`);
  return fs.readFileSync(target, 'utf8').replace(/^\uFEFF/, '');
}

function expect(file, text, label = text) {
  const content = read(file);
  if (!content.includes(text)) throw new Error(`${file}: missing ${label}`);
  console.log(`OK: ${file} contains ${label}`);
}

function reject(file, text, label = text) {
  const content = read(file);
  if (content.includes(text)) throw new Error(`${file}: forbidden ${label}`);
  console.log(`OK: ${file} excludes ${label}`);
}

const badPatterns = [
  String.fromCharCode(0x0139),
  String.fromCharCode(0x00c4),
  String.fromCharCode(0x0102),
  String.fromCharCode(0x00e2, 0x20ac),
  String.fromCharCode(0x00c5, 0x00bc),
  String.fromCharCode(0x00c5, 0x00ba),
  String.fromCharCode(0x00c5, 0x201a),
  String.fromCharCode(0x00c5, 0x201e),
  String.fromCharCode(0x00c5, 0x203a),
  String.fromCharCode(0x00c3, 0x00b3),
];

expect('src/components/Layout.tsx', 'VISUAL_STAGE_02_TODAY_ROUTE_SCOPE', 'Stage02 route scope marker');
expect('src/components/Layout.tsx', "const isTodayRoute = location.pathname === '/'", 'Today route detection');
expect('src/components/Layout.tsx', 'main-today', 'main-today scoped class');
expect('src/components/Layout.tsx', 'data-current-section={currentSection}', 'current section marker');
expect('src/components/Layout.tsx', 'data-visual-stage-today={isTodayRoute', 'Today visual data marker');
expect('src/App.tsx', "import('./pages/TodayStable')", 'active TodayStable route module');

reject('src/index.css', 'visual-stage02-today.css', 'inactive Stage02 Today CSS import');
expect('src/pages/TodayStable.tsx', "../styles/closeflow-page-header-v2.css", 'current page header CSS import');
expect('src/pages/TodayStable.tsx', "../styles/closeflow-unified-page-canvas-stage211c.css", 'current Stage211C canvas import');
expect('src/pages/TodayStable.tsx', "../styles/closeflow-canvas-source-truth-stage211e.css", 'current Stage211E canvas source import');
expect('src/pages/TodayStable.tsx', "../styles/closeflow-canvas-runtime-source-truth-stage211j.css", 'current Stage211J runtime canvas import');
expect('src/pages/TodayStable.tsx', 'P0_TODAY_STABLE_REBUILD', 'current TodayStable rebuild marker');
expect('src/pages/TodayStable.tsx', 'STAGE232T_R1C_TODAY_PRODUCTION_UI_CLEANUP_AND_SOURCE_TRUTH', 'current Today production UI source marker');
expect('src/pages/TodayStable.tsx', 'STAGE232B_TODAY_OWNER_CONTROL_TILE_SOURCE_OF_TRUTH', 'current owner-control tile source marker');
expect('src/pages/TodayStable.tsx', 'STAGE232T_R1D_TODAY_WORK_ITEM_ACTIONS_SOURCE_TRUTH', 'current work-item actions source marker');
expect('src/pages/TodayStable.tsx', 'STAGE232T_R1E_TODAY_ACTIONS_CLOSEOUT_DELETE_EDIT_TRASH_VST', 'current Today action closeout marker');

expect('src/styles/visual-stage02-today.css', 'VISUAL_STAGE_02_TODAY_CSS', 'Stage02 reference CSS marker');
expect('src/styles/visual-stage02-today.css', '.closeflow-visual-stage01 .main-today', 'historical scoped Today selector');
expect('src/styles/visual-stage02-today.css', '[data-today-tile-card="true"]', 'historical Today tile styling');
expect('src/styles/visual-stage02-today.css', '[data-today-quick-snooze-bar="true"]', 'historical snooze styling');
expect('src/styles/visual-stage02-today.css', '@media (max-width: 760px)', 'historical mobile polish');

expect('src/pages/TodayStable.tsx', 'fetchTasksFromSupabase', 'task read flow');
expect('src/pages/TodayStable.tsx', 'fetchEventsFromSupabase', 'event read flow');
expect('src/pages/TodayStable.tsx', 'getAiLeadDraftsAsync', 'AI draft read flow');
expect('src/pages/TodayStable.tsx', 'updateTaskInSupabase', 'task update flow');
expect('src/pages/TodayStable.tsx', 'updateEventInSupabase', 'event update flow');
expect('src/pages/TodayStable.tsx', 'deleteTaskFromSupabase', 'task delete flow');
expect('src/pages/TodayStable.tsx', 'deleteEventFromSupabase', 'event delete flow');
expect('src/pages/TodayStable.tsx', 'subscribeCloseflowDataMutations', 'mutation bus refresh');
expect('src/pages/TodayStable.tsx', 'getOperationalEntryActionDecision', 'shared action policy decision');
expect('src/pages/TodayStable.tsx', 'isOperationalEntryActionAllowed', 'shared action policy allow check');
expect('src/pages/TodayStable.tsx', 'WorkItemCard', 'shared work-item card source');

for (const file of ['src/components/Layout.tsx', 'src/App.tsx', 'src/pages/TodayStable.tsx', 'src/styles/visual-stage02-today.css', 'src/index.css']) {
  read(file).split(/\r?\n/).forEach((line, index) => {
    if (badPatterns.some((pattern) => line.includes(pattern))) {
      throw new Error(`Polish mojibake detected in ${file}:${index + 1}: ${line.trim().slice(0, 180)}`);
    }
  });
}

console.log('OK: Visual Stage02 Today guard reconciled with current TodayStable source truth.');
