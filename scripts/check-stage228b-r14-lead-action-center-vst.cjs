#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const repoRoot = process.cwd();
const leadPath = path.join(repoRoot, 'src/pages/LeadDetail.tsx');
const source = fs.readFileSync(leadPath, 'utf8');
const css = [
  fs.readFileSync(path.join(repoRoot, 'src/styles/owners/closeflow-page-adapters.css'), 'utf8'),
  fs.readFileSync(path.join(repoRoot, 'src/styles/owners/closeflow-rails-and-detail.css'), 'utf8'),
].join('\n');
const failures = [];
for (const token of [
  'STAGE228B_R14_LEAD_ACTION_CENTER_VST',
  'data-stage228b-r14-lead-action-center-vst="true"',
  'lead-detail-stage228b-work-action-center',
  'lead-detail-stage228d-action-center',
  'lead-detail-action-accordion-group',
  'Najbliższe zadania, wydarzenia i braki przypięte do tego leada.',
]) {
  if (!source.includes(token) && !css.includes(token)) failures.push('missing token: ' + token);
}
if (!/Najbliższe zadania, wydarzenia i braki przypięte do tego leada\./u.test(source)) failures.push('missing canonical lead action-center copy');
if (source.includes('Działania leada: zadania, wydarzenia i braki w jednym miejscu.')) failures.push('duplicate old action copy still present');
if (source.includes('return entry.isOverdue || title.includes')) failures.push('overdue events are still duplicated as blockers');
if (source.includes('â€˘') || source.includes('â€¢')) failures.push('mojibake bullet still present');
if (!css.includes('"ownerId":"semantic:page-adapters"') || !css.includes('src/pages/LeadDetail.tsx')) failures.push('LeadDetail route adaptation is not registered in the canonical page-adapter owner.');
if (!css.includes('"ownerId":"semantic:rails-detail"') || !css.includes('.lead-detail-vnext-page')) failures.push('LeadDetail rail/detail layout is not registered in the canonical rails/detail owner.');
if (!css.includes('.lead-detail-action-accordion')) failures.push('LeadDetail action accordion lacks a registered structural owner.');
if (failures.length) {
  console.error('STAGE228B_R14_LEAD_ACTION_CENTER_VST_GUARD FAILED');
  for (const failure of failures) console.error('- ' + failure);
  process.exit(1);
}
console.log(JSON.stringify({ ok: true, stage: 'STAGE228B_R14_LEAD_ACTION_CENTER_VST', guard: 'check:stage228b-r14-lead-action-center-vst' }, null, 2));
