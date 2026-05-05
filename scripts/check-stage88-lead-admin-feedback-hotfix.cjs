#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const fail = [];
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8').replace(/^\uFEFF/, '');
const expect = (condition, message) => { if (!condition) fail.push(message); };

const lead = read('src/pages/LeadDetail.tsx');
const css = read('src/styles/visual-stage14-lead-detail-vnext.css');
const exportFile = read('src/components/admin-tools/admin-tools-export.ts');
const candidates = read('src/components/admin-tools/dom-candidates.ts');
const pkg = JSON.parse(read('package.json'));

expect(lead.includes('STAGE88_LEAD_DETAIL_ADMIN_FEEDBACK_HOTFIX'), 'LeadDetail must carry Stage88 marker');
expect(!lead.includes('Dodaj zadanie albo wydarzenie, jeśli lead jest aktywny.'), 'LeadDetail must remove noisy nearest-move helper copy');
expect(!lead.includes('Krótka historia kontaktu i przekazania tematu.'), 'LeadDetail must remove noisy history helper copy');
expect(css.includes('STAGE88_LEAD_DETAIL_RIGHT_RAIL_READABILITY'), 'LeadDetail CSS must carry Stage88 readability marker');
expect(css.includes('max-height: calc(100vh - 132px)'), 'Right rail must have bounded viewport height');
expect(css.includes('overflow-y: auto'), 'Right rail/cards must allow vertical scroll');
expect(css.includes('color: #111827 !important'), 'Right rail must force readable dark text');
expect(exportFile.includes('ADMIN_FEEDBACK_EXPORT_SANITIZE_STAGE88'), 'Admin export must carry Stage88 marker');
expect(exportFile.includes('sanitizeAdminFeedbackPayload'), 'Admin export must sanitize old mojibake payloads');
expect(exportFile.includes('unknown_local_build'), 'Admin export must use explicit fallback commit');
expect(!exportFile.includes("commit: 'COMMIT_SHA_PLACEHOLDER'"), 'Admin export must not emit COMMIT_SHA_PLACEHOLDER');
expect(candidates.includes('ADMIN_TARGET_PRECISION_STAGE88'), 'DOM candidates must carry Stage88 marker');
expect(candidates.includes('large-container-penalty'), 'DOM targeting must penalize huge containers');
expect(candidates.includes('text-leaf'), 'DOM targeting must prefer text leaf targets');
expect(candidates.includes('getActionScanScope'), 'Button Matrix must scan current page scope before sidebar');
expect(candidates.includes('pageActions.length ? pageActions : scopedElements'), 'Button Matrix must prefer page actions over navigation');
expect(Boolean(pkg.scripts?.['check:stage88-lead-admin-feedback-hotfix']), 'package missing Stage88 check script');
expect(Boolean(pkg.scripts?.['test:stage88-lead-admin-feedback-hotfix']), 'package missing Stage88 test script');
expect(String(pkg.scripts?.['verify:admin-tools'] || '').includes('check:stage88-lead-admin-feedback-hotfix'), 'verify:admin-tools must include Stage88 guard');

if (fail.length) {
  console.error('Stage88 lead/admin feedback hotfix guard failed.');
  for (const item of fail) console.error('- ' + item);
  process.exit(1);
}

console.log('PASS STAGE88_LEAD_ADMIN_FEEDBACK_HOTFIX');
