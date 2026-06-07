const fs = require('fs');

const lead = fs.readFileSync('src/pages/LeadDetail.tsx', 'utf8');
const pkg = fs.readFileSync('package.json', 'utf8');

function pass(message) {
  console.log(`PASS ${message}`);
}

function fail(message) {
  console.error(`FAIL STAGE227E2_REMOVE_SALES_CONTEXT_BLOCK: ${message}`);
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

mustContain(lead, 'STAGE227E2_REMOVE_SALES_CONTEXT_BLOCK', 'stage marker');

// The E4/E4R2 sales context block was intentionally removed from runtime.
mustNotContain(lead, 'data-stage227e4-sales-signal-section="true"', 'old E4 sales context runtime section');
mustNotContain(lead, 'data-stage227e4r2-sales-context-section="true"', 'old E4R2 sales context runtime section');
mustNotContain(lead, 'lead-detail-sales-signal-section', 'old sales signal section class in runtime');
mustNotContain(lead, 'lead-detail-sales-context-section', 'old sales context section class in runtime');
mustNotContain(lead, 'leadSalesSignalItemsStage227E4.map', 'sales context runtime item map');
mustNotContain(lead, 'KONTEKST SPRZEDAĹ»OWY', 'sales context kicker');

// Work center remains the central operational section. Do not bind to title copy.
mustContain(lead, 'data-stage228b-lead-work-action-center="true"', 'work action center remains');
mustContain(lead, 'data-stage228d-lead-action-center-accordion="true"', 'accordion work center remains');
mustContain(lead, "key: 'next' as LeadActionAccordionGroup", 'next actions group remains');
mustContain(lead, "key: 'blockers' as LeadActionAccordionGroup", 'blockers group remains');
mustContain(lead, "key: 'active' as LeadActionAccordionGroup", 'active group remains');

// Action row contract is semantic, not Polish-label fragile.
mustContain(lead, 'openLinkedTaskEditor(entry.raw)', 'task edit action remains');
mustContain(lead, 'openLinkedEventEditor(entry.raw)', 'event edit action remains');
mustContain(lead, 'handleRescheduleLinkedTask(entry.raw', 'task tomorrow action remains');
mustContain(lead, 'handleRescheduleLinkedEvent(entry.raw', 'event tomorrow action remains');
mustContain(lead, 'handleToggleLinkedTask(entry.raw)', 'task done action remains');
mustContain(lead, 'handleToggleLinkedEvent(entry.raw)', 'event done action remains');
mustContain(lead, 'handleDeleteLinkedTask(entry.raw)', 'task delete action remains');
mustContain(lead, 'handleDeleteLinkedEvent(entry.raw)', 'event delete action remains');

// E1 header phone visibility must survive E2.
mustContain(lead, 'STAGE227E1_LEAD_HEADER_PHONE_VISIBILITY', 'E1 header marker remains');
mustContain(lead, 'Brak telefonu', 'explicit missing phone copy remains');
mustContain(lead, "copyValue('Telefon'", 'phone copy action remains');

mustContain(pkg, 'check:stage227e2-remove-sales-context-block', 'package check script');
mustContain(pkg, 'test:stage227e2-remove-sales-context-block', 'package test script');

console.log('PASS STAGE227E2_REMOVE_SALES_CONTEXT_BLOCK');