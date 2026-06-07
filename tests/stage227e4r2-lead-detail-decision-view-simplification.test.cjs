const assert = require('assert');
const fs = require('fs');
const test = require('node:test');

const lead = fs.readFileSync('src/pages/LeadDetail.tsx', 'utf8');

test('legacy E4 sales context contracts are superseded by Stage227E2 removal', () => {
  if (lead.includes('STAGE227E2_REMOVE_SALES_CONTEXT_BLOCK')) {
    assert.doesNotMatch(lead, /data-stage227e4-sales-signal-section="true"/);
    assert.doesNotMatch(lead, /data-stage227e4r2-sales-context-section="true"/);
    assert.doesNotMatch(lead, /leadSalesSignalItemsStage227E4\.map/);
    return;
  }
  assert.ok(lead.includes('STAGE227E4_LEAD_DETAIL_SALES_SIGNAL_SECTION'));
});