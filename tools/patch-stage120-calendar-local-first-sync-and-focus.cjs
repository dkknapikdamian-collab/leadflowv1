const fs = require('node:fs');
const path = require('node:path');

const repo = process.argv[2] ? path.resolve(process.argv[2]) : process.cwd();
const read = (rel) => fs.readFileSync(path.join(repo, rel), 'utf8');
const write = (rel, text) => {
  const full = path.join(repo, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, text, 'utf8');
};

function replaceOnce(text, needle, replacement, label) {
  if (!text.includes(needle)) throw new Error('Missing patch anchor: ' + label);
  return text.replace(needle, replacement);
}

function ensureOnce(text, needle, insertAfterNeedle, addition, label) {
  if (text.includes(needle)) return text;
  if (!text.includes(insertAfterNeedle)) throw new Error('Missing insert anchor: ' + label);
  return text.replace(insertAfterNeedle, insertAfterNeedle + addition);
}

function extractFunctionBody(source, functionName) {
  const marker = 'export async function ' + functionName;
  const start = source.indexOf(marker);
  if (start === -1) return '';
  const braceStart = source.indexOf('{', start);
  if (braceStart === -1) return '';
  let depth = 0;
  for (let i = braceStart; i < source.length; i += 1) {
    const ch = source[i];
    if (ch === '{') depth += 1;
    if (ch === '}') {
      depth -= 1;
      if (depth === 0) return source.slice(start, i + 1);
    }
  }
  return '';
}

