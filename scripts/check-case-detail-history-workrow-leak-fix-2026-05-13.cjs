const fs = require('node:fs');
const path = require('node:path');

const repoRoot = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(repoRoot, 'src/pages/CaseDetail.tsx'), 'utf8');

function fail(message) {
  console.error('FAIL check:case-detail-history-workrow-leak-fix:', message);
  process.exit(1);
}

for (const token of [
  'CLOSEFLOW_CASE_HISTORY_WORKROW_LEAK_FIX_2026_05_13',
  'function isCaseActivitySourceForWorkRow',
  'isCaseActivitySourceForWorkRow(entry.source)',
  'return null;',
  '<article className="case-detail-work-row"',
  '<article className="case-history-row"',
  "activeTab === 'history'"
]) {
  if (!source.includes(token)) fail('Brak tokenu: ' + token);
}

console.log('OK check:case-detail-history-workrow-leak-fix');
