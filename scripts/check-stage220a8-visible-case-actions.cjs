const fs = require('fs');
const path = require('path');

const repo = process.cwd();
const caseText = fs.readFileSync(path.join(repo, 'src/pages/CaseDetail.tsx'), 'utf8');
const taskText = fs.readFileSync(path.join(repo, 'src/components/TaskCreateDialog.tsx'), 'utf8');
const eventText = fs.readFileSync(path.join(repo, 'src/components/EventCreateDialog.tsx'), 'utf8');
const css = fs.readFileSync(path.join(repo, 'src/styles/closeflow-detail-view-source-truth-stage219.css'), 'utf8');

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
must(!belongsBlock.includes('caseRecord?.leadId'), 'belongsToCase must not use lead fallback');
must(!belongsBlock.includes('caseRecord?.clientId'), 'belongsToCase must not use client fallback');

must(!taskText.includes("'Follow-up: ' + context.recordLabel"), 'TaskCreateDialog still invents Follow-up title');
must(!eventText.includes("'Spotkanie: ' + context.recordLabel"), 'EventCreateDialog still invents Spotkanie title');
must(taskText.includes("title: '',"), 'TaskCreateDialog title should default to empty');
must(eventText.includes("title: '',"), 'EventCreateDialog title should default to empty');

must(caseText.includes('data-stage220a8-case-actions-preview="true"'), 'visible case actions preview missing');
must(caseText.includes('stage220a8-case-actions-preview-list'), 'visible case actions list missing');
must(caseText.includes('workItems.slice(0, 8).map'), 'visible case actions preview must render workItems');
must(caseText.includes('data-stage220a8-next-action-date="service"'), 'service next action date missing');
must(caseText.includes('data-stage220a8-next-action-date="top"'), 'top next action date missing');

must(css.includes('STAGE220A8_VISIBLE_CASE_ACTIONS'), 'CSS marker missing');
must(css.includes('.stage220a8-next-action-date'), 'next action date CSS missing');
must(css.includes('.stage220a8-case-actions-preview'), 'actions preview CSS missing');

if (errors.length) {
  console.error('Stage220A8 visible case actions guard failed:');
  for (const error of errors) console.error('- ' + error);
  process.exit(1);
}

console.log('OK Stage220A8 visible case actions guard passed');