function patchCalendarItems() {
  const rel = 'src/lib/calendar-items.ts';
  let text = read(rel);

  if (!text.includes('STAGE120_CALENDAR_LOCAL_FIRST_READ_GOOGLE_BACKGROUND')) {
    const oldBlock = `let lastGoogleCalendarInboundPullAt = 0;\nconst GOOGLE_CALENDAR_STAGE10K_INBOUND_PULL_THROTTLE_MS = 60_000;\n\nasync function maybePullGoogleCalendarInboundBeforeBundle() {\n  // GOOGLE_CALENDAR_STAGE10K_AUTO_PULL_BEFORE_BUNDLE\n  if (typeof window === 'undefined') return;\n  const now = Date.now();\n  if (now - lastGoogleCalendarInboundPullAt < GOOGLE_CALENDAR_STAGE10K_INBOUND_PULL_THROTTLE_MS) return;\n  lastGoogleCalendarInboundPullAt = now;\n  try {\n    const result = await syncGoogleCalendarInboundInSupabase({ daysBack: 30, daysForward: 90 });\n    const conflicts = Array.isArray(result?.conflicts) ? result.conflicts : [];\n    if (conflicts.length) {\n      const first = conflicts[0] || {};\n      toast.warning('Konflikt z Google Calendar', {\n        description: first.message || ('Wykryto ' + conflicts.length + ' konfliktów terminów po synchronizacji z Google Calendar.'),\n      });\n    }\n  } catch (error) {\n    console.warn('GOOGLE_CALENDAR_STAGE10K_INBOUND_PULL_FAILED', error);\n  }\n}\n`;
    const newBlock = `let lastGoogleCalendarInboundPullAt = 0;\nlet googleCalendarInboundPullInFlight: Promise<GoogleCalendarInboundSyncResult | null> | null = null;\nconst GOOGLE_CALENDAR_STAGE10K_INBOUND_PULL_THROTTLE_MS = 60_000;\n\nexport type GoogleCalendarInboundSyncResult = {\n  ok?: boolean;\n  connected?: boolean;\n  scanned?: number;\n  created?: number;\n  updated?: number;\n  deleted?: number;\n  conflicts?: Array<{\n    googleEventId?: string;\n    title?: string;\n    startAt?: string | null;\n    endAt?: string | null;\n    conflictCount?: number;\n    message?: string | null;\n  }>;\n};\n\nexport function shouldRefreshCalendarAfterGoogleInboundSync(result?: GoogleCalendarInboundSyncResult | null) {\n  if (!result || result.connected === false) return false;\n  return Boolean((result.created || 0) > 0 || (result.updated || 0) > 0 || (result.deleted || 0) > 0);\n}\n\nexport async function syncGoogleCalendarInboundForCalendar(options: { force?: boolean } = {}): Promise<GoogleCalendarInboundSyncResult | null> {\n  // STAGE120_CALENDAR_LOCAL_FIRST_READ_GOOGLE_BACKGROUND\n  // Calendar must render local Supabase data first. Google inbound sync is a background refresh, not a bootstrap blocker.\n  if (typeof window === 'undefined') return null;\n  const now = Date.now();\n  if (!options.force && now - lastGoogleCalendarInboundPullAt < GOOGLE_CALENDAR_STAGE10K_INBOUND_PULL_THROTTLE_MS) return null;\n  if (googleCalendarInboundPullInFlight) return googleCalendarInboundPullInFlight;\n\n  lastGoogleCalendarInboundPullAt = now;\n  googleCalendarInboundPullInFlight = syncGoogleCalendarInboundInSupabase({ daysBack: 30, daysForward: 90 })\n    .then((result) => {\n      const conflicts = Array.isArray(result?.conflicts) ? result.conflicts : [];\n      if (conflicts.length) {\n        const first = conflicts[0] || {};\n        toast.warning('Konflikt z Google Calendar', {\n          description: first.message || ('Wykryto ' + conflicts.length + ' konfliktów terminów po synchronizacji z Google Calendar.'),\n        });\n      }\n      return result || null;\n    })\n    .catch((error) => {\n      console.warn('GOOGLE_CALENDAR_STAGE120_BACKGROUND_INBOUND_PULL_FAILED', error);\n      return null;\n    })\n    .finally(() => {\n      googleCalendarInboundPullInFlight = null;\n    });\n\n  return googleCalendarInboundPullInFlight;\n}\n`;
    text = replaceOnce(text, oldBlock, newBlock, 'calendar-items google inbound block');
  }

  text = text.replace(/\n\s*await maybePullGoogleCalendarInboundBeforeBundle\(\); \/\/ GOOGLE_CALENDAR_STAGE10N_AUTO_PULL_CALL\n/, `\n  // STAGE120_CALENDAR_LOCAL_FIRST_READ_GOOGLE_BACKGROUND:\n  // Local Supabase reads must not await Google Calendar inbound sync.\n  // The Calendar page triggers syncGoogleCalendarInboundForCalendar() after the first local render.\n`);

  const fetchBody = extractFunctionBody(text, 'fetchCalendarBundleFromSupabase');
  if (fetchBody.includes('syncGoogleCalendarInboundInSupabase') || fetchBody.includes('maybePullGoogleCalendarInboundBeforeBundle')) {
    throw new Error('fetchCalendarBundleFromSupabase still blocks on Google inbound sync');
  }

  write(rel, text);
}

