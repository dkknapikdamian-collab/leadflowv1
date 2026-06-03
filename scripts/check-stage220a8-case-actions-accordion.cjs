const fs = require('fs');
const path = require('path');

const repo = process.cwd();
const caseText = fs.readFileSync(path.join(repo, 'src/pages/CaseDetail.tsx'), 'utf8');
const css = fs.readFileSync(path.join(repo, 'src/styles/closeflow-detail-view-source-truth-stage219.css'), 'utf8');

const errors = [];
const must = (ok, msg) => { if (!ok) errors.push(msg); };

must(caseText.includes("type CaseActionAccordionGroup = 'next' | 'blockers' | 'active';"), 'accordion group type missing');
must(caseText.includes('caseActionOpenGroup'), 'accordion open state missing');
must(caseText.includes('setCaseActionOpenGroup(group.key)'), 'accordion trigger does not set single open group');
must(caseText.includes('data-stage220a8-case-actions-accordion="true"'), 'accordion marker missing');
must(caseText.includes('data-stage220a8-case-actions-group={group.key}'), 'group data marker missing');
must(caseText.includes('workItems.slice(0, 5)'), 'active preview must be limited to 5 items');
must(caseText.includes("entry.kind === 'task' || entry.kind === 'event'"), 'nearest group must include task/event filter');
must(caseText.includes("entry.kind === 'missing'"), 'blocker group must include missing filter');
must(caseText.includes('data-stage220a8-show-all-actions="true"'), 'show all button missing');
must(caseText.includes('isCaseActionsAllOpen'), 'show all dialog state missing');
must(caseText.includes('data-stage220a8-case-actions-all-modal="true"'), 'show all modal marker missing');
must(caseText.includes('workItems.map((entry)'), 'show all modal must render all workItems');

must(css.includes('STAGE220A8_3_CASE_ACTIONS_ACCORDION'), 'accordion CSS marker missing');
must(css.includes('.stage220a8-case-actions-group-trigger'), 'accordion trigger CSS missing');
must(css.includes('.stage220a8-show-all-button'), 'show all button CSS missing');
must(css.includes('max-height: min(70vh, 680px)'), 'modal scroll height CSS missing');
must(css.includes('STAGE220A8_3_NEXT_ACTION_DATE_NOWRAP'), 'next date nowrap CSS marker missing');

if (errors.length) {
  console.error('Stage220A8 accordion guard failed:');
  for (const error of errors) console.error('- ' + error);
  process.exit(1);
}

console.log('OK Stage220A8 case actions accordion guard passed');
