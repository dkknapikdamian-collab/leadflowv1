const fs = require('fs');
const path = require('path');
const root = process.cwd();
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const exists = (p) => fs.existsSync(path.join(root, p));
const fail = (msg) => { console.error('STAGE231H_R1D2_R6_R9F FAIL: ' + msg); process.exit(1); };
const need = (cond, msg) => { if (!cond) fail(msg); };

const src = read('src/pages/CaseDetail.tsx');
need(src.includes('STAGE231H_R1D2_R6_R9_CASE_NOTE_FOLLOWUP_NOTES_CRUD_MASS_REPAIR'), 'CaseDetail missing R9 runtime marker');
need(src.includes("replace(/\\s+/g, ' ')") || src.includes("replace(/\\s+/g, \" \")"), 'runtime speech whitespace fix missing');
need(!src.includes("replace(/s+/g, ' ')") && !src.includes('replace(/s+/g, " ")'), 'broken runtime speech whitespace regexp still exists');
need(src.includes('data-stage231h-r1d2-r6-notes-crud-modal="true"'), 'notes CRUD modal marker missing');
need(src.includes('data-stage231h-r1d2-r6-edit-note="true"'), 'edit note marker missing');
need(src.includes('data-stage231h-r1d2-r6-delete-note="true"'), 'delete note marker missing');
need(src.includes('workspaceId: workspaceIdStage231H_R1D2_R6 || undefined'), 'follow-up task missing workspaceId');
need(src.includes('dueAt: scheduledAt'), 'follow-up task missing dueAt');

const guardFiles = [
  'scripts/check-stage231h-r1d2-r6-r9-case-note-followup-notes-crud-mass-repair.cjs',
  'scripts/check-stage231h-r1d2-r6-r9d-case-note-followup-notes-crud-guard-sync.cjs',
  'scripts/check-stage231h-r1d2-r6-r9e-case-note-followup-notes-crud-mass-guard-sync.cjs',
  'scripts/check-stage231h-r1d2-r6-r9f-case-note-followup-notes-crud-guard-regex-mass-fix.cjs',
];
for (const rel of guardFiles) {
  need(exists(rel), `${rel} missing`);
  const txt = read(rel);
  if (rel !== 'scripts/check-stage231h-r1d2-r6-r9f-case-note-followup-notes-crud-guard-regex-mass-fix.cjs') {
    need(!txt.includes('src.includes("replace(/\\s+/g, \' \')")'), `${rel} still contains JS-string-broken regex check`);
    need(txt.includes('src.includes("replace(/\\\\s+/g, \' \')")') || txt.includes('replace(/\\\\s+/g'), `${rel} missing double-escaped guard regex check`);
  }
}

for (const rel of [
  '_project/04_ETAPY_ROZWOJU_APLIKACJI.md',
  '_project/06_GUARDS_AND_TESTS.md',
  '_project/08_CHANGELOG_AI.md',
  '_project/10_PROJECT_TIMELINE.md',
  '_project/13_TEST_HISTORY.md',
]) {
  const txt = read(rel);
  need(txt.includes('STAGE231H_R1D2_R6_R9F_CASE_NOTE_FOLLOWUP_NOTES_CRUD_GUARD_REGEX_MASS_FIX'), `${rel} missing R9F marker`);
}

console.log('STAGE231H_R1D2_R6_R9F PASS: regex guard escaping and note follow-up CRUD chain are guarded.');
