const fs = require('fs');
const path = require('path');

const root = process.cwd();
let pass = 0;
let fail = 0;

function read(rel) {
  const file = path.join(root, rel);
  if (!fs.existsSync(file)) {
    record(false, `${rel}: exists`);
    return '';
  }
  record(true, `${rel}: exists`);
  return fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, '');
}

function record(ok, message) {
  if (ok) {
    pass += 1;
    console.log(`PASS ${message}`);
  } else {
    fail += 1;
    console.error(`FAIL ${message}`);
  }
}

function contains(text, needle, message) {
  record(text.includes(needle), `${message} [needle=${needle}]`);
}

function notContains(text, needle, message) {
  record(!text.includes(needle), `${message} [needle=${needle}]`);
}

const leadDetail = read('src/pages/LeadDetail.tsx');
const pkg = read('package.json');
const doc = read('docs/feedback/CLOSEFLOW_FB3_LEAD_DETAIL_CLEANUP_2026-05-09.md');

contains(leadDetail, 'CLOSEFLOW_FB3_LEAD_DETAIL_CLEANUP_V1', 'LeadDetail has FB-3 marker');
contains(leadDetail, 'data-fb3-lead-status-header-pill="true"', 'LeadDetail has header status pill marker');
contains(leadDetail, 'statusLabel(lead?.status)', 'LeadDetail status label remains visible');
contains(leadDetail, 'statusClass(lead?.status)', 'LeadDetail status tone remains visible');
notContains(leadDetail, 'Status leada', 'duplicated right rail Status leada card removed');
notContains(leadDetail, 'Lead aktywny. Możesz prowadzić kontakt sprzedażowy.', 'duplicated active lead helper copy removed');
notContains(leadDetail, 'Lead aktywny. Mozesz prowadzic kontakt sprzedazowy.', 'duplicated active lead helper copy ASCII removed');

contains(pkg, '"check:closeflow-fb3-lead-detail-cleanup"', 'package.json has FB-3 script');
contains(doc, 'CLOSEFLOW_FB3_LEAD_DETAIL_CLEANUP', 'FB-3 doc marker');
contains(doc, 'Nie zmienia statusów leadów', 'FB-3 doc preserves lead statuses');
contains(doc, 'status leada nadal jest widoczny', 'FB-3 doc states status remains visible');

console.log(`\nSummary: ${pass} pass, ${fail} fail.`);
if (fail > 0) {
  console.error('FAIL CLOSEFLOW_FB3_LEAD_DETAIL_CLEANUP_FAILED');
  process.exit(1);
}
console.log('CLOSEFLOW_FB3_LEAD_DETAIL_CLEANUP_OK');
