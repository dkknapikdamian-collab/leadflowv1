const assert = require('assert');
const fs = require('fs');
const test = require('node:test');

const lead = fs.readFileSync('src/pages/LeadDetail.tsx', 'utf8');
const css = fs.readFileSync('src/styles/visual-stage14-lead-detail-vnext.css', 'utf8');

function extractTopGrid() {
  const markers = [
    'data-stage227e3-decision-cards="true"',
    'data-stage227e2-top-cards="true"',
    'className="lead-detail-top-grid"',
  ];
  let start = -1;
  for (const marker of markers) {
    start = lead.indexOf(marker);
    if (start >= 0) break;
  }
  assert.ok(start >= 0, 'top decision grid start not found');
  const sectionStart = lead.lastIndexOf('<section', start);
  const from = sectionStart >= 0 ? sectionStart : start;
  const end = lead.indexOf('</section>', start);
  assert.ok(end >= 0, 'top decision grid end not found');
  return lead.slice(from, end + '</section>'.length);
}

const topGrid = extractTopGrid();

test('Stage227E3 keeps four decision cards in the top grid', () => {
  assert.ok(lead.includes('STAGE227E3_DECISION_CARDS_CLEANUP'));
  assert.ok(lead.includes('data-stage227e3-decision-cards="true"') || lead.includes('data-stage227e2-top-cards="true"'));
  assert.ok(topGrid.includes('data-stage227e2-next-step-card="true"'));
  assert.ok(topGrid.includes('data-stage227e2-potential-card="true"'));
  assert.ok(topGrid.includes('data-stage227e2-silence-risk-card="true"'));
  assert.ok(topGrid.includes('data-stage227e3-blocker-card="true"') || topGrid.includes('data-stage227e3-blockade-card="true"'));
  assert.ok(topGrid.includes('Blokada'));
  assert.ok((topGrid.match(/lead-detail-top-card/g) || []).length >= 4);
});

test('Stage227E3 top cards do not duplicate source/status or old decorative card', () => {
  assert.ok(!topGrid.includes('Aktywny lead'));
  assert.ok(!topGrid.includes('sourceLabel(lead.source)'));
  assert.ok(!topGrid.includes('statusLabel(lead.status)'));
});

test('Stage227E3 does not reintroduce sales context runtime block', () => {
  assert.ok(!lead.includes('data-stage227e4-sales-signal-section="true"'));
  assert.ok(!lead.includes('data-stage227e4r2-sales-context-section="true"'));
});

test('Stage227E3 has four-card CSS contract', () => {
  assert.ok(css.includes('STAGE227E3_DECISION_CARDS_CLEANUP_CSS'));
  assert.ok(css.includes('.lead-detail-top-grid'));
  assert.ok(css.includes('repeat(4, minmax(0, 1fr))') || css.includes('repeat(4,minmax(0,1fr))'));
  assert.ok(css.includes('lead-detail-callout-red') || css.includes('lead-detail-callout-danger') || css.includes('lead-detail-callout-blocker'));
});