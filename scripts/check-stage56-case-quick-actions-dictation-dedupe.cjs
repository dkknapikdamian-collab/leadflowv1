const fs = require('fs');
const path = require('path');
const marker = 'STAGE56_CASE_QUICK_ACTIONS_DICTATION_DEDUPE';
function read(file) { return fs.readFileSync(path.join(process.cwd(), file), 'utf8'); }
function pass(message) { console.log('PASS ' + message); }
function fail(message) { console.error('FAIL ' + message); process.exit(1); }
function contains(file, needle, label) {
  const value = read(file);
  if (!value.includes(needle)) fail(file + ': missing ' + label + ' -> ' + needle);
  pass(file + ': contains ' + label);
}
contains('src/pages/ClientDetail.tsx', marker, 'Stage56 ClientDetail marker');
contains('src/pages/ClientDetail.tsx', 'function normalizeTranscriptText', 'transcript normalizer');
contains('src/pages/ClientDetail.tsx', 'function dedupeTranscriptAppend', 'transcript dedupe helper');
contains('src/pages/ClientDetail.tsx', 'return dedupeTranscriptAppend(previous, addition);', 'joinTranscript dedupe usage');
contains('src/pages/ClientDetail.tsx', 'normalizedBaseWords.slice(-size)', 'suffix-prefix overlap logic');
contains('src/pages/CaseDetail.tsx', marker, 'Stage56 CaseDetail marker');
contains('src/styles/visual-stage13-case-detail-vnext.css', marker, 'Stage56 case CSS marker');
contains('src/styles/visual-stage13-case-detail-vnext.css', '.case-detail-vnext-page .case-detail-right-actions button', 'quick actions contrast selector');
contains('src/styles/visual-stage13-case-detail-vnext.css', '.case-detail-vnext-page .case-detail-row-actions button', 'row actions contrast selector');
contains('src/styles/visual-stage13-case-detail-vnext.css', '-webkit-text-fill-color: #111827 !important;', 'dark visible text fill');
contains('src/styles/visual-stage13-case-detail-vnext.css', 'box-shadow: 0 7px 18px', 'visible action shadow');
contains('package.json', 'check:stage56-case-quick-actions-dictation-dedupe', 'Stage56 check script');
contains('package.json', 'test:stage56-case-quick-actions-dictation-dedupe', 'Stage56 test script');
contains('package.json', 'verify:case-operational-ui', 'case operational verify script');
contains('tests/stage56-case-quick-actions-dictation-dedupe.test.cjs', marker, 'Stage56 test marker');
contains('docs/release/STAGE56_CASE_QUICK_ACTIONS_DICTATION_DEDUPE_2026-05-04.md', marker, 'Stage56 release marker');
console.log('PASS ' + marker);
