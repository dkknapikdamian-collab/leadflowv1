const fs = require('fs');
const path = require('path');
const root = process.cwd();
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const exists = (p) => fs.existsSync(path.join(root, p));
const fail = (msg) => { console.error('STAGE231H_R1D2_R6_R9G FAIL: ' + msg); process.exit(1); };
const need = (cond, msg) => { if (!cond) fail(msg); };

const r9 = 'STAGE231H_R1D2_R6_R9_CASE_NOTE_FOLLOWUP_NOTES_CRUD_MASS_REPAIR';
const r9d = 'STAGE231H_R1D2_R6_R9D_CASE_NOTE_FOLLOWUP_NOTES_CRUD_MASS_REPAIR_GUARD_SYNC';
const r9e = 'STAGE231H_R1D2_R6_R9E_CASE_NOTE_FOLLOWUP_NOTES_CRUD_MASS_GUARD_SYNC';
const r9f = 'STAGE231H_R1D2_R6_R9F_CASE_NOTE_FOLLOWUP_NOTES_CRUD_GUARD_REGEX_MASS_FIX';
const r9g = 'STAGE231H_R1D2_R6_R9G_CASE_NOTE_FOLLOWUP_NOTES_CRUD_LOCAL_TASKS_GUARD_MASS_FIX';

const src = read('src/pages/CaseDetail.tsx');
need(src.includes(r9), 'CaseDetail missing R9 runtime marker');
need(src.includes('setTasks((current) => dedupeCaseTasks([normalizedCreated, ...current], caseId, caseData));'), 'runtime must append created follow-up task to local tasks state');
need(src.includes('workspaceId: workspaceIdStage231H_R1D2_R6 || undefined'), 'follow-up task missing workspaceId');
need(src.includes('dueAt: scheduledAt'), 'follow-up task missing dueAt');
need(src.includes('data-stage231h-r1d2-r6-notes-crud-modal="true"'), 'notes CRUD modal marker missing');
need(src.includes('data-stage231h-r1d2-r6-edit-note="true"'), 'edit note marker missing');
need(src.includes('data-stage231h-r1d2-r6-delete-note="true"'), 'delete note marker missing');
need(src.includes("replace(/\\s+/g, ' ')") || src.includes('replace(/\\s+/g, " ")'), 'speech whitespace runtime fix missing');
need(!src.includes("replace(/s+/g, ' ')") && !src.includes('replace(/s+/g, " ")'), 'broken speech whitespace regexp still exists');

const r9eGuardRel = 'scripts/check-stage231h-r1d2-r6-r9e-case-note-followup-notes-crud-mass-guard-sync.cjs';
need(exists(r9eGuardRel), 'R9E guard missing');
const r9eGuard = read(r9eGuardRel);
need(!r9eGuard.includes("need(src.includes('setTasks((previousTasks)')"), 'R9E guard still requires only previousTasks local-state spelling');
need(r9eGuard.includes("setTasks((current) => dedupeCaseTasks([normalizedCreated, ...current], caseId, caseData));"), 'R9E guard must accept actual current/dedupe local-state update');

for (const rel of [
  '_project/04_ETAPY_ROZWOJU_APLIKACJI.md',
  '_project/04_ZNALEZIONE_PROBLEMY_DO_ANALIZY.md',
  '_project/06_GUARDS_AND_TESTS.md',
  '_project/08_CHANGELOG_AI.md',
  '_project/10_PROJECT_TIMELINE.md',
  '_project/13_TEST_HISTORY.md',
]) {
  const txt = read(rel);
  for (const marker of [r9, r9d, r9e, r9f, r9g]) {
    need(txt.includes(marker), `${rel} missing ${marker}`);
  }
}

console.log('STAGE231H_R1D2_R6_R9G PASS: local tasks guard spelling is mass-fixed and runtime is guarded.');
