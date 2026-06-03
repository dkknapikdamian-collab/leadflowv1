const fs = require('fs');
const path = require('path');

const repo = process.cwd();
const caseText = fs.readFileSync(path.join(repo, 'src/pages/CaseDetail.tsx'), 'utf8');
const taskText = fs.readFileSync(path.join(repo, 'src/components/TaskCreateDialog.tsx'), 'utf8');
const eventText = fs.readFileSync(path.join(repo, 'src/components/EventCreateDialog.tsx'), 'utf8');

const errors = [];
const must = (ok, msg) => { if (!ok) errors.push(msg); };

function getFunctionBlock(text, name) {
  const start = text.indexOf('function ' + name + '(');
  if (start === -1) return '';
  const next = text.indexOf('\nfunction ', start + 10);
  return next === -1 ? text.slice(start) : text.slice(start, next);
}

const belongsBlock = getFunctionBlock(caseText, 'belongsToCase');

must(caseText.includes('STAGE220A8_STRICT_CASE_SCOPE'), 'missing strict case scope marker');
must(belongsBlock.includes('entryCaseId === currentCaseId'), 'belongsToCase must require exact caseId match');
must(!belongsBlock.includes('caseRecord?.leadId'), 'belongsToCase must not include lead fallback');
must(!belongsBlock.includes('caseRecord?.clientId'), 'belongsToCase must not include client fallback');
must(!belongsBlock.includes('normalized.leadId'), 'belongsToCase must not accept loose leadId');
must(!belongsBlock.includes('normalized.clientId'), 'belongsToCase must not accept loose clientId');

must(caseText.includes('.filter((task) => belongsToCase(task, caseId, normalizedCase))'), 'tasks must still use belongsToCase filter');
must(caseText.includes('.filter((event) => belongsToCase(event, caseId, normalizedCase))'), 'events must still use belongsToCase filter');

must(!taskText.includes("'Follow-up: ' + context.recordLabel"), 'TaskCreateDialog must not invent Follow-up title');
must(!eventText.includes("'Spotkanie: ' + context.recordLabel"), 'EventCreateDialog must not invent Spotkanie title');
must(taskText.includes("title: '',"), 'TaskCreateDialog default title should be empty');
must(eventText.includes("title: '',"), 'EventCreateDialog default title should be empty');

if (errors.length) {
  console.error('Stage220A8 strict case scope guard failed:');
  for (const error of errors) console.error('- ' + error);
  process.exit(1);
}

console.log('OK Stage220A8 strict case scope guard passed');
