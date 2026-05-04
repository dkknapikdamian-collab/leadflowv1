const fs = require('fs');
const path = require('path');
const test = require('node:test');
const assert = require('node:assert/strict');

const marker = 'STAGE58_CASE_RECENT_MOVES_PANEL';
const root = process.cwd();
function read(file) { return fs.readFileSync(path.join(root, file), 'utf8'); }

test(marker + ': case detail exposes a compact recent moves panel', () => {
  const source = read('src/pages/CaseDetail.tsx');
  assert.match(source, /STAGE58_CASE_RECENT_MOVES_PANEL/);
  assert.match(source, /const recentCaseMoves = useMemo\(\(\) => activities\.slice\(0, 5\), \[activities\]\);/);
  assert.match(source, /data-case-recent-moves-panel="true"/);
  assert.match(source, /data-case-recent-move="true"/);
  assert.match(source, /data-case-recent-moves-open-history="true"/);
  assert.match(source, /setActiveTab\('history'\)/);
  assert.match(source, /getActivityText\(move\)/);
});

test(marker + ': CSS keeps the panel readable and scoped to case detail', () => {
  const css = read('src/styles/visual-stage13-case-detail-vnext.css');
  assert.match(css, /STAGE58_CASE_RECENT_MOVES_PANEL/);
  assert.match(css, /\.case-detail-vnext-page \.case-detail-recent-moves-panel/);
  assert.match(css, /\.case-detail-vnext-page \.case-detail-recent-move/);
  assert.match(css, /-webkit-text-fill-color: #111827 !important;/);
});