const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

test('FRT-004 Leads all state keeps real data, reference controls and pagination', () => {
  const leads = read('src/pages/Leads.tsx');
  const header = read('src/components/CloseFlowPageHeaderV2.tsx');
  const listCss = read('src/styles/closeflow-record-list-source-truth.css');

  assert.match(leads, /fetchLeadsFromSupabase\(\)/);
  assert.match(leads, /useState<LeadsQuickFilter>\('all'\)/);
  assert.match(leads, /data-frt004-leads-filter-card="true"/);
  assert.match(leads, /data-frt004-leads-filter-toolbar="true"/);
  assert.match(leads, /aria-label="Filtr statusu"/);
  assert.match(leads, /aria-label="Filtr źródła"/);
  assert.match(leads, /aria-label="Filtr ryzyka"/);
  assert.match(leads, /data-frt004-more-filters="true"/);
  assert.match(leads, /data-frt004-reset-filters="true"/);
  assert.match(leads, /data-frt004-more-filters-panel="true"/);
  assert.match(leads, /data-frt004-leads-table-head="true"/);
  assert.match(leads, /data-frt004-leads-table-row="true"/);
  assert.match(leads, /pagedLeads\.map/);
  assert.match(leads, /data-frt004-leads-pagination="true"/);
  assert.match(leads, /leadów/);
  assert.match(leads, /20 \/ strona/);
  assert.match(header, /Zarządzaj procesem sprzedaży i domykaj kolejne deale\./);
  assert.match(listCss, /\.leads-filter-card/);
  assert.match(listCss, /\.leads-table-head/);
  assert.match(listCss, /\.leads-table-row/);
});

test('FRT-004 keeps secondary lead actions out of the reference header without deleting behavior', () => {
  const leads = read('src/pages/Leads.tsx');
  const css = read('src/styles/closeflow-record-list-source-truth.css');

  assert.match(leads, /data-frt004-secondary-header-action="ai"/);
  assert.match(leads, /data-frt004-secondary-header-action="trash"/);
  assert.match(leads, /onClick=\{toggleTrashView\}/);
  assert.match(css, /\.leads-secondary-header-action[\s\S]*display: none !important/);
  assert.match(leads, /label: 'Kosz'/);
});
