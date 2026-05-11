#!/usr/bin/env node
/* CLOSEFLOW_ETAP5_CASES_DELETE_FROM_LIST_GUARD */
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');
const fail = (message) => {
  console.error('✖ ' + message);
  process.exit(1);
};

const cases = read('src/pages/Cases.tsx');
const apiCases = read('api/cases.ts');
const libCases = read('src/lib/cases.ts');
const fallback = read('src/lib/supabase-fallback.ts');

[
  "import { deleteCaseWithRelations } from '../lib/cases';",
  'const [caseToDelete, setCaseToDelete] = useState<CaseRecord | null>(null);',
  'const [deletePending, setDeletePending] = useState(false);',
  'async function handleDeleteCase()',
  'await deleteCaseWithRelations(caseId);',
  'await refreshCases();',
  "toast.success('Sprawa została usunięta.');",
  "toast.error(hasRelationBlocker ? 'Nie można usunąć sprawy, bo ma powiązane działania.' : 'Nie udało się usunąć sprawy.');",
  'className="case-row-title-line"',
  'data-case-row-delete-action="true"',
  'cf-case-row-delete-text-action',
  '<Trash2 className="h-4 w-4" />',
  'Usuń',
  'event.preventDefault();',
  'event.stopPropagation();',
  'setCaseToDelete(record);',
  '<ConfirmDialog',
].forEach((needle) => {
  if (!cases.includes(needle)) fail('Cases.tsx missing: ' + needle);
});

[
  'EntityTrashButton',
  '</EntityTrashButton>',
  ': <Trash2 className="cf-trash-action-icon',
  'window.location.reload',
].forEach((forbidden) => {
  if (cases.includes(forbidden)) fail('Cases.tsx contains forbidden/broken fragment: ' + forbidden);
});

[
  "if (req.method === 'DELETE')",
  "requireScopedRow('cases', id, workspaceId, 'CASE_NOT_FOUND')",
  "status: 'archived'",
  "primary_case_id: null",
  'assertWorkspaceWriteAccess',
].forEach((needle) => {
  if (!apiCases.includes(needle)) fail('api/cases.ts missing safe delete contract: ' + needle);
});

[
  'deleteCaseWithRelations',
  'deleteCaseFromSupabase',
].forEach((needle) => {
  if (!libCases.includes(needle)) fail('src/lib/cases.ts missing: ' + needle);
});

[
  'deleteCaseFromSupabase',
  '/api/cases?id=',
  "method: 'DELETE'",
].forEach((needle) => {
  if (!fallback.includes(needle)) fail('src/lib/supabase-fallback.ts missing: ' + needle);
});

console.log('✔ CLOSEFLOW_ETAP5_CASES_DELETE_FROM_LIST guard passed');
