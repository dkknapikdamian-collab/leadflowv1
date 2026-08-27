const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

test('FRT-007 history uses a real source list and exposes the reference controls', () => {
  const leads = read('src/pages/Leads.tsx');
  const contract = read('_project/contracts/forteca-clean/FRT-007_LEADS_HISTORY.md');
  const css = read('src/styles/closeflow-record-list-source-truth.css');

  assert.match(contract, /CONTRACT_STATUS: (?:ACTIVE|ACCEPTED)/);
  assert.match(leads, /function isLeadHistoryEntry\(/);
  assert.match(leads, /const historyLeads = useMemo\(/);
  assert.match(leads, /const historyView = !showTrash && quickFilter === 'history';/);
  assert.match(leads, /const sourceLeads = showTrash \? trashLeads : historyView \? historyLeads : activeLeads;/);
  assert.match(leads, /data-frt007-history-tabs="true"/);
  assert.match(leads, /data-frt007-history-filter-card=\{/);
  assert.match(leads, /data-frt007-history-status-filter="true"/);
  assert.match(leads, /data-frt007-history-reason-filter="true"/);
  assert.match(leads, /data-frt007-history-value-filter="true"/);
  assert.match(leads, /data-frt007-history-closed-period-filter="true"/);
  assert.match(leads, /<span>Wynik \/ powód<\/span>/);
  assert.match(leads, /<span>Data zamknięcia<\/span>/);
  assert.match(leads, /<span>Powiązana sprawa<\/span>/);
  assert.match(leads, /data-frt007-history-table-row=\{/);
  assert.match(css, /\.leads-filter-card-history/);
  assert.match(css, /\.leads-table-head-history/);
  assert.match(css, /\.leads-history-table-row/);
  assert.match(css, /@media \(max-width: 46rem\)/);
});

test('FRT-007 keeps soft-delete and outcome/date semantics canonical', () => {
  const leads = read('src/pages/Leads.tsx');

  assert.match(leads, /if \(isLeadInTrash\(lead\)\) return false;/);
  assert.match(leads, /\['won', 'lost'\]\.includes\(status\)/);
  assert.match(leads, /Przeniesiony do obsługi/);
  assert.match(leads, /function getLeadHistoryCloseAt\(/);
  assert.match(leads, /lead\?\.closedAt/);
  assert.match(leads, /lead\?\.movedToServiceAt/);
  assert.match(leads, /historyOutcome\.reason === historyReasonFilter/);
  assert.match(leads, /Brak daty zamknięcia/);
  assert.match(leads, /Brak powiązanej sprawy/);
  assert.doesNotMatch(leads, /ACME Logistics|North Build|Green Energy Sp\. z o\.o\./);
});
