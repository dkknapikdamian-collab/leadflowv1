const fs = require('fs');
const path = require('path');

const repo = process.cwd();
const caseText = fs.readFileSync(path.join(repo, 'src/pages/CaseDetail.tsx'), 'utf8');
const css = fs.readFileSync(path.join(repo, 'src/styles/closeflow-detail-view-source-truth-stage219.css'), 'utf8');

const errors = [];
const must = (ok, msg) => { if (!ok) errors.push(msg); };
const mustNot = (ok, msg) => { if (ok) errors.push(msg); };

must(caseText.includes('data-stage220a8-single-actions-card="STAGE220A8_4_SINGLE_ACTIONS_CARD"'), 'single actions card marker missing');
must(caseText.includes('data-stage220a8-case-actions-accordion="true"'), 'accordion marker missing');
must(caseText.includes('data-stage220a8-show-all-actions="true"'), 'show all button missing');
must(caseText.includes('data-stage220a8-case-actions-all-modal="true"'), 'show all modal missing');

mustNot(caseText.includes('className="case-detail-top-grid"'), 'old top color grid still rendered');
mustNot(caseText.includes('className="stage217-case-service-grid"'), 'old colored service grid still rendered');
mustNot(caseText.includes('stage217-case-service-card--next'), 'old next colored card still rendered');
mustNot(caseText.includes('stage217-case-service-card--blockers'), 'old blockers colored card still rendered');
mustNot(caseText.includes('stage217-case-service-card--workload'), 'old workload colored card still rendered');
mustNot(caseText.includes('stage217-case-service-card--finance'), 'old finance colored card still rendered');

must(caseText.includes('Działania sprawy'), 'Polish label Działania sprawy missing');
must(caseText.includes('Pokaż wszystkie'), 'Polish button Pokaż wszystkie missing');
must(caseText.includes('Najbliższe działania'), 'Polish group Najbliższe działania missing');
must(caseText.includes('przypięte do tej sprawy'), 'Polish text przypięte do tej sprawy missing');

const mojibake = ['\u00C4', '\u0139', '\u00C2', '\u0102', 'â€', '—', '–', '\u00C4ą', '\u0102„', 'ż'];
for (const bad of mojibake) {
  mustNot(caseText.includes(bad), 'CaseDetail still contains mojibake marker: ' + bad);
}

must(css.includes('STAGE220A8_4_SINGLE_ACTIONS_CARD'), 'CSS single actions card marker missing');
must(css.includes('.case-detail-top-grid'), 'CSS does not hide legacy top grid');
must(css.includes('.stage217-case-service-grid'), 'CSS does not hide legacy service grid');

if (errors.length) {
  console.error('Stage220A8 single actions card Polish guard failed:');
  for (const error of errors) console.error('- ' + error);
  process.exit(1);
}

console.log('OK Stage220A8 single actions card Polish guard passed');
