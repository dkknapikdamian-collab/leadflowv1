const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const file = path.join(root, 'src/pages/LeadDetail.tsx');
const text = fs.readFileSync(file, 'utf8');

const emptyConditional = /\{!leadInService\s*\?\s*\(\s*\)\s*:\s*null\}/;
if (emptyConditional.test(text)) {
  console.error('LEADDETAIL_EMPTY_CONDITIONAL_V21_FAIL: empty {!leadInService ? ( ) : null} block remains in LeadDetail.tsx');
  process.exit(1);
}

if (!text.includes('lead-detail-main-column')) {
  console.error('LEADDETAIL_EMPTY_CONDITIONAL_V21_FAIL: missing lead-detail-main-column anchor');
  process.exit(1);
}

console.log('OK leaddetail no empty conditional v21');
