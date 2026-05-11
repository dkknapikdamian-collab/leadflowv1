const fs = require('fs');
const path = require('path');

const root = process.cwd();
const STAGE = 'CLOSEFLOW_CASE_TRASH_HISTORY_CLIENTDETAIL_DIAG_2026_05_11';

function file(rel) {
  return path.join(root, rel);
}

function read(rel) {
  const p = file(rel);
  if (!fs.existsSync(p)) throw new Error(`Missing file: ${rel}`);
  return fs.readFileSync(p, 'utf8').replace(/^\uFEFF/, '');
}

function write(rel, content) {
  fs.writeFileSync(file(rel), content, 'utf8');
}

function ensureDir(rel) {
  fs.mkdirSync(file(rel), { recursive: true });
}

function patchCasesTrashButton() {
  const rel = 'src/pages/Cases.tsx';
  let src = read(rel);
  let changed = false;

  if (!src.includes('EntityTrashButton')) {
    const oldImport = "import { modalFooterClass } from '../components/entity-actions';";
    const newImport = "import { EntityTrashButton, modalFooterClass } from '../components/entity-actions';";
    if (!src.includes(oldImport)) {
      throw new Error('Cases.tsx: cannot find entity-actions import for modalFooterClass');
    }
    src = src.replace(oldImport, newImport);
    changed = true;
  }

  const lines = src.split(/\r?\n/);
  const markerIndex = lines.findIndex((line) => line.includes('data-case-row-delete-action="true"'));
  if (markerIndex < 0) {
    throw new Error('Cases.tsx: cannot find data-case-row-delete-action="true"');
  }

  let start = markerIndex;
  while (start >= 0 && !lines[start].includes('<button')) start -= 1;
  if (start < 0) throw new Error('Cases.tsx: cannot find opening <button> for case row delete action');

  let end = markerIndex;
  while (end < lines.length && !lines[end].includes('</button>')) end += 1;
  if (end >= lines.length) throw new Error('Cases.tsx: cannot find closing </button> for case row delete action');

  const before = lines.slice(start, end + 1).join('\n');
  if (!before.includes('setCaseToDelete(record)')) {
    throw new Error('Cases.tsx: row delete action does not call setCaseToDelete(record) in detected block');
  }
  if (!before.includes('<Trash2')) {
    throw new Error('Cases.tsx: row delete action does not contain Trash2 icon in detected block');
  }

  if (lines[start].includes('<button')) {
    lines[start] = lines[start].replace('<button', '<EntityTrashButton');
    changed = true;
  }
  if (lines[end].includes('</button>')) {
    lines[end] = lines[end].replace('</button>', '</EntityTrashButton>');
    changed = true;
  }

  const next = lines.join('\n');
  if (!next.includes('EntityTrashButton')) throw new Error('Cases.tsx: patch failed, EntityTrashButton missing');
  if (!next.includes('data-case-row-delete-action="true"')) throw new Error('Cases.tsx: patch removed delete action marker');
  if (!next.includes('setCaseToDelete(record)')) throw new Error('Cases.tsx: patch removed setCaseToDelete(record)');
  if (changed) write(rel, next);
  return changed;
}

