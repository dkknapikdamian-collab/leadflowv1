#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const required = [
  'src/server/_digest.ts',
  'src/server/_mail.ts',
  'src/server/daily-digest-handler.ts',
  'src/server/weekly-report-handler.ts',
  'src/components/NotificationRuntime.tsx',
  'src/pages/NotificationsCenter.tsx',
  'src/pages/Settings.tsx',
  'src/components/PwaInstallPrompt.tsx',
  'public/manifest.webmanifest',
  'public/service-worker.js',
  'supabase/migrations/20260501192800_stage_a28_digest_logs_weekly_report.sql',
];

const failures = [];

function exists(rel) {
  return fs.existsSync(path.join(root, rel));
}

function read(rel) {
  const full = path.join(root, rel);
  if (!fs.existsSync(full)) {
    failures.push(`${rel} missing`);
    return '';
  }
  return fs.readFileSync(full, 'utf8');
}

function readOptional(rel) {
  const full = path.join(root, rel);
  if (!fs.existsSync(full)) return '';
  return fs.readFileSync(full, 'utf8');
}

function mustContain(rel, needle, label = needle) {
  const content = read(rel);
  if (!content.includes(needle)) failures.push(`${rel} missing ${label}`);
}

function mustContainOptional(content, rel, needle, label = needle) {
  if (!content.includes(needle)) failures.push(`${rel} missing ${label}`);
}

function vercelHasRewrite(vercelJson, source, destinationNeedle) {
  try {
    const parsed = JSON.parse(vercelJson);
    const rewrites = Array.isArray(parsed.rewrites) ? parsed.rewrites : [];
    return rewrites.some((item) => item && item.source === source && String(item.destination || '').includes(destinationNeedle));
  } catch {
    return false;
  }
}

for (const rel of required) read(rel);

mustContain('src/server/_digest.ts', 'buildDailyDigestPayload', 'daily payload builder');
mustContain('src/server/_digest.ts', 'casesWithoutPlannedAction', 'cases without planned action');
mustContain('src/server/_digest.ts', 'pendingAiDrafts', 'AI drafts in daily digest');
mustContain('src/server/_digest.ts', 'buildWeeklyReportPayload', 'weekly report payload');
mustContain('src/server/_digest.ts', 'movedToCases', 'weekly moved to cases');
mustContain('src/server/_digest.ts', 'caseBlockers', 'weekly case blockers');
mustContain('src/server/weekly-report-handler.ts', "report_type: 'weekly'", 'weekly digest log type');
mustContain('src/server/weekly-report-handler.ts', 'alreadySentWeekly', 'weekly dedupe');
mustContain('src/server/daily-digest-handler.ts', 'digest_logs', 'daily digest logs');
mustContain('src/server/daily-digest-handler.ts', "report_type: 'daily'", 'daily digest log type');
mustContain('src/server/daily-digest-handler.ts', 'alreadySentToday', 'daily dedupe');

const system = readOptional('api/system.ts');
const dailyFacade = readOptional('api/daily-digest.ts');
const weeklyFacade = readOptional('api/weekly-report.ts');
const vercel = read('vercel.json');

const hasDailyFacade = dailyFacade.includes('dailyDigestHandler');
const hasDailySystemRoute = system.includes('dailyDigestHandler') && system.includes('daily-digest') && vercelHasRewrite(vercel, '/api/daily-digest', '/api/system?kind=daily-digest');

if (!hasDailyFacade && !hasDailySystemRoute) {
  failures.push('daily digest API route missing: expected api/daily-digest.ts facade or api/system.ts consolidated route');
}

const hasWeeklyFacade = weeklyFacade.includes('weeklyReportHandler');
const hasWeeklySystemRoute = system.includes('weeklyReportHandler') && system.includes('weekly-report') && vercelHasRewrite(vercel, '/api/weekly-report', '/api/system?kind=weekly-report');

if (!hasWeeklyFacade && !hasWeeklySystemRoute) {
  failures.push('weekly report API route missing: expected api/weekly-report.ts facade or api/system.ts consolidated route');
}

mustContain('vercel.json', '/api/weekly-report', 'weekly report cron');
mustContain('public/service-worker.js', 'isApiOrDataRequest', 'API cache guard');
mustContain('public/service-worker.js', "path.startsWith('/api/')", 'no aggressive API cache');
mustContain('src/components/PwaInstallPrompt.tsx', 'beforeinstallprompt', 'install prompt event');
mustContain('src/components/PwaInstallPrompt.tsx', 'Do ekranu początkowego', 'iOS manual install fallback');
mustContain('src/pages/Settings.tsx', 'DAILY_DIGEST_EMAIL_UI_VISIBLE = true', 'digest settings visible');
mustContain('public/manifest.webmanifest', '"display": "standalone"', 'standalone display');
mustContain('public/manifest.webmanifest', 'closeflow-icon-192.png', '192 png icon');
mustContain('public/manifest.webmanifest', 'closeflow-icon-512.png', '512 png icon');
mustContain('supabase/migrations/20260501192800_stage_a28_digest_logs_weekly_report.sql', 'create table if not exists public.digest_logs', 'digest_logs migration');
mustContain('supabase/migrations/20260501192800_stage_a28_digest_logs_weekly_report.sql', 'digest_logs_one_report_per_day_idx', 'dedupe index');

const manifest = JSON.parse(read('public/manifest.webmanifest'));
if (manifest.display !== 'standalone') failures.push('manifest display is not standalone');
if (!Array.isArray(manifest.icons) || manifest.icons.length < 2) failures.push('manifest icons are incomplete');

if (failures.length) {
  console.error('A28 digest/notifications/PWA guard failed.');
  for (const failure of failures) console.error('- ' + failure);
  process.exit(1);
}

console.log('OK: A28 digest, notifications, weekly report and PWA guard passed.');
