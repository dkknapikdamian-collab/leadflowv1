#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const fail = [];
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8').replace(/^\uFEFF/, '');
const expect = (condition, message) => { if (!condition) fail.push(message); };

const rootDoc = read('00_READ_FIRST_STAGE89_ACCEPTED_ADMIN_DEBUG_AND_LEAD_DETAIL.md');
const releaseDoc = read('docs/release/STAGE89C_MANUAL_ACCEPTANCE_LEDGER_2026-05-05.md');
const pkg = JSON.parse(read('package.json'));

expect(rootDoc.includes('Status: ACCEPTED_MANUAL_BY_USER'), 'root acceptance doc must mark accepted status');
expect(rootDoc.includes('Admin Debug Toolbar'), 'root acceptance doc must mention Admin Debug Toolbar');
expect(rootDoc.includes('LeadDetail right rail'), 'root acceptance doc must mention LeadDetail right rail');
expect(rootDoc.includes('Nie wracaj do kolejnego \u0142atania'), 'root acceptance doc must warn against blind rework');

expect(releaseDoc.includes('Stage89C - Manual acceptance ledger'), 'release doc title missing');
expect(releaseDoc.includes('ale dzia\u0142a poprawnie'), 'release doc must cite user acceptance phrase');
expect(releaseDoc.includes('Stage87G'), 'release doc must list Stage87G');
expect(releaseDoc.includes('Stage88'), 'release doc must list Stage88');
expect(releaseDoc.includes('Stage89'), 'release doc must list Stage89');
expect(releaseDoc.includes('Stage89B'), 'release doc must list Stage89B');
expect(releaseDoc.includes('verify:admin-tools'), 'release doc must mention verify:admin-tools');

expect(Boolean(pkg.scripts?.['check:stage89c-manual-acceptance']), 'package missing Stage89C check script');
expect(Boolean(pkg.scripts?.['test:stage89c-manual-acceptance']), 'package missing Stage89C test script');

if (fail.length) {
  console.error('Stage89C manual acceptance guard failed.');
  for (const item of fail) console.error('- ' + item);
  process.exit(1);
}

console.log('PASS STAGE89C_MANUAL_ACCEPTANCE_LEDGER');
