const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');

test('R12G guards explicit case quick action scope', () => {
  const source = fs.readFileSync('src/components/CaseQuickActions.tsx', 'utf8');
  assert.ok((source.match(/'data-context-case-id': caseId \|\| ''/g) || []).length >= 4);
});

test('R12G keeps context note savedRecord handoff before close', () => {
  const source = fs.readFileSync('src/components/ContextNoteDialog.tsx', 'utf8');
  const created = source.indexOf('const createdNote = await insertActivityToSupabase(input);');
  const saved = source.indexOf('await onSaved?.(savedRecord);', created);
  const close = source.indexOf('onOpenChange(false);', created);
  assert.ok(created >= 0);
  assert.ok(saved > created);
  assert.ok(close > saved);
  assert.ok(source.includes('savedRecord,'));
  assert.ok(source.includes('activity: savedRecord'));
});

test('R12G dedupes ClientDetail nearest actions after task/event merge', () => {
  const source = fs.readFileSync('src/pages/ClientDetail.tsx', 'utf8');
  assert.ok(source.includes('function getClientRightRailActionDedupeKeyStage231H_R1D2_R12G'));
  assert.ok(source.includes('getClientRightRailActionDedupeKeyStage231H_R1D2_R12G(candidate) === getClientRightRailActionDedupeKeyStage231H_R1D2_R12G(entry)'));
});

