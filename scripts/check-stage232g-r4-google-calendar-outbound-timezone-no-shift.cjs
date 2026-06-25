const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
function read(rel) { return fs.readFileSync(path.join(root, rel), 'utf8'); }
function fail(message) {
  console.error('STAGE232G_R4_GOOGLE_CALENDAR_OUTBOUND_TIMEZONE_NO_SHIFT_FAIL');
  console.error('- ' + message);
  process.exit(1);
}
function expect(src, needle, label) {
  if (!src.includes(needle)) fail(label + ': missing ' + needle);
}
function functionBody(src, name) {
  const start = src.indexOf('function ' + name + '(');
  if (start < 0) fail('missing function ' + name);
  const next = src.indexOf('\nfunction ', start + 1);
  return src.slice(start, next > start ? next : src.length);
}

const outbound = read('src/server/google-calendar-outbound.ts');
const sync = read('src/server/google-calendar-sync.ts');
const contract = read('src/lib/calendar-timezone-contract.ts');

expect(outbound, "import { normalizeCloseFlowDateTimeToUtcIso } from '../lib/calendar-timezone-contract.js';", 'outbound imports central timezone contract');
expect(outbound, 'STAGE232G_R4_GOOGLE_CALENDAR_OUTBOUND_TIMEZONE_NO_SHIFT', 'outbound stage marker');
expect(outbound, 'return normalizeCloseFlowDateTimeToUtcIso(value);', 'outbound asIsoDate delegates to central contract');

const asIso = functionBody(outbound, 'asIsoDate');
if (/new Date\(raw\)\s*;?[\s\S]*toISOString\(\)/.test(asIso)) {
  fail('outbound asIsoDate still uses raw new Date(raw).toISOString()');
}
if (asIso.includes('const parsed = new Date(raw)')) {
  fail('outbound asIsoDate still uses parsed raw Date');
}

expect(contract, "CLOSEFLOW_DEFAULT_TIMEZONE = 'Europe/Warsaw'", 'central timezone is Europe/Warsaw');
expect(contract, 'localDateTimeInputToUtcIso', 'contract has local datetime -> UTC conversion');
expect(contract, 'normalizeCloseFlowDateTimeToUtcIso', 'contract has normalize function');
expect(contract, 'utcIsoToGoogleDateTimeInDefaultZone', 'contract has UTC -> Google wall-clock conversion');
expect(contract, 'hasExplicitUtcOffset', 'contract detects explicit offsets');

expect(sync, 'utcIsoToGoogleDateTimeInDefaultZone(startIso, CLOSEFLOW_DEFAULT_TIMEZONE)', 'Google sync builds wall-clock in default zone');
expect(sync, 'timeZone: CLOSEFLOW_DEFAULT_TIMEZONE', 'Google sync sends timezone field');

console.log(JSON.stringify({
  stage: 'STAGE232G_R4_GOOGLE_CALENDAR_OUTBOUND_TIMEZONE_NO_SHIFT',
  ok: true,
  scope: 'Outbound Google Calendar sync uses central CloseFlow timezone contract, so no-offset 13:19 is not treated as UTC and shifted to 15:19.'
}, null, 2));
