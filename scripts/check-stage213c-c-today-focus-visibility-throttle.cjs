#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const root = process.cwd();
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const checks = [];
function check(label, condition) { checks.push({ label, pass: Boolean(condition) }); }
const pagePath = 'src/pages/TodayStable.tsx';
const reportPath = '_project/reports/STAGE213C_C_TODAY_FOCUS_VISIBILITY_THROTTLE_2026-05-31.md';
const obsidianPath = 'OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/2026-05-31 - CloseFlow Stage213C-C TodayStable focus visibility throttle.md';
check('TodayStable exists', fs.existsSync(path.join(root, pagePath)));
check('Stage213C-C report exists', fs.existsSync(path.join(root, reportPath)));
check('Stage213C-C Obsidian update exists', fs.existsSync(path.join(root, obsidianPath)));
if (fs.existsSync(path.join(root, pagePath))) {
  const src = read(pagePath);
  check('imports useRef', /useRef/.test(src));
  check('has Stage213C-C marker', src.includes('STAGE213C_C_TODAY_FOCUS_VISIBILITY_THROTTLE'));
  check('has TodayStable background refresh TTL 4 minutes', src.includes('TODAY_STABLE_BACKGROUND_REFRESH_TTL_MS = 4 * 60 * 1000'));
  check('has refresh in-flight ref', src.includes('todayRefreshInFlightRef'));
  check('has last successful refresh ref', src.includes('todayLastSuccessfulRefreshAtRef'));
  check('refreshData accepts force and reason', src.includes("reason?: 'initial' | 'manual' | 'focus' | 'visibility' | 'mutation' | 'operation'") && src.includes('force?: boolean'));
  check('focus refresh is not manual spinner refresh', src.includes("const handleFocus = () => void refreshData({ reason: 'focus' });"));
  check('visibility refresh is not manual spinner refresh', src.includes("if (document.visibilityState === 'visible') void refreshData({ reason: 'visibility' });"));
  check('legacy focus manual refresh removed', !src.includes('const handleFocus = () => void refreshData({ manual: true });'));
  check('legacy visibility manual refresh removed', !src.includes("if (document.visibilityState === 'visible') void refreshData({ manual: true });"));
  check('background refresh checks visibility', src.includes("document.visibilityState !== 'visible'"));
  check('background refresh checks TTL before full fetch', src.includes('now - todayLastSuccessfulRefreshAtRef.current < TODAY_STABLE_BACKGROUND_REFRESH_TTL_MS'));
  check('initial load remains forced', src.includes("refreshData({ manual: true, force: true, reason: 'initial' })"));
  check('manual refresh button remains forced', src.includes('data-stage213c-c-today-manual-refresh="true"') && src.includes("reason: 'manual'"));
  check('mutation refresh remains forced', src.includes("reason: 'mutation'"));
  check('operation refresh remains forced', src.includes("reason: 'operation'"));
  check('full data loader remains intact', src.includes('fetchTasksFromSupabase()') && src.includes('fetchLeadsFromSupabase()') && src.includes('fetchEventsFromSupabase()') && src.includes('fetchCasesFromSupabase()') && src.includes('getAiLeadDraftsAsync()'));
}
for (const p of [reportPath, obsidianPath]) {
  if (fs.existsSync(path.join(root, p))) {
    const text = read(p);
    check(`${p} mentions no SQL/RLS/GRANT`, /SQL/.test(text) && /RLS/.test(text) && /GRANT/.test(text));
    check(`${p} mentions TodayStable`, text.includes('TodayStable'));
    check(`${p} mentions focus/visibility`, /focus/i.test(text) && /visibility/i.test(text));
  }
}
const failed = checks.filter((c) => !c.pass);
for (const c of checks) console.log(`${c.pass ? 'PASS' : 'FAIL'} - ${c.label}`);
if (failed.length) { console.error(`\nFAIL: ${failed.length} Stage213C-C checks failed.`); process.exit(1); }
console.log(`\nPASS: ${checks.length} Stage213C-C checks passed.`);
