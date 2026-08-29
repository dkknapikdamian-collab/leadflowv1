const fs = require('fs');
const path = require('path');

const root = process.cwd();
const caseDetail = fs.readFileSync(path.join(root, 'src/pages/CaseDetail.tsx'), 'utf8');
const css = fs.readFileSync(path.join(root, 'src/styles/closeflow-case-history-visual-source-truth.css'), 'utf8');
const app = fs.readFileSync(path.join(root, 'src/App.tsx'), 'utf8');
const visualEntry = fs.readFileSync(path.join(root, 'src/styles/closeflow-visual-source-truth.css'), 'utf8');
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));

const actualCssImports = (source) => [...source.matchAll(/^\s*import\s+['"]([^'"]+\.css)['"];?\s*$/gm)].map((match) => match[1]);
const requiredCaseDetailImports = [
  '../styles/closeflow-case-history-visual-source-truth.css',
  '../styles/closeflow-case-detail-tabs.css',
  '../styles/closeflow-case-detail-shell-rail.css',
];
for (const marker of requiredCaseDetailImports) {
  if (!actualCssImports(caseDetail).includes(marker)) throw new Error('CaseDetail missing active CSS import: ' + marker);
}

if (!actualCssImports(app).includes('./styles/closeflow-visual-source-truth.css')) {
  throw new Error('App missing active canonical visual entry import');
}

if (!visualEntry.includes("@import './owners/closeflow-case-detail.css';")) {
  throw new Error('visual entry missing active CaseDetail owner import');
}

for (const target of [
  'src/styles/owners/closeflow-case-detail.css',
  'src/styles/closeflow-case-history-visual-source-truth.css',
  'src/styles/closeflow-case-detail-tabs.css',
  'src/styles/closeflow-case-detail-shell-rail.css',
]) {
  if (!fs.existsSync(path.join(root, target))) throw new Error('Missing active CaseDetail CSS owner: ' + target);
}

const requiredCss = [
  'LF-UI-SOT-007_OWNER',
  '.case-detail-history-list .case-detail-work-row',
  '.case-detail-history-row > span',
  '.case-detail-history-list .case-detail-row-actions',
  'grid-template-columns: 7.75rem minmax(0, 1fr)',
  'display: none;',
];
for (const marker of requiredCss) {
  if (!css.includes(marker)) throw new Error('CSS missing marker: ' + marker);
}

if (pkg.scripts?.['check:closeflow-case-history-visual-source-truth'] !== 'node scripts/check-closeflow-case-history-visual-source-truth.cjs') {
  throw new Error('package.json missing check:closeflow-case-history-visual-source-truth');
}

console.log('OK closeflow-case-history-visual-source-truth: CaseDetail history rows use compact visual rhythm.');
