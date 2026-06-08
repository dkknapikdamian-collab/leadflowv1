#!/usr/bin/env node
const fs = require('fs');

function read(file) {
  return fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, '');
}
function fail(message) {
  console.error('STAGE228R19R2_MISSING_ITEM_ACTIVE_SOURCE_TRUTH_FAIL: ' + message);
  process.exit(1);
}
function between(text, startToken, endToken) {
  const start = text.indexOf(startToken);
  if (start < 0) return '';
  const end = endToken ? text.indexOf(endToken, start + startToken.length) : -1;
  return text.slice(start, end >= 0 ? end : Math.min(text.length, start + 2400));
}

const lead = read('src/pages/LeadDetail.tsx');
const pkg = JSON.parse(read('package.json'));
const guard = 'node scripts/check-stage228r19r2-missing-item-active-source-truth.cjs';

if (!lead.includes('STAGE228R19R2_MISSING_ITEM_ACTIVE_SOURCE_TRUTH')) fail('LeadDetail marker missing');
if (!lead.includes('const activeMissingItemEntriesStage228R19R2 = useMemo')) fail('active linkedTasks helper missing');
if (!lead.includes('return linkedTasks.filter')) fail('active Braki helper must filter linkedTasks');
if (!lead.includes('const leadBlockerEntries = activeMissingItemEntriesStage228R19R2;')) fail('leadBlockerEntries must use activeMissingItemEntriesStage228R19R2');
if (!lead.includes('hardDeleteTaskFromSupabase')) fail('hard delete helper must still be wired in LeadDetail');

const activeBlock = between(lead, 'const activeMissingItemEntriesStage228R19R2 = useMemo', 'const leadBlockerEntries = activeMissingItemEntriesStage228R19R2;');
if (!activeBlock.includes('linkedTasks.filter')) fail('active block is not based on linkedTasks.filter');
if (activeBlock.includes('timeline.filter')) fail('active Braki block must not filter timeline');
if (activeBlock.includes('activeLeadWorkEntries')) fail('active Braki block must not depend on activeLeadWorkEntries');
if (!activeBlock.includes("'deleted'")) fail('active Braki block must exclude deleted status');
if (!activeBlock.includes("'resolved'")) fail('active Braki block must exclude resolved status');
if (!activeBlock.includes('missing_item')) fail('active Braki block must identify missing_item');

if (!pkg.scripts || pkg.scripts['check:stage228r19r2-missing-item-active-source-truth'] !== guard) fail('package check script missing');
if (!String(pkg.scripts.prebuild || '').includes(guard)) fail('R19R2 guard is not wired into prebuild');

console.log(JSON.stringify({
  ok: true,
  stage: 'STAGE228R19R2_MISSING_ITEM_ACTIVE_SOURCE_TRUTH',
  contract: 'Lead active Braki source is linkedTasks only; activity/timeline cannot resurrect deleted missing items.',
}, null, 2));
