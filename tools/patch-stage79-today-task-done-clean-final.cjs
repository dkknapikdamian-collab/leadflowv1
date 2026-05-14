const fs = require('node:fs');
const path = require('node:path');
const cp = require('node:child_process');
const root = process.cwd();
const p = (...parts) => path.join(root, ...parts);
const read = (file) => fs.readFileSync(p(file), 'utf8');
const write = (file, text) => fs.writeFileSync(p(file), text.replace(/\r\n/g, '\n'), 'utf8');
const ensureDir = (dir) => fs.mkdirSync(p(dir), { recursive: true });
function fail(msg) { console.error('STAGE79_CLEAN_FINAL_FAIL: ' + msg); process.exit(1); }
function ensurePackageScript(pkg, name, command) {
  if (!pkg.scripts) pkg.scripts = {};
  pkg.scripts[name] = command;
}
function ensureRequiredTest(quiet, testPath) {
  if (!quiet.includes('const requiredTests = [')) fail('quiet gate missing requiredTests array');
  if (quiet.includes(`'${testPath}'`)) return quiet;
  return quiet.replace('const requiredTests = [', `const requiredTests = [\n  '${testPath}',`);
}
function removeBadQuietEntries(quiet) {
  return quiet
    .replace(/\n\s*'test:stage79-today-task-done-action',/g, '')
    .replace(/\n\s*'check:stage79-today-task-done-action',/g, '')
    .replace(/\n\s*'test:stage79-release-gate-mass-guard',/g, '')
    .replace(/\n\s*'check:stage79-release-gate-mass-guard',/g, '');
}

ensureDir('scripts');
ensureDir('tests');

let today = read('src/pages/TodayStable.tsx');
const start = today.indexOf('function RowLink({');
const end = today.indexOf('async function loadStableTodayData');
if (start < 0) fail('cannot find RowLink start');
if (end < 0 || end <= start) fail('cannot find loadStableTodayData after RowLink');

const newRowLink = String.raw`function RowLink({
  to,
  title,
  meta,
  helper,
  badge,
  onDone,
  doneLabel,
  doneBusy,
  onEdit,
  onDelete,
  deleting,
  taskId,
  doneKind,
}: {
  key?: string;
  to: string;
  title: string;
  meta?: string;
  helper?: string;
  badge?: string;
  onDone?: () => void;
  doneLabel?: string;
  doneBusy?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  deleting?: boolean;
  taskId?: string;
  doneKind?: 'task' | 'event';
}) {
  const fb4TaskId = typeof to === 'string' && to.startsWith('/tasks/') ? (to.split('/').filter(Boolean).pop() || '') : '';
  const normalizedStage79TaskId = String(taskId || fb4TaskId || '').trim();
  const isStage79TaskRow = doneKind === 'task' || Boolean(fb4TaskId);
  const [stage79TaskDoneLocal, setStage79TaskDoneLocal] = useState(false);
  const [stage79TaskDoneSaving, setStage79TaskDoneSaving] = useState(false);

  async function markStage79TaskDoneFromRow() {
    if (!normalizedStage79TaskId || stage79TaskDoneSaving) return;
    setStage79TaskDoneSaving(true);
    try {
      await updateTaskInSupabase({ id: normalizedStage79TaskId, status: 'done' } as any);
      setStage79TaskDoneLocal(true);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('closeflow:today:mark-task-done', { detail: { id: normalizedStage79TaskId, stage79Done: true } }));
        window.dispatchEvent(new CustomEvent('closeflow:data-mutated', { detail: { entity: 'task', id: normalizedStage79TaskId, action: 'done', source: 'today' } }));
      }
    } catch (error) {
      console.error('Nie udało się oznaczyć zadania jako zrobione z panelu Dziś.', error);
    } finally {
      setStage79TaskDoneSaving(false);
    }
  }

  if (stage79TaskDoneLocal) return null;

  return (
    <div className="border-b border-slate-100 last:border-b-0 transition hover:bg-slate-50">
      <div className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Link to={to} className="font-semibold text-slate-900 break-words hover:underline">
              {title}
            </Link>
            {badge ? (
              <Badge variant="outline" className="cf-status-pill rounded-full" data-cf-status-tone={semanticBadgeTone(badge)}>
                {badge}
              </Badge>
            ) : null}
          </div>
          {helper ? <p className="mt-1 text-sm text-slate-600 break-words">{helper}</p> : null}
          {meta ? (
            <p className="mt-1 text-xs font-medium text-slate-500">
              {meta.startsWith('Ruch:') ? (
                <>
                  <span className="font-semibold text-blue-700">Ruch:</span>
                  {' ' + meta.slice(5).trim()}
                </>
              ) : meta}
            </p>
          ) : null}
        </div>
        <div className="flex items-center gap-2">
          {onDone ? (
            <Button
              type="button"
              size="sm"
              variant="outline"
              data-stage76-event-done-action="true"
              disabled={doneBusy}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                onDone();
              }}
            >
              {doneBusy ? 'Zapisywanie...' : (doneLabel || 'Zrobione')}
            </Button>
          ) : null}
          {!onDone && isStage79TaskRow ? (
            <Button
              type="button"
              size="sm"
              variant="outline"
              data-stage79-task-done-action="true"
              disabled={!normalizedStage79TaskId || stage79TaskDoneSaving}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                void markStage79TaskDoneFromRow();
              }}
            >
              {stage79TaskDoneSaving ? 'Zapisywanie...' : 'Zrobione'}
            </Button>
          ) : null}
          {onEdit ? <Button type="button" size="sm" variant="outline" onClick={onEdit}>Edytuj</Button> : null}
          {onDelete ? (
            <EntityActionButton
              type="button"
              size="sm"
              variant="ghost"
              tone="danger"
              onClick={onDelete}
              disabled={deleting}
              aria-label={deleting ? 'Usuwanie' : 'Kosz'}
              title={deleting ? 'Usuwanie' : 'Kosz'}
            >
              {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
            </EntityActionButton>
          ) : null}
          <Link to={to} className="inline-flex items-center rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
            <ArrowRight className="h-4 w-4 shrink-0" />
          </Link>
        </div>
      </div>
    </div>
  );
}

`;

