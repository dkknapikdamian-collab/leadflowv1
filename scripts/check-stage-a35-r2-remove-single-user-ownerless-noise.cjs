const fs = require('node:fs');
const assert = require('node:assert/strict');

const stage = 'STAGE-A35_R2_REMOVE_SINGLE_USER_OWNERLESS_NOISE';
const baseline = fs.readFileSync('src/lib/owner-control/owner-control-baseline.ts', 'utf8');
const r1Guard = fs.readFileSync('scripts/check-stage-a35-r1-owner-control-baseline-gap-close-and-queue-sync.cjs', 'utf8');
const cfRuntimeGuard = fs.readFileSync('scripts/check-cf-runtime-00-source-truth.cjs', 'utf8');

function must(source, token, label) {
  assert.ok(source.includes(token), label + ' missing: ' + token);
}

function runtimeMustNot(token, label) {
  assert.equal(baseline.includes(token), false, label + ' still present in runtime: ' + token);
}

runtimeMustNot('isOwnerlessOperationalRecord', 'ownerless helper');
runtimeMustNot('Brak odpowiedzialnego', 'ownerless signal');
runtimeMustNot('Bez odpowiedzialnego', 'ownerless status label');
runtimeMustNot('gapCloseKind: ownerless', 'ownerless metadata expression');
runtimeMustNot("gapCloseKind?: 'ownerless'", 'ownerless gap close union');
runtimeMustNot('"ownerless"', 'ownerless string literal');
runtimeMustNot("'ownerless'", 'ownerless string literal');

must(baseline, "gapCloseKind?: 'note_without_followup';", 'single-user gap-close kind');
must(baseline, 'buildNoteWithoutFollowUpOwnerControlItems', 'note-without-follow-up builder');
must(baseline, 'Notatka bez follow-upu', 'note-without-follow-up label');
must(baseline, "gapCloseKind: 'note_without_followup'", 'note-without-follow-up metadata');
must(baseline, 'hasOpenPlannedActionForNoteSource', 'note follow-up dedupe');

assert.doesNotMatch(baseline, /case_items/, 'A35 must not read case_items as source of truth');
assert.doesNotMatch(baseline, /from\(['"]clients['"]\)/, 'A35 must not add client table fetches');
assert.doesNotMatch(baseline, /from\(['"]users['"]\)/, 'single-user cleanup must not add user/owner fetches');

must(r1Guard, "gapCloseKind?: 'note_without_followup';", 'R1 guard updated to single-user contract');
assert.doesNotMatch(r1Guard, /must\(baseline, ['"]isOwnerlessOperationalRecord/, 'R1 guard must not require ownerless helper');
assert.doesNotMatch(r1Guard, /ownerless lead and case control signal/, 'R1 guard must not require ownerless test wording');

must(cfRuntimeGuard, 'CF_RUNTIME_00_STAGE_A35_R2_REMOVE_SINGLE_USER_OWNERLESS_NOISE_SCOPE_COMPAT', 'CF runtime R2 marker');
must(cfRuntimeGuard, 'scripts/check-stage-a35-r2-remove-single-user-ownerless-noise.cjs', 'CF runtime R2 guard allowlist');
must(cfRuntimeGuard, 'tests/stage-a35-r2-remove-single-user-ownerless-noise.test.cjs', 'CF runtime R2 test allowlist');

assert.ok(fs.existsSync('_project/runs/STAGE-A35_R2_REMOVE_SINGLE_USER_OWNERLESS_NOISE.md'), 'R2 run report missing');
assert.ok(fs.existsSync('_project/obsidian_updates/2026-06-24_STAGE-A35_R2_REMOVE_SINGLE_USER_OWNERLESS_NOISE.md'), 'R2 Obsidian payload missing');
assert.equal(fs.existsSync('supabase/migrations/STAGE-A35_R2_REMOVE_SINGLE_USER_OWNERLESS_NOISE.sql'), false, 'R2 must not add SQL');

console.log(JSON.stringify({
  ok: true,
  stage,
  guard: 'check-stage-a35-r2-remove-single-user-ownerless-noise',
  result: 'ownerless_absent_from_runtime_note_followup_kept'
}, null, 2));
