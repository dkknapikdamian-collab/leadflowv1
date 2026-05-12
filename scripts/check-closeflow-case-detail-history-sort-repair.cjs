const fs = require('fs');
const path = require('path');

const root = process.cwd();
const file = path.join(root, 'src/pages/CaseDetail.tsx');
const source = fs.readFileSync(file, 'utf8');

const required = [
  'CLOSEFLOW_CASE_DETAIL_HISTORY_SORT_REPAIR_2026_05_12',
  'function sortCaseHistoryItemsStage14D(items: CaseHistoryItem[])',
  'return sortCaseHistoryItemsStage14D(history);',
  'function buildCaseHistoryItemsStage14D(input:',
];

for (const marker of required) {
  if (!source.includes(marker)) {
    throw new Error('Missing CaseDetail history sort repair marker: ' + marker);
  }
}

const helperIndex = source.indexOf('function sortCaseHistoryItemsStage14D(items: CaseHistoryItem[])');
const buildIndex = source.indexOf('function buildCaseHistoryItemsStage14D(input:');
if (helperIndex < 0 || buildIndex < 0 || helperIndex > buildIndex) {
  throw new Error('sortCaseHistoryItemsStage14D must be declared before buildCaseHistoryItemsStage14D.');
}

console.log('OK closeflow-case-detail-history-sort-repair: sortCaseHistoryItemsStage14D is defined before CaseDetail history use.');
