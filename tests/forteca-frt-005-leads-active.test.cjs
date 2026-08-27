const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

test('FRT-005 active state uses the real quick filter and reference process notice', () => {
  const leads = read('src/pages/Leads.tsx');
  const contract = read('_project/contracts/forteca-clean/FRT-005_LEADS_ACTIVE.md');
  const css = read('src/styles/closeflow-record-list-source-truth.css');

  assert.match(contract, /CONTRACT_STATUS: ACTIVE/);
  assert.match(leads, /const activeView = !showTrash && quickFilter === 'active';/);
  assert.match(leads, /searchParams\.get\('quick'\) !== 'active'/);
  assert.match(leads, /setQuickFilter\('active'\);/);
  assert.match(leads, /data-frt005-active-process-banner="true"/);
  assert.match(leads, /Aktywne leady wymagające pilnowania procesu/);
  assert.match(leads, /data-frt005-active-filter-chip="true"/);
  assert.match(leads, /Status: aktywne/);
  assert.match(leads, /aria-label="Filtr ostatniego kontaktu"/);
  assert.match(leads, /setCadenceFilter\(event\.target\.value as ContactCadenceBucketKey \| 'all'\)/);
  assert.match(leads, /helper=\{activeView \? 'W trakcie sprzedaży' : 'Obecnie w procesie'\}/);
  assert.match(leads, /data-frt005-leads-active-filter-card=\{activeView \? 'true' : 'false'\}/);
  assert.match(leads, /data-frt005-leads-active-toolbar=\{activeView \? 'true' : 'false'\}/);
  assert.match(leads, /leads-table-head\$\{activeView \? ' leads-table-head-active' : ''\}/);
  assert.match(leads, /data-frt005-active-table-head=\{activeView \? 'true' : 'false'\}/);
  assert.match(leads, /<span>Lead \/ firma<\/span>/);
  assert.match(leads, /getLeadInitials\(lead, activeIdentityLabel\)/);
  assert.match(leads, /data-frt005-active-table-row=\{activeView \? 'true' : 'false'\}/);
  assert.match(leads, /lead-active-avatar/);
  assert.match(css, /\.leads-active-process-banner/);
  assert.match(css, /\.leads-filter-card-active/);
  assert.match(css, /\.leads-active-table-row/);
  assert.match(css, /\.lead-active-avatar/);
});

test('FRT-005 active state remains connected to real leads data and existing action owners', () => {
  const leads = read('src/pages/Leads.tsx');

  assert.match(leads, /fetchLeadsFromSupabase\(\)/);
  assert.match(leads, /quickFilter === 'active' && activeLead/);
  assert.match(leads, /onClick=\{\(\) => toggleQuickFilter\('active'\)\}/);
  assert.match(leads, /setQuickFilter\('active'\)/);
  assert.match(leads, /data-frt004-leads-table-row="true"/);
  assert.match(leads, /buildRecordOperationalBadges\(/);
});
