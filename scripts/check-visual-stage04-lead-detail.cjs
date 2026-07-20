const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
function read(file) {
  return fs.readFileSync(path.join(root, file), 'utf8').replace(/^\uFEFF/, '');
}
function expect(file, needle, label = needle) {
  if (!read(file).includes(needle)) throw new Error(`${file}: missing ${label}`);
  console.log(`OK: ${file} contains ${label}`);
}
function reject(file, needle, label = needle) {
  if (read(file).includes(needle)) throw new Error(`${file}: forbidden ${label}`);
  console.log(`OK: ${file} excludes ${label}`);
}
function rejectRegex(file, pattern, label = String(pattern)) {
  if (pattern.test(read(file))) throw new Error(`${file}: forbidden ${label}`);
  console.log(`OK: ${file} excludes ${label}`);
}

reject('src/index.css', 'visual-stage04-lead-detail.css', 'inactive Stage04 global CSS import');
expect('src/pages/LeadDetail.tsx', "../styles/visual-stage14-lead-detail-vnext.css", 'current LeadDetail Stage14 import');
expect('src/pages/LeadDetail.tsx', "../styles/closeflow-unified-page-canvas-stage211c.css", 'current LeadDetail canvas import');
expect('src/pages/LeadDetail.tsx', 'STAGE232A_R10_LEAD_DETAIL_VISUAL_SOURCE_TRUTH', 'current LeadDetail visual source marker');
expect('src/pages/LeadDetail.tsx', 'STAGE78_LEAD_DETAIL_NO_STATIC_AI_FOLLOWUP_CARD', 'no static AI follow-up card marker');
reject('src/pages/LeadDetail.tsx', 'LeadAiFollowupDraft', 'removed static AI follow-up component');
rejectRegex('src/pages/LeadDetail.tsx', /<LeadAiNextAction\b/, 'removed static AI next-action component');
expect('src/styles/visual-stage04-lead-detail.css', 'VISUAL_STAGE_04_LEAD_DETAIL_UI_SYSTEM', 'Stage04 reference CSS marker');

for (const required of [
  'startLeadServiceInSupabase',
  'startLeadToCaseHandoff',
  'caseDetailPath',
  'fetchCasesFromSupabase',
  'fetchPaymentsFromSupabase',
  'createPaymentInSupabase',
  'insertTaskToSupabase',
  'insertEventToSupabase',
  'updateLeadInSupabase',
  'deleteLeadFromSupabase',
  'getActivityTimelineTitle',
  'getActivityTimelineDescription',
  'TabsTrigger',
]) expect('src/pages/LeadDetail.tsx', required, `LeadDetail contract ${required}`);

console.log('OK: reconciled historical visual guard stage04 with current source truth.');