function patchCalendarPage() {
  const rel = 'src/pages/Calendar.tsx';
  let text = read(rel);

  text = text.replace(
    "import { fetchCalendarBundleFromSupabase } from '../lib/calendar-items';",
    "import { fetchCalendarBundleFromSupabase, shouldRefreshCalendarAfterGoogleInboundSync, syncGoogleCalendarInboundForCalendar } from '../lib/calendar-items';"
  );

  text = ensureOnce(
    text,
    'calendarGoogleInboundRefreshSeqRef',
    '  const calendarReadyRetryTimersRef = useRef<number[]>([]);',
    '\n  const calendarGoogleInboundRefreshSeqRef = useRef(0);',
    'calendar google inbound seq ref'
  );

  if (!text.includes('STAGE120_CALENDAR_FOCUS_QUERY_PARAM_CONTRACT')) {
    const anchor = `  useEffect(() => {\n    const forcedCalendarView = searchParams.get('view');\n    if (forcedCalendarView === 'week' || forcedCalendarView === 'month') {\n      setCalendarView(forcedCalendarView);\n    }\n  }, [searchParams]);\n`;
    const addition = `\n  useEffect(() => {\n    // STAGE120_CALENDAR_FOCUS_QUERY_PARAM_CONTRACT: sidebar mini-calendar links to /calendar?focus=YYYY-MM-DD.\n    const focus = searchParams.get('focus');\n    if (!focus || !/^\\d{4}-\\d{2}-\\d{2}$/.test(focus)) return;\n    const focusedDate = parseISO(focus + 'T12:00:00');\n    if (Number.isNaN(focusedDate.getTime())) return;\n    setSelectedDate(focusedDate);\n    setCurrentMonth(focusedDate);\n  }, [searchParams]);\n`;
    text = replaceOnce(text, anchor, anchor + addition, 'Calendar focus query effect');
  }

  if (!text.includes('STAGE120_CALENDAR_LOCAL_FIRST_BACKGROUND_GOOGLE_SYNC')) {
    const needle = `        await refreshSupabaseBundle();\n      } catch (error: any) {`;
    const replacement = `        await refreshSupabaseBundle();\n\n        if (reason === 'initial') {\n          // STAGE120_CALENDAR_LOCAL_FIRST_BACKGROUND_GOOGLE_SYNC:\n          // show local Supabase data first, then refresh only if Google inbound sync changed something.\n          const googleSyncRunId = runId;\n          calendarGoogleInboundRefreshSeqRef.current += 1;\n          void syncGoogleCalendarInboundForCalendar()\n            .then((result) => {\n              if (cancelled || googleSyncRunId !== calendarLoadSeqRef.current) return;\n              if (!shouldRefreshCalendarAfterGoogleInboundSync(result)) return;\n              void refreshSupabaseBundle().catch((syncRefreshError: any) => {\n                console.warn('CALENDAR_STAGE120_GOOGLE_INBOUND_REFRESH_FAILED', syncRefreshError);\n              });\n            })\n            .catch((syncError: any) => {\n              console.warn('CALENDAR_STAGE120_GOOGLE_BACKGROUND_SYNC_FAILED', syncError);\n            });\n        }\n      } catch (error: any) {`;
    text = replaceOnce(text, needle, replacement, 'Calendar local-first background sync after bundle load');
  }

  write(rel, text);
}

function patchPackageJson() {
  const rel = 'package.json';
  const json = JSON.parse(read(rel));
  json.scripts = json.scripts || {};
  json.scripts['test:stage120-calendar-local-first-sync-and-focus'] = 'node --test tests/stage120-calendar-local-first-sync-and-focus-contract.test.cjs';
  write(rel, JSON.stringify(json, null, 2) + '\n');
}

function patchQuietGate() {
  const rel = 'scripts/closeflow-release-check-quiet.cjs';
  let text = read(rel);
  const testPath = 'tests/stage120-calendar-local-first-sync-and-focus-contract.test.cjs';
  if (!text.includes(testPath)) {
    const anchor = "  'tests/stage119-calendar-release-gate-trust.test.cjs',";
    if (text.includes(anchor)) {
      text = text.replace(anchor, anchor + "\n  '" + testPath + "',");
    } else {
      const fallback = "  'tests/stage98-polish-mojibake-calendar-guard.test.cjs',";
      text = replaceOnce(text, fallback, fallback + "\n  '" + testPath + "',", 'quiet gate Stage120 insertion');
    }
  }
  const occurrences = text.split(testPath).length - 1;
  if (occurrences !== 1) throw new Error('Stage120 quiet gate entry count must be 1, got ' + occurrences);
  write(rel, text);
}

function appendIfClean(rel, block) {
  const full = path.join(repo, rel);
  if (!fs.existsSync(full)) return false;
  const text = fs.readFileSync(full, 'utf8');
  const marker = 'STAGE120_CALENDAR_LOCAL_FIRST_SYNC_AND_FOCUS';
  if (text.includes(marker)) return true;
  fs.appendFileSync(full, '\n\n' + block.trim() + '\n', 'utf8');
  return true;
}

