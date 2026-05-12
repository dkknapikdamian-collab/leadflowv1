const fs = require('fs');
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
