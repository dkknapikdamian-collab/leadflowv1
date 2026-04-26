const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const repoRoot = path.resolve(__dirname, '..');
function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

test('AI next action can create a confirmed follow-up task without autopilot', () => {
  const component = read('src/components/LeadAiNextAction.tsx');

  assert.ok(component.includes('insertTaskToSupabase'), 'component should create a task only after user click');
  assert.ok(component.includes('requireWorkspaceId'), 'component should keep workspace scoping');
  assert.ok(component.includes('handleCreateSuggestedTask'), 'component should expose explicit confirmed creation handler');
  assert.ok(component.includes('Utwórz zadanie'), 'UI should have a clear create task action');
  assert.ok(component.includes('Zadanie z sugestii AI utworzone'), 'success copy should confirm user-triggered task creation');
  assert.ok(component.includes('onTaskCreated?.()'), 'parent view should refresh after task creation');
  assert.ok(!component.includes('useEffect(() => {\n    handleCreateSuggestedTask'), 'task creation must not run automatically');
});

test('Lead detail refreshes after creating a task from AI suggestion', () => {
  const source = read('src/pages/LeadDetail.tsx');

  assert.ok(source.includes('onTaskCreated={() => void loadLead()}'), 'LeadDetail should refresh lead data after AI-created task');
});

test('AI next action create-task test is included in quiet release gate', () => {
  const source = read('scripts/closeflow-release-check-quiet.cjs');
  assert.ok(source.includes("'tests/ai-next-action-create-task.test.cjs'"));
});
