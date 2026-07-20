const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const guardPath = path.join(root, 'scripts/check-visual-html-theme-v14.cjs');
const indexCssPath = path.join(root, 'src/index.css');
const layoutPath = path.join(root, 'src/components/Layout.tsx');
const casesPath = path.join(root, 'src/pages/Cases.tsx');
const v14CssPath = path.join(root, 'src/styles/visual-html-theme-v14.css');

const guard = fs.readFileSync(guardPath, 'utf8');
const indexCss = fs.readFileSync(indexCssPath, 'utf8');
const layout = fs.readFileSync(layoutPath, 'utf8');
const cases = fs.readFileSync(casesPath, 'utf8');
const v14Css = fs.readFileSync(v14CssPath, 'utf8');

test('reconciled V14 guard passes against current shell and Cases source truth', () => {
  const result = spawnSync(process.execPath, [guardPath], { cwd: root, encoding: 'utf8' });
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  assert.match(result.stdout, /guard reconciled with current shell and Cases source truth/);
});

test('inactive V14 stylesheet is not globally imported', () => {
  assert.doesNotMatch(indexCss, /visual-html-theme-v14\.css/);
  assert.match(guard, /inactive V14 global theme import/);
});

test('Layout uses current shell and visual foundation sources', () => {
  for (const required of [
    'closeflow-compact-top-shell-source-truth.css',
    'closeflow-operator-top-trim-source-truth.css',
    'closeflow-unified-page-canvas-stage211c.css',
    'VisualFoundationRuntimeStage212M',
  ]) {
    assert.match(layout, new RegExp(required.replace(/\./g, '\\.')));
  }
});

test('Cases uses current page header, record-list and canvas sources', () => {
  for (const required of [
    'closeflow-page-header-v2.css',
    'closeflow-record-list-source-truth.css',
    'closeflow-unified-page-canvas-stage211c.css',
    'closeflow-canvas-source-truth-stage211e.css',
    'CLIENT_CASE_FORMS_VISUAL_REBUILD_STAGE23_CASES',
  ]) {
    assert.match(cases, new RegExp(required.replace(/\./g, '\\.')));
  }
});

test('V14 remains reference-only with historical trace markers', () => {
  assert.match(v14Css, /VISUAL_HTML_THEME_V14_CSS/);
  assert.match(v14Css, /grid-template-columns: 286px minmax\(0, 1fr\)/);
  assert.match(layout, /VISUAL_HTML_THEME_V14_LAYOUT/);
});
