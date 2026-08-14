const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const root = process.cwd();
const sourcePath = 'src/pages/ClientDetail.tsx';
const baseSha = '4c76155e';

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8').replace(/\r\n/g, '\n');
}

function readFromGit(spec) {
  return execFileSync('git', ['show', spec], { cwd: root, encoding: 'utf8' }).replace(/\r\n/g, '\n');
}

const current = read(sourcePath);
const base = readFromGit(`${baseSha}:${sourcePath}`);
const modalStart = current.indexOf('<MissingItemQuickActionModal');
const modalEnd = current.indexOf('/>', modalStart);
const modalCall = current.slice(modalStart, modalEnd);
const saveStart = current.indexOf('const handleSaveClientMissingItemStage227C3B');
const saveEnd = current.indexOf('\n\n\n  const handleToggleClientMissingBlockerStage232I4R13F', saveStart);
const saveHandler = current.slice(saveStart, saveEnd);
const persistencePaths = saveHandler.slice(saveHandler.indexOf('const stage232aMissingItemMetadata = {'));

assert(!base.includes('missingKindValue={clientMissingKind}'), 'fail-first base must lack the new modal metadata props');
assert(!base.includes('missingKind: clientMissingKind'), 'fail-first base must lack explicit draft metadata wiring');
assert(modalStart >= 0 && modalEnd > modalStart, 'ClientDetail shared missing-item modal call must remain present');
for (const token of [
  'missingKindValue={clientMissingKind}',
  'blocksProgressValue={clientMissingBlocksProgress}',
  'blockScopeValue={clientMissingBlockScope}',
  'onMissingKindChange={setClientMissingKind}',
  'onBlocksProgressChange={setClientMissingBlocksProgress}',
  'onBlockScopeChange={setClientMissingBlockScope}',
]) {
  assert(modalCall.includes(token), `modal call lost required canonical prop: ${token}`);
}

for (const token of [
  "import { buildMissingItemModalDraft, type MissingItemKind }",
  "useState<MissingItemKind>('document')",
  'const [clientMissingBlockScope, setClientMissingBlockScope] = useState(\'\');',
  'missingKind: clientMissingKind,',
  'blocksProgress: clientMissingBlocksProgress,',
  'blockScope: clientMissingBlockScope,',
  'const stage232aMissingItemMetadata = {',
  'missingKind: draft.missingKind,',
  'blocksProgress: draft.blocksProgress,',
  'blockScope: draft.blockScope || null,',
]) {
  assert(current.includes(token), `ClientDetail lost canonical metadata wiring: ${token}`);
}

assert((saveHandler.match(/\.\.\.stage232aMissingItemMetadata/g) || []).length === 6, 'metadata must be preserved in task, activity and all optimistic paths');
assert((saveHandler.match(/status: draft\.blocksProgress \?/g) || []).length === 5, 'all saved/optimistic status derivations must use the canonical draft flag');
assert(!persistencePaths.includes('blocksProgress: clientMissingBlocksProgress'), 'persistence paths must not persist raw pre-draft blocker state');
assert(current.includes("setClientMissingKind('document');"), 'missing kind must reset after open/cancel/success');
assert(current.includes("setClientMissingBlockScope('');"), 'block scope must reset after open/cancel/success');
assert(current.includes("import { MissingItemQuickActionModal } from '../components/detail/MissingItemQuickActionModal';"), 'ClientDetail must keep the shared modal as the single component owner');
assert(!current.includes('@ts-ignore') && !current.includes('@ts-expect-error'), 'A2-12 must not add TypeScript bypass directives');

console.log('PASS: A2-12 wires ClientDetail through the canonical missing-item metadata contract and preserves all persistence paths.');
