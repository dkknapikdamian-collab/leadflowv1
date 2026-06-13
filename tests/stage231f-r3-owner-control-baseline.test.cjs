const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const Module = require('node:module');
const { buildSync } = require('esbuild');

const root = path.resolve(__dirname, '..');

function loadTs(entry) {
  const result = buildSync({
    entryPoints: [path.join(root, entry)],
    bundle: true,
    platform: 'node',
    format: 'cjs',
    write: false,
    logLevel: 'silent',
  });
  const mod = new Module(entry, module);
  mod.filename = path.join(root, entry);
  mod.paths = Module._nodeModulePaths(path.dirname(mod.filename));
  mod._compile(result.outputFiles[0].text, mod.filename);
  return mod.exports;
}

const { buildOwnerControlBaseline } = loadTs('src/lib/owner-control/owner-control-baseline.ts');
const now = new Date('2026-06-13T12:00:00.000Z');

function lead(id, extra = {}) {
  return { id, name: `Lead ${id}`, status: 'open', updatedAt: now.toISOString(), ...extra };
}

function futureTask(id, leadId) {
  return { id, title: `Follow-up ${leadId}`, leadId, status: 'todo', scheduledAt: '2026-06-20T10:00:00.000Z' };
}

test('10 leads with 3 missing next steps put all 3 red records first', () => {
  const leads = Array.from({ length: 10 }, (_, index) => lead(String(index + 1)));
  const tasks = leads.slice(3).map((item, index) => futureTask(`task-${index}`, item.id));
  const baseline = buildOwnerControlBaseline({ leads, tasks, now });

  assert.equal(baseline.counts.missingNextStep, 3);
  assert.deepEqual(baseline.items.slice(0, 3).map((item) => item.entityId), ['1', '2', '3']);
  assert.ok(baseline.items.slice(0, 3).every((item) => item.severity === 'critical'));
  assert.ok(baseline.items.slice(0, 3).every((item) => item.statusLabel === 'Brak next step'));
});

test('default silence thresholds classify 6, 7, 13 and 14 days correctly', () => {
  const leads = [6, 7, 13, 14].map((days) => lead(`d${days}`, {
    lastContactAt: new Date(now.getTime() - days * 86_400_000).toISOString(),
  }));
  const tasks = leads.map((item, index) => futureTask(`future-${index}`, item.id));
  const baseline = buildOwnerControlBaseline({ leads, tasks, now });
  const byId = new Map(baseline.items.map((item) => [item.entityId, item]));

  assert.equal(byId.has('d6'), false);
  assert.equal(byId.get('d7').severity, 'warning');
  assert.equal(byId.get('d13').severity, 'warning');
  assert.equal(byId.get('d14').severity, 'critical');
});

test('custom 3 and 10 day thresholds drive the same classification contract', () => {
  const leads = [2, 3, 9, 10].map((days) => lead(`custom-${days}`, {
    lastContactAt: new Date(now.getTime() - days * 86_400_000).toISOString(),
  }));
  const tasks = leads.map((item, index) => futureTask(`custom-task-${index}`, item.id));
  const baseline = buildOwnerControlBaseline({ leads, tasks, settings: { warningDays: 3, criticalDays: 10 }, now });
  const byId = new Map(baseline.items.map((item) => [item.entityId, item]));

  assert.equal(byId.has('custom-2'), false);
  assert.equal(byId.get('custom-3').severity, 'warning');
  assert.equal(byId.get('custom-9').severity, 'warning');
  assert.equal(byId.get('custom-10').severity, 'critical');
});

test('closed records are excluded and a risky case is deduplicated', () => {
  const baseline = buildOwnerControlBaseline({
    leads: [lead('closed-lead', { status: 'lost' })],
    cases: [
      { id: 'closed-case', title: 'Closed', status: 'closed', updatedAt: '2026-05-01T12:00:00.000Z' },
      { id: 'case-risk', title: 'Case risk', status: 'active', contractValue: 12000, updatedAt: '2026-05-01T12:00:00.000Z' },
    ],
    now,
  });

  assert.equal(baseline.items.some((item) => item.entityId === 'closed-lead'), false);
  assert.equal(baseline.items.some((item) => item.entityId === 'closed-case'), false);
  const riskyCases = baseline.items.filter((item) => item.entityId === 'case-risk');
  assert.equal(riskyCases.length, 1);
  assert.equal(riskyCases[0].severity, 'critical');
  assert.ok(riskyCases[0].signals.includes('Brak następnego kroku'));
  assert.ok(riskyCases[0].signals.includes('Wysoka wartość bez bezpiecznego ruchu'));
});

test('workspace API and migration reject invalid threshold classes', () => {
  const api = fs.readFileSync(path.join(root, 'api/system.ts'), 'utf8');
  const settings = fs.readFileSync(path.join(root, 'src/pages/Settings.tsx'), 'utf8');
  const workspaceHook = fs.readFileSync(path.join(root, 'src/hooks/useWorkspace.ts'), 'utf8');
  const migration = fs.readFileSync(path.join(root, 'supabase/migrations/20260613065348_stage231f_r3_owner_control_workspace_settings.sql'), 'utf8');
  assert.match(api, /OWNER_CONTROL_WARNING_DAYS_INVALID/);
  assert.match(api, /OWNER_CONTROL_CRITICAL_DAYS_INVALID/);
  assert.match(api, /criticalDays <= warningDays/);
  assert.match(api, /assertWorkspaceOwnerOrAdmin\(workspaceId, req\)/);
  assert.match(settings, /isSupabaseConfigured\(\)/);
  assert.match(settings, /writeOwnerRiskSettings/);
  assert.match(workspaceHook, /ownerControlWarningDays: ownerRiskSettings\.warningDays/);
  assert.match(migration, /owner_control_critical_days > owner_control_warning_days/);
  assert.match(migration, /between 1 and 365/);
});
