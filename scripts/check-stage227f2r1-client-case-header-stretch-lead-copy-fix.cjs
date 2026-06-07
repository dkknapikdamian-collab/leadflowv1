const fs = require('fs');
const path = require('path');
const root = process.cwd();
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8').replace(/^\uFEFF/, '');
let failures = 0;
function ok(label) { console.log('PASS ' + label); }
function fail(label) { failures += 1; console.error('FAIL STAGE227F2R1_CLIENT_CASE_HEADER_STRETCH_LEAD_COPY_FIX: ' + label); }
function must(text, fragment, label) { text.includes(fragment) ? ok(label) : fail('missing: ' + label); }
function mustNot(text, fragment, label) { text.includes(fragment) ? fail('still contains: ' + label) : ok('not contains: ' + label); }
const leadCss = read('src/styles/visual-stage14-lead-detail-vnext.css');
const clientCss = read('src/styles/visual-stage12-client-detail-vnext.css');
const caseCss = read('src/styles/visual-stage13-case-detail-vnext.css');
const unifiedCss = read('src/styles/closeflow-unified-page-canvas-stage211c.css');
const pkg = read('package.json');
must(leadCss, 'STAGE227F2R1_LEAD_COPY_BUTTON_NO_CLIP_START', 'lead copy no-clip marker');
must(leadCss, '.lead-detail-header-contact-grid .lead-detail-header-meta-item.lead-detail-header-phone-item', 'lead phone copy row selector');
must(leadCss, 'grid-template-columns: minmax(0, 1fr) auto !important;', 'lead copy row has value plus copy button grid');
must(leadCss, 'grid-row: 1 / 3 !important;', 'lead copy button spans label and value rows');
must(leadCss, 'min-height: 58px !important;', 'lead copy row prevents vertical clipping');
must(clientCss, 'STAGE227F2R1_CLIENT_HEADER_STRETCH_START', 'client header stretch marker');
must(clientCss, '.client-detail-header,', 'client header selector');
must(clientCss, '.client-detail-shell {', 'client shell selector');
must(clientCss, 'max-width: none !important;', 'client removes artificial max-width moat');
must(clientCss, 'margin-left: 0 !important;', 'client removes left auto moat');
must(clientCss, 'grid-template-columns: minmax(260px, 300px) minmax(0, 1fr) minmax(280px, 310px) !important;', 'client desktop shell grid contract');
must(caseCss, 'STAGE227F2R1_CASE_HEADER_STRETCH_START', 'case header stretch marker');
must(caseCss, '.case-detail-header,', 'case header selector');
must(caseCss, '.case-detail-shell {', 'case shell selector');
must(caseCss, 'grid-template-columns: minmax(0, 1fr) minmax(300px, 320px) !important;', 'case desktop shell grid contract');
must(unifiedCss, 'STAGE227F2R1_SHARED_DETAIL_HEADER_STRETCH_START', 'shared detail header stretch marker');
must(unifiedCss, ':where(.client-detail-header, .case-detail-header)', 'shared client/case header selector');
must(pkg, 'check:stage227f2r1-client-case-header-stretch-lead-copy-fix', 'package check script');
must(pkg, 'test:stage227f2r1-client-case-header-stretch-lead-copy-fix', 'package test script');
if (failures) { console.error('\nStage227F2R1 guard failures: ' + failures); process.exit(1); }
console.log('PASS STAGE227F2R1_CLIENT_CASE_HEADER_STRETCH_LEAD_COPY_FIX');
