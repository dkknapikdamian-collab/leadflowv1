#!/usr/bin/env node
/* CLOSEFLOW_ETAP5_CASES_DELETE_FROM_LIST_FINAL_REPAIR
 * Purpose: fix broken JSX left by the first ETAP5 patch and keep safe case delete from /cases list.
 */
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const relPath = (rel) => path.join(root, rel);
const exists = (rel) => fs.existsSync(relPath(rel));
const read = (rel) => fs.readFileSync(relPath(rel), 'utf8');
const write = (rel, text) => {
  fs.mkdirSync(path.dirname(relPath(rel)), { recursive: true });
  fs.writeFileSync(relPath(rel), text, 'utf8');
  console.log('updated ' + rel.replace(/\\/g, '/'));
};
const fail = (message) => {
  console.error('✖ ' + message);
  process.exit(1);
};

const casesRel = 'src/pages/Cases.tsx';
const apiCasesRel = 'api/cases.ts';
const libCasesRel = 'src/lib/cases.ts';
const fallbackRel = 'src/lib/supabase-fallback.ts';
const pkgRel = 'package.json';

[casesRel, apiCasesRel, libCasesRel, fallbackRel, pkgRel].forEach((rel) => {
  if (!exists(rel)) fail('missing required file: ' + rel);
});

let cases = read(casesRel);

// EntityTrashButton was replaced with a text button, so keep only modalFooterClass import.
cases = cases.replace(
  "import { EntityTrashButton, modalFooterClass } from '../components/entity-actions';",
  "import { modalFooterClass } from '../components/entity-actions';",
);

// Harden delete handler.
const handlerRegex = /async function handleDeleteCase\(\) \{[\s\S]*?\n  \}\n\n  async function handleCreateCase/;
if (!handlerRegex.test(cases)) fail('could not locate handleDeleteCase block');
cases = cases.replace(handlerRegex, `async function handleDeleteCase() {
    if (!caseToDelete) return;

    const caseId = String(caseToDelete.id || '');
    if (!caseId) return;

    try {
      setDeletePending(true);
      await deleteCaseWithRelations(caseId);
      await refreshCases();
      toast.success('Sprawa została usunięta.');
      setCaseToDelete(null);
    } catch (error: any) {
      console.error(error);
      const message = String(error?.message || '');
      const hasRelationBlocker = /foreign key|violates|related|powiązan|działani/i.test(message);
      toast.error(hasRelationBlocker ? 'Nie można usunąć sprawy, bo ma powiązane działania.' : 'Nie udało się usunąć sprawy.');
    } finally {
      setDeletePending(false);
    }
  }

  async function handleCreateCase`);

// Replace the whole title-line region to remove broken leftovers like:
// </button> : <Trash2 ... />}
// </EntityTrashButton>
const titleLineRegex = /<span className="case-row-title-line">[\s\S]*?<\/span>\s*(?=<span className="cf-list-row-meta">)/;
if (!titleLineRegex.test(cases)) fail('could not locate case-row-title-line block');

const cleanTitleLine = `<span className="case-row-title-line">
                          <Link to={\`/case/\${record.id}\`} className="title">{record.title || 'Sprawa bez tytułu'}</Link>
                          <button
                            type="button"
                            className="btn ghost cf-case-row-delete-text-action cf-entity-action cf-entity-action-danger"
                            data-case-row-delete-action="true"
                            aria-label="Usuń sprawę"
                            title="Usuń sprawę"
                            disabled={deletePending && caseToDelete?.id === record.id}
                            onClick={(event) => {
                              event.preventDefault();
                              event.stopPropagation();
                              setCaseToDelete(record);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                            Usuń
                          </button>
                        </span>
                        `;
cases = cases.replace(titleLineRegex, cleanTitleLine);

if (cases.includes('</EntityTrashButton>')) fail('broken EntityTrashButton closing tag still present');
if (cases.includes(': <Trash2 className="cf-trash-action-icon')) fail('broken leftover ternary trash icon still present');
if (cases.includes('EntityTrashButton')) fail('EntityTrashButton reference still present');
if (!cases.includes('cf-case-row-delete-text-action')) fail('visible text delete action missing');
if (!cases.includes('await refreshCases();')) fail('delete handler must refresh cases after deletion');
if (cases.includes('window.location.reload')) fail('window.location.reload is forbidden');
write(casesRel, cases);

