#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const fail = [];
function read(file) { return fs.readFileSync(path.join(root, file), 'utf8'); }
function expect(condition, message) { if (!condition) fail.push(message); }

const api = read('api/leads.ts');
const lead = read('src/pages/LeadDetail.tsx');

expect(!api.includes('Klient - obsluga'), 'api/leads.ts still contains Klient - obsluga');
expect(!api.includes('obsĹ‚uga'), 'api/leads.ts still contains mojibake obsĹ‚uga');
expect(api.includes('Klient - obsługa') || api.includes('obsługa'), 'api/leads.ts should contain obsługa copy');

expect(lead.includes('leadServiceLockedMessage'), 'LeadDetail must define moved-to-service lock message');
expect(lead.includes('setIsQuickTaskOpen(false);'), 'LeadDetail must close quick task dialog after service move');
expect(lead.includes('setIsQuickEventOpen(false);'), 'LeadDetail must close quick event dialog after service move');
expect(lead.includes('setIsCreateCaseOpen(false);'), 'LeadDetail must close create case dialog after service move');
expect(lead.includes('Ten temat jest już w obsłudze'), 'LeadDetail must keep moved-to-service user copy');

const hasTaskOpenGuard = !lead.includes('setIsQuickTaskOpen(true);') || lead.includes('toast.error(leadServiceLockedMessage); return;');
const hasEventOpenGuard = !lead.includes('setIsQuickEventOpen(true);') || lead.includes('toast.error(leadServiceLockedMessage); return;');
const hasCreateCaseOpenGuard = !lead.includes('setIsCreateCaseOpen(true);') || lead.includes('toast.error(leadServiceLockedMessage); return;');

expect(hasTaskOpenGuard, 'LeadDetail quick task opening must be guarded after service move');
expect(hasEventOpenGuard, 'LeadDetail quick event opening must be guarded after service move');
expect(hasCreateCaseOpenGuard, 'LeadDetail create case opening must be guarded after service move');

if (fail.length) {
  console.error('P7 lead service closeout guard failed.');
  for (const item of fail) console.error('- ' + item);
  process.exit(1);
}
console.log('OK: P7 lead service closeout guard passed.');
