const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const repoRoot = process.cwd();
const lead = fs.readFileSync(path.join(repoRoot, 'src', 'pages', 'LeadDetail.tsx'), 'utf8');
const css = fs.readFileSync(path.join(repoRoot, 'src', 'styles', 'closeflow-lead-detail-sales-signal-stage227e4.css'), 'utf8');

test('Stage227E4 renders Sales Signal before Lead Work Action Center', () => {
  assert.ok(lead.includes('STAGE227E4_LEAD_DETAIL_SALES_SIGNAL_SECTION'));
  assert.ok(lead.includes('data-stage227e4-sales-signal-section="true"'));
  assert.ok(lead.indexOf('data-stage227e4-sales-signal-section="true"') < lead.indexOf('lead-detail-stage228b-work-action-center'));
});

test('Stage227E4 exposes the required sales signal fields', () => {
  for (const label of ['Problem / potrzeba', 'Powód kontaktu', 'Termin / pilność', 'Budżet / potencjał', 'Decyzja', 'Blokada']) {
    assert.ok(lead.includes(label), 'missing label: ' + label);
  }
  assert.ok(lead.includes('leadSalesSignalItemsStage227E4'));
  assert.ok(lead.includes('buildLeadSalesSignalStage227E4'));
});

test('Stage227E4 uses existing data without migration-only dependency', () => {
  const helperStart = lead.indexOf('function buildLeadSalesSignalStage227E4');
  const helperEnd = lead.indexOf('export default function LeadDetail()', helperStart);
  assert.ok(helperStart > -1 && helperEnd > helperStart, 'helper is isolated');
  const helper = lead.slice(helperStart, helperEnd);
  assert.ok(helper.includes('primaryNote'));
  assert.ok(helper.includes('financePotential'));
  assert.ok(helper.includes('riskReason'));
  assert.ok(!helper.includes('insertActivityToSupabase'));
  assert.ok(!helper.includes('updateLeadInSupabase'));
});

test('Stage227E4 has dedicated CSS classes', () => {
  assert.ok(css.includes('lead-detail-sales-signal-section'));
  assert.ok(css.includes('lead-detail-sales-signal-grid'));
  assert.ok(css.includes('lead-detail-sales-signal-card--missing'));
});