function writeProjectDocs() {
  const runReport = `# Stage120 - Calendar local-first sync and focus\n\n## Scan-first confirmation\n\n- Repo: CloseFlow / LeadFlow app repo.\n- Branch: dev-rollout-freeze.\n- Read files/folders: AGENTS.md rules, _project memory protocol, Calendar.tsx, calendar-items.ts, supabase-fallback.ts, scheduling.ts, Stage114 hard refresh guard, Stage108 smoke guard, package.json, quiet release gate, Obsidian CloseFlow dashboard context.\n- Active source of truth: repo code for runtime, _project for technical report, Obsidian as dashboard.\n- Conflict found: Stage119 gate is green, but manual QA says calendar still does not work. This is runtime/data loading, not release-gate trust.\n\n## FAKTY Z KODU / PLIKOW\n\n- Calendar page loads data through refreshSupabaseBundle() and fetchCalendarBundleFromSupabase().\n- Before Stage120, fetchCalendarBundleFromSupabase awaited Google Calendar inbound sync before reading local Supabase data.\n- Google inbound sync may take long enough to make hard refresh look empty or frozen.\n- Sidebar mini calendar links to /calendar?focus=YYYY-MM-DD, while Calendar did not consume focus before Stage120.\n\n## DECYZJE DAMIANA\n\n- Calendar P0 must be solved, not patched blindly.\n- If needed, use a different approach so calendar works reliably.\n\n## HIPOTEZY / PROPOZYCJE AI\n\n- Main cause: local calendar rendering is blocked by external Google inbound sync.\n- Fix direction: local Supabase first, Google inbound background after first local render.\n\n## ZMIANY\n\n- src/lib/calendar-items.ts: split Google inbound sync from fetchCalendarBundleFromSupabase.\n- src/pages/Calendar.tsx: initial load renders local data first and then runs background Google sync; /calendar?focus date is now honored.\n- tests/stage120-calendar-local-first-sync-and-focus-contract.test.cjs: regression guard.\n- scripts/closeflow-release-check-quiet.cjs and package.json: Stage120 guard wiring.\n\n## TESTY AUTOMATYCZNE\n\n- node --test tests/stage98-polish-mojibake-calendar-guard.test.cjs\n- node --test tests/stage114-calendar-hard-refresh-data-load-contract.test.cjs\n- node --test tests/stage120-calendar-local-first-sync-and-focus-contract.test.cjs\n- npm run build\n- npm run verify:closeflow:quiet\n\n## TESTY RECZNE\n\nTEST RECZNY DO WYKONANIA: /calendar hard refresh, week/month/selected day, /calendar?focus=YYYY-MM-DD, add/edit, +1H/+1D/+1W, done/delete.\n\n## BRAKI I RYZYKA\n\n- Google inbound sync is still async and can update calendar after first render. That is intentional: local data must not be blocked by Google.\n- If Google-only events do not appear immediately after hard refresh, wait for background sync completion or add a manual sync button in next stage.\n\n## NASTEPY KROK\n\nManual QA on calendar. If still broken, collect console/network error and move to API/data schema audit, not UI CSS.\n\n## GIT / ZIP STATUS\n\nZIP stage with selective push option. Do not use git add .\n`;
  write('_project/runs/2026-05-18_stage120_calendar_local_first_sync_and_focus.md', runReport);

  const block = `<!-- STAGE120_CALENDAR_LOCAL_FIRST_SYNC_AND_FOCUS -->\n## 2026-05-18 - Stage120 Calendar local-first sync and focus\n\n- Calendar reads local Supabase data before Google Calendar inbound sync.\n- Google inbound runs in background after first local render and refreshes only if it changed rows.\n- /calendar?focus=YYYY-MM-DD is now honored by Calendar.\n- Guard: tests/stage120-calendar-local-first-sync-and-focus-contract.test.cjs.\n- Manual QA: hard refresh, week/month/selected day, focus link, add/edit, shift, done/delete.\n<!-- /STAGE120_CALENDAR_LOCAL_FIRST_SYNC_AND_FOCUS -->`;

  for (const rel of ['_project/06_GUARDS_AND_TESTS.md', '_project/07_NEXT_STEPS.md', '_project/08_CHANGELOG_AI.md', '_project/14_TEST_HISTORY.md']) {
    try { appendIfClean(rel, block); } catch (error) { /* keep run report as fallback */ }
  }
}

patchCalendarItems();
patchCalendarPage();
patchPackageJson();
patchQuietGate();
writeProjectDocs();

console.log('Stage120 calendar local-first sync and focus patched.');
