const fs = require('fs');
const path = require('path');

const root = process.cwd();
const caseDetailPath = path.join(root, 'src/pages/CaseDetail.tsx');
const cssPath = path.join(root, 'src/styles/closeflow-case-history-visual-source-truth.css');
const checkPath = path.join(root, 'scripts/check-closeflow-case-history-visual-source-truth.cjs');
const docPath = path.join(root, 'docs/release/CLOSEFLOW_CASE_HISTORY_VISUAL_SOURCE_TRUTH_2026-05-12.md');
const packagePath = path.join(root, 'package.json');

function read(file) {
  return fs.readFileSync(file, 'utf8');
}
function write(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, value, 'utf8');
}

if (!fs.existsSync(caseDetailPath)) {
  throw new Error('Missing src/pages/CaseDetail.tsx');
}

let caseDetail = read(caseDetailPath);
const importLine = "import '../styles/closeflow-case-history-visual-source-truth.css';";
if (!caseDetail.includes(importLine)) {
  const anchor = "import '../styles/visual-stage13-case-detail-vnext.css';";
  if (!caseDetail.includes(anchor)) {
    throw new Error('CaseDetail missing visual-stage13-case-detail-vnext.css import anchor.');
  }
  caseDetail = caseDetail.replace(anchor, `${anchor}\n${importLine}`);
  write(caseDetailPath, caseDetail);
}

