const fs = require('fs');
const { execSync } = require('child_process');

function read(path) {
  return fs.existsSync(path) ? fs.readFileSync(path, 'utf8') : '';
}

const manager = read('src/components/detail/MissingItemsManagerDialog.tsx');
const client = read('src/pages/ClientDetail.tsx');
const lead = read('src/pages/LeadDetail.tsx');
const r16oGuard = read('scripts/check-stage232i4-r16o-client-shared-missing-manager-no-marker-anchor-final.cjs');
const r16oTest = read('tests/stage232i4-r16o-client-shared-missing-manager-no-marker-anchor-final.test.cjs');
const r16zGuard = read('scripts/check-stage232i4-r16z-r4-missing-manager-final-visual-fit-no-zip.cjs');
const r16zTest = read('tests/stage232i4-r16z-r4-missing-manager-final-visual-fit-no-zip.test.cjs');
const codex = read('_project/CODEX_CONTEXT_INDEX.md');
const stages = read('_project/04_ETAPY_ROZWOJU_APLIKACJI.md');
const guards = read('_project/06_GUARDS_AND_TESTS.md');
const testsDoc = read('_project/09_TESTY_DO_WYKONANIA_I_WYNIKI.md');
const risks = read('_project/11_RYZYKA_BUGI_I_DLUG_TECHNICZNY.md');
const runReport = read('_project/runs/STAGE232I4_R16Z_R5_MISSING_MANAGER_CLOSE_GUARD_CONSOLIDATION_AND_SMOKE.md');
const obsidianPayload = read('_project/obsidian_updates/2026-06-21_STAGE232I4_R16Z_R5_MISSING_MANAGER_CLOSE_GUARD_CONSOLIDATION_AND_SMOKE.md');

const errors = [];
function must(label, condition) { if (!condition) errors.push({ type: 'required', label }); }
function block(label, condition) { if (condition) errors.push({ type: 'forbidden', label }); }

must('R16Z_R5 manager marker exists', manager.includes('STAGE232I4_R16Z_R5_MISSING_MANAGER_CLOSE_GUARD_CONSOLIDATION_AND_SMOKE'));
must('R16O guard updated to R16Z source truth', r16oGuard.includes('STAGE232I4_R16O_CONSOLIDATED_WITH_R16Z_R4'));
must('R16O test updated to R16Z source truth', r16oTest.includes('R16O is consolidated with final R16Z_R4 760px flex layout'));
block('R16O guard obsolete 1100px requirement', r16oGuard.includes("must(manager, 'xl:w-[1100px]'"));
block('R16O test obsolete 1100px requirement', r16oTest.includes("assert.ok(manager.includes('xl:w-[1100px]'))"));
block('R16O guard obsolete title-block hard requirement', r16oGuard.includes("must(manager, 'data-missing-item-title-block=\"true\"'"));

must('R16Z_R4 guard still guards 760px', r16zGuard.includes('!w-[760px]') && r16zGuard.includes('sm:!max-w-[760px]'));
must('R16Z_R4 test still guards flex row', r16zTest.includes('flex w-full min-w-0 items-center gap-2 overflow-visible'));
must('manager final width 760', manager.includes('!w-[760px]') && manager.includes('sm:!max-w-[760px]'));
must('manager final no-clipping flex row', manager.includes('flex w-full min-w-0 items-center gap-2 overflow-visible'));
must('manager fallback item.title', manager.includes('item?.title'));
must('manager fallback raw.title', manager.includes('raw?.title'));
must('manager fallback payload.title', manager.includes('payload?.title'));
must('manager fallback payload.content/note', manager.includes('payload?.content') && manager.includes('payload?.note'));
must('manager fallback Brak bez nazwy', manager.includes('Brak bez nazwy'));
must('manager readable Blokuje text', manager.includes('data-stage232i4-r16z-r4-manager-blocker-text="readable"') && manager.includes('font-black leading-none text-slate-950'));
must('manager visible Uzupełnij and Usuń', manager.includes('Uzupełnij') && manager.includes('Usuń') && manager.includes('data-stage232i4-r16z-r4-manager-delete-visible="true"'));
block('manager old clipped grid forbidden', manager.includes('grid w-full min-w-0 grid-cols-[92px_minmax(120px,1fr)_88px_66px] items-center gap-2 overflow-hidden'));
block('manager old width 1100 forbidden', manager.includes('xl:w-[1100px]'));

