const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const test = require('node:test');

const root = process.cwd();
const sourcePath = 'src/lib/missing-items/stage227c2-missing-item-modal-contract.ts';
const guardPath = 'scripts/check-lf-prod-sot-g15-r23m-05-missing-item-union.cjs';
const baseSha = 'f8ff90de';

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8').replace(/\r\n/g, '\n');
}

test('A2-05 guard passes for explicit missing-item union narrowing', () => {
  const output = execFileSync(process.execPath, [guardPath], { cwd: root, encoding: 'utf8' });
  assert.match(output, /PASS: A2-05/);
});

test('A2-05 changes only the discriminant check', () => {
  const base = execFileSync('git', ['show', `${baseSha}:${sourcePath}`], { cwd: root, encoding: 'utf8' }).replace(/\r\n/g, '\n');
  const current = read(sourcePath);
  assert.equal(current, base.replace('if (!result.ok)', 'if (result.ok === false)'));
  assert.equal(current.includes('if (!result.ok)'), false);
  assert.equal((current.match(/result\.ok === false/g) || []).length, 1);
});

test('A2-05 preserves missing-item validation and persistence semantics', () => {
  const runtimeScript = [
    "import { buildMissingItemModalDraft } from './src/lib/missing-items/stage227c2-missing-item-modal-contract.ts';",
    "const context = { entityType: 'case', entityId: 'case-1', entityLabel: 'Case' };",
    "const draft = buildMissingItemModalDraft(context, { title: '  Umowa  ', missingKind: 'document', blocksProgress: true, blockScope: 'start' });",
    "if (draft.title !== 'Umowa' || draft.persistenceTarget !== 'case_items' || draft.blocksProgress !== true) process.exit(1);",
    "let failed = false; try { buildMissingItemModalDraft(context, { title: '   ' }); } catch (error) { failed = error instanceof Error && error.message === 'Wpisz, czego brakuje.'; }",
    "if (!failed) process.exit(1);",
  ].join(' ');
  execFileSync(process.execPath, [path.join(root, 'node_modules', 'tsx', 'dist', 'cli.cjs'), '--eval', runtimeScript], {
    cwd: root,
    encoding: 'utf8',
  });
});
