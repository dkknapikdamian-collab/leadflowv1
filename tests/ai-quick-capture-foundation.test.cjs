const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const repoRoot = path.resolve(__dirname, '..');
function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}
function exists(relativePath) {
  return fs.existsSync(path.join(repoRoot, relativePath));
}

test('Quick AI Capture is consolidated under system API and does not create a new Vercel function', () => {
  const system = read('api/system.ts');
  const server = read('src/server/ai-capture.ts');
  const client = read('src/lib/ai-capture.ts');

  assert.equal(exists('api/ai-capture.ts'), false, 'AI capture must not create api/ai-capture.ts');
  assert.match(system, /aiCaptureHandler/);
  assert.match(system, /kind === 'ai-capture-draft'/);
  assert.match(server, /mode: 'draft_only'/);
  assert.match(server, /rule_parser/);
  assert.match(client, /\/api\/system\?kind=ai-capture-draft/);
});

test('Quick AI Capture keeps the user confirmation gate', () => {
  const component = read('src/components/QuickAiCapture.tsx');

  assert.match(component, /Szybki szkic/);
  assert.match(component, /Zrób szkic/);
  assert.match(component, /Zatwierdź jako lead/);
  assert.match(component, /Zapisz szkic/);
  assert.match(component, /niczego nie zapisze bez Twojego potwierdzenia/);
  assert.match(component, /Tekst źródłowy zostaje widoczny/);
  assert.match(component, /insertLeadToSupabase/);
  assert.match(component, /insertTaskToSupabase/);
});

test('Leads page exposes Quick AI Capture as a lead intake action', () => {
  const leads = read('src/pages/Leads.tsx');

  assert.match(leads, /QuickAiCapture/);
  assert.match(leads, /onSaved=\{\(\) => void loadLeads\(\)\}/);
});
