const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

test('FRT-009 loads the real archived lead source and renders the trash contract', () => {
  const leads = read('src/pages/Leads.tsx');
  const fallback = read('src/lib/supabase-fallback.ts');
  const api = read('api/leads.ts');
  const contract = read('_project/contracts/forteca-clean/FRT-009_LEADS_TRASH.md');
  const css = read('src/styles/closeflow-record-list-source-truth.css');

  assert.match(contract, /CONTRACT_STATUS: ACTIVE/);
  assert.match(fallback, /includeArchived\?: boolean/);
  assert.match(fallback, /query\.set\('includeArchived', '1'\)/);
  assert.match(leads, /fetchLeadsFromSupabase\(\{ includeArchived: true \}\)/);
  assert.match(api, /const includeArchived = \['1', 'true', 'yes'\]/);
  assert.match(api, /!includeArchived/);
  assert.match(api, /visibility !== 'trash'/);
  assert.match(api, /outcome !== 'archived'/);
  assert.match(api, /'closed_at'/);
  assert.match(leads, /const filteredTrashLeads = useMemo\(/);
  assert.match(leads, /data-frt009-trash-view="true"/);
  assert.match(leads, /data-frt009-trash-summary="true"/);
  assert.match(leads, /data-frt009-trash-table="true"/);
  assert.match(leads, /data-frt009-trash-restore="true"/);
  assert.match(leads, /data-frt009-trash-export="true"/);
  assert.match(leads, /<span>Powód usunięcia<\/span>/);
  assert.match(leads, /<span>Termin trwałego usunięcia<\/span>/);
  assert.match(leads, /Zarządzaj usuniętymi leadami\. Możesz je przywrócić przed trwałym usunięciem\./);
  assert.match(css, /\.leads-trash-view/);
  assert.match(css, /\.leads-trash-table-row/);
  assert.match(css, /\.leads-trash-restore-button/);
  assert.match(css, /@media \(max-width: 46rem\)/);
});

test('FRT-009 keeps destructive behavior safe and data honest', () => {
  const leads = read('src/pages/Leads.tsx');

  assert.match(leads, /ConfirmDialog/);
  assert.match(leads, /executeRestoreLeadStage220A29/);
  assert.doesNotMatch(leads, /window\.confirm/);
  assert.doesNotMatch(leads, /Opróżnij kosz/);
  assert.doesNotMatch(leads, /ACME Sp\. z o\.o\.|Beta Systems|Tech Solutions S\.A\.|Green Energy Sp\. z o\.o\.|Invest Projekt/);
  assert.match(leads, /Brak źródła przywróceń/);
  assert.match(leads, /Brak terminu/);
});
