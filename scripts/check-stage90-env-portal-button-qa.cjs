#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { readSafe, joinedRelevantText } = require('./stage90-scan-lib.cjs');

const root = process.cwd();
const fail = [];

function read(file) {
  return readSafe(fs, path.join(root, file));
}

function expect(condition, message) {
  if (!condition) fail.push(message);
}

const readFirst = read('00_READ_FIRST_STAGE90_QA_SMOKE_PWA_DIGEST_PORTAL_BUTTON_MATRIX.md');
const release = read('docs/release/STAGE90_ENV_SMOKE_PWA_DIGEST_PORTAL_BUTTON_MATRIX_2026-05-05.md');
const checklist = read('docs/qa/CHECKLISTA_QA_PRZYCISKOW_CLOSEFLOW_2026-05-05.md');
const evidence = read('docs/qa/STAGE90_ENV_SMOKE_EVIDENCE.latest.md');
const writer = read('scripts/write-stage90-env-smoke-evidence.cjs');
const pkgText = read('package.json');
const pkg = JSON.parse(pkgText);

const vercel = read('vercel.json');
const notificationRuntime = read('src/components/NotificationRuntime.tsx');
const appText = read('src/App.tsx') + '\n' + read('src/components/Layout.tsx');
const swText = [
  'public/sw.js',
  'public/service-worker.js',
  'src/service-worker.ts',
  'src/serviceWorker.ts',
  'src/lib/service-worker.ts',
].map(read).join('\n');

const digestFiles = joinedRelevantText(fs, path, root, ['daily-digest', 'digest', 'resend']);
const portalFiles = joinedRelevantText(fs, path, root, ['portal', 'storage-upload', 'upload', 'bucket']);
const digestText = digestFiles.map((item) => `\n/* ${item.rel} */\n${item.text}`).join('\n');
const portalText = portalFiles.map((item) => `\n/* ${item.rel} */\n${item.text}`).join('\n');

const intervalRegex = /60000|60_000|60\s*\*\s*1000|POLL_INTERVAL|pollInterval|setInterval/i;

expect(readFirst.includes('QA_SMOKE_REQUIRED'), 'root read-first Stage90 doc missing QA_SMOKE_REQUIRED');
expect(readFirst.includes('CUMULATIVE_STAGE90C'), 'root read-first doc must mark cumulative Stage90C');
expect(release.includes('Stage90C - Env smoke'), 'release doc missing Stage90C title');
expect(release.includes('Etap 13'), 'release doc must mention Etap 13');
expect(release.includes('Etap 14'), 'release doc must mention Etap 14');
expect(release.includes('Etap 15'), 'release doc must mention Etap 15');

expect(checklist.includes('CHECKLISTA QA PRZYCISKÓW CLOSEFLOW 2026-05-05'), 'Button Matrix checklist title missing');
expect(checklist.includes('| Trasa | Przycisk / akcja | Oczekiwany efekt |'), 'Button Matrix checklist table missing');
expect(checklist.includes('/billing'), 'Button Matrix checklist must include billing');
expect(checklist.includes('/client-portal'), 'Button Matrix checklist must include portal');
expect(checklist.includes('Admin toolbar'), 'Button Matrix checklist must include admin toolbar');
expect(checklist.includes('Status live'), 'Button Matrix checklist must track live status');

expect(evidence.includes('Stage90 Env Smoke Evidence'), 'evidence file missing');
expect(evidence.includes('CUMULATIVE_STAGE90C'), 'evidence must mark cumulative Stage90C');
expect(evidence.includes('Live smoke required'), 'evidence must explicitly require live smoke');
expect(evidence.includes('Do not mark Stage13/14/15 as fully DONE'), 'evidence must block fake DONE status');

expect(writer.includes('RESEND_API_KEY'), 'evidence writer must check RESEND_API_KEY');
expect(writer.includes('SUPABASE_PORTAL_BUCKET'), 'evidence writer must check SUPABASE_PORTAL_BUCKET');
expect(writer.includes('NotificationRuntime'), 'evidence writer must check NotificationRuntime');
expect(writer.includes('joinedRelevantText'), 'evidence writer must use recursive relevant-file scan');
expect(writer.includes('CHECKLISTA_QA_PRZYCISKOW_CLOSEFLOW_2026-05-05.md'), 'evidence writer must reference checklist');

expect(notificationRuntime.length > 0, 'NotificationRuntime file missing or empty');
expect(intervalRegex.test(notificationRuntime), 'NotificationRuntime must have interval/polling contract; accepted: 60000, 60_000, 60*1000, POLL_INTERVAL, pollInterval, setInterval');
expect(appText.includes('NotificationRuntime'), 'NotificationRuntime must be mounted in App/Layout');

if (swText.trim()) {
  expect(/\/api\/|auth|storage|portal/i.test(swText), 'service worker must reference non-caching for api/auth/storage/portal when SW exists');
}

expect(/daily-digest|kind=daily-digest/i.test(vercel), 'vercel.json must include daily digest route/rewrite');
expect(/crons|schedule/i.test(vercel), 'vercel.json must include cron schedule');
expect(digestFiles.length > 0, 'digest relevant files must be discoverable');
expect(/RESEND_API_KEY|Resend|DIGEST_FROM_EMAIL/i.test(digestText), 'digest code must reference Resend env contract');
expect(portalFiles.length > 0, 'portal/storage relevant files must be discoverable');
expect(/token|session|portal/i.test(portalText), 'portal code must reference token/session/portal contract');
expect(/storage|bucket|upload|SUPABASE_PORTAL_BUCKET|portal-uploads/i.test(portalText), 'portal storage code must reference storage/bucket/upload contract');
expect(/401|403|unauthor|forbidden|token|session/i.test(portalText), 'portal must have no-token/unauthorized guard markers');

expect(Boolean(pkg.scripts?.['stage90:write-env-smoke-evidence']), 'package missing stage90 evidence writer script');
expect(Boolean(pkg.scripts?.['check:stage90-env-portal-button-qa']), 'package missing stage90 check script');
expect(Boolean(pkg.scripts?.['test:stage90-env-portal-button-qa']), 'package missing stage90 test script');
expect(Boolean(pkg.scripts?.['verify:stage90-env-portal-button-qa']), 'package missing stage90 verify script');

if (fail.length) {
  console.error('Stage90 env/portal/button QA guard failed.');
  for (const item of fail) console.error('- ' + item);
  console.error('');
  console.error('Diagnostic:');
  console.error(`- digestFiles=${digestFiles.map((f) => f.rel).slice(0, 10).join(', ')}`);
  console.error(`- portalFiles=${portalFiles.map((f) => f.rel).slice(0, 10).join(', ')}`);
  process.exit(1);
}

console.log('PASS STAGE90_ENV_PORTAL_BUTTON_QA');
console.log(`DIGEST_FILES=${digestFiles.length}`);
console.log(`PORTAL_FILES=${portalFiles.length}`);
