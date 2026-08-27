const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

test('FRT-008 rescue uses the real rescue owner and reference composition', () => {
  const leads = read('src/pages/Leads.tsx');
  const rescue = read('src/lib/owner-control/lost-lead-rescue.ts');
  const contract = read('_project/contracts/forteca-clean/FRT-008_LEADS_RESCUE.md');
  const css = read('src/styles/closeflow-record-list-source-truth.css');

  assert.match(contract, /CONTRACT_STATUS: ACTIVE/);
  assert.match(leads, /const rescueView = !showTrash && quickFilter === 'rescue';/);
  assert.match(leads, /const lostLeadRescueSummary = useMemo\(/);
  assert.match(leads, /const filteredRescueRows = useMemo\(/);
  assert.match(leads, /data-frt008-rescue-summary="true"/);
  assert.match(leads, /data-frt008-rescue-filter-card=\{/);
  assert.match(leads, /data-frt008-rescue-table="true"/);
  assert.match(leads, /data-frt008-rescue-row="true"/);
  assert.match(leads, /<span>Powód do odzyskania<\/span>/);
  assert.match(leads, /<span>Sugerowany następny krok<\/span>/);
  assert.match(leads, /data-context-action-kind="task"/);
  assert.match(leads, /Ustaw kolejny krok/);
  assert.match(leads, /handleArchiveLead\(event, lead\)/);
  assert.match(leads, /function getLeadOwnerLabel\(/);
  assert.match(rescue, /function buildLostLeadRescue\(/);
  assert.match(rescue, /reasonKey/);
  assert.match(rescue, /severity/);
  assert.match(css, /\.leads-filter-card-rescue/);
  assert.match(css, /\.leads-rescue-summary/);
  assert.match(css, /\.leads-rescue-table-row/);
  assert.match(css, /@media \(max-width: 46rem\)/);
});

test('FRT-008 does not ship disabled rescue placeholder actions or screenshot records', () => {
  const leads = read('src/pages/Leads.tsx');

  assert.doesNotMatch(leads, /Ustaw zadanie/);
  assert.doesNotMatch(leads, /Oznacz jako martwy/);
  assert.doesNotMatch(leads, /ACME Sp\. z o\.o\.|Beta Systems|Tech Solutions S\.A\.|Green Energy Sp\. z o\.o\.|Invest Projekt/);
  assert.match(leads, /resetLeadFilters/);
  assert.match(leads, /setQuickFilter\(rescueView \? 'rescue' : 'all'\)/);
});
