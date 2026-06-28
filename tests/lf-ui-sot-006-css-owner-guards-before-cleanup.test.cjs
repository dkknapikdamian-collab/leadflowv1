const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const guardPath = path.join(root, 'scripts/check-lf-ui-sot-006-css-owner-guards-before-cleanup.cjs');
const guardSource = fs.readFileSync(guardPath, 'utf8');
const guard = require(guardPath);

test('LF-UI-SOT-006 guard script exists', () => {
  assert.equal(fs.existsSync(guardPath), true);
});

test('LF-UI-SOT-006 guard passes on current baseline', () => {
  execFileSync(process.execPath, [guardPath], { cwd: root, stdio: 'pipe' });
});

test('LF-UI-SOT-006 guard source contains 45 CSS import baseline', () => {
  assert.match(guardSource, /CSS_IMPORT_BASELINE\s*=\s*45/);
  assert.match(guardSource, /APP_STYLES_IMPORT_MAX_BASELINE\s*=\s*45/);
});

test('LF-UI-SOT-006 guard source contains route owner dictionary', () => {
  assert.match(guardSource, /ROUTE_OWNER_DICTIONARY/);
  assert.ok(guard.ROUTE_OWNER_DICTIONARY.some((entry) => entry.route === '/cases/:caseId'));
  assert.ok(guard.ROUTE_OWNER_DICTIONARY.some((entry) => entry.route === '/ui-preview-vnext'));
});

test('LF-UI-SOT-006 guard source contains CSS owner dictionary', () => {
  assert.match(guardSource, /CSS_OWNER_DICTIONARY/);
  assert.equal(guard.CSS_OWNER_DICTIONARY.size, 45);
});

test('LF-UI-SOT-006 guard source contains blocked search owner rule', () => {
  assert.match(guardSource, /Search cleanup blocked until search owner is confirmed/);
  assert.match(guardSource, /DO_POTWIERDZENIA/);
});

test('LF-UI-SOT-006 guard source contains dev preview not production SOT rule', () => {
  assert.match(guardSource, /DEV_PREVIEW_NOT_PRODUCTION_SOT/);
});

test('LF-UI-SOT-006 guard source contains no-hotfix-delete rule', () => {
  assert.match(guardSource, /NO_HOTFIX_DELETE_GUARD/);
  assert.match(guardSource, /DELETE_AFTER_GUARD/);
});

test('LF-UI-SOT-006 guard source contains density runtime guard rule', () => {
  assert.match(guardSource, /DENSITY_RUNTIME_GUARD/);
  assert.match(guardSource, /Layout\.tsx runtime scroll\/scale contract/);
});

test('LF-UI-SOT-006 guard source contains modal owner guard rule', () => {
  assert.match(guardSource, /MODAL_OWNER_GUARD/);
  assert.match(guardSource, /closeflow-modal-visual-system\.css/);
});

test('LF-UI-SOT-006 guard source contains right rail owner guard rule', () => {
  assert.match(guardSource, /RIGHT_RAIL_OWNER_GUARD/);
  assert.match(guardSource, /closeflow-right-rail-source-truth\.css/);
});
