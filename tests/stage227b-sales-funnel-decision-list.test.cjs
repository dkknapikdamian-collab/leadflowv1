const assert = require('node:assert/strict');
const { describe, it } = require('node:test');
const fs = require('node:fs');
const path = require('node:path');

describe('STAGE227B sales funnel decision list static contract', () => {
  const pagePath = path.join(process.cwd(), 'src/pages/SalesFunnel.tsx');
  const page = fs.readFileSync(pagePath, 'utf8');

  it('uses owner filters and a stage strip instead of a crowded kanban board', () => {
    assert.match(page, /data-stage227b-owner-filter-row="true"/);
    assert.match(page, /data-stage227b-stage-filter-strip="true"/);
    assert.match(page, /data-stage227b-decision-list="true"/);
    assert.doesNotMatch(page, /view\.columns\.map\(\(column\)\s*=>\s*\(\s*<section[\s\S]{0,600}data-stage227a-funnel-column/i);
  });

  it('keeps the view read-only and detail-link based', () => {
    assert.match(page, /data-stage227b-open-detail="true"/);
    assert.match(page, /to=\{card\.href\}/);
    assert.doesNotMatch(page, /updateLeadInSupabase|updateCaseInSupabase|insertLeadToSupabase|createCaseInSupabase|updateClientInSupabase/);
  });

  it('keeps Stage227A regression marker compatibility while replacing the UI model', () => {
    assert.match(page, /data-stage227a-funnel-card="true"/);
    assert.match(page, /data-stage227a-funnel-next-step="true"/);
    assert.match(page, /STAGE227B_SALES_FUNNEL_DECISION_LIST/);
    assert.match(page, /Bez przeładowanego kanbana/);
  });
});
