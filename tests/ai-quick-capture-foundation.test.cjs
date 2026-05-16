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
  assert.match(component, /Zr\u00F3b szkic/);
  assert.match(component, /Zatwierd\u017A jako lead/);
  assert.match(component, /Zapisz szkic/);
  assert.match(component, /niczego nie zapisze bez Twojego potwierdzenia/);
  assert.match(component, /Tekst \u017Ar\u00F3d\u0142owy zostaje widoczny/);
  assert.match(component, /insertLeadToSupabase/);
  assert.match(component, /insertTaskToSupabase/);
});

test('Leads page delegates Quick AI Capture to the global quick actions toolbar', () => {
  const leads = read('src/pages/Leads.tsx');
  const global = read('src/components/GlobalQuickActions.tsx');

  assert.match(global, /QuickAiCapture/);
  assert.match(global, /<QuickAiCapture\s*\/>/);
  assert.match(global, /data-global-quick-actions-contract="v97"/);
  assert.match(leads, /consumeGlobalQuickAction/);
  assert.match(leads, /consumeGlobalQuickAction\(\) === 'lead'/);
  assert.doesNotMatch(leads, /<QuickAiCapture\b/);
  assert.doesNotMatch(leads, /from '..\/components\/QuickAiCapture'/);
});
