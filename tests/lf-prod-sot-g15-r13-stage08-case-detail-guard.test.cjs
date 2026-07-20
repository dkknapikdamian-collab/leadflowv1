const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const guardPath = path.join(root, 'scripts/check-visual-stage08-case-detail.cjs');
const indexCssPath = path.join(root, 'src/index.css');
const caseDetailPath = path.join(root, 'src/pages/CaseDetail.tsx');
const stage08CssPath = path.join(root, 'src/styles/visual-stage08-case-detail.css');

const guard = fs.readFileSync(guardPath, 'utf8');
const indexCss = fs.readFileSync(indexCssPath, 'utf8');
const caseDetail = fs.readFileSync(caseDetailPath, 'utf8');
const stage08Css = fs.readFileSync(stage08CssPath, 'utf8');

test('reconciled Stage08 guard passes against current CaseDetail source truth', () => {
  const result = spawnSync(process.execPath, [guardPath], { cwd: root, encoding: 'utf8' });
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  assert.match(result.stdout, /guard reconciled with current CaseDetail source truth/);
});

test('inactive Stage08 stylesheet is not globally imported', () => {
  assert.doesNotMatch(indexCss, /visual-stage08-case-detail\.css/);
  assert.match(guard, /inactive Stage08 CaseDetail CSS import/);
});

test('CaseDetail uses current visual source imports', () => {
  for (const required of [
    'visual-stage13-case-detail-vnext.css',
    'closeflow-case-history-visual-source-truth.css',
    'closeflow-unified-page-canvas-stage211c.css',
    'closeflow-case-detail-stage217-operation-workspace.css',
    'closeflow-case-detail-stage220a10-tabs-layout-repair.css',
    'case-detail-stage228r9-shell-rail-lift.css',
  ]) {
    assert.match(caseDetail, new RegExp(required.replace(/\./g, '\\.')));
  }
});

test('CaseDetail retains current operation and rail source markers', () => {
  assert.match(caseDetail, /STAGE231D2_R6_CASE_DETAIL_TOP_STRIP_RAIL_LIFT/);
  assert.match(caseDetail, /STAGE217_CASE_DETAIL_OPERATION_WORKSPACE_UX/);
});

test('Stage08 remains reference-only while business-flow checks stay in guard', () => {
  assert.match(stage08Css, /VISUAL_STAGE_08_CASE_DETAIL_CSS/);
  assert.match(stage08Css, /\.main-case-detail/);
  for (const required of [
    'fetchCaseByIdFromSupabase',
    'insertTaskToSupabase',
    'insertEventToSupabase',
    'createClientPortalTokenInSupabase',
    'resolveCaseLifecycleV1',
  ]) {
    assert.match(guard, new RegExp(required));
  }
});