today = today.slice(0, start) + newRowLink + today.slice(end);

// Best-effort: if the task mapping renders RowLink from task object, pass taskId/doneKind explicitly.
today = today.replace(/<RowLink\s+([\s\S]*?title=\{getTaskTitle\(task\)\}([\s\S]*?)\/\>)/g, (match) => {
  let next = match;
  if (!next.includes('taskId=')) next = next.replace('<RowLink', '<RowLink\n                      taskId={String(task.id)}');
  if (!next.includes('doneKind=')) next = next.replace('<RowLink', '<RowLink\n                      doneKind="task"');
  return next;
});

if (!today.includes('markStage79TaskDoneFromRow')) fail('RowLink patch did not add markStage79TaskDoneFromRow');
if (!today.includes("status: 'done'")) fail('RowLink patch did not add done status write');
if (!today.includes('data-stage79-task-done-action')) fail('RowLink patch did not add stage79 data marker');
write('src/pages/TodayStable.tsx', today);

const checkStage79 = String.raw`const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
function read(file) { return fs.readFileSync(path.join(root, file), 'utf8'); }
function fail(message) { console.error('STAGE79_TODAY_TASK_DONE_ACTION_FAIL: ' + message); process.exit(1); }
const today = read('src/pages/TodayStable.tsx');
const requiredTokens = [
  'function RowLink({',
  'taskId?: string;',
  "doneKind?: 'task' | 'event';",
  'normalizedStage79TaskId',
  'stage79TaskDoneLocal',
  'stage79TaskDoneSaving',
  'markStage79TaskDoneFromRow',
  'updateTaskInSupabase',
  "status: 'done'",
  'data-stage79-task-done-action',
  'setStage79TaskDoneLocal(true)',
  'stage79Done: true',
];
for (const token of requiredTokens) {
  if (!today.includes(token)) fail('TodayStable missing task done token: ' + token);
}
if (!today.includes('isClosedStatus(value: unknown)')) fail('TodayStable lost closed status helper');
if (!today.includes("status === 'done'")) fail('isClosedStatus must still treat done as closed');
const pkg = JSON.parse(read('package.json'));
if (!pkg.scripts['check:stage79-today-task-done-action']) fail('package missing Stage79 check script');
if (!pkg.scripts['test:stage79-today-task-done-action']) fail('package missing Stage79 test script');
const quiet = read('scripts/closeflow-release-check-quiet.cjs');
if (!quiet.includes("tests/stage79-today-task-done-action.test.cjs")) fail('quiet gate missing Stage79 test path');
console.log('OK stage79 today task done action');
`;
write('scripts/check-stage79-today-task-done-action.cjs', checkStage79);

const testStage79 = String.raw`const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const cp = require('node:child_process');
const root = path.resolve(__dirname, '..');
function read(file) { return fs.readFileSync(path.join(root, file), 'utf8'); }
function nodeCheck(file) {
  const result = cp.spawnSync(process.execPath, ['--check', file], { cwd: root, encoding: 'utf8' });
  assert.equal(result.status, 0, file + '\n' + result.stdout + result.stderr);
}
test('Stage79 checker and quiet runner are syntactically valid', () => {
  nodeCheck('scripts/check-stage79-today-task-done-action.cjs');
  nodeCheck('scripts/closeflow-release-check-quiet.cjs');
});
test('RowLink owns task done action without route-only custom event dependency', () => {
  const text = read('src/pages/TodayStable.tsx');
  assert.ok(text.includes('normalizedStage79TaskId'));
  assert.ok(text.includes('markStage79TaskDoneFromRow'));
  assert.ok(text.includes("status: 'done'"));
  assert.ok(text.includes('updateTaskInSupabase'));
  assert.ok(text.includes('data-stage79-task-done-action'));
  assert.ok(text.includes('setStage79TaskDoneLocal(true)'));
});
test('Stage79 guard passes current repo and is wired into package scripts', () => {
  const result = cp.spawnSync(process.execPath, ['scripts/check-stage79-today-task-done-action.cjs'], { cwd: root, encoding: 'utf8' });
  assert.equal(result.status, 0, result.stdout + result.stderr);
  const pkg = JSON.parse(read('package.json'));
  assert.equal(pkg.scripts['check:stage79-today-task-done-action'], 'node scripts/check-stage79-today-task-done-action.cjs');
  assert.equal(pkg.scripts['test:stage79-today-task-done-action'], 'node --test tests/stage79-today-task-done-action.test.cjs');
});
`;
write('tests/stage79-today-task-done-action.test.cjs', testStage79);

