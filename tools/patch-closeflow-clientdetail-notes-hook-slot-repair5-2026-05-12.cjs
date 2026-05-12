const fs = require('fs');
const path = require('path');

const root = process.cwd();
const clientPath = path.join(root, 'src/pages/ClientDetail.tsx');
const packagePath = path.join(root, 'package.json');
const checkPath = path.join(root, 'scripts/check-closeflow-clientdetail-notes-hook-slot-repair5.cjs');
const docPath = path.join(root, 'docs/release/CLOSEFLOW_CLIENTDETAIL_NOTES_HOOK_SLOT_REPAIR5_2026-05-12.md');

function read(file) { return fs.readFileSync(file, 'utf8'); }
function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content, 'utf8');
}
function fail(message) { throw new Error(message); }

if (!fs.existsSync(clientPath)) fail('Missing src/pages/ClientDetail.tsx');
let source = read(clientPath);

const loadingNeedle = 'if (loading || workspaceLoading) {';
const loadingStart = source.indexOf(loadingNeedle);
if (loadingStart < 0) fail('ClientDetail loading branch is missing after restore. Stop before patching.');
const noteHookStart = source.indexOf('const clientNotesStage14A = useMemo(() => {', loadingStart);
if (noteHookStart < 0) fail('clientNotesStage14A hook is missing after loading branch.');
const loadingBranch = source.slice(loadingStart, noteHookStart);
if (!loadingBranch.includes('client-detail-loading-card')) fail('Loading branch card not found before clientNotesStage14A.');

const nullHook = 'useMemo(() => null, []);';
const safeHook = 'useMemo(() => [], [activities, client?.id, clientId, id]);';
if (source.includes(nullHook)) {
  source = source.replace(nullHook, safeHook);
} else if (!source.includes(safeHook)) {
  fail('Neither null hook nor safe hook found. Manual inspection required.');
}

// Make direct note render calls safe even if a future hook/cache regression returns null.
source = source.replaceAll(
  'getClientNotesForRender(getClientVisibleNotes(activities, client), clientPinnedNoteIds).length',
  '(getClientNotesForRender(getClientVisibleNotes(activities, client), clientPinnedNoteIds) || []).length'
);
source = source.replaceAll(
  'getClientNotesForRender(getClientVisibleNotes(activities, client), clientPinnedNoteIds).map(',
  '(getClientNotesForRender(getClientVisibleNotes(activities, client), clientPinnedNoteIds) || []).map('
);
source = source.replaceAll(
  'clientNotesStage14A.length > 0',
  '(Array.isArray(clientNotesStage14A) ? clientNotesStage14A : []).length > 0'
);
source = source.replaceAll(
  'clientNotesStage14A.slice(0, 5).map(',
  '(Array.isArray(clientNotesStage14A) ? clientNotesStage14A : []).slice(0, 5).map('
);

write(clientPath, source);

const check = `const fs = require('fs');
const path = require('path');
const source = fs.readFileSync(path.join(process.cwd(), 'src/pages/ClientDetail.tsx'), 'utf8');
const loadingNeedle = 'if (loading || workspaceLoading) {';
const loadingStart = source.indexOf(loadingNeedle);
if (loadingStart < 0) throw new Error('Missing ClientDetail loading branch.');
const noteHookStart = source.indexOf('const clientNotesStage14A = useMemo(() => {', loadingStart);
if (noteHookStart < 0) throw new Error('Missing clientNotesStage14A hook after loading branch.');
const loadingBranch = source.slice(loadingStart, noteHookStart);
if (source.includes('useMemo(() => null, []);')) throw new Error('Forbidden null hook padding still exists.');
if (!loadingBranch.includes('useMemo(() => [], [activities, client?.id, clientId, id]);')) throw new Error('Loading branch must use safe empty array hook slot.');
if (!loadingBranch.includes('client-detail-loading-card')) throw new Error('Loading branch card missing.');
if (!source.includes('(Array.isArray(clientNotesStage14A) ? clientNotesStage14A : []).length > 0')) throw new Error('clientNotesStage14A length guard missing.');
if (!source.includes('(Array.isArray(clientNotesStage14A) ? clientNotesStage14A : []).slice(0, 5).map(')) throw new Error('clientNotesStage14A slice/map guard missing.');
console.log('OK closeflow-clientdetail-notes-hook-slot-repair5: ClientDetail note hook slot and note lists are null-safe.');
`;
write(checkPath, check);

const doc = `# CLOSEFLOW_CLIENTDETAIL_NOTES_HOOK_SLOT_REPAIR5_2026-05-12

## Goal

Fix ClientDetail production crash: Cannot read properties of null (reading 'length') in the notes panel.

## Finding

The deployed bundle pointed at the notes area. The loading branch previously used a dummy hook slot returning null:

\`\`\`tsx
useMemo(() => null, []);
\`\`\`

The loaded branch then used the same hook slot for \`clientNotesStage14A\`, which is later read with \`.length\`. This can leave a null value in the slot and crash the route.

## Change

- Restore ClientDetail from origin/dev-rollout-freeze before patching to remove broken failed patch leftovers.
- Replace dummy null hook with a safe empty-array hook slot.
- Guard client note render calls against non-array values.
- Keep the previous loading null-safe check for finance summary.

## Checks

- npm run check:closeflow-clientdetail-notes-hook-slot-repair5
- npm run check:closeflow-clientdetail-loading-null-safe
- npm run build
`;
write(docPath, doc);

const pkg = JSON.parse(read(packagePath));
pkg.scripts = pkg.scripts || {};
pkg.scripts['check:closeflow-clientdetail-notes-hook-slot-repair5'] = 'node scripts/check-closeflow-clientdetail-notes-hook-slot-repair5.cjs';
write(packagePath, JSON.stringify(pkg, null, 2) + '\n');

console.log('OK patch-closeflow-clientdetail-notes-hook-slot-repair5: applied safe hook slot repair.');
