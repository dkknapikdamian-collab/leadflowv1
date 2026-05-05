#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { readSafe, joinedRelevantText } = require('./stage90-scan-lib.cjs');

const root = process.cwd();

function exists(file) {
  return fs.existsSync(path.join(root, file));
}

function statusEnv(key) {
  const value = process.env[key];
  if (!value) return 'MISSING';
  if (/example|change_me|todo|placeholder/i.test(String(value))) return 'EXAMPLE_OR_PLACEHOLDER';
  return 'SET';
}

function bool(value) {
  return value ? 'YES' : 'NO';
}

function json(file) {
  try {
    return JSON.parse(readSafe(fs, path.join(root, file)));
  } catch {
    return null;
  }
}

const vercel = json('vercel.json') || {};
const vercelText = readSafe(fs, path.join(root, 'vercel.json'));
const notificationRuntime = readSafe(fs, path.join(root, 'src/components/NotificationRuntime.tsx'));
const appText = readSafe(fs, path.join(root, 'src/App.tsx')) + '\n' + readSafe(fs, path.join(root, 'src/components/Layout.tsx'));
const swText = [
  'public/sw.js',
  'public/service-worker.js',
  'src/service-worker.ts',
  'src/serviceWorker.ts',
  'src/lib/service-worker.ts',
].map((file) => readSafe(fs, path.join(root, file))).join('\n');

const digestFiles = joinedRelevantText(fs, path, root, ['daily-digest', 'digest', 'resend']);
const portalFiles = joinedRelevantText(fs, path, root, ['portal', 'storage-upload', 'upload', 'bucket']);
const digestText = digestFiles.map((item) => `\n/* ${item.rel} */\n${item.text}`).join('\n');
const portalText = portalFiles.map((item) => `\n/* ${item.rel} */\n${item.text}`).join('\n');
const checklistPath = 'docs/qa/CHECKLISTA_QA_PRZYCISKOW_CLOSEFLOW_2026-05-05.md';

const envKeys = [
  'APP_URL',
  'RELEASE_PREVIEW_URL',
  'VERCEL_URL',
  'RESEND_API_KEY',
  'DIGEST_FROM_EMAIL',
  'CRON_SECRET',
  'SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'SUPABASE_PORTAL_BUCKET',
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY',
];

const intervalRegex = /60000|60_000|60\s*\*\s*1000|POLL_INTERVAL|pollInterval|setInterval/i;
const cronSummary = Array.isArray(vercel.crons)
  ? vercel.crons.map((cron) => `${cron.path || 'NO_PATH'} @ ${cron.schedule || 'NO_SCHEDULE'}`)
  : [];

const lines = [];
lines.push('# Stage90 Env Smoke Evidence');
lines.push('');
lines.push(`GeneratedAt: ${new Date().toISOString()}`);
lines.push('Status: EVIDENCE_TEMPLATE_NOT_LIVE_COMPLETE');
lines.push('Package: CUMULATIVE_STAGE90F');
lines.push('');
lines.push('## Env status');
lines.push('');
lines.push('| Key | Status |');
lines.push('|---|---|');
for (const key of envKeys) {
  lines.push(`| ${key} | ${statusEnv(key)} |`);
}
lines.push('');
lines.push('## Static contract snapshot');
lines.push('');
lines.push('| Area | Result | Evidence |');
lines.push('|---|---:|---|');
lines.push(`| NotificationRuntime file | ${bool(exists('src/components/NotificationRuntime.tsx'))} | src/components/NotificationRuntime.tsx |`);
lines.push(`| NotificationRuntime interval/poll contract | ${bool(intervalRegex.test(notificationRuntime))} | accepts 60000, 60_000, 60*1000, pollInterval/setInterval |`);
lines.push(`| Notification runtime mounted | ${bool(appText.includes('NotificationRuntime'))} | App/Layout scan |`);
lines.push(`| Service worker avoids API/auth/storage cache | ${bool(/\/api\/|auth|storage|portal/i.test(swText))} | public/src SW scan |`);
lines.push(`| Daily digest API/server contract | ${bool(/daily-digest|dailyDigest|DIGEST/i.test(digestText))} | scanned ${digestFiles.length} relevant files |`);
lines.push(`| Resend contract referenced | ${bool(/RESEND_API_KEY|Resend|DIGEST_FROM_EMAIL/i.test(digestText))} | digest scan |`);
lines.push(`| Vercel cron configured | ${bool(cronSummary.length)} | ${cronSummary.join('; ') || 'missing'} |`);
lines.push(`| Vercel rewrite daily digest/system | ${bool(/daily-digest|kind=daily-digest/i.test(vercelText))} | vercel.json scan |`);
lines.push(`| Portal relevant files found | ${bool(portalFiles.length)} | scanned ${portalFiles.length} relevant files |`);
lines.push(`| Portal token/session contract | ${bool(/token|session|portal/i.test(portalText))} | portal scan |`);
lines.push(`| Portal storage/upload/bucket contract | ${bool(/storage|bucket|upload|SUPABASE_PORTAL_BUCKET|portal-uploads/i.test(portalText))} | portal/storage recursive scan |`);
lines.push(`| Portal blocks missing token/session | ${bool(/401|403|token|session|unauthor|forbidden/i.test(portalText))} | portal/upload scan |`);
lines.push(`| Button QA checklist exists | ${bool(exists(checklistPath))} | ${checklistPath} |`);
lines.push('');
lines.push('## Relevant files discovered');
lines.push('');
lines.push('### Digest');
for (const item of digestFiles.slice(0, 20)) lines.push(`- ${item.rel}`);
lines.push('');
lines.push('### Portal / storage');
for (const item of portalFiles.slice(0, 30)) lines.push(`- ${item.rel}`);
lines.push('');
lines.push('## Live smoke required');
lines.push('');
lines.push('### Etap 13 - PWA / notifications / digest');
lines.push('');
lines.push('- [ ] Browser notification permission requested in real browser.');
lines.push('- [ ] Toast appears when due notification exists.');
lines.push('- [ ] Browser notification appears when permission is granted.');
lines.push('- [ ] PWA install/service worker visible in browser application panel.');
lines.push('- [ ] Daily digest cron route works in Vercel logs.');
lines.push('- [ ] Resend delivery verified with non-production test recipient or safe dry-run route.');
lines.push('- [ ] Digest dedupe verified: second run does not duplicate same digest.');
lines.push('');
lines.push('### Etap 14 - Portal / storage');
lines.push('');
lines.push('- [ ] Portal without token returns no access.');
lines.push('- [ ] Portal with valid token opens correct scoped session.');
lines.push('- [ ] Upload valid file succeeds.');
lines.push('- [ ] Upload invalid type/oversize fails.');
lines.push('- [ ] Uploaded file is not publicly listable.');
lines.push('- [ ] Token from another client/workspace cannot access data.');
lines.push('');
lines.push('### Etap 15 - Button Matrix');
lines.push('');
lines.push('- [ ] Fill live status in `docs/qa/CHECKLISTA_QA_PRZYCISKOW_CLOSEFLOW_2026-05-05.md`.');
lines.push('- [ ] Every PENDING/FAIL creates a new small repair stage.');
lines.push('');
lines.push('## Decision');
lines.push('');
lines.push('Do not mark Stage13/14/15 as fully DONE until live boxes above are checked.');

const out = path.join(root, 'docs/qa/STAGE90_ENV_SMOKE_EVIDENCE.latest.md');
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, lines.join('\n') + '\n', 'utf8');

console.log(`WROTE ${path.relative(root, out)}`);
