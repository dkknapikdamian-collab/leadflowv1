const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();

function fail(message) {
  console.error('STAGE78_LEAD_DETAIL_NO_STATIC_AI_FOLLOWUP_FAIL:', message);
  process.exit(1);
}
function read(relativePath) {
  const file = path.join(root, relativePath);
  if (!fs.existsSync(file)) fail('missing file: ' + relativePath);
  return fs.readFileSync(file, 'utf8');
}

const leadDetail = read('src/pages/LeadDetail.tsx');
const component = read('src/components/LeadAiFollowupDraft.tsx');
const aiLib = read('src/lib/ai-followup.ts');
const quietRunner = read('scripts/closeflow-release-check-quiet.cjs');
const pkg = JSON.parse(read('package.json'));

const forbiddenLeadDetailTokens = [
  "from '../components/LeadAiFollowupDraft'",
  'from "../components/LeadAiFollowupDraft"',
  '<LeadAiFollowupDraft',
  'data-ai-followup-draft-card=',
];
for (const token of forbiddenLeadDetailTokens) {
  if (leadDetail.includes(token)) fail('LeadDetail still renders/imports the static AI follow-up card token: ' + token);
}

// Important: do NOT ban the phrase "AI follow-up" globally. The reusable component may still own it.
// Stage78 removes the static right-rail usage from LeadDetail, not the AI draft capability itself.
if (!component.includes('data-ai-followup-draft-card="true"')) fail('LeadAiFollowupDraft component was removed or lost its DOM marker');
if (!component.includes('AI follow-up')) fail('LeadAiFollowupDraft component was unexpectedly changed');
if (!component.includes('Szkic odpowiedzi')) fail('LeadAiFollowupDraft component lost draft action copy');
if (!aiLib.includes('createLeadFollowupDraft')) fail('AI follow-up engine was removed');

if (pkg.scripts['check:stage78-lead-detail-no-static-ai-followup-card'] !== 'node scripts/check-stage78-lead-detail-no-static-ai-followup-card.cjs') {
  fail('package.json missing Stage78 check script');
}
if (pkg.scripts['test:stage78-lead-detail-no-static-ai-followup-card'] !== 'node --test tests/stage78-lead-detail-no-static-ai-followup-card.test.cjs') {
  fail('package.json missing Stage78 test script');
}
if (!quietRunner.includes("'tests/stage78-lead-detail-no-static-ai-followup-card.test.cjs'")) {
  fail('verify:closeflow:quiet is not wired to Stage78 regression test');
}

console.log('OK stage78 lead detail no static ai followup card');
