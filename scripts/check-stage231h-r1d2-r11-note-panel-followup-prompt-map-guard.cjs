const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const caseDetailPath = path.join(root, 'src/pages/CaseDetail.tsx');
const r14fGuardPath = path.join(root, 'scripts/check-stage231h-r1d2-r14f-note-delete-linked-followup-expanded-panel-arrow-safe.cjs');

const text = fs.readFileSync(caseDetailPath, 'utf8');
const r14fGuardExists = fs.existsSync(r14fGuardPath);

function requireCondition(condition, label) {
  if (!condition) {
    throw new Error('STAGE231H_R1D2_R11 FAIL: missing ' + label);
  }
}

requireCondition(text.includes('caseNoteItems'), 'case note items source');
requireCondition(!/caseNoteItems\.slice\(0,\s*5\)/.test(text), 'old five-note preview limit removed');
requireCondition(text.includes('notePreview'), 'note preview fallback');
requireCondition(text.includes('pendingNoteFollowUp') || text.includes('setPendingNoteFollowUp'), 'note follow-up prompt state');
requireCondition(text.includes('case_note_follow_up') || text.includes('Follow-up po notatce'), 'case note follow-up mapping');
requireCondition(
  text.includes('deleteTaskFromSupabase') || r14fGuardExists,
  'linked follow-up delete path guarded'
);

console.log('STAGE231H_R1D2_R11 PASS: note panel follow-up prompt map guard is compatible with R14F expanded notes panel.');