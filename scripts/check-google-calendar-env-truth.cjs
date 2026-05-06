#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

const settings = read('src/pages/Settings.tsx');
const handler = read('src/server/google-calendar-handler.ts');
const sync = read('src/server/google-calendar-sync.ts');
const vercel = read('vercel.json');

assert.match(sync, /GOOGLE_CLIENT_ID/);
assert.match(sync, /GOOGLE_CLIENT_SECRET/);
assert.match(sync, /GOOGLE_REDIRECT_URI/);
assert.match(sync, /GOOGLE_TOKEN_ENCRYPTION_KEY/);
assert.match(sync, /configured:/);
assert.match(handler, /GOOGLE_CALENDAR_CONFIG_REQUIRED/);
assert.match(handler, /missing: cfg\.missing/);
assert.match(settings, /Wymaga konfiguracji/);
assert.match(settings, /canUseGoogleCalendarByPlan/);
assert.match(settings, /access\?\.features\?\.googleCalendar/);
assert.match(settings, /googleCalendarStatus\?\.configured === false/);
assert.match(vercel, /"source": "\/api\/google-calendar"/);
assert.match(vercel, /"destination": "\/api\/system\?kind=google-calendar"/);

console.log('OK check:google-calendar-env-truth');