const css = `/* CLOSEFLOW_CASE_HISTORY_VISUAL_SOURCE_TRUTH_2026_05_12
   owner: CloseFlow Visual System
   scope: CaseDetail history surfaces only
   goal: lower history/work rows must match the compact visual rhythm of the upper "Historia sprawy" card
   rule: visual-only; no Supabase/write/history data changes
*/

.case-detail-vnext-page {
  --cf-case-history-bg: #ffffff;
  --cf-case-history-line: #e2e8f0;
  --cf-case-history-text: #0f172a;
  --cf-case-history-muted: #64748b;
  --cf-case-history-blue: #2563eb;
  --cf-case-history-blue-soft: #eff6ff;
}

/* The history tab/list is a compact ledger, not a stack of large cards. */
.case-detail-vnext-page .case-detail-history-list {
  display: grid !important;
  gap: 0.48rem !important;
  padding: 0 !important;
  background: transparent !important;
  border: 0 !important;
  box-shadow: none !important;
}

/* Native history rows: same pill-row rhythm as the compact history card above. */
.case-detail-vnext-page .case-detail-history-row {
  min-height: 2.85rem !important;
  display: grid !important;
  grid-template-columns: minmax(0, 1fr) !important;
  align-items: center !important;
  gap: 0 !important;
  padding: 0.46rem 0.72rem !important;
  border: 1px solid var(--cf-case-history-line) !important;
  border-radius: 1rem !important;
  background: var(--cf-case-history-bg) !important;
  box-shadow: none !important;
}

.case-detail-vnext-page .case-detail-history-row > span {
  display: none !important;
}

.case-detail-vnext-page .case-detail-history-row > div {
  min-width: 0 !important;
  display: grid !important;
  grid-template-columns: 7.75rem minmax(0, 1fr) !important;
  align-items: center !important;
  gap: 0.72rem !important;
}

.case-detail-vnext-page .case-detail-history-row .case-detail-kind-pill {
  grid-column: 1 !important;
  grid-row: 1 !important;
  width: fit-content !important;
  min-height: 1.42rem !important;
  padding: 0.16rem 0.5rem !important;
  border-radius: 999px !important;
  border-color: #dbeafe !important;
  background: var(--cf-case-history-blue-soft) !important;
  color: #1d4ed8 !important;
  -webkit-text-fill-color: #1d4ed8 !important;
  font-size: 0.68rem !important;
  font-weight: 920 !important;
  line-height: 1 !important;
}

.case-detail-vnext-page .case-detail-history-row h3 {
  grid-column: 2 !important;
  grid-row: 1 !important;
  margin: 0 !important;
  min-width: 0 !important;
  color: var(--cf-case-history-text) !important;
  -webkit-text-fill-color: var(--cf-case-history-text) !important;
  font-size: 0.82rem !important;
  font-weight: 900 !important;
  line-height: 1.22 !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  white-space: nowrap !important;
}

.case-detail-vnext-page .case-detail-history-row p {
  grid-column: 2 !important;
  grid-row: 2 !important;
  margin: 0.12rem 0 0 !important;
  min-width: 0 !important;
  color: var(--cf-case-history-muted) !important;
  -webkit-text-fill-color: var(--cf-case-history-muted) !important;
  font-size: 0.72rem !important;
  line-height: 1.25 !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  white-space: nowrap !important;
}

/* Some history entries are rendered through the generic work-row contract. In history context they must stop looking like task cards. */
.case-detail-vnext-page .case-detail-history-list .case-detail-work-row {
  min-height: 2.85rem !important;
  display: grid !important;
  grid-template-columns: minmax(0, 1fr) 8.5rem !important;
  align-items: center !important;
  gap: 0.72rem !important;
  padding: 0.46rem 0.72rem !important;
  border: 1px solid var(--cf-case-history-line) !important;
  border-radius: 1rem !important;
  background: var(--cf-case-history-bg) !important;
  box-shadow: none !important;
}

.case-detail-vnext-page .case-detail-history-list .case-detail-work-icon,
.case-detail-vnext-page .case-detail-history-list .case-detail-work-row > span,
.case-detail-vnext-page .case-detail-history-list .case-detail-row-actions,
.case-detail-vnext-page .case-detail-history-list .case-detail-work-row > .case-detail-pill,
.case-detail-vnext-page .case-detail-history-list .case-detail-work-row > [class*="pill"]:not(.case-detail-kind-pill) {
  display: none !important;
}

.case-detail-vnext-page .case-detail-history-list .case-detail-work-main {
  min-width: 0 !important;
  display: grid !important;
  grid-template-columns: 7.75rem minmax(0, 1fr) !important;
  align-items: center !important;
  gap: 0.72rem !important;
}

.case-detail-vnext-page .case-detail-history-list .case-detail-work-main .case-detail-kind-pill {
  grid-column: 1 !important;
  grid-row: 1 !important;
  width: fit-content !important;
  min-height: 1.42rem !important;
  padding: 0.16rem 0.5rem !important;
  border-radius: 999px !important;
  font-size: 0.68rem !important;
  font-weight: 920 !important;
  line-height: 1 !important;
}

.case-detail-vnext-page .case-detail-history-list .case-detail-work-main h3 {
  grid-column: 2 !important;
  grid-row: 1 !important;
  margin: 0 !important;
  min-width: 0 !important;
  color: var(--cf-case-history-text) !important;
  -webkit-text-fill-color: var(--cf-case-history-text) !important;
  font-size: 0.82rem !important;
  font-weight: 900 !important;
  line-height: 1.22 !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  white-space: nowrap !important;
}

.case-detail-vnext-page .case-detail-history-list .case-detail-work-main p {
  display: none !important;
}

.case-detail-vnext-page .case-detail-history-list .case-detail-work-date {
  justify-self: end !important;
  min-width: 0 !important;
  text-align: right !important;
}

.case-detail-vnext-page .case-detail-history-list .case-detail-work-date small {
  display: none !important;
}

.case-detail-vnext-page .case-detail-history-list .case-detail-work-date strong {
  display: block !important;
  margin: 0 !important;
  color: var(--cf-case-history-muted) !important;
  -webkit-text-fill-color: var(--cf-case-history-muted) !important;
  font-size: 0.72rem !important;
  font-weight: 820 !important;
  line-height: 1.15 !important;
  white-space: nowrap !important;
}

/* Keep the compact summary card clean if older CSS tries to inflate it. */
.case-detail-vnext-page [data-case-history-summary="true"],
.case-detail-vnext-page .case-detail-history-summary-card {
  max-width: 44rem !important;
}

@media (max-width: 760px) {
  .case-detail-vnext-page .case-detail-history-row > div,
  .case-detail-vnext-page .case-detail-history-list .case-detail-work-main {
    grid-template-columns: 1fr !important;
    gap: 0.28rem !important;
  }

  .case-detail-vnext-page .case-detail-history-list .case-detail-work-row {
    grid-template-columns: 1fr !important;
    align-items: start !important;
  }

  .case-detail-vnext-page .case-detail-history-row h3,
  .case-detail-vnext-page .case-detail-history-row p,
  .case-detail-vnext-page .case-detail-history-list .case-detail-work-main h3 {
    white-space: normal !important;
  }

  .case-detail-vnext-page .case-detail-history-list .case-detail-work-date {
    justify-self: start !important;
    text-align: left !important;
  }
}
`;
write(cssPath, css);

