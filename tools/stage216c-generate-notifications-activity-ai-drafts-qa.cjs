#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const STAGE = 'STAGE216C';
const DATE = '2026-05-31';
const REPORT_PATH = path.join('_project', 'reports', 'STAGE216C_NOTIFICATIONS_ACTIVITY_AI_DRAFTS_QA_2026-05-31.md');
const OBSIDIAN_PATH = path.join('OBSIDIAN_UPDATE', '10_PROJEKTY', 'CloseFlow_LeadFlow', '2026-05-31 - CloseFlow Stage216-C notifications activity ai drafts QA.md');

const expectedFiles = [
  'package.json',
  'vercel.json',
  'src/lib/supabase-fallback.ts',
  'src/lib/notifications.ts',
  'src/lib/ai-drafts.ts',
  'src/lib/ai-draft-approval.ts',
  'src/lib/ai-draft-confirm-records.ts',
  'src/lib/data-contract.ts',
  'api/activities.ts',
  'api/system.ts',
  'src/pages/NotificationsCenter.tsx',
  'src/pages/Activity.tsx',
  'src/pages/AiDrafts.tsx',
  'src/pages/TodayStable.tsx',
  '_project/reports/STAGE213C_A_NOTIFICATIONS_QUERY_BUDGET_2026-05-31.md',
  '_project/reports/STAGE213C_B_CALENDAR_RETRY_POLICY_2026-05-31.md',
  '_project/reports/STAGE213C_C_TODAY_STABLE_FOCUS_VISIBILITY_THROTTLE_2026-05-31.md',
  '_project/reports/STAGE216B_TASKS_EVENTS_CALENDAR_QA_2026-05-31.md',
  '_project/reports/STAGE216B_TASKS_EVENTS_CALENDAR_RUNTIME_SMOKE_RESULT_2026-05-31.md',
];

const markerDefs = [
  { key: 'api activities route', rx: /\/api\/activities|api\/activities|fetchActivitiesFromSupabase|insertActivityToSupabase/i },
  { key: 'api ai-drafts route', rx: /kind=ai-drafts|fetchAiDraftsFromSupabase|createAiDraftInSupabase|updateAiDraftInSupabase|deleteAiDraftFromSupabase/i },
  { key: 'notifications refresh budget', rx: /NOTIFICATIONS_BACKGROUND_REFRESH_INTERVAL_MS|NOTIFICATIONS_BACKGROUND_REFRESH_TTL_MS|Stage213C-A|setInterval|visibilitychange|focus/i },
  { key: 'notifications local log/read/snooze', rx: /getNotificationLog|markAllNotificationsRead|setNotificationSnooze|clearNotificationSnooze|getUnreadNotificationCount/i },
  { key: 'ai draft approval flow', rx: /handleApproveDraftToRecord|buildAiDraftApprovalForm|markAiLeadDraftConvertedAsync|archiveAiLeadDraftAsync|deleteAiLeadDraftAsync/i },
  { key: 'ai draft creates task/event/lead/note', rx: /insertTaskToSupabase|insertEventToSupabase|createLeadFromAiDraftApprovalInSupabase|recordType === 'note'|linkedRecordType/i },
  { key: 'activity relation mapping', rx: /leadId|caseId|clientId|getActivityRelation|getActivityEntity|requiresAttention/i },
  { key: 'supabase normalizer', rx: /normalizeActivityListContract|normalizeAiDraftListContract|normalizeActivityContract|normalizeAiDraft/i },
  { key: 'invalid api response guard clue', rx: /INVALID_API_RESPONSE|raw|JSON\.parse|Content-Type|application\/json/i },
  { key: 'auth/workspace guard clue', rx: /AUTH_WORKSPACE_REQUIRED|resolveRequestWorkspaceId|requireScopedRow|useWorkspace|workspace\.id/i },
  { key: 'manual qa relation clue', rx: /lead\/client\/case|leadId|caseId|clientId|Powiązanie|relation/i },
];

function readFileSafe(repoRoot, rel) {
  const abs = path.join(repoRoot, rel);
  if (!fs.existsSync(abs)) return null;
  return fs.readFileSync(abs, 'utf8');
}

function count(rx, text) {
  return (text.match(new RegExp(rx.source, rx.flags.includes('g') ? rx.flags : rx.flags + 'g')) || []).length;
}

function markerList(text) {
  return markerDefs.filter((marker) => marker.rx.test(text)).map((marker) => marker.key);
}

