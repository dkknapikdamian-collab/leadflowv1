const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync, spawnSync } = require('node:child_process');

const root = process.cwd();
const vault = path.resolve(root, '..', '00_OBSIDIAN_VAULT');
const mapBase = path.join(vault, '10_PROJEKTY', 'CloseFlow_Lead_App', '04_NAPRAWA_ZRODLA_PRAWDY');

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

function git(args, cwd = root) {
  return execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
}

test('G5 guard passes', () => {
  const result = spawnSync(
    process.execPath,
    [path.join(root, 'scripts', 'guards', 'verify-lf-prod-sot-g5-gcal-calendar-boundary-gap-map.cjs')],
    { cwd: root, encoding: 'utf8' },
  );
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  assert.match(result.stdout, /GCAL CALENDAR BOUNDARY GAP MAP: PASS/);
});

test('G5 package alias is exact', () => {
  const pkg = JSON.parse(read(path.join(root, 'package.json')));
  assert.equal(
    pkg.scripts['verify:lf-prod-sot-g5'],
    'node scripts/guards/verify-lf-prod-sot-g5-gcal-calendar-boundary-gap-map.cjs && node --test tests/lf-prod-sot-g5-gcal-calendar-boundary-gap-map.test.cjs',
  );
});

test('Calendar is local-first with background inbound and no outbound callsite', () => {
  const items = read(path.join(root, 'src', 'lib', 'calendar-items.ts'));
  const page = read(path.join(root, 'src', 'pages', 'Calendar.tsx'));
  assert.match(items, /GOOGLE_CALENDAR_STAGE10K_INBOUND_PULL_THROTTLE_MS\s*=\s*60_000/);
  assert.match(items, /syncGoogleCalendarInboundInSupabase\(\{/);
  assert.match(items, /GOOGLE_CALENDAR_STAGE120_BACKGROUND_INBOUND_PULL_FAILED/);
  assert.match(page, /syncGoogleCalendarInboundForCalendar/);
  assert.doesNotMatch(page, /syncGoogleCalendarOutboundInSupabase|route=sync-outbound/);
});

test('Settings owns the explicit manual outbound action', () => {
  const settings = read(path.join(root, 'src', 'pages', 'Settings.tsx'));
  assert.match(settings, /fetch\('\/api\/google-calendar\?route=sync-outbound'/);
  assert.match(settings, /mode:\s*'all',\s*limit:\s*200,\s*daysBack:\s*30,\s*daysForward:\s*365/);
});

test('task and event mutation routes have no automatic outbound or pending transition', () => {
  for (const file of ['task-route-stage124f.ts', 'event-route-stage124f.ts']) {
    const text = read(path.join(root, 'src', 'server', file));
    assert.match(text, /created_by_user_id:/);
    assert.doesNotMatch(text, /syncGoogleCalendarOutbound/);
    assert.doesNotMatch(text, /google_calendar_sync_status:\s*'pending'/);
  }
});

test('browser reminder preference has no event-route persistence owner', () => {
  const prefs = read(path.join(root, 'src', 'lib', 'google-calendar-reminder-preferences.ts'));
  const fallback = read(path.join(root, 'src', 'lib', 'supabase-fallback.ts'));
  const eventRoute = read(path.join(root, 'src', 'server', 'event-route-stage124f.ts'));
  const outbound = read(path.join(root, 'src', 'server', 'google-calendar-outbound.ts'));

  assert.match(prefs, /googleCalendarReminderMethod:/);
  assert.match(prefs, /googleCalendarReminderMinutesBefore:/);
  assert.match(fallback, /applyGoogleCalendarReminderPreferenceToEventPayload/);
  assert.doesNotMatch(eventRoute, /googleCalendarReminderMethod|googleCalendarReminderMinutesBefore/);
  assert.doesNotMatch(outbound, /googleCalendarReminderMethod|googleCalendarReminderMinutesBefore/);
});

test('active inbound and outbound require exact user scope', () => {
  const handler = read(path.join(root, 'src', 'server', 'google-calendar-handler.ts'));
  const userScope = read(path.join(root, 'src', 'server', 'google-calendar-user-scope.ts'));
  assert.match(handler, /getGoogleCalendarUserConnection\(workspaceId,\s*userId\)/);
  assert.match(handler, /connectionScope:\s*'user'/);
  assert.match(userScope, /workspace_id=eq\.\$\{encode\(workspace\)\}/);
  assert.match(userScope, /user_id=eq\.\$\{encode\(user\)\}/);
});

test('identity, tombstone and fail-closed invariants are documented by code', () => {
  const inbound = read(path.join(root, 'src', 'server', 'google-calendar-inbound.ts'));
  const outbound = read(path.join(root, 'src', 'server', 'google-calendar-outbound.ts'));
  assert.match(inbound, /findExistingGoogleCalendarWorkItemByCanonicalKey/);
  assert.match(inbound, /Duplicate titles are allowed; this intentionally does not match by title/);
  assert.match(inbound, /isLocalDeletedGoogleCalendarWorkItemStage232GR6/);
  assert.match(outbound, /fail closed\. Do not push the entire workspace/);
  assert.match(outbound, /'done', 'completed', 'cancelled', 'canceled', 'archived', 'deleted', 'removed'/);
});

test('readonly SOT explicitly forbids Google runtime changes', () => {
  const dateBoundary = read(path.join(root, 'src', 'lib', 'source-of-truth', 'calendar-date-time-boundary-readonly-runtime.ts'));
  const statusBoundary = read(path.join(root, 'src', 'lib', 'source-of-truth', 'calendar-status-date-readonly-runtime.ts'));
  for (const text of [dateBoundary, statusBoundary]) {
    assert.match(text, /GoogleCalendarSyncChange:\s*'FORBIDDEN'/);
    assert.match(text, /GoogleCalendarMapperChange:\s*'FORBIDDEN'/);
  }
  assert.match(dateBoundary, /RemoteCalendarBoundaryChange:\s*'FORBIDDEN'/);
  assert.match(statusBoundary, /remoteProviderChange:\s*'FORBIDDEN'/);
});

test('G5 map has 31 real boundary rows, 20 domains and 10 findings', () => {
  const map = read(path.join(mapBase, 'LF-PROD-SOT-G5_GCAL_CALENDAR_BOUNDARY_GAP_MAP.md'));
  assert.equal((map.match(/^\| G5-\d{2} \|/gm) || []).length, 31);
  assert.equal((map.match(/^- [A-Z][A-Z0-9_]+$/gm) || []).length, 20);
  assert.equal((map.match(/^### G5-FINDING-\d{3}/gm) || []).length, 10);
});

test('G5 stops runtime and routes only to a not-created contract decision stage', () => {
  const report = read(path.join(root, '_project', 'runs', 'LF-PROD-SOT-G5_GCAL_CALENDAR_BOUNDARY_GAP_MAP.md'));
  const map = read(path.join(mapBase, 'LF-PROD-SOT-G5_GCAL_CALENDAR_BOUNDARY_GAP_MAP.md'));
  const router = read(path.join(mapBase, '00_MAPY_I_ZALEZNOSCI_SOT.md'));
  for (const doc of [report, map]) {
    assert.match(doc, /RECOVERY_PACKAGE: V3_SAFE_VAULT_HEAD_ADVANCE_COMPAT/);
    assert.match(doc, /G5_FINAL_STATUS: PASS_GCAL_CALENDAR_BOUNDARY_GAP_MAP/);
    assert.match(doc, /GCAL_RUNTIME_DECISION: STOP_NO_SAFE_RUNTIME_CANDIDATE/);
    assert.match(doc, /G5_FIRST_SAFE_RUNTIME_CANDIDATE: NONE/);
    assert.match(doc, /G5_R1_CREATED: NO/);
    assert.match(doc, /NEXT_STAGE_SELECTED: LF-PROD-SOT-G5-R1_GCAL_OUTBOUND_TRIGGER_REMINDER_AND_DELETE_CONTRACT_DECISION/);
  }
  assert.match(router, /G5 -> CONTRACT_DECISION_GATE/);
  assert.match(router, /LF-PROD-SOT-G5-R1_GCAL_OUTBOUND_TRIGGER_REMINDER_AND_DELETE_CONTRACT_DECISION/);
});

test('G5 lineage contains no src changes', () => {
  const input = 'fa44c9aed16be191915b38ffd184605aa8be0deb';
  const result = spawnSync('git', ['merge-base', '--is-ancestor', input, 'HEAD'], { cwd: root });
  assert.equal(result.status, 0);
  const committed = git(['diff', '--name-only', `${input}..HEAD`]);
  const dirty = execFileSync('git', ['status', '--porcelain=v1', '--untracked-files=all'], { cwd: root, encoding: 'utf8' });
  const paths = [
    ...(committed ? committed.split(/\r?\n/) : []),
    ...dirty.split(/\r?\n/).filter(Boolean).map((line) => line.slice(3).trim()),
  ].filter(Boolean);
  assert.equal(paths.some((file) => file.replaceAll('\\', '/').startsWith('src/')), false);
});

test('G5-R1 artifacts do not exist', () => {
  const checks = [
    [path.join(root, '_project', 'runs'), 'LF-PROD-SOT-G5-R1_'],
    [path.join(root, 'scripts', 'guards'), 'verify-lf-prod-sot-g5-r1-'],
    [path.join(root, 'tests'), 'lf-prod-sot-g5-r1-'],
    [mapBase, 'LF-PROD-SOT-G5-R1_'],
  ];
  for (const [dir, prefix] of checks) {
    const names = fs.existsSync(dir) ? fs.readdirSync(dir).filter((name) => name.startsWith(prefix)) : [];
    assert.deepEqual(names, []);
  }
});