const massGuard = String.raw`const fs = require('node:fs');
const path = require('node:path');
const cp = require('node:child_process');
const root = path.resolve(__dirname, '..');
function read(file) { return fs.readFileSync(path.join(root, file), 'utf8'); }
function fail(message) { console.error('STAGE79_RELEASE_GATE_MASS_GUARD_FAIL: ' + message); process.exit(1); }
function nodeCheck(file) {
  const result = cp.spawnSync(process.execPath, ['--check', file], { cwd: root, encoding: 'utf8' });
  if (result.status !== 0) fail('node --check failed for ' + file + '\n' + result.stdout + result.stderr);
}
for (const file of [
  'scripts/check-stage79-today-task-done-action.cjs',
  'tests/stage79-today-task-done-action.test.cjs',
  'scripts/check-stage79-release-gate-mass-guard.cjs',
  'tests/stage79-release-gate-mass-guard.test.cjs',
  'scripts/closeflow-release-check-quiet.cjs',
]) {
  if (fs.existsSync(path.join(root, file))) nodeCheck(file);
}
const pkg = JSON.parse(read('package.json'));
for (const [name, value] of Object.entries(pkg.scripts || {})) {
  if (name.startsWith('test:stage') && typeof value === 'string' && !value.includes('node --test tests/')) {
    fail('stage test script should point to tests/*.test.cjs: ' + name);
  }
}
const quiet = read('scripts/closeflow-release-check-quiet.cjs');
if (quiet.includes("'test:stage")) fail('quiet requiredTests contains npm script name instead of test path');
if (quiet.includes("'check:stage")) fail('quiet requiredTests contains check script name instead of test path');
for (const required of [
  'tests/stage79-today-task-done-action.test.cjs',
  'tests/stage79-release-gate-mass-guard.test.cjs',
]) {
  if (!quiet.includes(required)) fail('quiet gate missing ' + required);
}
const today = read('src/pages/TodayStable.tsx');
if (!today.includes('data-stage79-task-done-action')) fail('TodayStable missing Stage79 DOM marker');
if (!today.includes("status: 'done'")) fail('TodayStable missing done status write');
console.log('OK stage79 release gate mass guard');
`;
write('scripts/check-stage79-release-gate-mass-guard.cjs', massGuard);

const massTest = String.raw`const assert = require('node:assert/strict');
const cp = require('node:child_process');
const test = require('node:test');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
test('Stage79 mass guard passes current repo', () => {
  const result = cp.spawnSync(process.execPath, ['scripts/check-stage79-release-gate-mass-guard.cjs'], { cwd: root, encoding: 'utf8' });
  assert.equal(result.status, 0, result.stdout + result.stderr);
});
`;
write('tests/stage79-release-gate-mass-guard.test.cjs', massTest);

let pkg = JSON.parse(read('package.json'));
ensurePackageScript(pkg, 'check:stage79-today-task-done-action', 'node scripts/check-stage79-today-task-done-action.cjs');
ensurePackageScript(pkg, 'test:stage79-today-task-done-action', 'node --test tests/stage79-today-task-done-action.test.cjs');
ensurePackageScript(pkg, 'check:stage79-release-gate-mass-guard', 'node scripts/check-stage79-release-gate-mass-guard.cjs');
ensurePackageScript(pkg, 'test:stage79-release-gate-mass-guard', 'node --test tests/stage79-release-gate-mass-guard.test.cjs');
write('package.json', JSON.stringify(pkg, null, 2) + '\n');

let quiet = read('scripts/closeflow-release-check-quiet.cjs');
quiet = removeBadQuietEntries(quiet);
quiet = ensureRequiredTest(quiet, 'tests/stage79-today-task-done-action.test.cjs');
quiet = ensureRequiredTest(quiet, 'tests/stage79-release-gate-mass-guard.test.cjs');
write('scripts/closeflow-release-check-quiet.cjs', quiet);

for (const file of [
  'scripts/check-stage79-today-task-done-action.cjs',
  'tests/stage79-today-task-done-action.test.cjs',
  'scripts/check-stage79-release-gate-mass-guard.cjs',
  'tests/stage79-release-gate-mass-guard.test.cjs',
  'scripts/closeflow-release-check-quiet.cjs',
]) {
  const result = cp.spawnSync(process.execPath, ['--check', file], { cwd: root, encoding: 'utf8' });
  if (result.status !== 0) fail('syntax check failed for ' + file + '\n' + result.stdout + result.stderr);
}
console.log('OK: Stage79 clean final patch applied.');
