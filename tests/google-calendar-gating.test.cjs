const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

test('Google Calendar is gated by Pro/AI plan features in Settings', () => {
  const settings = read('src/pages/Settings.tsx');
  assert.match(settings, /canUseGoogleCalendarByPlan/);
  assert.match(settings, /access\?\.features\?\.googleCalendar/);
  assert.match(settings, /hidden=\{!canUseGoogleCalendarByPlan\}/);
});

test('Free and Basic do not expose Google Calendar as available in the plan model', () => {
  const plans = read('src/lib/plans.ts');
  assert.match(plans, /googleCalendar:\s*false/);
  assert.match(plans, /googleCalendar:\s*PLAN_IDS\.pro/);
  assert.match(plans, /const PRO_FEATURES[\s\S]*googleCalendar:\s*true/);
});

test('missing Google Calendar environment is shown as configuration, not success', () => {
  const settings = read('src/pages/Settings.tsx');
  const handler = read('src/server/google-calendar-handler.ts');
  assert.match(settings, /Wymaga konfiguracji/);
  assert.match(handler, /status\(409\)\.json\(\{ error: 'GOOGLE_CALENDAR_CONFIG_REQUIRED', missing: cfg\.missing \}\)/);
});
