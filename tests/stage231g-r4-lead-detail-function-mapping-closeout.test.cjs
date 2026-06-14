const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const lead = fs.readFileSync(path.join(root, 'src/pages/LeadDetail.tsx'), 'utf8');
const css = fs.readFileSync(path.join(root, 'src/styles/visual-stage14-lead-detail-vnext.css'), 'utf8');

test('STAGE231G_R4 uses ContextActionDialogs as the only missing_item creation path in LeadDetail', () => {
  assert.equal(lead.includes('MissingItemQuickActionModal'), false);
  assert.equal(lead.includes('buildMissingItemModalDraft'), false);
  assert.equal(lead.includes('openLeadMissingItemDialog'), false);
  assert.equal(lead.includes('handleSaveLeadMissingItem'), false);
  assert.equal(lead.includes('missingItemDialogOpen'), false);
  assert.match(lead, /openLeadContextAction\('blocker'\)/);
  assert.match(lead, /data-stage231g-r4-context-blocker-only="true"/);
});

test('STAGE231G_R4 overflow missing_item delete uses hard missing delete route', () => {
  const overflowStart = lead.indexOf('lead-detail-overflow-work-summary');
  const overflowEnd = lead.indexOf('lead-detail-stage228b-work-action-center', overflowStart);
  assert.ok(overflowStart >= 0 && overflowEnd > overflowStart);
  const overflow = lead.slice(overflowStart, overflowEnd);
  assert.match(overflow, /isMissingItemTimelineEntry\(entry\) \? \(/);
  assert.match(overflow, /data-stage231g-r4-overflow-missing-delete="true"/);
  assert.match(overflow, /handleDeleteLeadMissingItemStage228R15\(entry\)/);
  assert.match(overflow, /handleDeleteLinkedTask\(entry\.raw\)/);
});

test('STAGE231G_R4 work-row CSS is safe at medium width', () => {
  assert.equal(css.includes('minmax(260px, 1fr) auto minmax(280px, auto)'), false);
  assert.equal(css.includes('minmax(220px, 1fr) auto minmax(220px, auto)'), false);
  assert.match(css, /\.lead-detail-work-row\s*\{[\s\S]*grid-template-columns: 38px minmax\(0, 1fr\);[\s\S]*align-items: start;/);
  assert.match(css, /\.lead-detail-work-row__actions\s*\{[\s\S]*grid-column: 2;[\s\S]*max-width: 100%;/);
  assert.match(css, /@media \(min-width: 1280px\)[\s\S]*grid-template-columns: 38px minmax\(0, 1fr\) max-content minmax\(0, auto\);/);
});

test('STAGE231G_R4 does not remove R3 operational wiring', () => {
  assert.match(lead, /data-stage231g-potential-edit-action="true"/);
  assert.match(lead, /data-stage231g-finance-edit-potential="true"/);
  assert.match(lead, /leadNextActionEntries/);
  assert.match(lead, /handleDeleteLeadMissingItemStage228R15\(entry\)/);
});
