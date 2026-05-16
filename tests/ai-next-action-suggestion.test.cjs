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

test('AI next action is consolidated under system API without creating a new Vercel function', () => {
  const system = read('api/system.ts');
  const server = read('src/server/ai-next-action.ts');
  const client = read('src/lib/ai-next-action.ts');

  assert.equal(exists('api/ai-next-action.ts'), false, 'next action AI must not create a new api/*.ts function');
  assert.match(system, /aiNextActionHandler/);
  assert.match(system, /kind === 'ai-next-action'/);
  assert.match(server, /scope: 'suggestion_only'/);
  assert.match(server, /noAutoWrite: true/);
  assert.match(client, /\/api\/system\?kind=ai-next-action/);
});

test('Lead detail exposes AI next action as a controlled suggestion flow', () => {
  const component = read('src/components/LeadAiNextAction.tsx');
  const detail = read('src/pages/LeadDetail.tsx');

  assert.match(detail, /LeadAiNextAction/);
  assert.match(component, /AI niczego nie tworzy bez Twojego klikni\u0119cia/);
  assert.match(component, /Tylko sugestia/);
  assert.match(component, /Kopiuj plan/);
  assert.match(component, /Utw\u00F3rz zadanie/);
  assert.match(component, /handleCreateSuggestedTask/);
  assert.match(component, /insertTaskToSupabase/);
  assert.doesNotMatch(component, /useEffect\s*\(.*handleCreateSuggestedTask/s);
  assert.doesNotMatch(component, /autoCreate/i);
  assert.doesNotMatch(component, /GEMINI_API_KEY/);
});

test('AI next action test is included in quiet release gate', () => {
  const source = read('scripts/closeflow-release-check-quiet.cjs');
  assert.ok(source.includes("'tests/ai-next-action-suggestion.test.cjs'"));
});
