const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const guardPath = path.join(root, 'scripts/check-visual-stage07-cases.cjs');
const indexCssPath = path.join(root, 'src/index.css');
const casesPath = path.join(root, 'src/pages/Cases.tsx');
const stage07CssPath = path.join(root, 'src/styles/visual-stage07-cases.css');

const guard = fs.readFileSync(guardPath, 'utf8');
const indexCss = fs.readFileSync(indexCssPath, 'utf8');
const cases = fs.readFileSync(casesPath, 'utf8');
const stage07Css = fs.readFileSync(stage07CssPath, 'utf8');

test('reconciled Stage07 guard passes against current Cases source truth', () => {
  const result = spawnSync(process.execPath, [guardPath], { cwd: root, encoding: 'utf8' });
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  assert.match(result.stdout, /guard reconciled with current Cases source truth/);
});

test('inactive Stage07 stylesheet is not globally imported', () => {
  assert.doesNotMatch(indexCss, /visual-stage07-cases\.css/);
  assert.match(guard, /inactive Stage07 Cases CSS import/);
});

test('Cases uses current page-header, record-list and canvas sources', () => {
  for (const required of [
    'closeflow-page-header-v2.css',
    'closeflow-record-list-source-truth.css',
    'closeflow-unified-page-canvas-stage211c.css',
    'closeflow-canvas-source-truth-stage211e.css',
  ]) {
    assert.match(cases, new RegExp(required.replace(/\./g, '\\.')));
  }
});

test('Cases retains current archive and operator source markers', () => {
  assert.match(cases, /CLIENT_CASE_FORMS_VISUAL_REBUILD_STAGE23_CASES/);
  assert.match(cases, /STAGE228G_OPERATOR_RAIL_SOURCE_TRUTH/);
  assert.match(cases, /STAGE231B0_R7_CASE_ARCHIVE_RESTORE_NAVIGATION/);
  assert.match(cases, /route: '\/cases\?view=closed'/);
});

test('Stage07 remains reference-only while case flows stay guarded', () => {
  assert.match(stage07Css, /VISUAL_STAGE_07_CASES/);
  assert.match(stage07Css, /\.main-cases/);
  for (const required of [
    'fetchCasesFromSupabase',
    'createCaseInSupabase',
    'deleteCaseWithRelations',
    'resolveCaseLifecycleV1',
    'handleSelectClientSuggestion',
  ]) {
    assert.match(guard, new RegExp(required));
  }
});
