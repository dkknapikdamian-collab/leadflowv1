const fs = require('fs');
const path = require('path');

const root = process.cwd();
const required = [
  'src/server/_digest.ts',
  'src/server/_mail.ts',
  'src/server/daily-digest-handler.ts',
  'src/server/weekly-report-handler.ts',
  'api/daily-digest.ts',
  'api/weekly-report.ts',
  'src/components/NotificationRuntime.tsx',
  'src/pages/NotificationsCenter.tsx',
  'src/pages/Settings.tsx',
  'src/components/PwaInstallPrompt.tsx',
  'public/manifest.webmanifest',
  'public/service-worker.js',
  'supabase/migrations/20260501192800_stage_a28_digest_logs_weekly_report.sql',
];

const failures = [];
function read(rel) {
  const full = path.join(root, rel);
  if (!fs.existsSync(full)) {
    failures.push(`${rel} missing`);
    return '';
  }
  return fs.readFileSync(full, 'utf8');
}
function mustContain(rel, needle, label = needle) {
  const content = read(rel);
  if (!content.includes(needle)) failures.push(`${rel} missing ${label}`);
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
mustContain('api/weekly-report.ts', 'weeklyReportHandler', 'weekly report API facade');
mustContain('api/daily-digest.ts', 'dailyDigestHandler', 'daily digest API facade');
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
