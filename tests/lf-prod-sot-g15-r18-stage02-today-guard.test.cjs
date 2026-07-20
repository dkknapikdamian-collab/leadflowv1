const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const guardPath = path.join(root, 'scripts/check-visual-stage02-today.cjs');
const indexCss = fs.readFileSync(path.join(root, 'src/index.css'), 'utf8');
const app = fs.readFileSync(path.join(root, 'src/App.tsx'), 'utf8');
const todayStable = fs.readFileSync(path.join(root, 'src/pages/TodayStable.tsx'), 'utf8');
const stage02Css = fs.readFileSync(path.join(root, 'src/styles/visual-stage02-today.css'), 'utf8');
const guard = fs.readFileSync(guardPath, 'utf8');

test('reconciled Stage02 guard passes against current TodayStable source truth', () => {
  const result = spawnSync(process.execPath, [guardPath], { cwd: root, encoding: 'utf8' });
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  assert.match(result.stdout, /guard reconciled with current TodayStable source truth/);
});

test('inactive Stage02 stylesheet is not globally imported', () => {
  assert.doesNotMatch(indexCss, /visual-stage02-today\.css/);
  assert.match(guard, /inactive Stage02 Today CSS import/);
});

test('active Today route and current canvas sources remain', () => {
  assert.match(app, /import\('\.\/pages\/TodayStable'\)/);
  for (const required of [
    'closeflow-page-header-v2.css',
    'closeflow-unified-page-canvas-stage211c.css',
    'closeflow-canvas-source-truth-stage211e.css',
    'closeflow-canvas-runtime-source-truth-stage211j.css',
  ]) assert.match(todayStable, new RegExp(required.replace(/\./g, '\\.')));
});

test('TodayStable retains current owner-control and action contracts', () => {
  assert.match(todayStable, /P0_TODAY_STABLE_REBUILD/);
  assert.match(todayStable, /STAGE232B_TODAY_OWNER_CONTROL_TILE_SOURCE_OF_TRUTH/);
  assert.match(todayStable, /STAGE232T_R1D_TODAY_WORK_ITEM_ACTIONS_SOURCE_TRUTH/);
  assert.match(todayStable, /STAGE232T_R1E_TODAY_ACTIONS_CLOSEOUT_DELETE_EDIT_TRASH_VST/);
});

test('Stage02 remains reference-only while current Today flows stay guarded', () => {
  assert.match(stage02Css, /VISUAL_STAGE_02_TODAY_CSS/);
  assert.match(stage02Css, /\.closeflow-visual-stage01 \.main-today/);
  for (const required of [
    'fetchTasksFromSupabase',
    'fetchEventsFromSupabase',
    'getAiLeadDraftsAsync',
    'deleteTaskFromSupabase',
    'deleteEventFromSupabase',
    'getOperationalEntryActionDecision',
    'WorkItemCard',
  ]) assert.match(guard, new RegExp(required));
});
