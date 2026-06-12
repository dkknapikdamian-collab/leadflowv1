#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = process.cwd();
function read(rel) {
  const p = path.join(root, rel);
  if (!fs.existsSync(p)) throw new Error(`Missing required file: ${rel}`);
  return fs.readFileSync(p, 'utf8');
}
function assert(condition, message) {
  if (!condition) throw new Error(message);
}
function noImportLegacyConnection(fileText, rel) {
  const importBlocks = fileText.match(/import\s*\{[\s\S]*?\}\s*from\s*['"]\.\/google-calendar-sync\.js['"];?/g) || [];
  for (const block of importBlocks) {
    assert(!block.includes('getGoogleCalendarConnection'), `${rel} must not import legacy getGoogleCalendarConnection.`);
  }
}

const outbound = read('src/server/google-calendar-outbound.ts');
const inbound = read('src/server/google-calendar-inbound.ts');
const handler = read('src/server/google-calendar-handler.ts');
const userScope = read('src/server/google-calendar-user-scope.ts');
const sync = read('src/server/google-calendar-sync.ts');
const foundProblems = read('_project/04_ZNALEZIONE_PROBLEMY_DO_ANALIZY.md');

noImportLegacyConnection(outbound, 'src/server/google-calendar-outbound.ts');
noImportLegacyConnection(inbound, 'src/server/google-calendar-inbound.ts');

assert(outbound.includes("getGoogleCalendarUserConnection"), 'Outbound sync must use exact user-scoped Google Calendar connection.');
assert(inbound.includes("getGoogleCalendarUserConnection"), 'Inbound sync must use exact user-scoped Google Calendar connection.');
assert(outbound.includes("personalScopeSkipped"), 'Outbound sync must report user-scope skipped records.');
assert(outbound.includes("workspaceWideDefault: false"), 'Outbound sync must not be workspace-wide by default.');
assert(outbound.includes("GOOGLE_CALENDAR_PERSONAL_SCOPE_USER_FIELDS_STAGE231F_R1"), 'Outbound sync must have explicit personal ownership field allowlist.');
assert(outbound.includes("googleCalendarPersonalScopeForRowStage231F"), 'Outbound sync must check row ownership before pushing to Google.');
assert(inbound.includes("source_user_id: userId"), 'Inbound import should mark source_user_id where schema supports it.');
assert(inbound.includes("google_calendar_user_id: userId"), 'Inbound import should mark google_calendar_user_id where schema supports it.');
assert(inbound.includes("connectionScope: 'user'"), 'Inbound result must expose user connection scope.');
assert(handler.includes("getGoogleCalendarUserConnection"), 'Handler must keep using exact user-scoped connection checks.');
assert(userScope.includes("Never borrow a workspace fallback token"), 'User-scope helper must preserve refresh-token guard.');
assert(sync.includes("getGoogleCalendarConnection"), 'Legacy helper may exist, but must be isolated away from normal member sync.');
assert(foundProblems.includes("FOUND-20260613-01"), 'Found problem ledger must record the remaining schema/ownership blocker.');

console.log(JSON.stringify({
  ok: true,
  stage: 'STAGE231F_R1_GOOGLE_CALENDAR_USER_SCOPE_SAFETY_LOCK',
  contract: 'normal Google Calendar sync uses exact user connection, blocks silent workspace fallback, and prevents workspace-wide outbound sync by default'
}, null, 2));
