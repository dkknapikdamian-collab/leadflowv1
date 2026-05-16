const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8').replace(/^\uFEFF/, '');

test('Stage88 removes noisy LeadDetail helper copy and protects right rail readability', () => {
  const lead = read('src/pages/LeadDetail.tsx');
  const css = read('src/styles/visual-stage14-lead-detail-vnext.css');

  assert.ok(lead.includes('STAGE88_LEAD_DETAIL_ADMIN_FEEDBACK_HOTFIX'));
  assert.equal(lead.includes('Dodaj zadanie albo wydarzenie, je\u015Bli lead jest aktywny.'), false);
  assert.equal(lead.includes('Kr\u00F3tka historia kontaktu i przekazania tematu.'), false);
  assert.ok(css.includes('STAGE88_LEAD_DETAIL_RIGHT_RAIL_READABILITY'));
  assert.ok(css.includes('max-height: calc(100vh - 132px)'));
  assert.ok(css.includes('overflow-y: auto'));
  assert.ok(css.includes('color: #111827 !important'));
});

test('Stage88 sanitizes admin feedback export and removes placeholder commit', () => {
  const exportFile = read('src/components/admin-tools/admin-tools-export.ts');

  assert.ok(exportFile.includes('ADMIN_FEEDBACK_EXPORT_SANITIZE_STAGE88'));
  assert.ok(exportFile.includes('sanitizeAdminFeedbackPayload'));
  assert.ok(exportFile.includes('Klikni\u0119to'));
  assert.ok(exportFile.includes('Klikni\u0119to'));
  assert.ok(exportFile.includes('unknown_local_build'));
  assert.equal(exportFile.includes("commit: 'COMMIT_SHA_PLACEHOLDER'"), false);
});

test('Stage88 makes admin targeting more precise and Button Matrix page-scoped', () => {
  const candidates = read('src/components/admin-tools/dom-candidates.ts');

  assert.ok(candidates.includes('ADMIN_TARGET_PRECISION_STAGE88'));
  assert.ok(candidates.includes('large-container-penalty'));
  assert.ok(candidates.includes('text-leaf'));
  assert.ok(candidates.includes('getActionScanScope'));
  assert.ok(candidates.includes('pageActions.length ? pageActions : scopedElements'));
});
