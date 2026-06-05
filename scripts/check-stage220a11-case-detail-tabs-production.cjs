const fs = require('fs');
const path = require('path');

const repo = process.cwd();
const casePath = path.join(repo, 'src', 'pages', 'CaseDetail.tsx');
const cssPath = path.join(repo, 'src', 'styles', 'closeflow-case-detail-stage217-operation-workspace.css');

function fail(message) {
  console.error('STAGE220A11_CASE_DETAIL_TABS_PRODUCTION_GUARD: FAIL');
  console.error(message);
  process.exit(1);
}

function read(file) {
  if (!fs.existsSync(file)) fail(`Missing file: ${file}`);
  return fs.readFileSync(file, 'utf8');
}

const caseText = read(casePath);
const cssText = read(cssPath);

const typeMatch = caseText.match(/type\s+CaseDetailTab\s*=\s*([^;]+);/);
if (!typeMatch) fail('CaseDetailTab type not found');
if (/path/.test(typeMatch[1])) fail('CaseDetailTab must not contain path');
if (/label:\s*['\"](?:Ścieżka|Scieżka|Sciezka|Path)['\"]/.test(caseText)) fail('Forbidden path tab label found');

const requiredLabels = ["label: 'Obsługa'", "label: 'Checklisty'", "label: 'Historia'"];
for (const label of requiredLabels) {
  if (!caseText.includes(label)) fail(`Missing tab label: ${label}`);
}

if (!caseText.includes('data-stage220a11-case-tab-trigger')) fail('Stage220A11 tab trigger marker missing');
if (!caseText.includes('data-stage220a11-tab-content="service"')) fail('Service tab content marker missing');
if (!caseText.includes('data-stage220a11-tab-content="checklists"')) fail('Checklists tab content marker missing');
if (!caseText.includes('data-stage220a11-tab-content="history"')) fail('History tab content marker missing');
if (!caseText.includes('STAGE220A11_CASE_DETAIL_TABS_PRODUCTION')) fail('Stage220A11 TSX marker missing');

const historyBlock = caseText.match(/const caseHistoryItems = useMemo<CaseHistoryItem\[\]>\(\(\) => \{[\s\S]*?\n  \}, \[[^\]]*\]\);/);
if (!historyBlock) fail('caseHistoryItems useMemo not found');
if (!historyBlock[0].includes('buildCaseHistoryItemsStage14D')) fail('History must use buildCaseHistoryItemsStage14D');
if (!historyBlock[0].includes('formatCaseHistoryBodyStage220A11')) fail('History must sanitize/format visible body');

if (!caseText.includes("handleItemStatusChange(item, 'missing')")) fail('Checklist tab must expose Brak action');
if (caseText.includes('Obs\u0139') || caseText.includes('Zak\u0139') || caseText.includes('wpłat')) fail('Mojibake found in CaseDetail');

const forbiddenCss = /\.case-detail-main-column\s*>\s*\.case-detail-section-card:not\(\.stage217-case-operation-workspace\):not\(\.stage217-case-notes-panel\)\s*\{\s*display:\s*none\s*!important;\s*\}/;
if (forbiddenCss.test(cssText)) fail('Legacy CSS hide selector still hides active tab panels');
if (!cssText.includes('STAGE220A11_CASE_DETAIL_TABS_PRODUCTION_CSS')) fail('Stage220A11 CSS marker missing');
if (!/min-height:\s*46px\s*!important/.test(cssText)) fail('Tab trigger min-height repair missing');
if (!/line-height:\s*1\.25\s*!important/.test(cssText)) fail('Tab trigger line-height repair missing');

console.log('STAGE220A11_CASE_DETAIL_TABS_PRODUCTION_GUARD: OK');
