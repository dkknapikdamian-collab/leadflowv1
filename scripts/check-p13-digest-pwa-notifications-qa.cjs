#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const root = process.cwd();
const failures = [];
function read(rel){
  const full = path.join(root, rel);
  if(!fs.existsSync(full)){ failures.push(`${rel} missing`); return ''; }
  return fs.readFileSync(full, 'utf8');
}
function expect(cond, msg){ if(!cond) failures.push(msg); }
const pkg = JSON.parse(read('package.json') || '{}');
const daily = read('src/server/daily-digest-handler.ts');
const weekly = read('src/server/weekly-report-handler.ts');
const notifications = read('src/pages/NotificationsCenter.tsx');
const sw = read('public/service-worker.js');
const manifest = read('public/manifest.webmanifest');
const a28 = read('scripts/check-a28-digest-notifications-pwa.cjs');

expect(pkg.scripts && pkg.scripts['check:p13-digest-pwa-notifications-qa'], 'package.json missing check:p13-digest-pwa-notifications-qa');

expect(daily.includes('getDigestPlanGateStatus'), 'daily digest missing plan gate status helper');
expect(daily.includes("planId === 'free'"), 'daily digest must block free plan');
expect(daily.includes('DIGEST_NOT_AVAILABLE_ON_FREE'), 'daily digest self-test must reject free plan');
expect(daily.includes('stats.skippedPlan += 1'), 'daily digest cron must count skippedPlan');
expect(daily.includes('DIGEST_ENFORCE_WORKSPACE_HOUR, true'), 'daily digest must enforce workspace hour by default');
expect(daily.includes('alreadySentToday'), 'daily digest must keep duplicate protection');
expect(daily.includes("report_type: 'daily'"), 'daily digest must log daily report type');

expect(weekly.includes('getWeeklyPlanGateStatus'), 'weekly report missing plan gate status helper');
expect(weekly.includes("planId === 'free'"), 'weekly report must block free plan');
expect(weekly.includes('WEEKLY_REPORT_NOT_AVAILABLE_ON_FREE'), 'weekly report self-test must reject free plan');
expect(weekly.includes('stats.skippedPlan += 1'), 'weekly report cron must count skippedPlan');
expect(weekly.includes('alreadySentWeekly'), 'weekly report must keep duplicate protection');
expect(weekly.includes("report_type: 'weekly'"), 'weekly report must log weekly report type');

expect(!notifications.includes('Poranny digest e-mail jest przygotowany jako kolejny etap.'), 'NotificationsCenter still says digest is future work');
expect(notifications.includes('Konfiguracja w Ustawieniach'), 'NotificationsCenter missing digest settings pointer');

expect(sw.includes('P13_API_NETWORK_ONLY'), 'service worker missing P13 API network-only marker');
expect(sw.includes("path.startsWith('/api/')"), 'service worker must not cache API paths');
expect(sw.includes("path.includes('/storage/v1/')"), 'service worker must not cache Supabase storage paths');

expect(manifest.includes('"display": "standalone"'), 'manifest must be standalone');
expect(manifest.includes('closeflow-icon-192.png'), 'manifest missing 192 icon');
expect(manifest.includes('closeflow-icon-512.png'), 'manifest missing 512 icon');
expect(a28.includes('public/service-worker.js'), 'A28 guard must still cover service worker');

if(failures.length){
  console.error('P13 digest/PWA/notifications QA guard failed.');
  for(const failure of failures) console.error('- ' + failure);
  process.exit(1);
}
console.log('OK: P13 digest/PWA/notifications QA guard passed.');
