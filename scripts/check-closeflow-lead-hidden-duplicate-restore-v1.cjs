#!/usr/bin/env node
const fs = require('fs');
function fail(message){ console.error('CLOSEFLOW_LEAD_HIDDEN_DUPLICATE_RESTORE_V1_FAIL: ' + message); process.exit(1); }
const api = fs.readFileSync('api/leads.ts', 'utf8');
const leads = fs.readFileSync('src/pages/Leads.tsx', 'utf8');
const doc = fs.readFileSync('docs/bugs/CLOSEFLOW_LEAD_HIDDEN_DUPLICATE_RESTORE_V1.md', 'utf8');
[
  'CLOSEFLOW_LEAD_CREATE_HIDDEN_DUPLICATE_RESTORE_V1',
  'restoreHiddenLeadForCreateIfNeeded',
  'restoreHiddenLeadForCreateAfterDuplicate',
  'LEAD_DUPLICATE_IN_HISTORY_OPEN_RECORD',
  'findHiddenLeadDuplicateCandidates',
].forEach((needle) => { if (!api.includes(needle)) fail('Brak w api/leads.ts: ' + needle); });
if (!leads.includes('Ten kontakt istnieje już w historii albo obsłudze')) fail('Brak czytelnego komunikatu UI dla duplikatu historycznego');
if (!doc.includes('Lead hidden duplicate restore v1')) fail('Brak dokumentacji fixa');
console.log('CLOSEFLOW_LEAD_HIDDEN_DUPLICATE_RESTORE_V1_OK');
