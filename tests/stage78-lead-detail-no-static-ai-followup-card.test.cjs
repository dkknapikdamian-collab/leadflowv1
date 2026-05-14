const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}
function runNode(args) {
  return spawnSync(process.execPath, args, { cwd: root, encoding: 'utf8' });
}

test('Stage78 checker and quiet runner are syntactically valid', () => {
  for (const file of [
    'scripts/check-stage78-lead-detail-no-static-ai-followup-card.cjs',
    'tests/stage78-lead-detail-no-static-ai-followup-card.test.cjs',
    'scripts/closeflow-release-check-quiet.cjs',
  ]) {
    const result = runNode(['--check', file]);
    assert.equal(result.status, 0, file + '\n' + result.stderr);
  }
});

test('Stage78 guard passes current repo', () => {
  const result = runNode(['scripts/check-stage78-lead-detail-no-static-ai-followup-card.cjs']);
  assert.equal(result.status, 0, result.stdout + result.stderr);
});

test('LeadDetail no longer imports or renders the static AI follow-up card', () => {
  const leadDetail = read('src/pages/LeadDetail.tsx');
  assert.equal(leadDetail.includes("from '../components/LeadAiFollowupDraft'"), false);
  assert.equal(leadDetail.includes('from "../components/LeadAiFollowupDraft"'), false);
  assert.equal(leadDetail.includes('<LeadAiFollowupDraft'), false);
  assert.equal(leadDetail.includes('data-ai-followup-draft-card='), false);
});

test('AI follow-up capability remains available outside the static LeadDetail rail', () => {
  const component = read('src/components/LeadAiFollowupDraft.tsx');
  const aiLib = read('src/lib/ai-followup.ts');
  assert.ok(component.includes('data-ai-followup-draft-card="true"'));
  assert.ok(component.includes('AI follow-up'));
  assert.ok(component.includes('Szkic odpowiedzi'));
  assert.ok(aiLib.includes('createLeadFollowupDraft'));
});

test('Stage78 is wired into package scripts and quiet verify gate', () => {
  const pkg = JSON.parse(read('package.json'));
  const quietRunner = read('scripts/closeflow-release-check-quiet.cjs');
  assert.equal(pkg.scripts['check:stage78-lead-detail-no-static-ai-followup-card'], 'node scripts/check-stage78-lead-detail-no-static-ai-followup-card.cjs');
  assert.equal(pkg.scripts['test:stage78-lead-detail-no-static-ai-followup-card'], 'node --test tests/stage78-lead-detail-no-static-ai-followup-card.test.cjs');
  assert.ok(quietRunner.includes("'tests/stage78-lead-detail-no-static-ai-followup-card.test.cjs'"));
});
