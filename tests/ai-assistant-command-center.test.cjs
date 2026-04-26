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

test('AI assistant command center is consolidated under system API without a new Vercel function', () => {
  const system = read('api/system.ts');
  const server = read('src/server/ai-assistant.ts');
  const client = read('src/lib/ai-assistant.ts');

  assert.equal(exists('api/ai-assistant.ts'), false, 'assistant must not create a new api/*.ts function');
  assert.match(system, /aiAssistantHandler/);
  assert.match(system, /kind === 'ai-assistant'/);
  assert.match(client, /\/api\/system\?kind=ai-assistant/);
  assert.match(server, /scope: 'assistant_read_or_draft_only'/);
  assert.match(server, /noAutoWrite: true/);
});

test('Today exposes spoken AI assistant for daily plan lead lookup and lead capture intent', () => {
  const today = read('src/pages/Today.tsx');
  const component = read('src/components/TodayAiAssistant.tsx');
  const server = read('src/server/ai-assistant.ts');

  assert.match(today, /TodayAiAssistant/);
  assert.match(today, /leads=\{leads\}/);
  assert.match(today, /tasks=\{tasks\}/);
  assert.match(today, /events=\{events\}/);
  assert.match(component, /Asystent AI/);
  assert.match(component, /SpeechRecognition/);
  assert.match(component, /webkitSpeechRecognition/);
  assert.match(component, /Co mam dzisiaj zrobić/);
  assert.match(component, /Mam leada Warszawa/);
  assert.match(component, /Bez autopilota/);
  assert.match(server, /today_briefing/);
  assert.match(server, /lead_lookup/);
  assert.match(server, /lead_capture/);
});

test('AI assistant does not write records directly', () => {
  const component = read('src/components/TodayAiAssistant.tsx');
  const server = read('src/server/ai-assistant.ts');

  assert.doesNotMatch(component, /insertLeadToSupabase/);
  assert.doesNotMatch(component, /insertTaskToSupabase/);
  assert.doesNotMatch(component, /updateLeadInSupabase/);
  assert.doesNotMatch(server, /insertLeadToSupabase/);
  assert.doesNotMatch(server, /insertTaskToSupabase/);
  assert.doesNotMatch(server, /updateLeadInSupabase/);
});

test('AI assistant test is included in quiet release gate', () => {
  const source = read('scripts/closeflow-release-check-quiet.cjs');
  assert.ok(source.includes("'tests/ai-assistant-command-center.test.cjs'"));
});