function scan(repoRoot) {
  return expectedFiles.map((rel) => {
    const text = readFileSafe(repoRoot, rel);
    const exists = text !== null;
    return {
      rel,
      exists,
      lines: exists ? text.split(/\r?\n/).length : 0,
      fetch: exists ? count(/\bfetch\s*\(/, text) : 0,
      useEffect: exists ? count(/\buseEffect\s*\(/, text) : 0,
      setInterval: exists ? count(/setInterval\s*\(/, text) : 0,
      callApi: exists ? count(/callApi\s*</, text) : 0,
      supabaseFrom: exists ? count(/\.from\s*\(/, text) : 0,
      markers: exists ? markerList(text) : [],
    };
  });
}

function summarizeMarkers(rows) {
  const map = new Map();
  for (const row of rows) {
    for (const marker of row.markers) map.set(marker, (map.get(marker) || 0) + 1);
  }
  return [...map.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
}

function mdEscape(value) {
  return String(value || '').replace(/\|/g, '\\|');
}

function buildReport(repoRoot, rows) {
  const scannedAt = new Date().toISOString();
  const existing = rows.filter((row) => row.exists).length;
  const missing = rows.filter((row) => !row.exists).map((row) => row.rel);
  const markerSummary = summarizeMarkers(rows);
  const totalFetch = rows.reduce((sum, row) => sum + row.fetch, 0);
  const totalUseEffect = rows.reduce((sum, row) => sum + row.useEffect, 0);
  const totalIntervals = rows.reduce((sum, row) => sum + row.setInterval, 0);
  const totalCallApi = rows.reduce((sum, row) => sum + row.callApi, 0);
  const totalSupabaseFrom = rows.reduce((sum, row) => sum + row.supabaseFrom, 0);

  return `---\ntyp: project_report\nstage: ${STAGE}\nstatus: prepared_qa_smoke\nproject: CloseFlow / LeadFlow\ndate: ${DATE}\n---\n\n# STAGE216-C - Notifications / Activity / AI drafts QA + runtime smoke\n\n## Routing\n\n- canonical_name: CloseFlow / LeadFlow\n- entity_id: DO_POTWIERDZENIA\n- workspace_id: DO_POTWIERDZENIA\n- project_id: DO_POTWIERDZENIA\n- repo: dkknapikdamian-collab/leadflowv1\n- branch: dev-rollout-freeze\n- local path: C:\\Users\\malim\\Desktop\\biznesy_ai\\2.closeflow\n- Obsidian vault: C:\\Users\\malim\\Desktop\\biznesy_ai\\00_OBSIDIAN_VAULT\n- Obsidian folder: 10_PROJEKTY/CloseFlow_LeadFlow\n- tryb pracy: ZIP-first, lokalne wdrożenie, testy, potem targetowany commit/push\n\n## Teza etapu\n\nStage216-C nie naprawia wszystkiego naraz. To bramka diagnostyczna dla trzeciego rdzenia operacyjnego po migracji Supabase: powiadomienia, aktywność oraz szkice AI.\n\nPo Stage216-B tasks/events/calendar mają kontrolowany JSON smoke. Teraz sprawdzamy, czy Activity i AI Drafts działają jako JSON/auth controlled paths, a NotificationsCenter nie wraca do kosztownego pollingu po Stage213C-A.\n\n## Wynik skanu lokalnego\n\n- scanned_at: ${scannedAt}\n- cwd: ${repoRoot}\n- expected files: ${rows.length}\n- existing files: ${existing}\n- missing files: ${missing.length}\n- fetch() markers: ${totalFetch}\n- useEffect() markers: ${totalUseEffect}\n- setInterval() markers: ${totalIntervals}\n- callApi() markers: ${totalCallApi}\n- Supabase .from() markers: ${totalSupabaseFrom}\n\n## Mapa plików\n\n| Plik | Status | Linie | fetch | useEffect | setInterval | callApi | supabase .from | Markery |\n|---|---:|---:|---:|---:|---:|---:|---:|---|\n${rows.map((row) => `| ${mdEscape(row.rel)} | ${row.exists ? 'OK' : 'MISSING'} | ${row.lines} | ${row.fetch} | ${row.useEffect} | ${row.setInterval} | ${row.callApi} | ${row.supabaseFrom} | ${mdEscape(row.markers.join('; ') || '-')} |`).join('\n')}\n\n## Podsumowanie markerów\n\n${markerSummary.length ? markerSummary.map(([key, value]) => `- ${key}: ${value}`).join('\n') : '- brak markerów'}\n\n## Braki do potwierdzenia\n\n${missing.length ? missing.map((rel) => `- ${rel}`).join('\n') : '- brak, wszystkie oczekiwane pliki były dostępne podczas skanu'}\n\n## Runtime smoke GET-only\n\nDo uruchomienia po starcie lokalnego dev API:\n\n\`\`\`powershell\ncd "C:\\Users\\malim\\Desktop\\biznesy_ai\\2.closeflow"\nnpm run dev:api\n\`\`\`\n\nW drugim oknie:\n\n\`\`\`powershell\ncd "C:\\Users\\malim\\Desktop\\biznesy_ai\\2.closeflow"\n$env:CLOSEFLOW_APP_URL="http://localhost:3000"\nnode tools/stage216c-notifications-activity-ai-drafts-runtime-smoke.cjs --write\n\`\`\`\n\nAkceptowalne wyniki runtime bez pełnego auth:\n\n- AUTH_REQUIRED_401 lub AUTH_REQUIRED_403 jako JSON,\n- 200 JSON dla endpointów publicznie czytelnych w kontekście testowym,\n- 400 JSON, jeżeli endpoint wymaga parametru i jasno to komunikuje.\n\nTwardy FAIL:\n\n- 500,\n- HTML zamiast JSON,\n- Vite/source response,\n- FETCH_FAILED przy działającym dev API,\n- cichy pusty wynik bez kontrolowanego statusu, jeżeli endpoint powinien zgłosić auth albo walidację.\n\n## Manual QA\n\n1. Otwórz Powiadomienia. Sprawdź, czy lista ładuje się bez INVALID_API_RESPONSE i bez ciągłego pełnego odświeżania co 60 sekund.\n2. Sprawdź filtry: Wszystkie, Do reakcji, Zaległe, Dzisiaj, Nadchodzące, Odłożone, Przeczytane.\n3. Oznacz powiadomienie jako przeczytane, odłóż i przywróć. Sprawdź, czy widok nie robi request stormu.\n4. Otwórz Aktywność. Sprawdź, czy lista pokazuje wpisy albo kontrolowany pusty stan bez 500.\n5. Sprawdź relacje aktywności: lead, klient, sprawa, zadanie, wydarzenie.\n6. Otwórz Szkice AI. Sprawdź ładowanie szkiców, filtry, wyszukiwarkę i pusty stan.\n7. Jeżeli masz szkic testowy, otwórz zatwierdzanie jako lead/task/event/note, ale nie zapisuj produkcyjnych danych bez decyzji.\n8. Po hard refresh na Powiadomieniach/Aktywności/Szkicach AI nie może być INVALID_API_RESPONSE ani HTML source.\n\n## Czego nie ruszano\n\n- database policy changes,\n- Google Calendar sync,\n- realne dane runtime,\n- backupy lokalne,\n- moduły spoza Notifications/Activity/AiDrafts,\n- naprawy funkcjonalne bez konkretnego FAIL-a.\n\n## Następny krok\n\nJeżeli Stage216-C przejdzie: Stage216-D Portal / Storage / Uploads QA. Jeżeli smoke znajdzie konkretny FAIL: Stage216-C2 jako wąski fix pod wskazany endpoint albo komponent.\n`;
}

function buildObsidian(rows) {
  const existing = rows.filter((row) => row.exists).length;
  const missing = rows.filter((row) => !row.exists).map((row) => row.rel);
  return `---\ntyp: obsidian_project_update\nproject: CloseFlow / LeadFlow\nstage: STAGE216C\nstatus: prepared_qa_smoke\ndate: 2026-05-31\n---\n\n# 2026-05-31 - CloseFlow Stage216-C notifications activity ai drafts QA\n\n## FAKTY\n\n- Stage216-B jest zamknięty: guard PASS, build PASS, runtime smoke JSON/auth controlled, commit 380707a0.\n- Aktualny etap to Stage216-C: QA/smoke dla NotificationsCenter, Activity i AiDrafts po migracji Supabase.\n- Skan lokalny: ${existing}/${rows.length} oczekiwanych plików dostępnych.\n- Braki: ${missing.length ? missing.join(', ') : 'brak'}.\n\n## DECYZJE DAMIANA\n\n- Nie używać git add .\n- Nie robić push bez PASS testów i wpisu Obsidian/_project.\n- Nie ruszać zmian bazodanowych/polityk dostępu bez wyraźnej decyzji.\n- Etap ma być najpierw QA/smoke, nie naprawą wszystkiego naraz.\n\n## HIPOTEZY AI\n\n- Największe ryzyko w Stage216-C to rozjazd auth/workspace/JSON na /api/activities i /api/system?kind=ai-drafts oraz powrót nadmiarowego odświeżania NotificationsCenter.\n- 401/403 JSON jest akceptowalne w runtime smoke bez sesji, bo potwierdza endpoint JSON i kontrolowany auth.\n- 500, HTML albo Vite source response powinny uruchomić Stage216-C2.\n\n## DO POTWIERDZENIA\n\n- entity_id: DO_POTWIERDZENIA\n- workspace_id: DO_POTWIERDZENIA\n- project_id: DO_POTWIERDZENIA\n- czy fizyczny Obsidian vault ma osobny commit po skopiowaniu notatki\n- czy AI Drafts mają być testowane tylko GET-only, czy później osobnym kontrolowanym testem write sandbox\n\n## TESTY\n\n- node scripts/check-stage216c-notifications-activity-ai-drafts-qa.cjs\n- npm run build\n- node tools/stage216c-notifications-activity-ai-drafts-runtime-smoke.cjs --write\n\n## RYZYKA\n\n- Repo ma dużo lokalnych backupów i plików .bak. Nie wolno ich przypadkiem dodać.\n- Vault Obsidiana ma niezależne zmiany Node_RED_Kabelki. Nie commitować vaulta globalnie przy CloseFlow.\n- Zatwierdzanie szkiców AI może tworzyć realne rekordy lead/task/event/note, więc Stage216-C jest GET-only/QA-first.\n\n## NASTĘPNY KROK\n\nUruchomić Stage216-C lokalnie. Jeżeli smoke przejdzie, iść do Stage216-D Portal / Storage / Uploads QA. Jeżeli smoke znajdzie konkretny FAIL, przygotować Stage216-C2 jako wąski fix.\n\n## Zapis do Obsidiana\n\n- nazwa / alias wejściowy: CloseFlow / LeadFlow, Stage216-C\n- entity_id: DO_POTWIERDZENIA\n- workspace_id: DO_POTWIERDZENIA\n- project_id: DO_POTWIERDZENIA\n- idea_id: nie dotyczy\n- report_id: STAGE216C_NOTIFICATIONS_ACTIVITY_AI_DRAFTS_QA_2026-05-31\n- canonical_name: CloseFlow / LeadFlow\n- folder Obsidiana: 10_PROJEKTY/CloseFlow_LeadFlow\n- mapa główna / pulpit: DO_POTWIERDZENIA\n- mapa zależności: DO_POTWIERDZENIA\n- ściąga plików: DO_POTWIERDZENIA\n- typ wpisu: QA/smoke po migracji Supabase\n- docelowa ścieżka: 10_PROJEKTY/CloseFlow_LeadFlow/2026-05-31 - CloseFlow Stage216-C notifications activity ai drafts QA.md\n- status zapisu: przygotowano ZIP\n- repo: dkknapikdamian-collab/leadflowv1\n- branch: dev-rollout-freeze\n- local path: C:\\Users\\malim\\Desktop\\biznesy_ai\\2.closeflow\n- testy: check Stage216-C, build, runtime smoke GET-only, ręczne QA\n- czego nie ruszano: zmiany bazodanowe/polityki dostępu, Google Calendar sync, backupy, dane runtime\n- następny krok: apply ZIP i runtime smoke\n`;
}

function ensureDir(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function main() {
  const repoRoot = process.cwd();
  const rows = scan(repoRoot);
  const existing = rows.filter((row) => row.exists).length;
  const missing = rows.filter((row) => !row.exists);
  console.log(`Stage216-C scan: ${existing}/${rows.length} source files present`);
  if (missing.length) {
    console.log('Missing files:');
    for (const row of missing) console.log(`- ${row.rel}`);
  }
  if (process.argv.includes('--write')) {
    const report = buildReport(repoRoot, rows);
    const obsidian = buildObsidian(rows);
    ensureDir(path.join(repoRoot, REPORT_PATH));
    ensureDir(path.join(repoRoot, OBSIDIAN_PATH));
    fs.writeFileSync(path.join(repoRoot, REPORT_PATH), report, 'utf8');
    fs.writeFileSync(path.join(repoRoot, OBSIDIAN_PATH), obsidian, 'utf8');
    console.log(`WROTE ${REPORT_PATH}`);
    console.log(`WROTE ${OBSIDIAN_PATH}`);
  }
}

main();
