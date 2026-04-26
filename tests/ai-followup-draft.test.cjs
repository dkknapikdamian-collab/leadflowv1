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

test('AI follow-up draft is consolidated under system API without creating a new Vercel function', () => {
  const system = read('api/system.ts');
  const server = read('src/server/ai-followup.ts');
  const client = read('src/lib/ai-followup.ts');

  assert.equal(exists('api/ai-followup.ts'), false, 'follow-up AI must not create a new api/*.ts function');
  assert.match(system, /aiFollowupHandler/);
  assert.match(system, /kind === 'ai-followup-draft'/);
  assert.match(server, /scope: 'draft_only'/);
  assert.match(server, /noAutoSend: true/);
  assert.match(client, /\/api\/system\?kind=ai-followup-draft/);
});

test('Lead detail exposes AI follow-up as a draft-only copy flow', () => {
  const component = read('src/components/LeadAiFollowupDraft.tsx');
  const detail = read('src/pages/LeadDetail.tsx');

  assert.match(detail, /LeadAiFollowupDraft/);
  assert.match(component, /AI niczego nie wysyła automatycznie/);
  assert.match(component, /Szkic do potwierdzenia/);
  assert.match(component, /Kopiuj treść/);
  assert.doesNotMatch(component, /sendEmail/i);
  assert.doesNotMatch(component, /autoSend/i);
  assert.doesNotMatch(component, /GEMINI_API_KEY/);
});

test('AI follow-up draft test is included in quiet release gate', () => {
  const source = read('scripts/closeflow-release-check-quiet.cjs');
  assert.ok(source.includes("'tests/ai-followup-draft.test.cjs'"));
});
