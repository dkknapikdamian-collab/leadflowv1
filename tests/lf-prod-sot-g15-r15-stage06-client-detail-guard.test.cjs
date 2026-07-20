const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const guardPath = path.join(root, 'scripts/check-visual-stage06-client-detail.cjs');
const indexCssPath = path.join(root, 'src/index.css');
const clientDetailPath = path.join(root, 'src/pages/ClientDetail.tsx');
const stage06CssPath = path.join(root, 'src/styles/visual-stage06-client-detail.css');

const guard = fs.readFileSync(guardPath, 'utf8');
const indexCss = fs.readFileSync(indexCssPath, 'utf8');
const clientDetail = fs.readFileSync(clientDetailPath, 'utf8');
const stage06Css = fs.readFileSync(stage06CssPath, 'utf8');

test('reconciled Stage06 guard passes against current ClientDetail source truth', () => {
  const result = spawnSync(process.execPath, [guardPath], { cwd: root, encoding: 'utf8' });
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  assert.match(result.stdout, /guard reconciled with current ClientDetail source truth/);
});

test('inactive Stage06 stylesheet is not globally imported', () => {
  assert.doesNotMatch(indexCss, /visual-stage06-client-detail\.css/);
  assert.match(guard, /inactive Stage06 ClientDetail CSS import/);
});

test('ClientDetail uses current Stage12 and shared canvas sources', () => {
  assert.match(clientDetail, /visual-stage12-client-detail-vnext\.css/);
  assert.match(clientDetail, /closeflow-unified-page-canvas-stage211c\.css/);
});

test('ClientDetail retains current workspace and missing-manager source markers', () => {
  assert.match(clientDetail, /STAGE231D0_CLIENT_WORKSPACE_UX_CLEANUP/);
  assert.match(clientDetail, /STAGE231B0_R15_R2_CLIENT_DETAIL_SHARED_CANVAS_WIDTH_TRIAL/);
  assert.match(clientDetail, /STAGE232I4_R16O_CLIENT_SHARED_MISSING_MANAGER_NO_MARKER_ANCHOR_FINAL/);
});

test('Stage06 remains reference-only while client flows stay guarded', () => {
  assert.match(stage06Css, /VISUAL_STAGE_06_CLIENT_DETAIL/);
  assert.match(stage06Css, /\.main-client-detail/);
  for (const required of [
    'fetchClientByIdFromSupabase',
    'fetchCasesFromSupabase',
    'updateClientInSupabase',
    'openNewCase',
    'openNewLeadForExistingClient',
  ]) {
    assert.match(guard, new RegExp(required));
  }
});
