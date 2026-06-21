const fs = require('fs');
const { execSync } = require('child_process');

function read(path) {
  return fs.existsSync(path) ? fs.readFileSync(path, 'utf8') : '';
}
function section(source, start, end) {
  const startIndex = source.indexOf(start);
  const endIndex = end ? source.indexOf(end, startIndex + start.length) : -1;
  if (startIndex < 0) return '';
  return endIndex > startIndex ? source.slice(startIndex, endIndex) : source.slice(startIndex);
}
const manager = read('src/components/detail/MissingItemsManagerDialog.tsx');
const cfRuntime = read('scripts/check-cf-runtime-00-source-truth.cjs');
const closeGuard = read('scripts/check-stage232i4-r16z-r5-missing-manager-close-guard-consolidation.cjs');
const fn = section(manager, 'function isManagerItemBlocker(item: MissingItemsManagerItem)', 'function managerItemTitle');
const errors = [];
function must(label, condition) { if (!condition) errors.push({ type: 'required', label }); }
function block(label, condition) { if (condition) errors.push({ type: 'forbidden', label }); }

must('manager R9 marker exists', manager.includes('STAGE232I4_R16Z_R9_MISSING_MANAGER_DIRECT_BLOCKER_OVERRIDE'));
must('blocker function exists', fn.includes('isManagerItemBlocker'));
must('explicit direct blocker source exists', fn.includes('const direct = item?.isBlocker ?? item?.blocksProgress ?? item?.blocks_progress;'));
must('explicit direct false/true returns before raw/status fallback', fn.includes('if (direct !== undefined && direct !== null) return isTruthyBooleanLike(direct);'));
must('raw/payload direct fallback exists', fn.includes('const rawOrPayloadDirect = raw?.blocksProgress ?? raw?.blocks_progress ?? payload?.blocksProgress ?? payload?.blocks_progress;'));
must('raw/payload false/true returns before status fallback', fn.includes('if (rawOrPayloadDirect !== undefined && rawOrPayloadDirect !== null) return isTruthyBooleanLike(rawOrPayloadDirect);'));
must('status fallback is still present', fn.includes("status === 'blocking_missing_item'"));
must('priority high fallback is still present', fn.includes("priority === 'high'"));
block('old OR logic must not remain', fn.includes("status === 'blocking_missing_item'\n    || priority === 'high'\n    || isTruthyBooleanLike(direct)"));

const directIndex = fn.indexOf('const direct = item?.isBlocker');
const directReturnIndex = fn.indexOf('if (direct !== undefined');
const statusIndex = fn.indexOf('const status =');
const priorityIndex = fn.indexOf('const priority =');
must('direct override appears before status fallback', directIndex >= 0 && directReturnIndex > directIndex && statusIndex > directReturnIndex && priorityIndex > directReturnIndex);

must('CF runtime allowlist contains R9 files', cfRuntime.includes('STAGE232I4_R16Z_R9_MISSING_MANAGER_DIRECT_BLOCKER_OVERRIDE_ALLOWLIST'));
must('R16Z_R5 close guard allows R9 files', closeGuard.includes('STAGE232I4_R16Z_R9_MISSING_MANAGER_DIRECT_BLOCKER_OVERRIDE_ALLOWLIST'));

const changed = execSync('git status --short', { encoding: 'utf8' })
  .split(/\r?\n/)
  .filter(Boolean)
  .map(line => line.slice(3));
const allowed = new Set([
  'src/components/detail/MissingItemsManagerDialog.tsx',
  'scripts/check-stage232i4-r16z-r9-missing-manager-direct-blocker-override.cjs',
  'tests/stage232i4-r16z-r9-missing-manager-direct-blocker-override.test.cjs',
  '_project/runs/STAGE232I4_R16Z_R9_MISSING_MANAGER_DIRECT_BLOCKER_OVERRIDE.md',
  '_project/obsidian_updates/2026-06-21_STAGE232I4_R16Z_R9_MISSING_MANAGER_DIRECT_BLOCKER_OVERRIDE.md',
  'scripts/check-cf-runtime-00-source-truth.cjs',
  'scripts/check-stage232i4-r16z-r5-missing-manager-close-guard-consolidation.cjs',
  '_project/04_ETAPY_ROZWOJU_APLIKACJI.md',
  '_project/06_GUARDS_AND_TESTS.md',
  '_project/09_TESTY_DO_WYKONANIA_I_WYNIKI.md',
  '_project/11_RYZYKA_BUGI_I_DLUG_TECHNICZNY.md',
  '_project/CODEX_CONTEXT_INDEX.md',

// STAGE232I4_R16Z_R10_ALLOWLIST_FOR_R9_GUARD: allow R10 lead checkbox source fix files in existing scope guard.
  'src/pages/LeadDetail.tsx',
  'scripts/check-stage232i4-r16z-r10-lead-missing-checkbox-activity-source-fix.cjs',
  'tests/stage232i4-r16z-r10-lead-missing-checkbox-activity-source-fix.test.cjs',
  '_project/runs/STAGE232I4_R16Z_R10_LEAD_MISSING_CHECKBOX_ACTIVITY_SOURCE_FIX.md',
  '_project/obsidian_updates/2026-06-21_STAGE232I4_R16Z_R10_LEAD_MISSING_CHECKBOX_ACTIVITY_SOURCE_FIX.md',
]);
for (const path of changed) {
  must('change scope allowed: ' + path, allowed.has(path));
}

if (errors.length) {
  console.error(JSON.stringify({ ok: false, stage: 'STAGE232I4_R16Z_R9_MISSING_MANAGER_DIRECT_BLOCKER_OVERRIDE', errors }, null, 2));
  process.exit(1);
}
console.log(JSON.stringify({ ok: true, stage: 'STAGE232I4_R16Z_R9_MISSING_MANAGER_DIRECT_BLOCKER_OVERRIDE', contract: 'MissingItemsManagerDialog treats explicit item.isBlocker/blocksProgress false as source of truth before stale raw/payload status/priority fallback, so Lead checkbox Blokuje cannot be rechecked by old raw bridge data after refresh.' }, null, 2));
