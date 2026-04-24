const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const repoRoot = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

test('Clients panel exposes safe trash action', () => {
  const source = read('src/pages/Clients.tsx');

  assert.match(source, /Trash2/);
  assert.match(source, /RotateCcw/);
  assert.match(source, /updateClientInSupabase/);
  assert.match(source, /handleArchiveClient/);
  assert.match(source, /handleRestoreClient/);
  assert.match(source, /event\.preventDefault\(\)/);
  assert.match(source, /event\.stopPropagation\(\)/);
  assert.match(source, /archivePendingId/);
});

test('Leads panel exposes safe trash action', () => {
  const source = read('src/pages/Leads.tsx');

  assert.match(source, /Trash2/);
  assert.match(source, /RotateCcw/);
  assert.match(source, /updateLeadInSupabase/);
  assert.match(source, /handleArchiveLead/);
  assert.match(source, /handleRestoreLead/);
  assert.match(source, /event\.preventDefault\(\)/);
  assert.match(source, /event\.stopPropagation\(\)/);
  assert.match(source, /archivePendingId/);
});

test('Panel trash actions keep cards navigable through Link wrappers', () => {
  const clients = read('src/pages/Clients.tsx');
  const leads = read('src/pages/Leads.tsx');

  assert.match(clients, /className="relative group\/client-card"/);
  assert.match(clients, /className="block"/);
  assert.match(leads, /className="relative group\/lead-row"/);
  assert.match(leads, /className="block"/);
});

test('Clients and leads expose trash view toggles', () => {
  const clients = read('src/pages/Clients.tsx');
  const leads = read('src/pages/Leads.tsx');

  assert.match(clients, /showArchived/);
  assert.match(clients, /Kosz klientów jest pusty/);
  assert.match(clients, /Przywróć klienta/);
  assert.match(leads, /showTrash/);
  assert.match(leads, /Kosz leadów jest pusty/);
  assert.match(leads, /Przywróć leada/);
});

test('Panel trash mode is soft-delete and restore, not hard delete', () => {
  const clients = read('src/pages/Clients.tsx');
  const leads = read('src/pages/Leads.tsx');

  assert.doesNotMatch(clients, /deleteClientFromSupabase/);
  assert.doesNotMatch(leads, /deleteLeadFromSupabase/);
  assert.match(clients, /archivedAt: new Date\(\)\.toISOString\(\)/);
  assert.match(clients, /archivedAt: null/);
  assert.match(leads, /status: 'archived'/);
  assert.match(leads, /leadVisibility: 'trash'/);
  assert.match(leads, /salesOutcome: 'archived'/);
  assert.match(leads, /status: nextStatus/);
});

test('Panel delete confirmation strings are valid escaped strings', () => {
  const leads = read('src/pages/Leads.tsx');
  const clients = read('src/pages/Clients.tsx');

  assert.doesNotMatch(leads, /\?\s*'\r?\n\r?\n\s*Ten lead ma powiązaną sprawę/);
  assert.doesNotMatch(clients, /\?\s*'\r?\n\r?\n\s*Ten klient ma powiązania/);

  assert.match(leads, /\\n\\nTen lead ma powiązaną sprawę/);
  assert.match(clients, /\\n\\nTen klient ma powiązania/);
});

test('Panel delete actions documentation explains safe trash mode', () => {
  const doc = read('docs/PANEL_DELETE_ACTIONS_V1_2026-04-24.md');

  assert.match(doc, /Panel delete actions V1/);
  assert.match(doc, /Leady/);
  assert.match(doc, /Klienci/);
  assert.match(doc, /potwierdzenie/);
  assert.match(doc, /Kosz w V1 nie kasuje danych trwale/);
  assert.match(doc, /przywrócić rekord/);
});
