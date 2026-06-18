const fs = require('fs');
const assert = require('assert');

const stage = 'STAGE232L_DELETE_LINKED_NOTE_REFERENCE_SWEEP';
const badHelper = 'getLinkedNoteForTaskStage231H_R1D2_R15C';
const goodHelper = 'findCaseNoteForFollowUpTaskStage231H_R1D2_R15C';

const files = [
  'src/pages/CaseDetail.tsx',
  'src/pages/ClientDetail.tsx',
  'src/pages/LeadDetail.tsx',
  'src/pages/TodayStable.tsx',
  'src/pages/Calendar.tsx',
  'src/pages/TasksStable.tsx',
].filter((file) => fs.existsSync(file));

const texts = Object.fromEntries(files.map((file) => [file, fs.readFileSync(file, 'utf8')]));
const caseDetail = texts['src/pages/CaseDetail.tsx'] || '';

assert.ok(caseDetail.includes(stage), 'STAGE232L marker missing in CaseDetail');
assert.ok(caseDetail.includes('function ' + goodHelper + '(task: TaskRecord)'), 'defined linked-note helper missing');
assert.ok(caseDetail.includes(goodHelper + '(task)'), 'delete handler must call defined linked-note helper');
assert.ok(!caseDetail.includes(badHelper + '('), 'CaseDetail still calls undefined linked-note helper');

for (const [file, text] of Object.entries(texts)) {
  assert.ok(!text.includes(badHelper + '('), file + ' contains undefined helper call ' + badHelper);
}

assert.ok(caseDetail.includes("await deleteTaskFromSupabase(task.id);"), 'CaseDetail task delete branch missing');
assert.ok(caseDetail.includes("await deleteEventFromSupabase(event.id);"), 'CaseDetail event delete branch missing');

console.log(JSON.stringify({ ok: true, stage, guard: 'check-stage232l-delete-linked-note-reference-sweep' }, null, 2));
