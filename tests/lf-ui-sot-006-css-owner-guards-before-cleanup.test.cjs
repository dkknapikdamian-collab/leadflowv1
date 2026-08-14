const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const guardPath = path.join(root, 'scripts/check-lf-ui-sot-006-css-owner-guards-before-cleanup.cjs');
const guardSource = fs.readFileSync(guardPath, 'utf8');
const guard = require(guardPath);

test('LF-UI-SOT-006 guard script exists', () => assert.equal(fs.existsSync(guardPath), true));

test('LF-UI-SOT-006 guard passes on current semantic baseline', () => {
  execFileSync(process.execPath, [guardPath], { cwd: root, stdio: 'pipe' });
});
test('LF-UI-SOT-006 delegates to semantic ownership and does not use marker counts', () => {
  assert.match(guardSource, /validateCssArchitecture/);
  assert.doesNotMatch(guardSource, /CANONICAL_CSS_OWNER_BEGIN/);
  assert.equal(guard.CSS_OWNER_DICTIONARY.size, 20);
});

test('LF-UI-SOT-006 retains route ownership coverage', () => {
  assert.match(guardSource, /ROUTE_OWNER_DICTIONARY/);
  assert.ok(guard.ROUTE_OWNER_DICTIONARY.includes('/cases/:caseId'));
  assert.ok(guard.ROUTE_OWNER_DICTIONARY.includes('/ui-preview-vnext'));
});
