const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const calendarPath = path.join(root, 'src/pages/Calendar.tsx');
const calendar = fs.readFileSync(calendarPath, 'utf8');

function extractHardRefreshEffect(source) {
  const marker = 'STAGE114E_CALENDAR_HARD_REFRESH_READY_RETRY_CONTRACT';
  const markerIndex = source.indexOf(marker);
  assert.notEqual(markerIndex, -1, 'Stage114E hard refresh lifecycle marker missing.');
  const effectStart = source.lastIndexOf('useEffect(() => {', markerIndex);
  const effectEnd = source.indexOf('}, [workspace?.id, workspaceLoading, workspaceReady, calendarAuthUserId]);', markerIndex);
  assert.notEqual(effectStart, -1, 'Stage114E hard refresh useEffect start missing.');
  assert.notEqual(effectEnd, -1, 'Stage114E hard refresh useEffect dependency list missing.');
  return source.slice(effectStart, effectEnd + 80);
}

test('Stage114E hard refresh waits for workspaceReady before final calendar load', () => {
  assert.match(calendar, /const\s+\{\s*workspace,\s*hasAccess,\s*loading:\s*workspaceLoading,\s*workspaceReady\s*\}\s*=\s*useWorkspace\(\)/, 'Calendar must destructure workspaceReady from useWorkspace.');
  const effect = extractHardRefreshEffect(calendar);
  assert.match(effect, /workspaceLoading\s*\|\|\s*!workspaceReady\s*\|\|\s*!workspace\?\.id/, 'Loader must gate on workspaceLoading, workspaceReady and workspace id.');
  assert.match(effect, /setLoading\(true\);[\s\S]*return undefined;/, 'Not-ready branch must stay loading, not final empty.');
  assert.doesNotMatch(effect, /setEvents\(\s*\[\s*\]\s*\)|setTasks\(\s*\[\s*\]\s*\)|setLeads\(\s*\[\s*\]\s*\)/, 'Not-ready branch must not publish empty calendar arrays.');
});

test('Stage114E hard refresh lifecycle performs immediate load and retry reads after workspace is ready', () => {
  const effect = extractHardRefreshEffect(calendar);
  assert.match(calendar, /const\s+calendarLoadSeqRef\s*=\s*useRef\(0\)/, 'Calendar load sequence ref missing.');
  assert.match(calendar, /const\s+calendarReadyRetryTimersRef\s*=\s*useRef<number\[\]>\(\[\]\)/, 'Calendar retry timer ref missing.');
  assert.match(effect, /const\s+workspaceId\s*=\s*requireWorkspaceId\(workspace\)/, 'Loader must force workspace id resolution before fetch.');
  assert.match(effect, /await\s+refreshSupabaseBundle\(\)/, 'Loader must use shared refreshSupabaseBundle after workspaceReady.');
  assert.match(effect, /void\s+loadBundle\('initial'\)/, 'Loader must run immediately after workspaceReady.');
  assert.match(effect, /\[250,\s*900,\s*1800\]\.map/, 'Loader must schedule hard-refresh retry reads.');
});

test('Stage114E calendar UI distinguishes loading from loaded empty state', () => {
  assert.match(calendar, /const\s+calendarWorkspaceNotReady\s*=\s*workspaceLoading\s*\|\|\s*!workspaceReady\s*\|\|\s*!workspace\?\.id/, 'calendarWorkspaceNotReady state missing.');
  assert.match(calendar, /const\s+calendarDataLoading\s*=\s*calendarWorkspaceNotReady\s*\|\|\s*loading/, 'calendarDataLoading must include workspace-not-ready state.');
  assert.match(calendar, /const\s+calendarLoadedEmpty\s*=\s*!calendarDataLoading/, 'Loaded-empty state must be separate from loading.');
});
