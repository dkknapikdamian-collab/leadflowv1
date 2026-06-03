const fs = require('fs');
const path = require('path');

const repo = process.cwd();
const text = fs.readFileSync(path.join(repo, 'src/pages/CaseDetail.tsx'), 'utf8');

const errors = [];
const must = (ok, msg) => { if (!ok) errors.push(msg); };

must(text.includes('updateLeadInSupabase'), 'updateLeadInSupabase import missing');
must(text.includes('STAGE220A8_7_LEAD_NEXT_ACTION_NOT_NULL_HEAL'), 'Stage220A8-7 marker missing');
must(text.includes('const ensureCaseLeadNextActionTitleSafe = async'), 'lead next action heal helper missing');
must(text.includes('nextStep: safeTitle'), 'helper must write nextStep safeTitle');
must(text.includes("'Działanie sprawy'"), 'helper must have safe fallback title');

const calls = (text.match(/await ensureCaseLeadNextActionTitleSafe/g) || []).length;
must(calls >= 6, 'expected heal call before task/event done/tomorrow/delete mutations, got ' + calls);

must(text.includes("await ensureCaseLeadNextActionTitleSafe(task.leadId || caseData?.leadId || null, task.title"), 'task heal call missing');
must(text.includes("await ensureCaseLeadNextActionTitleSafe(event.leadId || caseData?.leadId || null, event.title"), 'event heal call missing');
must(text.includes("await updateTaskInSupabase({ id: task.id, status: 'done' });"), 'task done update missing');
must(text.includes("await updateEventInSupabase({ id: event.id, status: 'done' });"), 'event done update missing');
must(text.includes('await deleteTaskFromSupabase(task.id);'), 'task delete call missing');
must(text.includes('await deleteEventFromSupabase(event.id);'), 'event delete call missing');

if (errors.length) {
  console.error('Stage220A8 lead next action not-null guard failed:');
  for (const error of errors) console.error('- ' + error);
  process.exit(1);
}

console.log('OK Stage220A8 lead next action not-null guard passed');
