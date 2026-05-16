const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

const root = process.cwd();
const leadDetailPath = path.join(root, 'src/pages/LeadDetail.tsx');
const leadsPath = path.join(root, 'src/pages/Leads.tsx');
const todayPath = path.join(root, 'src/pages/Today.tsx');
const serviceStatePath = path.join(root, 'src/lib/lead-service-state.ts');

const leadDetail = fs.readFileSync(leadDetailPath, 'utf8');
const leads = fs.readFileSync(leadsPath, 'utf8');
const today = fs.readFileSync(todayPath, 'utf8');
const serviceState = fs.readFileSync(serviceStatePath, 'utf8');

assert.match(serviceState, /in_service/);
assert.match(serviceState, /moved_to_service/);
assert.match(serviceState, /isLeadInServiceStatus/);

assert.match(leadDetail, /Ten temat jest.*obs\u0142udze|Ten temat jest ju/);
assert.match(leadDetail, /!leadInService \? \(/);
assert.doesNotMatch(leadDetail, /Najbli\u017Csza akcja[\s\S]*leadInService \? \(/);

assert.match(leads, /!isLeadInTrash\(lead\) && !isLeadMovedToService\(lead\)/);
assert.match(today, /isActiveSalesLead\(lead\) && !isLeadMovedToService\(lead\)/);

console.log('PASS lead-service-state-ui guard');
