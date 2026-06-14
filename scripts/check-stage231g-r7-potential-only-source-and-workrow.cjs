#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const root = process.cwd();
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8').replace(/^\uFEFF/, '');
const lead = read('src/pages/LeadDetail.tsx');
const api = read('api/leads.ts');
const css = read('src/styles/visual-stage14-lead-detail-vnext.css');
function ok(name) { return { ok: true, name }; }
function bad(name, details = '') { return { ok: false, name, details }; }
function between(text, start, end) {
  const s = text.indexOf(start);
  if (s < 0) return '';
  const e = text.indexOf(end, s + start.length);
  return e < 0 ? text.slice(s) : text.slice(s, e);
}
const checks = [];
const potentialOpener = between(lead, 'const handleStartPotentialEditingStage231G = () => {', 'const handleCancelPotentialEditingStage231GR7');
checks.push(lead.includes('data-stage231g-r7-potential-only-dialog="true"') ? ok('potential opens dedicated potential-only dialog') : bad('potential opens dedicated potential-only dialog'));
checks.push(lead.includes('data-stage231g-r7-potential-only-input="true"') ? ok('potential-only input marker present') : bad('potential-only input marker present'));
checks.push(lead.includes('handleSavePotentialStage231GR7') && lead.includes('updateLeadInSupabase({') ? ok('potential save uses dedicated update handler') : bad('potential save uses dedicated update handler'));
checks.push(lead.includes('dealValue: amount') && lead.includes('deal_value: amount') && lead.includes('value: amount') && lead.includes('contractValue: amount') && lead.includes('contract_value: amount') ? ok('potential save sends all value aliases') : bad('potential save sends all value aliases'));
checks.push(potentialOpener.includes('setIsPotentialEditingStage231GR7(true)') && !potentialOpener.includes('setIsEditing(true)') ? ok('potential CTA no longer opens full lead edit dialog') : bad('potential CTA no longer opens full lead edit dialog'));
checks.push(api.includes('payload.value = nextLeadValueStage231GR7') && api.includes('payload.deal_value = nextLeadValueStage231GR7') ? ok('PATCH /api/leads writes value and deal_value') : bad('PATCH /api/leads writes value and deal_value'));
checks.push(api.includes('value: leadPotentialValueStage231GR7') && api.includes('deal_value: leadPotentialValueStage231GR7') ? ok('POST /api/leads writes value and deal_value') : bad('POST /api/leads writes value and deal_value'));
checks.push(lead.includes('lead-detail-work-row__content') && lead.includes('lead-detail-work-row__status') && lead.includes('lead-detail-work-row__actions') ? ok('LeadDetail keeps work-row content/status/actions blocks') : bad('LeadDetail keeps work-row content/status/actions blocks'));
checks.push(css.includes('STAGE231G_R7_POTENTIAL_ONLY_MODAL_AND_WORK_ROW_ALIGN') ? ok('R7 CSS marker present') : bad('R7 CSS marker present'));
checks.push(css.includes('.lead-detail-stage228d-action-center .lead-detail-work-row__actions') && css.includes('flex-wrap: nowrap') && css.includes('max-content') ? ok('desktop work-row actions stay aligned in row') : bad('desktop work-row actions stay aligned in row'));
checks.push(!/(^|\n)(<{7}|={7}|>{7})/.test(lead + '\n' + api + '\n' + css) ? ok('no conflict markers in touched runtime files') : bad('no conflict markers in touched runtime files'));
const failed = checks.filter((entry) => !entry.ok);
if (failed.length) {
  console.error(JSON.stringify({ ok: false, stage: 'STAGE231G_R8_R7_GUARD_REPAIR', failed }, null, 2));
  process.exit(1);
}
console.log(JSON.stringify({ ok: true, stage: 'STAGE231G_R8_R7_GUARD_REPAIR', checked: checks.length }, null, 2));