const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const repoRoot = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

test('Clients panel exposes trash delete action', () => {
  const source = read('src/pages/Clients.tsx');

  assert.match(source, /Trash2/);
  assert.match(source, /deleteClientFromSupabase/);
  assert.match(source, /handleDeleteClient/);
  assert.match(source, /event\.preventDefault\(\)/);
  assert.match(source, /event\.stopPropagation\(\)/);
  assert.match(source, /deletePendingId/);
});

test('Leads panel exposes trash delete action', () => {
  const source = read('src/pages/Leads.tsx');

  assert.match(source, /Trash2/);
  assert.match(source, /deleteLeadFromSupabase/);
  assert.match(source, /handleDeleteLead/);
  assert.match(source, /event\.preventDefault\(\)/);
  assert.match(source, /event\.stopPropagation\(\)/);
  assert.match(source, /deletePendingId/);
});

test('Panel delete actions keep cards navigable through Link wrappers', () => {
  const clients = read('src/pages/Clients.tsx');
  const leads = read('src/pages/Leads.tsx');

  assert.match(clients, /className="relative group\/client-card"/);
  assert.match(clients, /className="block"/);
  assert.match(leads, /className="relative group\/lead-row"/);
  assert.match(leads, /className="block"/);
});

test('Panel delete actions documentation exists', () => {
  const doc = read('docs/PANEL_DELETE_ACTIONS_V1_2026-04-24.md');

  assert.match(doc, /Panel delete actions V1/);
  assert.match(doc, /Leady/);
  assert.match(doc, /Klienci/);
  assert.match(doc, /potwierdzenie/);
});
