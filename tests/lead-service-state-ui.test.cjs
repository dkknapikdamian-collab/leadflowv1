const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');

test('lead service state recognizes moved/in_service variants', async () => {
  const mod = await import('../src/lib/lead-service-state.ts');
  assert.equal(mod.isLeadInServiceStatus('moved_to_service'), true);
  assert.equal(mod.isLeadInServiceStatus('in_service'), true);
  assert.equal(mod.isLeadInServiceStatus('pozyskany_do_obslugi'), true);
  assert.equal(mod.isLeadInServiceStatus('new'), false);
});

test('lead detail gates right rail for active leads only', () => {
  const source = read('src/pages/LeadDetail.tsx');
  assert.match(source, /!leadInService \? \(\s*<aside className="lead-detail-right-rail"/);
});

test('leads and today exclude moved leads from active-sales queues', () => {
  const leads = read('src/pages/Leads.tsx');
  const today = read('src/pages/Today.tsx');
  assert.match(leads, /!isLeadInTrash\(lead\) && !isLeadMovedToService\(lead\)/);
  assert.match(today, /isActiveSalesLead\(lead\) && !isLeadMovedToService\(lead\)/);
});
