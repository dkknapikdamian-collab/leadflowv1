const assert = require('node:assert/strict');
function assertSourceMatches(source, pattern, label) {
  assert.ok(pattern.test(source), label + ': missing ' + pattern);
}

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

test('AI assistant is available from global toolbar for daily plan lead lookup and lead capture intent', () => {
  const today = read('src/pages/Today.tsx');
  const layout = read('src/components/Layout.tsx');
  const globalQuickActions = read('src/components/GlobalQuickActions.tsx');
  const globalAssistant = read('src/components/GlobalAiAssistant.tsx');
  const component = read('src/components/TodayAiAssistant.tsx');
  const server = read('src/server/ai-assistant.ts');

  assertSourceMatches(today, /TODAY_GLOBAL_QUICK_ACTIONS_DEDUPED_V97/, 'today single-source marker');
  assert.doesNotMatch(today, /import\s+TodayAiAssistant/);
  assert.match(layout, /GlobalQuickActions/);
  assert.match(globalQuickActions, /GlobalAiAssistant/);
  assert.match(globalQuickActions, /data-global-quick-actions-contract/);
  assert.match(globalAssistant, /TodayAiAssistant/);
  assert.match(globalAssistant, /leads=\{context\.leads\}/);
  assert.match(globalAssistant, /tasks=\{context\.tasks\}/);
  assert.match(globalAssistant, /events=\{context\.events\}/);
  assert.match(globalAssistant, /cases=\{context\.cases\}/);
  assert.match(globalAssistant, /clients=\{context\.clients\}/);
  assert.match(component, /Asystent AI/);
  assert.match(component, /SpeechRecognition/);
  assert.match(component, /webkitSpeechRecognition/);
  assertSourceMatches(component, /Co mam dzi\u015B do zrobienia\?/, 'today assistant example');
  assertSourceMatches(component, /Dodaj leada: Pan Marek/, 'lead capture example copy');
  assert.match(component, /STAGE35_AI_ASSISTANT_COMPACT_UI/);
  assert.match(server, /today_briefing/);
  assert.match(server, /lead_lookup/);
  assert.match(server, /lead_capture/);
});
test('AI assistant writes tasks and events only behind explicit safety gate', () => {
  const localFs = require('node:fs');
  const localPath = require('node:path');
  const source = localFs.readFileSync(localPath.join(process.cwd(), 'src', 'components', 'TodayAiAssistant.tsx'), 'utf8');

  // AI_DIRECT_WRITE_TEST_CONTRACT_V79: leady nadal bez bezpo\u015Bredniego zapisu, zadania i wydarzenia tylko za bramk\u0105 bezpiecze\u0144stwa.
  assert.doesNotMatch(source, /insertLeadToSupabase/);
  assert.match(source, /AI_DIRECT_WRITE_MODE_STATE/);
  assert.match(source, /parseAiDirectWriteCommand/);
  assert.match(source, /direct_task_event/);
  assert.match(source, /getStoredAiDirectWriteMode/);
  assert.match(source, /persistAiDirectWriteMode/);
  assert.match(source, /insertTaskToSupabase/);
  assert.match(source, /insertEventToSupabase/);
});


test('AI assistant hard-blocks out-of-scope questions to protect usage limits', () => {
  const server = read('src/server/ai-assistant.ts');
  const client = read('src/lib/ai-assistant.ts');
  const component = read('src/components/TodayAiAssistant.tsx');

  assert.match(server, /ASSISTANT_ALLOWED_SCOPE/);
  assert.match(server, /buildOutOfScopeAnswer/);
  assert.match(server, /blocked_out_of_scope/);
  assert.match(server, /hardBlock: true/);
  assert.match(server, /Twarda blokada zakresu/);
  assert.match(server, /Nie odpowiadam na pytania og\u00F3lne/);
  assert.match(client, /blocked_out_of_scope/);
  assert.match(component, /Poza zakresem aplikacji/);
  assert.match(component, /Blokada zakresu/);
  assert.match(component, /Asystent dzia\u0142a tylko w obr\u0119bie CloseFlow/);
  assert.doesNotMatch(server, /OPENAI_API_KEY/);
  assert.doesNotMatch(server, /GEMINI_API_KEY/);
});

test('AI assistant test is included in quiet release gate', () => {
  const source = read('scripts/closeflow-release-check-quiet.cjs');
  assert.ok(source.includes("'tests/ai-assistant-command-center.test.cjs'"));
});
