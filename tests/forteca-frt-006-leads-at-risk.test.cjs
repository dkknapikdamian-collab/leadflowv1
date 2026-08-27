const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

test('FRT-006 at-risk state follows the reference composition and canonical risk owners', () => {
  const leads = read('src/pages/Leads.tsx');
  const header = read('src/components/CloseFlowPageHeaderV2.tsx');
  const contract = read('_project/contracts/forteca-clean/FRT-006_LEADS_AT_RISK.md');
  const css = read('src/styles/closeflow-record-list-source-truth.css');

  assert.match(contract, /CONTRACT_STATUS: (?:ACTIVE|ACCEPTED)/);
  assert.match(leads, /const riskView = !showTrash && quickFilter === 'at-risk';/);
  assert.match(leads, /searchParams\.get\('quick'\) !== 'at-risk'/);
  assert.match(leads, /setRiskFilter\('at-risk'\);/);
  assert.match(leads, /Leady – Zagrożone/);
  assert.match(leads, /Leady wymagające natychmiastowej uwagi i reakcji/);
  assert.match(leads, /data-frt006-risk-filter-card=\{/);
  assert.match(leads, /data-frt006-risk-filter-chip="true"/);
  assert.match(leads, /aria-label="Filtr kontaktu i ciszy"/);
  assert.match(leads, /<span>Powód ryzyka<\/span>/);
  assert.match(leads, /<span>Następny ruch<\/span>/);
  assert.match(leads, /buildLeadRiskReason\(/);
  assert.match(leads, /buildNextMoveContract\(/);
  assert.match(leads, /getLeadOwnerRiskBadges\(/);
  assert.match(leads, /readOwnerRiskSettings\(/);
  assert.match(leads, /fetchLeadsFromSupabase\(\)/);
  assert.match(leads, /data-frt006-risk-table-head=\{/);
  assert.match(leads, /data-frt006-risk-table-row=\{/);
  assert.match(leads, /onClick=\{\(\) => toggleQuickFilter\('at-risk'\)\}/);
  assert.match(header, /title\?: ReactNode/);
  assert.match(header, /description\?: ReactNode/);
  assert.match(css, /\.leads-filter-card-risk/);
  assert.match(css, /\.leads-table-head-risk/);
  assert.match(css, /\.leads-risk-table-row/);
  assert.match(css, /@media \(max-width: 46rem\)/);
});

test('FRT-006 displays live lead-derived dates and movement details without reference fixtures', () => {
  const leads = read('src/pages/Leads.tsx');

  assert.match(leads, /function getLeadRelativeContact\(/);
  assert.match(leads, /function getLeadRelativeDue\(/);
  assert.match(leads, /getNearestPlannedAction\(\{[\s\S]*?leadId,/);
  assert.match(leads, /relatedRecordsByLeadId\.get\(leadId\)/);
  assert.match(leads, /const riskContact = getLeadRelativeContact\(lead\.lastContactAt\);/);
  assert.match(leads, /const riskDue = getLeadRelativeDue\(nextAction\?\.at\);/);
  assert.doesNotMatch(leads, /Green Energy Sp\. z o\.o\./);
  assert.doesNotMatch(leads, /Anna Kowalska.*7/);
});
