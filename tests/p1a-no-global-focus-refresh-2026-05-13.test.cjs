const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const repoRoot = path.resolve(__dirname, '..');
const app = fs.readFileSync(path.join(repoRoot, 'src/App.tsx'), 'utf8');
const quietGate = fs.readFileSync(path.join(repoRoot, 'scripts/closeflow-release-check-quiet.cjs'), 'utf8');

test('App does not refresh profile on browser focus or visibility change', () => {
  assert.ok(app.includes('CLOSEFLOW_P1A_NO_GLOBAL_FOCUS_REFRESH_2026_05_13'));
  assert.ok(app.includes('void syncProfileFromApi(true);'), 'initial profile sync should stay');
  assert.equal(app.includes("window.addEventListener('focus', handleVisibilityRefresh)"), false);
  assert.equal(app.includes("document.addEventListener('visibilitychange', handleVisibilityRefresh)"), false);
  assert.equal(app.includes("window.setInterval(() => void syncProfileFromApi(false), 60_000)"), false);
});

test('P1A no global focus refresh test is included in quiet release gate', () => {
  assert.ok(quietGate.includes("'tests/p1a-no-global-focus-refresh-2026-05-13.test.cjs'"));
});