must('ClientDetail quick add opens quick modal', client.includes('setClientMissingModalOpen(true)'));
must('ClientDetail quick add keeps manager closed after save', client.includes('setClientMissingListOpenStage232I6(false)'));
must('ClientDetail view all opens manager', client.includes('setClientMissingListOpenStage232I6(true)'));
must('ClientDetail renders shared manager', client.includes('<MissingItemsManagerDialog') && client.includes('open={clientMissingListOpenStage232I6}') && client.includes('scopeLabel="Klient"'));
must('ClientDetail source truth still priority high', client.includes("priority === 'high'"));
must('LeadDetail renders shared manager', lead.includes('<MissingItemsManagerDialog') && lead.includes('open={leadMissingManagerOpen}') && lead.includes('scopeLabel="Lead"'));

must('run report exists', runReport.includes('MAPA R16 / R16Z PRZED ZMIANA'));
must('obsidian payload exists', obsidianPayload.includes('Zapis do Obsidiana'));
must('CODEX context updated with R16Z_R5', codex.includes('STAGE232I4_R16Z_R5_MISSING_MANAGER_CLOSE_GUARD_CONSOLIDATION_AND_SMOKE'));
must('stage queue updated with R16Z_R5', stages.includes('STAGE232I4_R16Z_R5_MISSING_MANAGER_CLOSE_GUARD_CONSOLIDATION_AND_SMOKE'));
must('guards registry updated with R16Z_R5', guards.includes('check-stage232i4-r16z-r5-missing-manager-close-guard-consolidation.cjs'));
must('test registry updated with manual smoke checklist', testsDoc.includes('Manual smoke R16Z_R5'));
must('risk registry updated with R16Z_R5', risks.includes('STAGE232I4_R16Z_R5 risk audit'));

