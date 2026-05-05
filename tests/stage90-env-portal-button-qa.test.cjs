const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { joinedRelevantText } = require('../scripts/stage90-scan-lib.cjs');

const root = process.cwd();

function read(file) {
  try {
    return fs.readFileSync(path.join(root, file), 'utf8').replace(/^\uFEFF/, '');
  } catch {
    return '';
  }
}

test('Stage90E documents that env smoke is required and not faked', () => {
  const readFirst = read('00_READ_FIRST_STAGE90_QA_SMOKE_PWA_DIGEST_PORTAL_BUTTON_MATRIX.md');
  const evidence = read('docs/qa/STAGE90_ENV_SMOKE_EVIDENCE.latest.md');

  assert.ok(readFirst.includes('QA_SMOKE_REQUIRED'));
  assert.match(readFirst, /CUMULATIVE_STAGE90[A-Z]/);
  assert.ok(readFirst.includes('Kod i guardy nie są dowodem'));
  assert.ok(evidence.includes('Live smoke required'));
  assert.ok(evidence.includes('Do not mark Stage13/14/15 as fully DONE'));
});

test('Stage90E checklist covers required Button Matrix columns and critical routes', () => {
  const checklist = read('docs/qa/CHECKLISTA_QA_PRZYCISKOW_CLOSEFLOW_2026-05-05.md');

  assert.ok(checklist.includes('| Trasa | Przycisk / akcja | Oczekiwany efekt | Typ efektu | Wynik po reloadzie | Test / guard | Status live | Uwagi |'));
  assert.ok(checklist.includes('/billing'));
  assert.ok(checklist.includes('/client-portal'));
  assert.ok(checklist.includes('/settings'));
  assert.ok(checklist.includes('Admin toolbar'));
  assert.ok(checklist.includes('PENDING'));
});

test('Stage90E static contracts cover notifications, digest, portal, and package scripts', () => {
  const notificationRuntime = read('src/components/NotificationRuntime.tsx');
  const appText = read('src/App.tsx') + '\n' + read('src/components/Layout.tsx');
  const vercel = read('vercel.json');
  const digestFiles = joinedRelevantText(fs, path, root, ['daily-digest', 'digest', 'resend']);
  const portalFiles = joinedRelevantText(fs, path, root, ['portal', 'storage-upload', 'upload', 'bucket']);
  const digestText = digestFiles.map((item) => item.text).join('\n');
  const portalText = portalFiles.map((item) => item.text).join('\n');
  const pkg = JSON.parse(read('package.json'));

  assert.match(notificationRuntime, /60000|60_000|60\s*\*\s*1000|POLL_INTERVAL|pollInterval|setInterval/i);
  assert.ok(appText.includes('NotificationRuntime'));
  assert.match(vercel, /daily-digest|kind=daily-digest/i);
  assert.match(vercel, /crons|schedule/i);
  assert.ok(digestFiles.length > 0);
  assert.match(digestText, /RESEND_API_KEY|Resend|DIGEST_FROM_EMAIL/i);
  assert.ok(portalFiles.length > 0);
  assert.match(portalText, /storage|bucket|upload|SUPABASE_PORTAL_BUCKET|portal-uploads/i);
  assert.ok(pkg.scripts['verify:stage90-env-portal-button-qa']);
});
