const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const repo = process.cwd();
const aiDraftsPath = path.join(repo, 'src', 'pages', 'AiDrafts.tsx');
const docPath = path.join(repo, 'docs', 'STAGE24_AI_DRAFT_RELATION_PICKER_2026-04-28.md');

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

test('Stage24 replaces manual relation IDs in AI drafts with searchable pickers', () => {
  const source = read(aiDraftsPath);

  assert.match(source, /AI_DRAFT_RELATION_PICKER_STAGE24/);
  assert.match(source, /fetchClientsFromSupabase/);
  assert.match(source, /fetchLeadsFromSupabase/);
  assert.match(source, /fetchCasesFromSupabase/);
  assert.match(source, /data-ai-draft-relation-picker=\{kind\}/);
  assert.match(source, /renderApprovalRelationPicker\('lead', 'Lead'/);
  assert.match(source, /renderApprovalRelationPicker\('case', 'Sprawa'/);
  assert.match(source, /renderApprovalRelationPicker\('client', 'Klient'/);
  assert.match(source, /Szukaj leada po nazwie/);
  assert.match(source, /Szukaj sprawy po nazwie/);
  assert.match(source, /Szukaj klienta po nazwie/);

  assert.doesNotMatch(source, /ID leada<Input/);
  assert.doesNotMatch(source, /ID sprawy<Input/);
  assert.doesNotMatch(source, /ID klienta<Input/);
});

test('Stage24 keeps final AI draft writes in approval flow with relation IDs selected from records', () => {
  const source = read(aiDraftsPath);

  assert.match(source, /leadId: form\.leadId \|\| null/);
  assert.match(source, /caseId: form\.caseId \|\| null/);
  assert.match(source, /clientId: form\.clientId \|\| null/);
  assert.match(source, /updateApprovalForm\(\{ \[field\]: option\.id \}/);
  assert.match(source, /Nie wpisuj ID recznie|Nie wpisuj ID ręcznie/);
});

test('Stage24 docs keep Polish encoding clean', () => {
  const doc = read(docPath);
  for (const marker of ['Ä', 'Å', 'Ã', 'Ĺ']) {
    assert.equal(doc.includes(marker), false, `mojibake marker found: ${marker}`);
  }
  assert.match(doc, /wyszukiwanie klienta/);
  assert.match(doc, /Kryterium zakończenia/);
});
