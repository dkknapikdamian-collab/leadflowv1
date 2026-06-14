const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
let failed = false;
const fail = (message) => {
  console.error('STAGE231G_R3 FAIL: ' + message);
  failed = true;
};
const assert = (condition, message) => {
  if (!condition) fail(message);
};

const lead = read('src/pages/LeadDetail.tsx');
const css = read('src/styles/visual-stage14-lead-detail-vnext.css');

assert(lead.includes('STAGE231G_LEAD_DETAIL_OPERATIONAL_WIRING_AUDIT_AND_FIX'), 'missing STAGE231G marker in LeadDetail');
assert(lead.includes('data-stage231g-potential-edit-action="true"'), 'potential card edit action missing');
assert(lead.includes('data-stage231g-finance-edit-potential="true"'), 'finance panel edit potential action missing');
assert(lead.includes('updateLeadInSupabase({') && lead.includes('dealValue: amount'), 'potential save must use updateLeadInSupabase with dealValue amount');
assert(lead.includes("replace(/\\s+/g, '')"), 'potential parser must use /\s+/g');
assert(!lead.includes("replace(/s+/g, '')"), 'potential parser still uses /s+/g');
assert(lead.includes('const leadNextActionEntries = useMemo('), 'leadNextActionEntries must be memoized');
assert(lead.includes("activeLeadWorkEntries.filter((entry) => !isMissingItemTimelineEntry(entry) && (entry.kind === 'task' || entry.kind === 'event'))"), 'missing_item must be excluded from leadNextActionEntries while keeping task/event scope');
assert(!lead.includes("activeLeadWorkEntries.filter((entry) => entry.kind === 'task' || entry.kind === 'event')"), 'old leadNextActionEntries filter still allows missing_item tasks');
assert(lead.includes('if (!nearestPlannedAction?.id) return leadNextActionEntries[0] || null;'), 'nextTimelineEntry must fallback to filtered leadNextActionEntries');
assert(!/return timeline\.find\(\(entry\) => !isDoneStatus\(entry\.status\)\)/.test(lead), 'nextTimelineEntry still falls back to full timeline');
assert(lead.includes('handleDeleteLeadMissingItemStage228R15(entry)'), 'missing_item delete must route through handleDeleteLeadMissingItemStage228R15');
assert(lead.includes('hardDeleteTaskFromSupabase(taskId)'), 'missing_item delete must hard delete task from Supabase');
assert(lead.includes('lead-detail-work-row__icon'), 'work row icon class missing');
assert(lead.includes('lead-detail-work-row__content'), 'work row content class missing');
assert(lead.includes('lead-detail-work-row__status'), 'work row status class missing');
assert(lead.includes('lead-detail-work-row__actions'), 'work row actions class missing');
assert(lead.includes('data-stage231g-next-step-action="true"'), 'next step card action missing');
assert(lead.includes('data-stage231g-risk-action="true"'), 'risk card follow-up action missing');
assert(lead.includes('data-stage231g-blocker-action="true"'), 'blocker card action missing');
assert(lead.includes("openLeadContextAction('blocker')"), 'blocker add path must use ContextActionDialogs blocker');
assert(lead.includes("key: 'note'") && lead.includes("key: 'task'") && lead.includes("key: 'event'") && lead.includes("key: 'missing'") && lead.includes("key: 'lost'") && lead.includes("key: 'service'"), 'quick actions set incomplete');
assert(css.includes('STAGE231G_R3_LEAD_DETAIL_FUNCTION_MAPPING_AND_OPERATIONAL_CLOSEOUT'), 'CSS stage marker missing');
assert(css.includes('.lead-detail-work-row__content') && css.includes('overflow-wrap: anywhere'), 'CSS must protect row content wrapping');

if (failed) process.exit(1);
console.log('STAGE231G_R3 PASS: LeadDetail function mapping and operational wiring guard passed.');
