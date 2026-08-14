const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const test = require('node:test');

const root = process.cwd();
const sourcePath = 'src/pages/ClientDetail.tsx';
const guardPath = 'scripts/check-lf-prod-sot-g15-r23m-12-client-missing-modal-metadata.cjs';

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8').replace(/\r\n/g, '\n');
}

test('A2-12 focused guard passes', () => {
  const output = execFileSync(process.execPath, [guardPath], { cwd: root, encoding: 'utf8' });
  assert.match(output, /PASS: A2-12/);
});

test('A2-12 passes explicit kind, blocker and scope through the shared modal', () => {
  const source = read(sourcePath);
  assert.match(source, /const \[clientMissingKind, setClientMissingKind\] = useState<MissingItemKind>\('document'\)/);
  assert.match(source, /missingKindValue=\{clientMissingKind\}/);
  assert.match(source, /blocksProgressValue=\{clientMissingBlocksProgress\}/);
  assert.match(source, /blockScopeValue=\{clientMissingBlockScope\}/);
  assert.match(source, /onMissingKindChange=\{setClientMissingKind\}/);
  assert.match(source, /onBlocksProgressChange=\{setClientMissingBlocksProgress\}/);
  assert.match(source, /onBlockScopeChange=\{setClientMissingBlockScope\}/);
});

test('A2-12 gives the canonical draft the current UI values and preserves metadata', () => {
  const source = read(sourcePath);
  assert.match(source, /missingKind: clientMissingKind,\n\s+blocksProgress: clientMissingBlocksProgress,\n\s+blockScope: clientMissingBlockScope,/);
  assert.match(source, /const stage232aMissingItemMetadata = \{[\s\S]*?missingKind: draft\.missingKind,[\s\S]*?blocksProgress: draft\.blocksProgress,[\s\S]*?blockScope: draft\.blockScope \|\| null,/);
  assert.equal((source.match(/\.\.\.stage232aMissingItemMetadata/g) || []).length, 6);
});

test('A2-12 does not weaken the shared modal contract or create a second owner', () => {
  const source = read(sourcePath);
  assert.match(source, /import \{ MissingItemQuickActionModal \} from '..\/components\/detail\/MissingItemQuickActionModal';/);
  assert.equal((source.match(/<MissingItemQuickActionModal/g) || []).length, 1);
  assert.doesNotMatch(source, /@ts-(?:ignore|expect-error)/);
});
