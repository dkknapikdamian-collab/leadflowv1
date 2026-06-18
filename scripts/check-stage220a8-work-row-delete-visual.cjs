const fs = require('fs');
const path = require('path');

const repo = process.cwd();
const caseText = fs.readFileSync(path.join(repo, 'src/pages/CaseDetail.tsx'), 'utf8');
const css = fs.readFileSync(path.join(repo, 'src/styles/closeflow-detail-view-source-truth-stage219.css'), 'utf8');

const errors = [];
const must = (ok, msg) => { if (!ok) errors.push(msg); };

must(caseText.includes("type CaseActionAccordionGroup = 'next' | 'blockers' | 'active' | null;"), 'accordion type must support null');
must(caseText.includes('setCaseActionOpenGroup((current) => current === group.key ? null : group.key)'), 'accordion trigger must toggle closed on second click');

must(caseText.includes('deleteTaskFromSupabase'), 'task delete import missing');
must(caseText.includes('deleteEventFromSupabase'), 'event delete import missing');
must(caseText.includes('deleteWorkItemTarget'), 'delete work item target state missing');
must(caseText.includes('deleteWorkItemPending'), 'delete pending state missing');
must(caseText.includes('STAGE220A8_5_WORK_ITEM_DELETE_HANDLER'), 'delete handler marker missing');
must(caseText.includes('await deleteTaskFromSupabase'), 'task delete call missing');
must(caseText.includes('await deleteEventFromSupabase'), 'event delete call missing');
must(caseText.includes('STAGE232K_CASE_DETAIL_LEGACY_CASE_ITEM_DELETE_NO_METHOD_ALLOWED'), 'legacy case_items no DELETE stage missing');
must(caseText.includes('updateCaseItemInSupabase({'), 'legacy case_items delete must use updateCaseItemInSupabase soft close');
must(!/await\s+deleteCaseItemFromSupabase\(item\.id\);/.test(caseText), 'legacy active row must not call physical DELETE/METHOD_NOT_ALLOWED path');
must(caseText.includes('data-stage220a8-delete-work-item="true"'), 'row delete button marker missing');
must(caseText.includes('data-stage220a8-delete-work-item-confirm="true"'), 'delete confirm marker missing');
must(caseText.includes('onDelete={openDeleteWorkItemConfirm}'), 'WorkItemRow delete prop not wired');

must(caseText.includes('data-stage220a8-work-row="true"'), 'work row data marker missing');
must(css.includes('STAGE220A8_5_WORK_ROW_VISUAL_CLARITY'), 'visual clarity CSS marker missing');
must(css.includes('border-left-width: 4px'), 'row left visual strip missing');
must(css.includes('.stage220a8-work-row-task'), 'task row style missing');
must(css.includes('.stage220a8-work-row-event'), 'event row style missing');
must(css.includes('.stage220a8-work-row-missing'), 'missing row style missing');
must(css.includes('.case-detail-row-action-trash'), 'trash button style missing');
must(css.includes('content: "+"'), 'accordion plus indicator missing');
must(css.includes('content: "–"'), 'accordion minus indicator missing');

if (errors.length) {
  console.error('Stage220A8 work row delete visual guard failed:');
  for (const error of errors) console.error('- ' + error);
  process.exit(1);
}

console.log('OK Stage220A8 work row delete visual guard passed');
