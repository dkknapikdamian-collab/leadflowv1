const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const repoRoot = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

function assertHas(content, needle, label) {
  assert.ok(content.includes(needle), 'Missing Stage32 marker: ' + label);
}

function assertNotHas(content, needle, label) {
  assert.ok(!content.includes(needle), 'Unexpected old Stage32 content: ' + label);
}

test('Stage32 moves valuable relations to a compact right rail', () => {
  const leads = read('src/pages/Leads.tsx');

  assertHas(leads, 'STAGE32_VALUABLE_RELATIONS_RIGHT_RAIL', 'stage marker');
  assertHas(leads, 'data-stage32-leads-value-layout="true"', 'two column layout marker');
  assertHas(leads, 'xl:grid-cols-[minmax(0,1fr)_300px]', 'desktop right rail grid');
  assertHas(leads, 'data-stage32-leads-value-rail="true"', 'right rail marker');
  assertHas(leads, 'data-stage32-valuable-relation-row="true"', 'valuable relation row marker');
  assertHas(leads, "to={entry.href || '/leads'}", 'clickable relation route');
  assertHas(leads, 'formatRelationValue(entry.value)', 'relation value label');
});

test('Stage32 keeps relation value logic unchanged and removes the large old board copy', () => {
  const leads = read('src/pages/Leads.tsx');

  assertHas(leads, 'buildRelationValueEntries({ leads: activeLeads, clients, cases })', 'existing value calculation');
  assertHas(leads, 'relationValueEntries.slice(0, 5)', 'top 5 entries');
  assertNotHas(leads, 'Suma lejka liczona z aktywnych leadow i klientow', 'old long description ascii');
  assertNotHas(leads, 'Suma lejka liczona z aktywnych leadów i klientów', 'old long description polish');
  assertNotHas(leads, 'md:grid-cols-2 xl:grid-cols-3', 'old large relation grid');
});

test('Stage32 is included in both release gates', () => {
  const quietGate = read('scripts/closeflow-release-check-quiet.cjs');
  const fullGate = read('scripts/closeflow-release-check.cjs');

  assertHas(quietGate, 'tests/stage32-leads-value-right-rail.test.cjs', 'quiet gate');
  assertHas(fullGate, 'tests/stage32-leads-value-right-rail.test.cjs', 'full gate');
});
