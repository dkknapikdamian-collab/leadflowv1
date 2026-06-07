const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');

test('Stage227F6 removes LeadDetail top shortcut row and moves content up', () => {
  const lead = fs.readFileSync('src/pages/LeadDetail.tsx', 'utf8');
  assert.match(lead, /STAGE227F6_LEAD_TOP_STRIP_REMOVED_CADENCE_FUNNEL_WIDTH/);
  assert.match(lead, /data-stage227f6-lead-top-strip-removed="true"/);
  assert.doesNotMatch(lead, /lead-detail-stage227f5-top-strip case-detail-stage220a10-tabs-wrap/);
});

test('Stage227F6 makes contact cadence compact on Leads and Clients', () => {
  const leads = fs.readFileSync('src/pages/Leads.tsx', 'utf8');
  const clients = fs.readFileSync('src/pages/Clients.tsx', 'utf8');
  assert.match(leads, /data-stage227f6-contact-cadence-compact="leads"/);
  assert.match(clients, /data-stage227f6-contact-cadence-compact="clients"/);
  assert.doesNotMatch(leads, /Filtruje leady po dacie ostatniego kontaktu/);
  assert.doesNotMatch(clients, /Filtruje klientów po dacie ostatniego kontaktu/);
});

test('Stage227F6 widens SalesFunnel with shared full width canvas', () => {
  const funnel = fs.readFileSync('src/pages/SalesFunnel.tsx', 'utf8');
  const css = fs.readFileSync('src/styles/closeflow-unified-page-canvas-stage211c.css', 'utf8');
  assert.match(funnel, /data-stage227f6-sales-funnel-wide-shell="true"/);
  assert.match(funnel, /sales-funnel-stage227f6-canvas space-y-5/);
  assert.doesNotMatch(funnel, /mx-auto max-w-\[1260px\]/);
  assert.match(css, /sales-funnel-stage227f6-canvas/);
});
