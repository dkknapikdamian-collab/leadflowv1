const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const guardPath = path.join(root, 'scripts/check-visual-stage16-today-html-reset.cjs');
const indexCssPath = path.join(root, 'src/index.css');
const appPath = path.join(root, 'src/App.tsx');
const todayStablePath = path.join(root, 'src/pages/TodayStable.tsx');
const stage16CssPath = path.join(root, 'src/styles/visual-stage16-today-html-reset.css');

const guard = fs.readFileSync(guardPath, 'utf8');
const indexCss = fs.readFileSync(indexCssPath, 'utf8');
const app = fs.readFileSync(appPath, 'utf8');
const todayStable = fs.readFileSync(todayStablePath, 'utf8');
const stage16Css = fs.readFileSync(stage16CssPath, 'utf8');

test('reconciled Stage16 guard passes against current TodayStable source truth', () => {
  const result = spawnSync(process.execPath, [guardPath], { cwd: root, encoding: 'utf8' });
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  assert.match(result.stdout, /guard reconciled with current TodayStable source truth/);
});

test('inactive Stage16 stylesheet is not globally imported', () => {
  assert.doesNotMatch(indexCss, /visual-stage16-today-html-reset\.css/);
  assert.match(guard, /inactive Stage16 global CSS import/);
});

test('active Today route resolves to TodayStable', () => {
  assert.match(app, /import\('\.\/pages\/TodayStable'\), 'TodayStable'/);
});

test('TodayStable uses current page-header and canvas source styles', () => {
  for (const required of [
    'closeflow-page-header-v2.css',
    'closeflow-unified-page-canvas-stage211c.css',
    'closeflow-canvas-source-truth-stage211e.css',
    'closeflow-canvas-runtime-source-truth-stage211j.css',
  ]) {
    assert.match(todayStable, new RegExp(required.replace(/\./g, '\\.')));
  }
});

test('TodayStable retains current source markers while Stage16 remains reference-only', () => {
  assert.match(todayStable, /P0_TODAY_STABLE_REBUILD/);
  assert.match(todayStable, /STAGE232T_R1C_TODAY_PRODUCTION_UI_CLEANUP_AND_SOURCE_TRUTH/);
  assert.match(stage16Css, /VISUAL_STAGE16_TODAY_HTML_RESET_CSS/);
  assert.match(stage16Css, /aggressive/);
});
