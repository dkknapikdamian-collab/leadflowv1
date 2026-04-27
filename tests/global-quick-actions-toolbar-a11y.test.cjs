const assert = require('node:assert/strict');
const fs = require('node:fs');
const test = require('node:test');

test('global quick actions are exposed as one accessible toolbar', () => {
  const source = fs.readFileSync('src/components/GlobalQuickActions.tsx', 'utf8');

  assert.match(source, /GLOBAL_QUICK_ACTIONS_TOOLBAR_A11Y_V97/);
  assert.match(source, /role="toolbar"/);
  assert.match(source, /aria-label="Szybkie akcje aplikacji"/);
  assert.match(source, /data-global-quick-actions="true"|data-global-quick-actions-contract="v97"/);
  assert.match(source, /data-global-quick-action="ai-drafts"/);
  assert.match(source, /data-global-quick-action="lead"/);
  assert.match(source, /data-global-quick-action="task"/);
  assert.match(source, /data-global-quick-action="event"/);
});

test('global quick actions toolbar test is included in quiet release gate', () => {
  const gate = fs.readFileSync('scripts/closeflow-release-check-quiet.cjs', 'utf8');
  assert.match(gate, /tests\/global-quick-actions-toolbar-a11y\.test\.cjs/);
});