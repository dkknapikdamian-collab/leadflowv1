const fs = require('fs');
const path = require('path');
const marker = 'STAGE51_CLIENTS_CASE_CONTRAST_HOTFIX';
const checks = [
  ['src/pages/ClientDetail.tsx', marker],
  ['src/styles/visual-stage12-client-detail-vnext.css', marker],
  ['src/styles/visual-stage05-clients.css', marker],
  ['src/styles/visual-stage08-case-detail.css', marker],
  ['src/styles/visual-stage05-clients.css', '.clients-page .right-card p,'],
  ['src/styles/visual-stage08-case-detail.css', '.case-detail-page p,'],
  ['package.json', 'check:stage51-clients-case-contrast-hotfix'],
  ['tests/stage51-clients-case-contrast-hotfix.test.cjs', marker],
];
let failed = false;
for (const [file, expected] of checks) {
  const value = fs.readFileSync(path.join(process.cwd(), file), 'utf8');
  if (value.includes(expected)) {
    console.log('PASS ' + file + ': contains ' + expected);
  } else {
    console.error('FAIL ' + file + ': missing ' + expected);
    failed = true;
  }
}
if (failed) process.exit(1);
console.log('PASS STAGE51_CLIENTS_CASE_CONTRAST_HOTFIX');
