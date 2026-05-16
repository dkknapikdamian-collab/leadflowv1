const fs = require('node:fs');
const path = require('node:path');

const repoRoot = path.resolve(__dirname, '..');
const quick = fs.readFileSync(path.join(repoRoot, 'src/components/CaseQuickActions.tsx'), 'utf8');
const css = fs.readFileSync(path.join(repoRoot, 'src/styles/closeflow-case-history-visual-source-truth.css'), 'utf8');

function fail(message) {
  console.error('FAIL check:p1-case-detail-history-quick-actions-visual:', message);
  process.exit(1);
}

if (quick.includes('Dodaj operacyjny ruch bez starego kafelka formularza.')) {
  fail('CaseQuickActions nadal zawiera usuwany opis pod Szybkimi akcjami.');
}

for (const token of [
  'CLOSEFLOW_P1_CASE_DETAIL_HISTORY_VISUAL_UNIFIED_2026_05_13',
  '.case-detail-section-card:has([data-case-history-summary="true"])',
  '.case-detail-work-icon',
  '.case-detail-row-actions',
  'grid-template-columns: 7.75rem minmax(0, 1fr)',
]) {
  if (!css.includes(token)) fail('CSS historii nie zawiera wymaganego tokenu: ' + token);
}

console.log('OK check:p1-case-detail-history-quick-actions-visual');