const diffNames = execSync('git diff --name-only', { encoding: 'utf8' }).split(/\r?\n/).filter(Boolean);
const allowedTracked = new Set([
  // STAGE232I4_R16Z_R9_MISSING_MANAGER_DIRECT_BLOCKER_OVERRIDE_ALLOWLIST
  'src/components/detail/MissingItemsManagerDialog.tsx',
  'scripts/check-stage232i4-r16z-r9-missing-manager-direct-blocker-override.cjs',
  'tests/stage232i4-r16z-r9-missing-manager-direct-blocker-override.test.cjs',
  '_project/runs/STAGE232I4_R16Z_R9_MISSING_MANAGER_DIRECT_BLOCKER_OVERRIDE.md',
  '_project/obsidian_updates/2026-06-21_STAGE232I4_R16Z_R9_MISSING_MANAGER_DIRECT_BLOCKER_OVERRIDE.md',
  // STAGE232I4_R16Z_R8_LEAD_MISSING_BLOCKER_TOGGLE_PRIORITY_FIX_ALLOWLIST
  'src/pages/LeadDetail.tsx',
  'scripts/check-stage232i4-r16z-r5-missing-manager-close-guard-consolidation.cjs',
  'scripts/check-stage232i4-r16z-r8-lead-missing-blocker-toggle-priority-fix.cjs',
  'tests/stage232i4-r16z-r8-lead-missing-blocker-toggle-priority-fix.test.cjs',
  '_project/runs/STAGE232I4_R16Z_R8_LEAD_MISSING_BLOCKER_TOGGLE_PRIORITY_FIX.md',
  '_project/obsidian_updates/2026-06-21_STAGE232I4_R16Z_R8_LEAD_MISSING_BLOCKER_TOGGLE_PRIORITY_FIX.md',
  // STAGE232I4_R16Z_R5_R5_CLIENT_OPERATIONAL_CENTER_TEST_COMPAT_ALLOWLIST
  'tests/client-detail-v1-operational-center.test.cjs',
  'scripts/check-stage232i4-r16z-r5-r5-client-operational-center-test-compat.cjs',
  'tests/stage232i4-r16z-r5-r5-client-operational-center-test-compat.test.cjs',
  '_project/runs/STAGE232I4_R16Z_R5_R5_CLIENT_OPERATIONAL_CENTER_TEST_COMPAT.md',
  '_project/obsidian_updates/2026-06-21_STAGE232I4_R16Z_R5_R5_CLIENT_OPERATIONAL_CENTER_TEST_COMPAT.md',
  // STAGE232I4_R16Z_R5_R7_POLISH_MOJIBAKE_AUDIT_SCOPE_FINAL_ALLOWLIST
  'tests/polish-mojibake-audit.test.cjs',
  'scripts/check-stage232i4-r16z-r5-r7-polish-mojibake-audit-scope-final.cjs',
  'tests/stage232i4-r16z-r5-r7-polish-mojibake-audit-scope-final.test.cjs',
  '_project/runs/STAGE232I4_R16Z_R5_R7_POLISH_MOJIBAKE_AUDIT_SCOPE_FINAL.md',
  '_project/obsidian_updates/2026-06-21_STAGE232I4_R16Z_R5_R7_POLISH_MOJIBAKE_AUDIT_SCOPE_FINAL.md',
  // STAGE232I4_R16Z_R5_R6_CF_RUNTIME_R5_ALLOWLIST_FINAL_ALLOWLIST
  'scripts/check-stage232i4-r16z-r5-r6-cf-runtime-r5-allowlist-final.cjs',
  'tests/stage232i4-r16z-r5-r6-cf-runtime-r5-allowlist-final.test.cjs',
  '_project/runs/STAGE232I4_R16Z_R5_R6_CF_RUNTIME_R5_ALLOWLIST_FINAL.md',
  '_project/obsidian_updates/2026-06-21_STAGE232I4_R16Z_R5_R6_CF_RUNTIME_R5_ALLOWLIST_FINAL.md',
  // R16Z_R5_R4_CLOSE_GUARD_ALLOWLIST_REPAIR: CF runtime guard is intentionally in scope for verify:closeflow:quiet.
  'scripts/check-cf-runtime-00-source-truth.cjs',
  'src/components/detail/MissingItemsManagerDialog.tsx',
  'scripts/check-stage232i4-r16o-client-shared-missing-manager-no-marker-anchor-final.cjs',
  'tests/stage232i4-r16o-client-shared-missing-manager-no-marker-anchor-final.test.cjs',
  '_project/CODEX_CONTEXT_INDEX.md',
  '_project/04_ETAPY_ROZWOJU_APLIKACJI.md',
  '_project/06_GUARDS_AND_TESTS.md',
  '_project/09_TESTY_DO_WYKONANIA_I_WYNIKI.md',
  '_project/11_RYZYKA_BUGI_I_DLUG_TECHNICZNY.md',
]);
for (const path of diffNames) {
  must('tracked diff allowed: ' + path, allowedTracked.has(path));
}

if (errors.length) {
  console.error(JSON.stringify({ ok: false, stage: 'STAGE232I4_R16Z_R5_MISSING_MANAGER_CLOSE_GUARD_CONSOLIDATION_AND_SMOKE', errors }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  stage: 'STAGE232I4_R16Z_R5_MISSING_MANAGER_CLOSE_GUARD_CONSOLIDATION_AND_SMOKE',
  contract: 'R16O is consolidated with R16Z_R4 final manager layout, final close guard exists, Client/Lead shared manager wiring is protected, docs/status payloads are updated, no SQL/finance/calendar scope touched.'
}, null, 2));
