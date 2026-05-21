const fs = require('fs');
const assert = require('assert');

const settings = fs.readFileSync('src/pages/Settings.tsx', 'utf8');
const handler = fs.readFileSync('src/server/google-calendar-handler.ts', 'utf8');

assert(settings.includes("getSupabaseAccessToken"), 'Settings must import getSupabaseAccessToken');
assert(settings.includes('buildGoogleCalendarRequestHeaders'), 'Settings must define buildGoogleCalendarRequestHeaders');
assert(settings.includes('Authorization: `Bearer ${token}`'), 'Settings Google Calendar headers must include Bearer token when available');

const googleCalendarFetches = Array.from(settings.matchAll(/fetch\('\/api\/google-calendar\?route=[^']+'[\s\S]*?\}\);/g)).map((m) => m[0]);
assert(googleCalendarFetches.length >= 4, 'Expected Google Calendar status/connect/disconnect/sync fetches');
for (const block of googleCalendarFetches) {
  assert(block.includes('headers: await buildGoogleCalendarRequestHeaders()'), 'Every Google Calendar fetch must use auth bridge headers');
}

assert(handler.includes("requireRequestIdentity"), 'Google Calendar handler must import/use requireRequestIdentity');
assert(/requestIdentity\?\.userId/.test(handler), 'Google Calendar handler must derive userId from verified request identity');
assert(/requestIdentity\?\.email/.test(handler), 'Google Calendar handler must derive userEmail from verified request identity');
assert(handler.includes('getUserId(req) ||'), 'Legacy x-user-id should remain only as fallback');

console.log('[Stage125B] OK: Google Calendar auth bridge source contract');
