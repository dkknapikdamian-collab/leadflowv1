const fs = require('fs');

const lead = fs.readFileSync('src/pages/LeadDetail.tsx', 'utf8');

function fail(message) {
  console.error(`FAIL STAGE227E_LEGACY_SALES_CONTEXT_GUARD: ${message}`);
  process.exit(1);
}

if (lead.includes('STAGE227E2_REMOVE_SALES_CONTEXT_BLOCK')) {
  if (lead.includes('data-stage227e4-sales-signal-section="true"')) fail('E4 runtime sales context returned after E2');
  if (lead.includes('data-stage227e4r2-sales-context-section="true"')) fail('E4R2 runtime sales context returned after E2');
  if (lead.includes('leadSalesSignalItemsStage227E4.map')) fail('sales context item map returned after E2');
  console.log('PASS STAGE227E_LEGACY_SALES_CONTEXT_GUARD_SUPERSEDED_BY_E2');
  process.exit(0);
}

if (!lead.includes('STAGE227E4_LEAD_DETAIL_SALES_SIGNAL_SECTION')) fail('missing legacy E4 marker');
console.log('PASS STAGE227E_LEGACY_SALES_CONTEXT_GUARD');