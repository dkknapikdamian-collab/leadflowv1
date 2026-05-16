const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

const root = process.cwd();

function read(relPath) {
  return fs.readFileSync(path.join(root, relPath), 'utf8');
}

const leadsApi = read('api/leads.ts');
const serverHandler = read('src/server/lead-to-case.ts');
const leadDetail = read('src/pages/LeadDetail.tsx');

assert.match(leadsApi, /startLeadServiceOperation/);
assert.match(leadsApi, /action\)\s*===\s*'start_service'/);
assert.match(serverHandler, /buildLeadMovedToServicePayload/);
assert.match(serverHandler, /event_type:\s*'lead_moved_to_service'/);
assert.match(serverHandler, /case_id:/);
assert.match(leadDetail, /navigate\(`\/cases\/\$\{.*caseId/);
assert.match(leadDetail, /Otw\u00F3rz spraw\u0119/);

console.log('PASS lead-to-case flow guard');
