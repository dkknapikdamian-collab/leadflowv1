const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = process.cwd();
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8').replace(/^\uFEFF/, '');
function between(text, start, end) {
  const s = text.indexOf(start);
  if (s < 0) return '';
  const e = text.indexOf(end, s + start.length);
  return e < 0 ? text.slice(s) : text.slice(s, e);
}

test('STAGE231G R8 validates R7 potential-only modal, source truth and work-row alignment', () => {
  const lead = read('src/pages/LeadDetail.tsx');
  const api = read('api/leads.ts');
  const css = read('src/styles/visual-stage14-lead-detail-vnext.css');
  const opener = between(lead, 'const handleStartPotentialEditingStage231G = () => {', 'const handleCancelPotentialEditingStage231GR7');
  assert.ok(lead.includes('data-stage231g-r7-potential-only-dialog="true"'));
  assert.ok(lead.includes('data-stage231g-r7-potential-only-input="true"'));
  assert.ok(lead.includes('handleSavePotentialStage231GR7'));
  assert.ok(opener.includes('setIsPotentialEditingStage231GR7(true)'));
  assert.ok(!opener.includes('setIsEditing(true)'));
  assert.ok(lead.includes('dealValue: amount'));
  assert.ok(lead.includes('deal_value: amount'));
  assert.ok(lead.includes('value: amount'));
  assert.ok(api.includes('payload.value = nextLeadValueStage231GR7'));
  assert.ok(api.includes('payload.deal_value = nextLeadValueStage231GR7'));
  assert.ok(api.includes('value: leadPotentialValueStage231GR7'));
  assert.ok(api.includes('deal_value: leadPotentialValueStage231GR7'));
  assert.ok(lead.includes('lead-detail-work-row__content'));
  assert.ok(lead.includes('lead-detail-work-row__status'));
  assert.ok(lead.includes('lead-detail-work-row__actions'));
  assert.ok(css.includes('STAGE231G_R7_POTENTIAL_ONLY_MODAL_AND_WORK_ROW_ALIGN'));
  assert.ok(css.includes('flex-wrap: nowrap'));
  assert.ok(css.includes('max-content'));
});