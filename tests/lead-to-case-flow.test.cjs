const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');

test('lead start service uses shared server operation and redirects to /cases/:id', () => {
  const leadsApi = read('api/leads.ts');
  const leadDetail = read('src/pages/LeadDetail.tsx');

  assert.match(leadsApi, /startLeadServiceOperation/);
  assert.match(leadsApi, /LEAD_ALREADY_HAS_CASE/);
  assert.match(leadDetail, /navigate\(`\/cases\/\$\{/);
});

test('server operation persists lead moved-to-service activity payload', () => {
  const serverHandler = read('src/server/lead-to-case.ts');
  assert.match(serverHandler, /event_type:\s*'lead_moved_to_service'/);
  assert.match(serverHandler, /linked_case_id|caseId/);
  assert.match(serverHandler, /movedToServiceAt/);
});
