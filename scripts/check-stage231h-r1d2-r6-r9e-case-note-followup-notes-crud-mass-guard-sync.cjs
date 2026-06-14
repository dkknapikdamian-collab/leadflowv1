const fs = require('fs');
const path = require('path');
const root = process.cwd();
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const exists = (p) => fs.existsSync(path.join(root, p));
const fail = (msg) => { console.error('STAGE231H_R1D2_R6_R9E FAIL: ' + msg); process.exit(1); };
const need = (cond, msg) => { if (!cond) fail(msg); };

const legacyR4 = 'STAGE231H_R1D2_R4_NOTES_PANEL_DICTATION_BUTTON';
const r9 = 'STAGE231H_R1D2_R6_R9_CASE_NOTE_FOLLOWUP_NOTES_CRUD_MASS_REPAIR';
const r9d = 'STAGE231H_R1D2_R6_R9D_CASE_NOTE_FOLLOWUP_NOTES_CRUD_MASS_REPAIR_GUARD_SYNC';
const r9e = 'STAGE231H_R1D2_R6_R9E_CASE_NOTE_FOLLOWUP_NOTES_CRUD_MASS_GUARD_SYNC';

for (const rel of [
  '_project/04_ETAPY_ROZWOJU_APLIKACJI.md',
  '_project/06_GUARDS_AND_TESTS.md',
  '_project/08_CHANGELOG_AI.md',
  '_project/10_PROJECT_TIMELINE.md',
  '_project/13_TEST_HISTORY.md',
]) {
  const txt = read(rel);
  need(txt.includes(legacyR4), `${rel} missing legacy R4 marker required by R4 guard`);
}

const etapas = read('_project/04_ETAPY_ROZWOJU_APLIKACJI.md');
need(etapas.includes('PRODUCT_PASS / TECH_PUSHED / MANUAL_CONFIRMED'), 'missing exact legacy R1G2 product-pass phrase');
need(etapas.includes(r9), 'missing R9 marker in stage ledger');
need(etapas.includes(r9d), 'missing R9D marker in stage ledger');
need(etapas.includes(r9e), 'missing R9E marker in stage ledger');

need(exists('_project/runs/STAGE231H_R1D2_R4_NOTES_PANEL_DICTATION_BUTTON.md'), 'missing legacy R4 run report file');
need(exists('_project/obsidian_updates/2026-06-14_STAGE231H_R1D2_R4_NOTES_PANEL_DICTATION_BUTTON.md'), 'missing legacy R4 Obsidian payload file');
need(read('_project/runs/STAGE231H_R1D2_R4_NOTES_PANEL_DICTATION_BUTTON.md').includes(legacyR4), 'legacy R4 run report missing marker');
need(read('_project/obsidian_updates/2026-06-14_STAGE231H_R1D2_R4_NOTES_PANEL_DICTATION_BUTTON.md').includes(legacyR4), 'legacy R4 Obsidian payload missing marker');

const src = read('src/pages/CaseDetail.tsx');
need(src.includes(r9), 'CaseDetail missing R9 runtime marker');
need(src.includes("workspaceId: workspaceIdStage231H_R1D2_R6 || undefined"), 'follow-up task missing workspaceId');
need(src.includes("dueAt: scheduledAt"), 'follow-up task missing dueAt');
need(src.includes('setTasks((current) => dedupeCaseTasks([normalizedCreated, ...current], caseId, caseData));') || src.includes('setTasks((previousTasks)'), 'follow-up task is not appended to local tasks state');
need(src.includes('data-stage231h-r1d2-r6-notes-crud-modal="true"'), 'notes CRUD modal marker missing');
need(src.includes('data-stage231h-r1d2-r6-edit-note="true"'), 'edit note marker missing');
need(src.includes('data-stage231h-r1d2-r6-delete-note="true"'), 'delete note marker missing');
need(src.includes('updateActivityInSupabase('), 'notes edit must use updateActivityInSupabase');
need(src.includes('deleteActivityFromSupabase('), 'notes delete must use deleteActivityFromSupabase');
need(src.includes("replace(/\\s+/g, ' ')"), 'speech whitespace fix missing');
need(!src.includes("replace(/s+/g, ' ')"), 'broken speech whitespace regexp still exists');

console.log('STAGE231H_R1D2_R6_R9E PASS: legacy guards and mass repair ledgers are synced.');
