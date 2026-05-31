#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');

const checks = [];
function check(label, condition) {
  checks.push({ label, pass: Boolean(condition) });
}

const pagePath = 'src/pages/NotificationsCenter.tsx';
const reportPath = '_project/reports/STAGE213C_A_NOTIFICATIONS_QUERY_BUDGET_FIX_2026-05-31.md';
const obsidianPath = 'OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/2026-05-31 - CloseFlow Stage213C-A notifications query budget fix.md';

check('NotificationsCenter exists', fs.existsSync(path.join(root, pagePath)));
check('Stage213C-A report exists', fs.existsSync(path.join(root, reportPath)));
check('Stage213C-A Obsidian update exists', fs.existsSync(path.join(root, obsidianPath)));

if (fs.existsSync(path.join(root, pagePath))) {
  const src = read(pagePath);

  check('imports useCallback', /useCallback/.test(src));
  check('imports useRef', /useRef/.test(src));
  check('imports Loader2', /Loader2/.test(src));
  check('has Stage213C-A marker', src.includes('STAGE213C_A_NOTIFICATIONS_QUERY_BUDGET_FIX'));
  check('has visible-tab helper', src.includes('function isDocumentVisible()'));
  check('has background refresh interval 5 minutes', src.includes('NOTIFICATIONS_BACKGROUND_REFRESH_INTERVAL_MS = 5 * 60 * 1000'));
  check('has background refresh TTL 4 minutes', src.includes('NOTIFICATIONS_BACKGROUND_REFRESH_TTL_MS = 4 * 60 * 1000'));
  check('has in-flight dedupe ref', src.includes('bundleRefreshInFlightRef'));
  check('has manual refresh handler', src.includes('const handleManualRefresh'));
  check('manual refresh button rendered', src.includes('data-stage213c-a-notifications-manual-refresh="true"'));
  check('stage marker rendered on main element', src.includes('data-stage213c-a-notifications-query-budget="ttl-visible-refresh"'));
  check('shows last loaded label', src.includes('data-stage213c-a-notifications-last-refresh="true"'));

  check('legacy load() helper removed', !src.includes('const load = async () =>'));
  check('legacy 60s bundle polling removed', !src.includes('void load();') && !src.includes('fetchCalendarBundleFromSupabase();\n        if (!cancelled)'));

  const intervalCount = (src.match(/setInterval\(/g) || []).length;
  check('has exactly two intervals: background refresh plus local tick', intervalCount === 2);

  const backgroundIntervalIsVisibleGated =
    src.includes("const refreshIfVisible = (reason: 'visibility' | 'focus' | 'interval') => {") &&
    src.includes('if (!isDocumentVisible()) return;') &&
    src.includes("refreshIfVisible('interval');") &&
    src.includes('}, NOTIFICATIONS_BACKGROUND_REFRESH_INTERVAL_MS);');
  check('background interval is visibility-gated and uses 5 minute constant', backgroundIntervalIsVisibleGated);

  const localTickIsLocalOnly =
    src.includes('setLogTick((value) => value + 1);') &&
    src.includes('setSnoozedUntilByKey(getNotificationSnoozedUntilByKey());') &&
    src.includes('setPermission(getBrowserNotificationPermission());') &&
    src.includes('}, 60_000);');

  const localTickBundleWindow = /setInterval\(\(\) => \{[\s\S]{0,260}(fetchCalendarBundleFromSupabase|refreshNotificationBundle)[\s\S]{0,260}60_000/.test(src);
  check('60 second interval is local-only tick', localTickIsLocalOnly && !localTickBundleWindow);

  const directBundlePolling60s = /setInterval\(\(\) => \{[\s\S]{0,500}(fetchCalendarBundleFromSupabase|refreshNotificationBundle\(\{ reason: 'interval' \}\))[\s\S]{0,500}60_000/.test(src);
  check('no full Supabase bundle polling every 60 seconds', !directBundlePolling60s);
}

for (const p of [reportPath, obsidianPath]) {
  if (fs.existsSync(path.join(root, p))) {
    const text = read(p);
    check(`${p} mentions no SQL/RLS/GRANT`, /SQL/.test(text) && /RLS/.test(text) && /GRANT/.test(text));
    check(`${p} mentions NotificationsCenter`, text.includes('NotificationsCenter'));
    check(`${p} mentions REPAIR4`, text.includes('REPAIR4'));
    check(`${p} mentions REPAIR6`, text.includes('REPAIR6'));
  }
}

const failed = checks.filter((c) => !c.pass);
for (const c of checks) {
  console.log(`${c.pass ? 'PASS' : 'FAIL'} - ${c.label}`);
}

if (failed.length) {
  console.error(`\nFAIL: ${failed.length} Stage213C-A checks failed.`);
  process.exit(1);
}

console.log(`\nPASS: ${checks.length} Stage213C-A checks passed.`);