const check = `const fs = require('fs');
const path = require('path');

const root = process.cwd();
const caseDetail = fs.readFileSync(path.join(root, 'src/pages/CaseDetail.tsx'), 'utf8');
const css = fs.readFileSync(path.join(root, 'src/styles/closeflow-case-history-visual-source-truth.css'), 'utf8');
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));

const requiredCaseDetail = [
  "import '../styles/visual-stage13-case-detail-vnext.css';",
  "import '../styles/closeflow-case-history-visual-source-truth.css';",
];
for (const marker of requiredCaseDetail) {
  if (!caseDetail.includes(marker)) throw new Error('CaseDetail missing marker: ' + marker);
}

const requiredCss = [
  'CLOSEFLOW_CASE_HISTORY_VISUAL_SOURCE_TRUTH_2026_05_12',
  '.case-detail-history-list .case-detail-work-row',
  '.case-detail-history-row > span',
  '.case-detail-history-list .case-detail-row-actions',
  'grid-template-columns: 7.75rem minmax(0, 1fr)',
  'display: none !important',
];
for (const marker of requiredCss) {
  if (!css.includes(marker)) throw new Error('CSS missing marker: ' + marker);
}

if (pkg.scripts?.['check:closeflow-case-history-visual-source-truth'] !== 'node scripts/check-closeflow-case-history-visual-source-truth.cjs') {
  throw new Error('package.json missing check:closeflow-case-history-visual-source-truth');
}

console.log('OK closeflow-case-history-visual-source-truth: CaseDetail history rows use compact visual rhythm.');
`;
write(checkPath, check);

const doc = `# CLOSEFLOW_CASE_HISTORY_VISUAL_SOURCE_TRUTH_2026-05-12

## Cel

Ujednolicić wizualnie historię sprawy w \`/cases/:id\`.

## Problem wejściowy

Górna karta \`Historia sprawy\` ma dobry, czytelny rytm: kompaktowy wiersz, typ po lewej, opis w środku, data po prawej.

Niżej historia była renderowana jak duże karty operacyjne: ikona, piguła \`Notatka\`, tytuł, opis, termin, piguła \`Historia\`, a czasem jeszcze przyciski akcji. To mieszało dwa źródła prawdy wizualnej.

## Decyzja

Nie zmieniamy danych ani logiki historii. Dokładamy osobny CSS source truth dla historii w CaseDetail:

- historia ma wyglądać jak kompaktowy ledger,
- ikony i akcje robocze są ukryte w kontekście historii,
- etykieta typu, treść i data są ustawione w jednym rytmie,
- mobile zostaje responsywne, ale bez osobnej przebudowy telefonu.

## Zakres

- \`src/pages/CaseDetail.tsx\`
- \`src/styles/closeflow-case-history-visual-source-truth.css\`
- \`scripts/check-closeflow-case-history-visual-source-truth.cjs\`
- \`package.json\`

## Kryterium zakończenia

- \`npm run check:closeflow-case-history-visual-source-truth\` przechodzi.
- \`npm run build\` przechodzi.
- Dolna historia sprawy wizualnie pasuje do górnej kompaktowej karty \`Historia sprawy\`.
`;
write(docPath, doc);

const pkg = JSON.parse(read(packagePath));
pkg.scripts = pkg.scripts || {};
pkg.scripts['check:closeflow-case-history-visual-source-truth'] = 'node scripts/check-closeflow-case-history-visual-source-truth.cjs';
write(packagePath, JSON.stringify(pkg, null, 2) + '\n');

console.log('OK patch-closeflow-case-history-visual-source-truth: CaseDetail history visual source truth applied.');