function patchCaseDetailHistoryFallback() {
  const rel = 'src/pages/CaseDetail.tsx';
  let src = read(rel);
  if (src.includes("return 'Dodano ruch w sprawie';")) return false;

  const start = src.indexOf('function getActivityText(activity: CaseActivity) {');
  if (start < 0) throw new Error('CaseDetail.tsx: missing getActivityText(activity: CaseActivity)');
  const end = src.indexOf('function sortCaseItems', start);
  if (end < 0) throw new Error('CaseDetail.tsx: missing sortCaseItems boundary after getActivityText');

  const block = src.slice(start, end);
  const lines = block.split(/\r?\n/);
  let fallbackLine = -1;
  for (let i = lines.length - 1; i >= 0; i -= 1) {
    if (/^\s*return\s+['`"].*;\s*$/.test(lines[i])) {
      fallbackLine = i;
      break;
    }
  }
  if (fallbackLine < 0) throw new Error('CaseDetail.tsx: cannot find fallback return in getActivityText block');

  const indent = (lines[fallbackLine].match(/^\s*/) || [''])[0];
  lines[fallbackLine] = `${indent}return 'Dodano ruch w sprawie';`;
  const nextBlock = lines.join('\n');
  const next = src.slice(0, start) + nextBlock + src.slice(end);

  if (!next.slice(start, start + nextBlock.length).includes("return 'Dodano ruch w sprawie';")) {
    throw new Error('CaseDetail.tsx: patch failed, required fallback copy missing');
  }
  write(rel, next);
  return true;
}

function writeClientDetailDiagnostic() {
  const rel = 'tools/diagnose-clientdetail-hook-order-2026-05-11.cjs';
  const content = `const fs = require('fs');
const file = 'src/pages/ClientDetail.tsx';
const src = fs.readFileSync(file, 'utf8').replace(/^\\uFEFF/, '');
const lines = src.split(/\\r?\\n/);
const startIndex = lines.findIndex((line) => line.includes('export default function ClientDetail') || line.includes('function ClientDetail(') || line.includes('const ClientDetail'));
if (startIndex < 0) { console.error('Missing ClientDetail component start'); process.exit(2); }
const hookRegex = /\\b(useState|useEffect|useMemo|useCallback|useRef|useWorkspace|useParams|useNavigate)\\s*\\(/;
const returnRegex = /^\\s*(if\\s*\\(.+\\)\\s*)?return\\b/;
const hooks = [];
const returns = [];
for (let i = startIndex; i < lines.length; i += 1) {
  const line = lines[i];
  if (hookRegex.test(line)) hooks.push({ line: i + 1, text: line.trim() });
  if (returnRegex.test(line)) returns.push({ line: i + 1, text: line.trim() });
}
const firstReturn = returns[0]?.line || null;
const hooksAfterFirstReturn = firstReturn ? hooks.filter((hook) => hook.line > firstReturn) : [];
console.log('ClientDetail hooks:', hooks.length);
console.log('ClientDetail returns:', returns.length);
if (firstReturn) console.log('First return:', firstReturn, returns[0].text);
if (hooksAfterFirstReturn.length) {
  console.error('FAIL ClientDetail has hooks after first return. This can cause React #310.');
  hooksAfterFirstReturn.forEach((hook) => console.error(hook.line + ': ' + hook.text));
  process.exit(1);
}
console.log('PASS ClientDetail no hooks after first return');
`;
  ensureDir('tools');
  write(rel, content);
  return true;
}

function writeReleaseDoc(results) {
  ensureDir('docs/release');
  const rel = 'docs/release/CLOSEFLOW_CASE_TRASH_HISTORY_CLIENTDETAIL_DIAG_2026-05-11.md';
  const content = `# CloseFlow case trash + history fallback + ClientDetail runtime diag

## Stage

${STAGE}

## Cel

Naprawia dwa czerwone guardy wykryte po diagnozie runtime:

1. Lista spraw ma używać wspólnego EntityTrashButton zamiast lokalnego przycisku kosza.
2. Historia sprawy ma mieć finalny fallback copy: \`Dodano ruch w sprawie\`.
3. Dodany jest lokalny diagnostic tool dla ClientDetail hook order, bez zmiany UI i bez obchodzenia React runtime.

## Zmienione pliki

- \`src/pages/Cases.tsx\`
- \`src/pages/CaseDetail.tsx\`
- \`tools/diagnose-clientdetail-hook-order-2026-05-11.cjs\`
- \`docs/release/CLOSEFLOW_CASE_TRASH_HISTORY_CLIENTDETAIL_DIAG_2026-05-11.md\`

## Wynik patcha

- Cases.tsx changed: ${results.casesChanged}
- CaseDetail.tsx changed: ${results.caseDetailChanged}
- ClientDetail diagnostic written: ${results.diagWritten}

## Weryfikacja wymagana po wdrożeniu

\`\`\`powershell
npm.cmd run build
npm.cmd run check:case-trash-actions
npm.cmd run check:stage68p-case-history-package-final
node tools/diagnose-clientdetail-hook-order-2026-05-11.cjs
npm.cmd run verify:closeflow:quiet
\`\`\`

## Uwaga

Ten patch nie maskuje React #310. Jeśli po deployu błąd nadal występuje, trzeba zebrać nieminizowany stack lokalnie albo z sourcemap/dev builda i wskazać konkretną linię hooka.
`;
  write(rel, content);
  return true;
}

const results = {
  casesChanged: patchCasesTrashButton(),
  caseDetailChanged: patchCaseDetailHistoryFallback(),
  diagWritten: writeClientDetailDiagnostic(),
};
writeReleaseDoc(results);
console.log(`PASS ${STAGE}`);
console.log(JSON.stringify(results, null, 2));
