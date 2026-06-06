#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const repoRoot = process.cwd();
const leadPath = path.join(repoRoot, 'src/pages/LeadDetail.tsx');
const cssPath = path.join(repoRoot, 'src/styles/visual-stage14-lead-detail-vnext.css');
const source = fs.readFileSync(leadPath, 'utf8');
const css = fs.readFileSync(cssPath, 'utf8');
const failures = [];
for (const token of [
  'STAGE228B_R14_LEAD_ACTION_CENTER_VST',
  'data-stage228b-r14-lead-action-center-vst="true"',
  'lead-detail-stage228b-r14-action-center',
  'lead-detail-stage228b-r14-quick-actions',
  'lead-detail-stage228b-r14-group',
  'Najbliższe zadania, wydarzenia i braki przypięte do tego leada.',
]) {
  if (!source.includes(token) && !css.includes(token)) failures.push('missing token: ' + token);
}
if (source.includes('Działania leada: zadania, wydarzenia i braki w jednym miejscu.')) failures.push('duplicate old action copy still present');
if (source.includes('return entry.isOverdue || title.includes')) failures.push('overdue events are still duplicated as blockers');
if (source.includes('â€˘') || source.includes('â€¢')) failures.push('mojibake bullet still present');
if (!css.includes('STAGE228B_R14_LEAD_ACTION_CENTER_VST_CSS')) failures.push('missing R14 CSS source marker');
if (failures.length) {
  console.error('STAGE228B_R14_LEAD_ACTION_CENTER_VST_GUARD FAILED');
  for (const failure of failures) console.error('- ' + failure);
  process.exit(1);
}
console.log(JSON.stringify({ ok: true, stage: 'STAGE228B_R14_LEAD_ACTION_CENTER_VST', guard: 'check:stage228b-r14-lead-action-center-vst' }, null, 2));
