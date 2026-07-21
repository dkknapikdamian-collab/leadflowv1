const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const sourcePath = path.join(root, 'src/components/ContextActionDialogs.tsx');
const guardPath = path.join(root, 'scripts/check-g15-r23d-context-action-case-source-narrowing.cjs');
const source = fs.readFileSync(sourcePath, 'utf8');

test('R23D focused guard passes', () => {
  const result = spawnSync(process.execPath, [guardPath], { cwd: root, encoding: 'utf8' });
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  assert.match(result.stdout, /PASS: R23D/);
});

test('case branch uses the runtime-equivalent fixed source literal', () => {
  const caseStart = source.indexOf("if (request.recordType === 'case') {");
  const elseStart = source.indexOf('      } else {', caseStart);
  assert.ok(caseStart >= 0 && elseStart > caseStart);
  const caseBranch = source.slice(caseStart, elseStart);
  assert.match(caseBranch, /source: 'context_action_dialogs_blocker',/);
  assert.doesNotMatch(caseBranch, /request\.recordType === 'client'/);
});

test('valid client narrowing outside the case branch remains', () => {
  assert.match(source, /const clientId = request\.clientId \|\| \(request\.recordType === 'client' \? request\.recordId : null\);/);
});

test('R23D leaves the next no-flicker mutation type debt untouched', () => {
  assert.match(source, /item: createdMissingTaskRecordStage232N,/);
  assert.match(source, /record: createdMissingTaskRecordStage232N,/);
});
