const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8').replace(/^\uFEFF/, '');
}

test('Faza 3 Etap 3.2G backend allows draft cleanup without AI feature gate', () => {
  const serverDrafts = read('src/server/ai-drafts.ts');

  assert.match(serverDrafts, /function isAiDraftCleanupMutation/);
  assert.match(serverDrafts, /req\?\.method === 'DELETE'/);
  assert.match(serverDrafts, /if \(!isAiDraftCleanupMutation\(req, body\)\) \{[\s\S]*await assertWorkspaceAiAllowed\(workspaceId\);[\s\S]*\}/);
  assert.match(serverDrafts, /WORKSPACE_AI_ACCESS_REQUIRED/);
});

test('Faza 3 Etap 3.2G client sends archive action and UI has cancellable note draft path', () => {
  const libDrafts = read('src/lib/ai-drafts.ts');
  const pageDrafts = read('src/pages/AiDrafts.tsx');

  assert.match(libDrafts, /action: \(patch as any\)\.action/);
  assert.match(pageDrafts, /archiveAiLeadDraftAsync\(draft\.id\)/);
  assert.match(pageDrafts, /Nie udało się anulować szkicu/);
});

test('Faza 3 Etap 3.2G package and quiet release gate are wired', () => {
  const pkg = JSON.parse(read('package.json'));
  const quiet = read('scripts/closeflow-release-check-quiet.cjs');

  assert.equal(pkg.scripts['check:faza3-etap32g-ai-draft-cancel-smoke'], 'node scripts/check-faza3-etap32g-ai-draft-cancel-smoke.cjs');
  assert.equal(pkg.scripts['test:faza3-etap32g-ai-draft-cancel-smoke'], 'node --test tests/faza3-etap32g-ai-draft-cancel-smoke.test.cjs');
  assert.match(quiet, /tests\/faza3-etap32g-ai-draft-cancel-smoke\.test\.cjs/);
});
