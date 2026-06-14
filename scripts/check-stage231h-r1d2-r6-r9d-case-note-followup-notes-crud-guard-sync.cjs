const fs = require('fs');
const path = require('path');
const root = process.cwd();
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const fail = (msg) => { console.error('STAGE231H_R1D2_R6_R9D FAIL: ' + msg); process.exit(1); };
const need = (cond, msg) => { if (!cond) fail(msg); };

const etapas = read('_project/04_ETAPY_ROZWOJU_APLIKACJI.md');
need(etapas.includes('STAGE231H_R1D2_CASE_DETAIL_NOTE_DICTATION_RESTORE_RUNTIME'), 'central stage file missing R1D2 marker');
need(etapas.includes('PRODUCT_PASS / TECH_PUSHED / MANUAL_CONFIRMED'), 'central stage file missing exact legacy R1G2 product-pass sync phrase');
need(etapas.includes('STAGE231H_R1D2_R6_R9_CASE_NOTE_FOLLOWUP_NOTES_CRUD_MASS_REPAIR'), 'central stage file missing R9 mass repair marker');
need(etapas.includes('STAGE231H_R1D2_R6_R9D_CASE_NOTE_FOLLOWUP_NOTES_CRUD_MASS_REPAIR_GUARD_SYNC'), 'central stage file missing R9D guard sync marker');

const src = read('src/pages/CaseDetail.tsx');
need(src.includes('STAGE231H_R1D2_R6_R9_CASE_NOTE_FOLLOWUP_NOTES_CRUD_MASS_REPAIR'), 'CaseDetail missing R9 runtime marker');
need(src.includes("workspaceId: workspaceIdStage231H_R1D2_R6 || undefined"), 'follow-up task missing workspaceId assignment');
need(src.includes("dueAt: scheduledAt"), 'follow-up task missing dueAt');
need(src.includes('data-stage231h-r1d2-r6-notes-crud-modal="true"'), 'notes CRUD modal marker missing');
need(src.includes('data-stage231h-r1d2-r6-edit-note="true"'), 'edit note button missing');
need(src.includes('data-stage231h-r1d2-r6-delete-note="true"'), 'delete note button missing');
need(src.includes("replace(/\\s+/g, ' ')"), 'speech whitespace fix missing');
need(!src.includes("replace(/s+/g, ' ')"), 'broken speech whitespace still present');

console.log('STAGE231H_R1D2_R6_R9D PASS: central R1G2 sync and R9 mass repair are guarded.');
