const assert = require('assert');
const fs = require('fs');
const test = require('node:test');

const lead = fs.readFileSync('src/pages/LeadDetail.tsx', 'utf8');
const css = fs.readFileSync('src/styles/visual-stage14-lead-detail-vnext.css', 'utf8');

test('Stage227F1 keeps four decision cards as the top decision dashboard', () => {
  assert.ok(lead.includes('data-stage227f1-decision-dashboard="true"'));
  assert.ok(lead.includes('data-stage227e3-next-step-card="true"'));
  assert.ok(lead.includes('data-stage227e3-potential-card="true"'));
  assert.ok(lead.includes('data-stage227e3-silence-risk-card="true"'));
  assert.ok(lead.includes('data-stage227e3-blocker-card="true"'));
  assert.match(css, /grid-template-columns:\s*repeat\(4,\s*minmax\(0,\s*1fr\)\)/);
});

test('Stage227F1 removes the redundant work-center super-heading but keeps the work center', () => {
  const marker = 'data-stage227f1-work-center="true"';
  const workIdx = lead.indexOf(marker);
  assert.ok(workIdx >= 0, 'F1 work center marker should exist');
  const workSlice = lead.slice(Math.max(0, workIdx - 1400), workIdx + 2600);
  assert.ok(workSlice.includes('data-stage227e5-work-center-blockers-source="true"'));
  assert.match(workSlice, /<h2>[^<]*leada<\/h2>/);
  assert.ok(!lead.includes('CO ROBIMY TERAZ?'));
  assert.ok(!workSlice.includes('lead-detail-box-kicker'));
});

test('Stage227F1 CSS keeps the dashboard visually dominant and lower sections calmer', () => {
  assert.ok(css.includes('STAGE227F1_LEAD_DETAIL_VISUAL_HIERARCHY_POLISH'));
  assert.ok(css.includes('data-stage227f1-decision-dashboard'));
  assert.ok(css.includes('data-stage227f1-work-center'));
  assert.ok(css.includes('lead-detail-main-column'));
});