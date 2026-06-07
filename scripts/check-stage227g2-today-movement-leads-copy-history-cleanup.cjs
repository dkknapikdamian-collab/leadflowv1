const fs = require('fs');

let failures = 0;
function pass(label) { console.log('PASS ' + label); }
function fail(label) { failures += 1; console.error('FAIL STAGE227G2_TODAY_MOVEMENT_LEADS_COPY_HISTORY_CLEANUP: ' + label); }
function contains(text, needle, label) { text.includes(needle) ? pass(label) : fail('missing: ' + label + ' [' + needle + ']'); }
function notContains(text, needle, label) { !text.includes(needle) ? pass(label) : fail('still contains: ' + label + ' [' + needle + ']'); }

const leads = fs.existsSync('src/pages/Leads.tsx') ? fs.readFileSync('src/pages/Leads.tsx', 'utf8') : '';
const workCss = fs.readFileSync('src/styles/work-item-card.css', 'utf8');
const leadCss = fs.readFileSync('src/styles/visual-stage14-lead-detail-vnext.css', 'utf8');
const pkg = fs.readFileSync('package.json', 'utf8');

contains(workCss, 'STAGE227G2_TODAY_MOVEMENT_HELPER_VISUAL', 'movement helper visual marker');
contains(workCss, '.cf-work-item-card-helper', 'work item helper selector');
contains(workCss, 'background: #f9fafb', 'helper neutral card background');
contains(workCss, 'border-radius: 12px', 'helper card radius');
contains(workCss, 'padding: 6px 10px', 'helper compact padding');

notContains(leads, 'Bez przesady, tylko najpotrzebniejsze.', 'Leads helper copy Bez przesady removed');
notContains(leads, '5 leadów z największą wartością.', 'Leads highest value helper copy removed');
notContains(leads, '5 leadow z najwieksza wartoscia.', 'Leads ascii highest value helper copy removed');
contains(leads, 'STAGE227G2_LEADS_RUNTIME_COPY_CLEANUP', 'Leads copy cleanup marker');

contains(leadCss, 'STAGE227G2_LEAD_HISTORY_TILE_SUPPRESSION', 'lead history tile suppression marker');
contains(leadCss, '[data-stage227f3-top-card="history"]', 'F3 history tile selector');
contains(leadCss, '[data-stage227f5-top-card="history"]', 'F5 history tile selector');

contains(pkg, 'check:stage227g2-today-movement-leads-copy-history-cleanup', 'package check script');
contains(pkg, 'test:stage227g2-today-movement-leads-copy-history-cleanup', 'package test script');

if (failures) {
  console.error('\nStage227G2 guard failures: ' + failures);
  process.exit(1);
}
console.log('PASS STAGE227G2_TODAY_MOVEMENT_LEADS_COPY_HISTORY_CLEANUP');
