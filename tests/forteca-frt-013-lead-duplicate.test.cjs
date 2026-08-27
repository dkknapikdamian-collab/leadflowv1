const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

test('FRT-013 uses the real Lead create conflict flow and the Forteca calm-light variant', () => {
  const contract = read('_project/contracts/forteca-clean/FRT-013_LEAD_DUPLICATE.md');
  const leads = read('src/pages/Leads.tsx');
  const dialog = read('src/components/EntityConflictDialog.tsx');
  const handler = read('src/server/entity-conflicts-handler.ts');
  const apiLeads = read('api/leads.ts');
  const dialogCss = read('src/styles/owners/closeflow-dialogs.css');

  assert.match(contract, /STAGE_ID: FRT-013/);
  assert.match(contract, /TARGET_ROUTE: \/leads/);
  assert.match(contract, /TARGET_STATE: duplicate conflict during real Lead creation flow/);
  assert.match(leads, /findEntityConflictsInSupabase/);
  assert.match(leads, /toast\.error\('Nie udało się sprawdzić duplikatów/);
  assert.match(leads, /setLeadConflictPendingInput\(preparedLead\)/);
  assert.match(leads, /variant="forteca-lead-duplicate"/);
  assert.match(leads, /draft=\{leadConflictPendingInput\}/);
  assert.match(leads, /onCreateAnyway=\{handleCreateLeadAnyway\}/);
  assert.equal((leads.match(/<EntityConflictDialog/g) || []).length, 1);

  assert.match(dialog, /data-forteca-frt-013-lead-duplicate/);
  assert.match(dialog, /data-forteca-frt-013-new-lead/);
  assert.match(dialog, /data-forteca-frt-013-candidates/);
  assert.match(dialog, /candidate\.email/);
  assert.match(dialog, /candidate\.phone/);
  assert.match(dialog, /candidate\.sourceLabel \|\| candidate\.source/);
  assert.match(dialog, /onShow\(candidate\)/);
  assert.match(dialog, /setPreviewCandidateKey/);
  assert.doesNotMatch(dialog, /ACME Logistics|Jan Kowalski|Damian Knapik/);

  assert.match(handler, /async function safeRows\(query: string \| string\[\]\)/);
  assert.match(handler, /source,last_contact_at/);
  assert.match(handler, /buildLeadCandidate/);
  assert.match(handler, /lastContactAt/);
  assert.match(handler, /safeDisplayOwner/);

  assert.match(apiLeads, /const allowDuplicate = body\.allowDuplicate === true/);
  assert.match(apiLeads, /const restoredHiddenLeadForCreate = allowDuplicate \? null : await restoreHiddenLeadForCreateIfNeeded/);
  assert.match(apiLeads, /const restoredAfterDuplicate = allowDuplicate \? null : await restoreHiddenLeadForCreateAfterDuplicate/);

  assert.match(dialogCss, /FRT-013 — Forteca calm-light real Lead duplicate conflict/);
  assert.match(dialogCss, /width: min\(836px, calc\(100vw - 32px\)\)/);
  assert.match(dialogCss, /background: #ffffff !important/);
  assert.match(dialogCss, /@media \(max-width: 720px\)/);
  assert.match(dialogCss, /@media \(max-width: 480px\)/);
  assert.doesNotMatch(dialogCss, /#root[^\n]*data-forteca-frt-013/);
});

test('FRT-013 does not ship reference fixtures or invent merge/potential-duplicate persistence', () => {
  const source = read('src/components/EntityConflictDialog.tsx');
  assert.doesNotMatch(source, /ACME Sp\. z o\.o\.|Jan Kowalski|jan\.kowalski@acme\.pl|Damian Knapik/);
  assert.match(source, /Automatyczne scalanie nie jest wykonywane/);
  assert.match(source, /candidates\.map/);
});
