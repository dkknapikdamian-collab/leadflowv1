const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const nodeTest = require('node:test');

const root = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8').replace(/^\uFEFF/, '');
}

nodeTest('Faza 3 Etap 3.2H lead limit is only near real lead insert path', () => {
  const leads = read('api/leads.ts');
  const call = "assertWorkspaceEntityLimit(workspaceId, 'lead')";
  assert.equal(leads.split(call).length - 1, 1);

  const insertMatches = [...leads.matchAll(/await\s+insertLeadWithSchemaFallback\(\s*payload\s*\)/g)];
  assert.equal(insertMatches.length, 1);

  const callIndex = leads.indexOf(call);
  const insertIndex = insertMatches[0].index;
  assert.ok(callIndex > -1);
  assert.ok(insertIndex > -1);
  assert.ok(callIndex < insertIndex);
  assert.ok(insertIndex - callIndex < 2000);

  const ensureStart = leads.indexOf('async function ensureClientForLead');
  const startServiceStart = leads.indexOf('async function handleStartService');
  const ensureBlock = leads.slice(ensureStart, startServiceStart);
  assert.doesNotMatch(ensureBlock, /assertWorkspaceEntityLimit\(workspaceId,\s*['"]lead['"]\)/);
});

nodeTest('Faza 3 Etap 3.2H package and quiet release gate are wired', () => {
  const pkg = JSON.parse(read('package.json'));
  const quiet = read('scripts/closeflow-release-check-quiet.cjs');

  assert.equal(pkg.scripts['check:faza3-etap32h-lead-limit-placement-hotfix'], 'node scripts/check-faza3-etap32h-lead-limit-placement-hotfix.cjs');
  assert.equal(pkg.scripts['test:faza3-etap32h-lead-limit-placement-hotfix'], 'node --test tests/faza3-etap32h-lead-limit-placement-hotfix.test.cjs');
  assert.match(quiet, /tests\/faza3-etap32h-lead-limit-placement-hotfix\.test\.cjs/);
});
