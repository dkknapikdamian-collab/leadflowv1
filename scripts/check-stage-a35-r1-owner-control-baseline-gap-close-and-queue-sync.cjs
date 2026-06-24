const fs = require('node:fs');
const assert = require('node:assert/strict');

const stage = 'STAGE-A35_R1_OWNER_CONTROL_BASELINE_GAP_CLOSE_AND_QUEUE_SYNC';
const baseline = fs.readFileSync('src/lib/owner-control/owner-control-baseline.ts', 'utf8');
const today = fs.readFileSync('src/pages/TodayStable.tsx', 'utf8');
const cfRuntimeGuard = fs.readFileSync('scripts/check-cf-runtime-00-source-truth.cjs', 'utf8');

function must(source, token, label) {
  assert.ok(source.includes(token), label + ' missing: ' + token);
}

must(baseline, 'STAGE_A35_R1_OWNER_CONTROL_BASELINE_GAP_CLOSE_AND_QUEUE_SYNC', 'baseline stage marker');
must(today, 'STAGE_A35_R1_OWNER_CONTROL_BASELINE_GAP_CLOSE_AND_QUEUE_SYNC', 'Today marker');
must(baseline, "export type OwnerControlEntityType = 'lead' | 'case' | 'client' | 'task' | 'event'", 'owner control entity type');
must(baseline, "gapCloseKind?: 'note_without_followup';", 'single-user gap-close kind field');
must(baseline, 'export function buildNoteWithoutFollowUpOwnerControlItems', 'note-without-follow-up builder');
must(baseline, "normalized.type !== 'note'", 'note row classifier');
must(baseline, "if (normalized.type === 'note') return null;", 'note generic task exclusion');
must(baseline, 'hasOpenPlannedActionForNoteSource', 'note follow-up dedupe');
must(baseline, 'Notatka bez follow-upu', 'note status label');
must(baseline, "gapCloseKind: 'note_without_followup'", 'note gap-close metadata');
must(baseline, '...buildNoteWithoutFollowUpOwnerControlItems({ items: workItems, now })', 'note rows injected into baseline');
must(today, 'const actionRequiredRows = useMemo(() => ownerControlBaseline.items', 'Today Wymaga ruchu uses baseline items');
must(cfRuntimeGuard, 'CF_RUNTIME_00_STAGE_A35_R1_OWNER_CONTROL_BASELINE_GAP_CLOSE_SCOPE_COMPAT', 'CF runtime R1 stage marker');
must(cfRuntimeGuard, 'CF_RUNTIME_00_STAGE_A35_R2_REMOVE_SINGLE_USER_OWNERLESS_NOISE_SCOPE_COMPAT', 'CF runtime R2 stage marker');
must(cfRuntimeGuard, 'scripts/check-stage-a35-r1-owner-control-baseline-gap-close-and-queue-sync.cjs', 'CF runtime R1 guard allowlist');
must(cfRuntimeGuard, 'tests/stage-a35-r1-owner-control-baseline-gap-close-and-queue-sync.test.cjs', 'CF runtime R1 test allowlist');
must(cfRuntimeGuard, 'scripts/check-stage-a35-r2-remove-single-user-ownerless-noise.cjs', 'CF runtime R2 guard allowlist');
must(cfRuntimeGuard, 'tests/stage-a35-r2-remove-single-user-ownerless-noise.test.cjs', 'CF runtime R2 test allowlist');

assert.doesNotMatch(baseline, /isOwnerlessOperationalRecord/);
assert.doesNotMatch(baseline, /Brak odpowiedzialnego/);
assert.doesNotMatch(baseline, /Bez odpowiedzialnego/);
assert.doesNotMatch(baseline, /gapCloseKind: ownerless/);
assert.doesNotMatch(baseline, /gapCloseKind\?: 'ownerless'/);
assert.doesNotMatch(baseline, /case_items/);
assert.doesNotMatch(baseline, /from\(['"]clients['"]\)/);
assert.doesNotMatch(baseline, /Ä|Ĺ|Ă/);
assert.equal(fs.existsSync('supabase/migrations/STAGE-A35_R1_OWNER_CONTROL_BASELINE_GAP_CLOSE_AND_QUEUE_SYNC.sql'), false);
assert.ok(fs.existsSync('_project/runs/STAGE-A35_R1_OWNER_CONTROL_BASELINE_GAP_CLOSE_AND_QUEUE_SYNC.md'), 'R1 run report missing');
assert.ok(fs.existsSync('_project/obsidian_updates/2026-06-24_STAGE-A35_R1_OWNER_CONTROL_BASELINE_GAP_CLOSE_AND_QUEUE_SYNC.md'), 'R1 Obsidian payload missing');

console.log(JSON.stringify({ ok: true, stage, guard: 'check-stage-a35-r1-owner-control-baseline-gap-close-and-queue-sync' }, null, 2));
