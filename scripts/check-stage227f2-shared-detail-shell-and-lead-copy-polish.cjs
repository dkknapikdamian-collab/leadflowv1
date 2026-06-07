const fs = require('fs');

const leadCss = fs.readFileSync('src/styles/visual-stage14-lead-detail-vnext.css', 'utf8');
const unifiedCss = fs.readFileSync('src/styles/closeflow-unified-page-canvas-stage211c.css', 'utf8');
const clientDetail = fs.readFileSync('src/pages/ClientDetail.tsx', 'utf8');
const caseDetail = fs.readFileSync('src/pages/CaseDetail.tsx', 'utf8');
const pkg = fs.readFileSync('package.json', 'utf8');

let failures = 0;
function pass(label) { console.log('PASS ' + label); }
function fail(label) { failures += 1; console.error('FAIL STAGE227F2_SHARED_DETAIL_SHELL_AND_LEAD_COPY_POLISH: ' + label); }
function must(haystack, needle, label) {
  if (haystack.includes(needle)) pass(label);
  else fail('missing: ' + label);
}

must(leadCss, 'STAGE227F2_LEAD_HEADER_COPY_BUTTON_POLISH_START', 'Lead copy polish CSS marker');
must(leadCss, '[data-stage227e1-header-phone="true"]', 'Lead phone header selector remains targeted');
must(leadCss, '[data-stage227e1-header-email="true"]', 'Lead email header selector remains targeted');
must(leadCss, 'grid-template-columns: minmax(0, 1fr) auto', 'Lead copy rows use value plus copy-button grid');
must(leadCss, 'grid-row: 1 / span 2', 'Lead copy button spans label and value rows');
must(leadCss, 'min-height: 48px', 'Lead copy rows have enough vertical room');

must(unifiedCss, 'STAGE227F2_SHARED_DETAIL_SHELL_AND_CLIENT_CASE_WIDTH_POLISH_START', 'Shared shell CSS marker');
must(unifiedCss, '--cf-detail-shell-gutter-x: clamp(12px, 1.1vw, 18px)', 'Shared stable gutter token');
must(unifiedCss, '.client-detail-shell', 'ClientDetail shell selector');
must(unifiedCss, '.case-detail-shell', 'CaseDetail shell selector');
must(unifiedCss, 'max-width: none', 'No artificial max-width moat');
must(unifiedCss, 'grid-template-columns: var(--cf-detail-left-rail-width) minmax(0, 1fr) var(--cf-detail-right-rail-width)', 'ClientDetail desktop grid contract');
must(unifiedCss, 'grid-template-columns: minmax(0, 1fr) var(--cf-case-right-rail-width)', 'CaseDetail desktop grid contract');
must(unifiedCss, '@media (max-width: 1180px)', 'Shared responsive collapse contract');

must(clientDetail, 'className="client-detail-shell"', 'ClientDetail keeps shell wrapper');
must(caseDetail, 'className="case-detail-shell"', 'CaseDetail keeps shell wrapper');
must(pkg, 'check:stage227f2-shared-detail-shell-and-lead-copy-polish', 'package check script');
must(pkg, 'test:stage227f2-shared-detail-shell-and-lead-copy-polish', 'package test script');

if (failures) {
  console.error('\nStage227F2 guard failures: ' + failures);
  process.exit(1);
}
console.log('PASS STAGE227F2_SHARED_DETAIL_SHELL_AND_LEAD_COPY_POLISH');
