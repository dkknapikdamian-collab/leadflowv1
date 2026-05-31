#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const checks = [];
function check(label, condition) {
  checks.push({ label, pass: Boolean(condition) });
}

const calendarPath = 'src/pages/Calendar.tsx';
const reportPath = '_project/reports/STAGE213C_B_CALENDAR_RETRY_POLICY_2026-05-31.md';
const obsidianPath = 'OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/2026-05-31 - CloseFlow Stage213C-B calendar retry policy.md';

check('Calendar.tsx exists', fs.existsSync(path.join(root, calendarPath)));
check('Stage213C-B report exists', fs.existsSync(path.join(root, reportPath)));
check('Stage213C-B Obsidian update exists', fs.existsSync(path.join(root, obsidianPath)));

if (fs.existsSync(path.join(root, calendarPath))) {
  const src = read(calendarPath);
  check('has Stage213C-B marker', src.includes('STAGE213C_B_CALENDAR_RETRY_POLICY'));
  check('has one-retry limit constant', src.includes('CALENDAR_READY_MAX_EMPTY_RETRIES = 1'));
  check('has 900ms empty retry delay', src.includes('CALENDAR_READY_EMPTY_RETRY_DELAY_MS = 900'));
  check('has bundle row counter', src.includes('function countStage213CBCalendarBundleRows'));
  check('loadBundle returns CalendarLoadResult', src.includes("type CalendarLoadResult = 'loaded' | 'empty' | 'failed'"));
  check('initial load schedules retry only on non-loaded result', src.includes("void loadBundle('initial').then((result) =>") && src.includes("result !== 'loaded'") && src.includes('scheduleEmptyRetry(1)'));
  check('retry timer uses single delay constant', src.includes('}, CALENDAR_READY_EMPTY_RETRY_DELAY_MS);'));
  check('retry timers are pushed, not created from [250,900,1800].map', src.includes('calendarReadyRetryTimersRef.current.push(timer)'));
  check('old three retry array removed', !src.includes('[250, 900, 1800]') && !src.includes('[250,900,1800]'));
  check('old unconditional retry map removed', !src.includes('.map((delayMs) => window.setTimeout'));
  check('Google inbound sync preserved', src.includes('syncGoogleCalendarInboundForCalendar()') && src.includes('shouldRefreshCalendarAfterGoogleInboundSync(result)'));
  check('live mutation refresh preserved', src.includes('subscribeCloseflowDataMutations') && src.includes('CALENDAR_LIVE_REFRESH_FAILED'));
  check('does not touch NotificationsCenter', fs.existsSync(path.join(root, 'src/pages/NotificationsCenter.tsx')));
}

for (const p of [reportPath, obsidianPath]) {
  if (fs.existsSync(path.join(root, p))) {
    const text = read(p);
    check(`${p} mentions no SQL/RLS/GRANT`, /SQL/.test(text) && /RLS/.test(text) && /GRANT/.test(text));
    check(`${p} mentions Calendar retry policy`, /Calendar/.test(text) && /retry/.test(text));
    check(`${p} mentions Stage213C-B`, text.includes('Stage213C-B'));
  }
}

const failed = checks.filter((c) => !c.pass);
for (const c of checks) {
  console.log(`${c.pass ? 'PASS' : 'FAIL'} - ${c.label}`);
}
if (failed.length) {
  console.error(`\nFAIL: ${failed.length} Stage213C-B checks failed.`);
  process.exit(1);
}
console.log(`\nPASS: ${checks.length} Stage213C-B checks passed.`);
