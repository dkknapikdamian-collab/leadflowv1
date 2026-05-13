const fs = require('node:fs');
const path = require('node:path');

const repoRoot = path.resolve(__dirname, '..');
const caseDetail = fs.readFileSync(path.join(repoRoot, 'src/pages/CaseDetail.tsx'), 'utf8');
const quick = fs.readFileSync(path.join(repoRoot, 'src/components/CaseQuickActions.tsx'), 'utf8');
const css = fs.readFileSync(path.join(repoRoot, 'src/styles/closeflow-case-history-visual-source-truth.css'), 'utf8');

function fail(message) {
  console.error('FAIL check:case-detail-history-visual-p1-repair3:', message);
  process.exit(1);
}

if (!caseDetail.includes('case-detail-history-unified-panel')) fail('CaseDetail nie oznacza sekcji Historii sprawy jawna klasa.');
if (quick.includes('Dodaj operacyjny ruch bez starego kafelka formularza.')) fail('CaseQuickActions nadal zawiera helper copy.');
if (!quick.includes('CLOSEFLOW_CASE_QUICK_ACTIONS_NO_HELPER_COPY_P1_2026_05_13')) fail('Brak markera quick actions no helper copy.');

for (const token of [
  'CLOSEFLOW_CASE_DETAIL_HISTORY_VISUAL_P1_REPAIR3_2026_05_13',
  '.case-detail-history-unified-panel .case-detail-work-row',
  '.case-detail-history-unified-panel .case-detail-history-row',
  '.case-detail-history-unified-panel .case-detail-work-icon',
  '.case-detail-history-unified-panel .case-detail-row-actions',
  'article[class*="case-detail-work"]',
  'grid-template-columns: 7.75rem minmax(0, 1fr)'
]) {
  if (!css.includes(token)) fail('CSS nie zawiera tokenu: ' + token);
}

console.log('OK check:case-detail-history-visual-p1-repair3');
