const fs = require('fs');
const path = require('path');
const marker = 'STAGE58_CASE_RECENT_MOVES_PANEL';
function read(file) { return fs.readFileSync(path.join(process.cwd(), file), 'utf8'); }
function pass(message) { console.log('PASS ' + message); }
function fail(message) { console.error('FAIL ' + message); process.exit(1); }
function contains(file, needle, label) {
  const value = read(file);
  if (!value.includes(needle)) fail(file + ': missing ' + label + ' -> ' + needle);
  pass(file + ': contains ' + label);
}
contains('src/pages/CaseDetail.tsx', marker, 'Stage58 TSX marker');
contains('src/pages/CaseDetail.tsx', 'const recentCaseMoves = useMemo(() => activities.slice(0, 5), [activities]);', 'last five moves selector');
contains('src/pages/CaseDetail.tsx', 'function getCaseRecentMoveMeta(activity: CaseActivity)', 'recent move metadata helper');
contains('src/pages/CaseDetail.tsx', 'data-case-recent-moves-panel="true"', 'recent moves panel');
contains('src/pages/CaseDetail.tsx', 'data-case-recent-move="true"', 'recent move row');
contains('src/pages/CaseDetail.tsx', 'data-case-recent-moves-empty="true"', 'empty state');
contains('src/pages/CaseDetail.tsx', 'data-case-recent-moves-open-history="true"', 'open history action');
contains('src/pages/CaseDetail.tsx', "setActiveTab('history')", 'history tab navigation');
contains('src/pages/CaseDetail.tsx', 'getActivityText(move)', 'uses existing activity copy');
contains('src/styles/visual-stage13-case-detail-vnext.css', marker, 'Stage58 CSS marker');
contains('src/styles/visual-stage13-case-detail-vnext.css', '.case-detail-vnext-page .case-detail-recent-moves-panel', 'panel CSS');
contains('src/styles/visual-stage13-case-detail-vnext.css', '.case-detail-vnext-page .case-detail-recent-move', 'row CSS');
contains('package.json', 'check:stage58-case-recent-moves-panel', 'Stage58 check script');
contains('package.json', 'test:stage58-case-recent-moves-panel', 'Stage58 test script');
contains('package.json', 'check:stage58-case-recent-moves-panel && npm.cmd run check:stage59-case-note-follow-up-prompt && npm.cmd run verify:client-detail-operational-ui', 'Stage58 included in case operational verify');
contains('tests/stage58-case-recent-moves-panel.test.cjs', marker, 'Stage58 test marker');
contains('docs/release/STAGE58_CASE_RECENT_MOVES_PANEL_2026-05-04.md', marker, 'Stage58 release marker');
console.log('PASS ' + marker);