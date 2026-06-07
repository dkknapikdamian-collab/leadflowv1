const fs = require('fs');

const lead = fs.readFileSync('src/pages/LeadDetail.tsx', 'utf8');
const css = fs.readFileSync('src/styles/closeflow-lead-detail-sales-signal-stage227e4.css', 'utf8');
const pkg = fs.readFileSync('package.json', 'utf8');

function pass(message) {
  console.log(`PASS ${message}`);
}

function fail(message) {
  console.error(`FAIL STAGE227E4_SALES_CONTEXT_SECTION: ${message}`);
  process.exit(1);
}

function mustContain(source, fragment, label = fragment) {
  if (!source.includes(fragment)) fail(`missing: ${label}`);
  pass(`contains: ${label}`);
}

function mustNotContain(source, fragment, label = fragment) {
  if (source.includes(fragment)) fail(`forbidden: ${label}`);
  pass(`not contains: ${label}`);
}

mustContain(lead, 'STAGE227E4_LEAD_DETAIL_SALES_SIGNAL_SECTION', 'Stage227E4 marker');
mustContain(lead, 'STAGE227E4R2_LEAD_DETAIL_DECISION_VIEW_SIMPLIFICATION', 'Stage227E4R2 marker');
mustContain(lead, 'buildLeadSalesSignalStage227E4');
mustContain(lead, 'leadSalesSignalItemsStage227E4');
mustContain(lead, 'data-stage227e4-sales-signal-section="true"', 'sales context section data marker');
mustContain(lead, 'data-stage227e4r2-sales-context-section="true"', 'R2 sales context section marker');
mustContain(lead, 'Kontekst sprzedażowy');
mustContain(lead, 'Potrzeba / problem');
mustContain(lead, 'Termin / pilność');
mustContain(lead, 'Budżet / potencjał');
mustContain(lead, 'Decyzja');
mustContain(lead, 'Blokada');

mustNotContain(lead, 'Powód kontaktu', 'source/reason card removed from context');
mustNotContain(lead, 'input.sourceLabel', 'sourceLabel fallback removed');
mustNotContain(lead, "String(lead.status || '').replaceAll", 'lead.status decision fallback removed');

const contextIndex = lead.indexOf('data-stage227e4r2-sales-context-section="true"');
const actionIndex = lead.indexOf('data-stage228b-lead-work-action-center="true"');
if (contextIndex === -1 || actionIndex === -1 || contextIndex > actionIndex) {
  fail('sales context must render before Work Action Center');
}
pass('sales context remains before Work Action Center');

mustContain(css, 'STAGE227E4_SALES_CONTEXT_SECTION_CSS', 'R2 CSS marker');
mustContain(css, 'lead-detail-sales-context-grid', 'compact context grid css');
mustContain(css, 'lead-detail-sales-context-card', 'compact context card css');
mustNotContain(css, 'min-height: 126px', 'old heavy card min-height removed');

mustContain(pkg, 'check:stage227e4r2-lead-detail-decision-view-simplification', 'package check script');
mustContain(pkg, 'test:stage227e4r2-lead-detail-decision-view-simplification', 'package test script');

console.log('PASS STAGE227E4_SALES_CONTEXT_SECTION');