const apiCases = read(apiCasesRel);
[
  "if (req.method === 'DELETE')",
  "requireScopedRow('cases', id, workspaceId, 'CASE_NOT_FOUND')",
  "status: 'archived'",
  "primary_case_id: null",
  'assertWorkspaceWriteAccess',
].forEach((needle) => {
  if (!apiCases.includes(needle)) fail('api/cases.ts missing safe DELETE contract: ' + needle);
});

const libCases = read(libCasesRel);
if (!libCases.includes('deleteCaseWithRelations')) fail('src/lib/cases.ts missing deleteCaseWithRelations');
if (!libCases.includes('deleteCaseFromSupabase')) fail('src/lib/cases.ts missing deleteCaseFromSupabase bridge');

const fallback = read(fallbackRel);
if (!fallback.includes('deleteCaseFromSupabase')) fail('src/lib/supabase-fallback.ts missing deleteCaseFromSupabase');
if (!fallback.includes('/api/cases?id=')) fail('src/lib/supabase-fallback.ts missing /api/cases DELETE bridge');

const doc = `# CLOSEFLOW_ETAP5_CASES_DELETE_FROM_LIST — 2026-05-11

## Cel

Na widoku \`/cases\` z wiersza sprawy ma dać się bezpiecznie usunąć sprawę.

## Co ustalono z kodu

W repo istnieje już bezpieczniejszy wariant delete:

- \`src/lib/cases.ts\` ma \`deleteCaseWithRelations(caseId)\`.
- \`src/lib/supabase-fallback.ts\` ma most do \`DELETE /api/cases?id=...\`.
- \`api/cases.ts\` obsługuje \`DELETE\`, scope'uje sprawę przez workspace i archiwizuje sprawę statusem \`archived\`.
- API czyści tylko \`clients.primary_case_id\`, nie kasuje klienta ani leada.

## Zmiana UI

W \`src/pages/Cases.tsx\` akcja usunięcia z listy jest jawna:

- przycisk ma tekst \`Usuń\`,
- jest spokojnym danger action,
- nie odpala się po kliknięciu całej karty,
- używa \`event.preventDefault()\` oraz \`event.stopPropagation()\`,
- otwiera istniejący confirm dialog przez \`setCaseToDelete(record)\`.

## Zmiana działania po usunięciu

Po potwierdzeniu usunięcia:

- wywołuje \`deleteCaseWithRelations(caseId)\`,
- robi \`await refreshCases()\`, bez \`window.location.reload()\`,
- pokazuje sukces \`Sprawa została usunięta.\`,
- przy błędzie relacji pokazuje \`Nie można usunąć sprawy, bo ma powiązane działania.\`,
- przy innym błędzie pokazuje \`Nie udało się usunąć sprawy.\`.

## Poprawka finalna

Pierwsza paczka naruszyła JSX, bo regex zamienił tylko otwarcie \`EntityTrashButton\`, zostawiając fragment starego renderu. Finalizer wymienia cały blok \`case-row-title-line\`, usuwa pozostałości \`EntityTrashButton\` i dopiero potem odpala guard oraz build.

## Nie zmieniono

- nie dodano usuwania klienta,
- nie dodano usuwania leada,
- nie dodano cascade delete,
- nie zmieniono relacji lead/client/case,
- nie zmieniono tworzenia spraw.

## Test ręczny

1. Wejdź na \`/cases\`.
2. Kliknij \`Usuń\` przy sprawie.
3. Anuluj confirm: sprawa zostaje.
4. Kliknij ponownie i potwierdź.
5. Sprawa znika z listy.
6. Odśwież stronę: sprawa nie wraca.
7. Klient nadal istnieje.
8. Lead źródłowy, jeśli istnieje, nadal istnieje.
`;
write('docs/feedback/CLOSEFLOW_ETAP5_CASES_DELETE_FROM_LIST_2026-05-11.md', doc);

const guard = `#!/usr/bin/env node
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
`;
write('scripts/check-closeflow-etap5-cases-delete-from-list.cjs', guard);

let pkg = JSON.parse(read(pkgRel));
pkg.scripts = pkg.scripts || {};
pkg.scripts['check:etap5-cases-delete-from-list'] = 'node scripts/check-closeflow-etap5-cases-delete-from-list.cjs';
write(pkgRel, JSON.stringify(pkg, null, 2) + '\n');

console.log('✔ CLOSEFLOW_ETAP5_CASES_DELETE_FROM_LIST_FINAL repair applied');
