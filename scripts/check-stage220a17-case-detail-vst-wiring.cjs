const fs = require('fs');

function fail(message) {
  console.error('STAGE220A17_CASE_DETAIL_VST_WIRING_GUARD: FAIL');
  console.error(message);
  process.exit(1);
}

function read(path) {
  return fs.readFileSync(path, 'utf8');
}

const caseDetail = read('src/pages/CaseDetail.tsx');
const confirmDialog = read('src/components/confirm-dialog.tsx');
const css = read('src/styles/closeflow-visual-source-truth.css');
const doc = read('docs/visual/CLOSEFLOW_VISUAL_SOURCE_OF_TRUTH.md');
const pkg = JSON.parse(read('package.json'));

function requireText(text, needle, label) {
  if (!text.includes(needle)) fail(label + ' missing: ' + needle);
}

function forbidText(text, needle, label) {
  if (text.includes(needle)) fail(label + ' forbidden: ' + needle);
}

requireText(caseDetail, 'STAGE220A17_CASE_DETAIL_VST_WIRING', 'stage marker');
requireText(caseDetail, 'data-stage220a17-delete-case-button="true"', 'delete button marker');
requireText(caseDetail, 'cf-vst-button cf-vst-button-delete cf-case-detail-delete-action', 'delete button VST classes');
requireText(caseDetail, 'data-cf-vst-kind="delete"', 'delete semantic kind');
requireText(caseDetail, 'Usuń sprawę', 'visible delete copy');
requireText(caseDetail, 'deleteCaseWithRelations(caseData.id)', 'delete handler still used');
requireText(caseDetail, "navigate('/cases')", 'delete navigate still used');
forbidText(caseDetail, '<EntityTrashButton', 'old icon-only delete action');

requireText(confirmDialog, 'cf-vst-dialog', 'confirm dialog VST class');
requireText(confirmDialog, 'data-cf-vst-dialog="true"', 'confirm dialog VST data marker');

requireText(caseDetail, 'CASE_HISTORY_VISUAL_TAXONOMY_STAGE220A17', 'history taxonomy map');
requireText(caseDetail, 'CaseHistoryKindIconStage220A17', 'history icon mapper');
requireText(caseDetail, 'data-cf-vst-kind={getCaseHistoryVstKindStage220A17(item.kind)}', 'history VST kind binding');
requireText(caseDetail, 'data-stage220a17-history-kind-row={item.kind}', 'history row marker');
requireText(caseDetail, 'isCaseHistoryBareStatusStage220A17', 'bare status filter');
requireText(caseDetail, 'pickCaseHistoryActionNameStage220A17', 'task action name picker');
requireText(caseDetail, "'Zadanie wykonane'", 'task done title');
requireText(caseDetail, "'Nazwa zadania niedostępna'", 'task fallback body');

const taskIndex = caseDetail.indexOf("if (lowerType.includes('task'))");
const statusIndex = caseDetail.indexOf("if (lowerType.includes('status') || lowerType.includes('lifecycle'))");
if (taskIndex < 0 || statusIndex < 0 || taskIndex > statusIndex) {
  fail('Task history branch must run before generic status branch.');
}

requireText(css, 'STAGE220A17_CASE_DETAIL_VST_WIRING', 'A17 CSS marker');
requireText(css, '.case-detail-stage220a17-history-row', 'history VST CSS');
requireText(css, '.cf-confirm-dialog', 'confirm dialog CSS');
requireText(css, '.cf-case-detail-delete-action', 'delete action CSS');

requireText(doc, 'STAGE220A17 - pierwsze realne przepięcie', 'doc A17 section');

const prebuild = String(pkg.scripts && pkg.scripts.prebuild || '');
requireText(prebuild, 'node scripts/check-stage220a17-case-detail-vst-wiring.cjs', 'prebuild A17 guard');

console.log('STAGE220A17_CASE_DETAIL_VST_WIRING_GUARD: OK');
