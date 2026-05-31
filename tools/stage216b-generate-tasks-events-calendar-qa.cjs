#!/usr/bin/env node
/*
  CloseFlow Stage216-B
  Tasks / Events / Calendar functional QA generator.

  This script is intentionally read-only for app source files. It scans the current repo,
  writes a project report, and writes an Obsidian update note. It does not modify SQL,
  RLS, GRANTs, application logic, Google Calendar sync, or runtime data.
*/

const fs = require('node:fs');
const path = require('node:path');

const STAGE = 'Stage216-B';
const DATE = '2026-05-31';
const REPORT_PATH = path.join('_project', 'reports', 'STAGE216B_TASKS_EVENTS_CALENDAR_QA_2026-05-31.md');
const OBSIDIAN_PATH = path.join('OBSIDIAN_UPDATE', '10_PROJEKTY', 'CloseFlow_LeadFlow', '2026-05-31 - CloseFlow Stage216-B tasks events calendar QA.md');

const ROUTING = {
  canonicalName: 'CloseFlow / LeadFlow',
  repo: 'dkknapikdamian-collab/leadflowv1',
  branch: 'dev-rollout-freeze',
  localPath: 'C:\\Users\\malim\\Desktop\\biznesy_ai\\2.closeflow',
  obsidianVault: 'C:\\Users\\malim\\Desktop\\biznesy_ai\\00_OBSIDIAN_VAULT',
  obsidianFolder: '10_PROJEKTY/CloseFlow_LeadFlow',
  entityId: 'DO_POTWIERDZENIA',
  workspaceId: 'DO_POTWIERDZENIA',
  projectId: 'DO_POTWIERDZENIA',
};

const SOURCE_FILES = [
  'package.json',
  'vercel.json',
  'src/lib/supabase-fallback.ts',
  'api/work-items.ts',
  'api/system.ts',
  'src/pages/TasksStable.tsx',
  'src/pages/Calendar.tsx',
  'src/pages/TodayStable.tsx',
  'src/pages/LeadDetail.tsx',
  'src/pages/ClientDetail.tsx',
  'src/pages/CaseDetail.tsx',
  'scripts/check-stage216a2-lcc-runtime-smoke.cjs',
  '_project/reports/STAGE215_SUPABASE_COVERAGE_MATRIX_2026-05-31.md',
  '_project/reports/STAGE216A_LEADS_CLIENTS_CASES_FUNCTIONAL_QA_2026-05-31.md',
  '_project/reports/STAGE216A2_LCC_RUNTIME_SMOKE_2026-05-31.md',
  '_project/reports/STAGE216A3_VITE_API_SOURCE_RESPONSE_GUARD_2026-05-31.md',
  '_project/reports/STAGE216A4_CLIENTS_AUTH_ERROR_HOTFIX_2026-05-31.md',
  '_project/reports/STAGE216A5_LEAD_SERVICE_RPC_FALLBACK_HOTFIX_2026-05-31.md',
];

const MARKERS = [
  { key: 'api_tasks_literal', label: 'literal /api/tasks', re: /['"`]\/api\/tasks(?:\?|['"`])/ },
  { key: 'api_events_literal', label: 'literal /api/events', re: /['"`]\/api\/events(?:\?|['"`])/ },
  { key: 'work_items_route', label: 'api/work-items or work-items route', re: /work-items|api\/work-items/i },
  { key: 'system_api_route', label: 'api/system or apiRoute', re: /apiRoute|api\/system/i },
  { key: 'kind_tasks', label: 'kind=tasks / task kind routing', re: /kind\s*[:=]\s*['"`]tasks['"`]|kind=tasks|tasks/i },
  { key: 'kind_events', label: 'kind=events / event kind routing', re: /kind\s*[:=]\s*['"`]events['"`]|kind=events|events/i },
  { key: 'invalid_api_response', label: 'INVALID_API_RESPONSE handling', re: /INVALID_API_RESPONSE/ },
  { key: 'non_json_guard', label: 'non-JSON / HTML guard clues', re: /text\/html|NON_JSON|response\.text\(|content-type|Content-Type/i },
  { key: 'vite_source_clue', label: 'Vite source response clue', re: /VITE_DEV_API_SOURCE_RESPONSE|import\s+\{[^}]+\}\s+from|vite/i },
  { key: 'supabase_access', label: 'Supabase access clue', re: /supabase|from\(['"`](tasks|events|work_items|work-items|calendar|cases|leads|clients)['"`]\)/i },
  { key: 'polling_or_interval', label: 'polling / interval clue', re: /setInterval|poll|retry|visibilitychange|focus|refetch/i },
  { key: 'hard_refresh_risk', label: 'hard refresh / workspace readiness clue', re: /workspaceReady|useWorkspace|workspaceId|selectedWorkspace|hard refresh/i },
  { key: 'calendar_sync_clue', label: 'Google Calendar sync clue', re: /google-calendar|Google Calendar|sync-inbound|calendar sync/i },
  { key: 'relation_clue', label: 'lead/client/case relation clue', re: /leadId|lead_id|clientId|client_id|caseId|case_id|spraw|lead|client|klient/i },
];

function readFileSafe(file) {
  const abs = path.resolve(process.cwd(), file);
  if (!fs.existsSync(abs)) return null;
  const stat = fs.statSync(abs);
  if (!stat.isFile()) return null;
  return fs.readFileSync(abs, 'utf8');
}

function lineCount(text) {
  if (!text) return 0;
  return text.split(/\r?\n/).length;
}

function summarizeFile(file, text) {
  const hits = [];
  for (const marker of MARKERS) {
    if (marker.re.test(text)) hits.push(marker.label);
  }
  const fetchCount = (text.match(/fetch\s*\(/g) || []).length;
  const useEffectCount = (text.match(/useEffect\s*\(/g) || []).length;
  const setIntervalCount = (text.match(/setInterval\s*\(/g) || []).length;
  const supabaseFromCount = (text.match(/\.from\s*\(/g) || []).length;
  return {
    file,
    exists: true,
    bytes: Buffer.byteLength(text, 'utf8'),
    lines: lineCount(text),
    hits,
    fetchCount,
    useEffectCount,
    setIntervalCount,
    supabaseFromCount,
  };
}

function scan() {
  const scannedAt = new Date().toISOString();
  const files = SOURCE_FILES.map((file) => {
    const text = readFileSafe(file);
    if (text === null) return { file, exists: false };
    return summarizeFile(file, text);
  });

  const existing = files.filter((x) => x.exists);
  const missing = files.filter((x) => !x.exists);
  const aggregate = new Map();
  for (const item of existing) {
    for (const hit of item.hits) aggregate.set(hit, (aggregate.get(hit) || 0) + 1);
  }

  return {
    stage: STAGE,
    scannedAt,
    cwd: process.cwd(),
    routing: ROUTING,
    files,
    totals: {
      expectedFiles: SOURCE_FILES.length,
      existingFiles: existing.length,
      missingFiles: missing.length,
      fetchCount: existing.reduce((acc, x) => acc + x.fetchCount, 0),
      useEffectCount: existing.reduce((acc, x) => acc + x.useEffectCount, 0),
      setIntervalCount: existing.reduce((acc, x) => acc + x.setIntervalCount, 0),
      supabaseFromCount: existing.reduce((acc, x) => acc + x.supabaseFromCount, 0),
    },
    markerSummary: [...aggregate.entries()].sort((a, b) => b[1] - a[1]),
  };
}

function statusIcon(ok) {
  return ok ? 'OK' : 'BRAK';
}

function tableRows(files) {
  return files.map((item) => {
    if (!item.exists) return `| ${item.file} | BRAK | - | - | - | - | - | do potwierdzenia |`;
    const hits = item.hits.length ? item.hits.join('; ') : 'brak markerów';
    return `| ${item.file} | OK | ${item.lines} | ${item.fetchCount} | ${item.useEffectCount} | ${item.setIntervalCount} | ${item.supabaseFromCount} | ${hits.replace(/\|/g, '/')} |`;
  }).join('\n');
}

function buildManualQa() {
  return [
    '- Zadania: wejść w listę zadań, odświeżyć stronę, potwierdzić brak pustego stanu po hard refresh, jeżeli dane istnieją.',
    '- Zadania: sprawdzić dodanie/edycję/zmianę statusu tylko ręcznie, bez danych testowych commitowanych do repo.',
    '- Wydarzenia: wejść w listę/kalendarz, odświeżyć stronę, potwierdzić brak INVALID_API_RESPONSE.',
    '- Kalendarz: sprawdzić dzień/miesiąc, zmianę zakresu, powrót po odświeżeniu i brak skoku do błędnego stanu.',
    '- Relacje: z LeadDetail/ClientDetail/CaseDetail sprawdzić, czy zadania/wydarzenia są widoczne albo czy brak danych jest kontrolowanym pustym stanem.',
    '- Auth/API: przy braku sesji endpoint może dać 401/403, ale musi to być JSON, nie HTML ani source z Vite.',
    '- Query budget: podczas przełączania kalendarza obserwować Network i potwierdzić, że nie ma serii niekontrolowanych retry/polling po Stage213C-B/C.',
  ].join('\n');
}

function buildReport(result) {
  const missing = result.files.filter((x) => !x.exists).map((x) => x.file);
  const markerLines = result.markerSummary.length
    ? result.markerSummary.map(([label, count]) => `- ${label}: ${count}`).join('\n')
    : '- brak markerów w dostępnych plikach';

  return `---
typ: project_report
stage: STAGE216B
status: prepared_qa_smoke
project: CloseFlow / LeadFlow
date: ${DATE}
---

# STAGE216-B - Tasks / Events / Calendar QA + runtime smoke

## Routing

- canonical_name: ${ROUTING.canonicalName}
- entity_id: ${ROUTING.entityId}
- workspace_id: ${ROUTING.workspaceId}
- project_id: ${ROUTING.projectId}
- repo: ${ROUTING.repo}
- branch: ${ROUTING.branch}
- local path: ${ROUTING.localPath}
- Obsidian vault: ${ROUTING.obsidianVault}
- Obsidian folder: ${ROUTING.obsidianFolder}
- tryb pracy: ZIP-first, lokalne wdrożenie, testy, potem targetowany commit/push

## Teza etapu

Stage216-B nie naprawia wszystkiego naraz. To bramka diagnostyczna dla drugiego rdzenia operacyjnego po migracji Supabase: zadania, wydarzenia, kalendarz oraz relacje lead/client/case -> task/event.

Po Stage216-A5 start obsługi leada jest odblokowany fallbackiem JS. Teraz sprawdzamy, czy zadania, wydarzenia i kalendarz odpowiadają jako kontrolowany JSON, nie jako HTML, Vite source albo 500.

## Wynik skanu lokalnego

- scanned_at: ${result.scannedAt}
- cwd: ${result.cwd}
- expected files: ${result.totals.expectedFiles}
- existing files: ${result.totals.existingFiles}
- missing files: ${result.totals.missingFiles}
- fetch() markers: ${result.totals.fetchCount}
- useEffect() markers: ${result.totals.useEffectCount}
- setInterval() markers: ${result.totals.setIntervalCount}
- Supabase .from() markers: ${result.totals.supabaseFromCount}

## Mapa plików

| Plik | Status | Linie | fetch | useEffect | setInterval | supabase .from | Markery |
|---|---:|---:|---:|---:|---:|---:|---|
${tableRows(result.files)}

## Podsumowanie markerów

${markerLines}

## Braki do potwierdzenia

${missing.length ? missing.map((file) => `- ${file}`).join('\n') : '- brak, wszystkie oczekiwane pliki były dostępne podczas skanu'}

## Runtime smoke GET-only

Do uruchomienia po starcie lokalnego dev API:

\`\`\`powershell
cd "C:\\Users\\malim\\Desktop\\biznesy_ai\\2.closeflow"
npm run dev:api
\`\`\`

W drugim oknie:

\`\`\`powershell
cd "C:\\Users\\malim\\Desktop\\biznesy_ai\\2.closeflow"
$env:CLOSEFLOW_APP_URL="http://localhost:3000"
$env:CLOSEFLOW_WORKSPACE_ID="PRAWDZIWY_WORKSPACE_UUID"
node tools/stage216b-tasks-events-calendar-runtime-smoke.cjs --write
\`\`\`

Sprawdzane kandydaty:

- /api/tasks
- /api/events
- /api/work-items?kind=tasks
- /api/work-items?kind=events
- /api/system?apiRoute=tasks
- /api/system?apiRoute=events

## Interpretacja runtime

- PASS JSON: endpoint działa jako JSON.
- AUTH_REQUIRED 401/403 JSON: endpoint żyje, wymaga auth/workspace context, to nie jest INVALID_API_RESPONSE.
- NON_JSON_HTML_RESPONSE: twardy FAIL.
- VITE_DEV_API_SOURCE_RESPONSE: prawdopodobnie uruchomiono zwykłe npm run dev zamiast npm run dev:api albo rewrite/API nie działa.
- 500: twardy FAIL i podstawa pod Stage216-B2.
- FETCH_FAILED: port/app URL nie działa.

## Testy automatyczne

- node scripts/check-stage216b-tasks-events-calendar-qa.cjs
- npm run build
- runtime: node tools/stage216b-tasks-events-calendar-runtime-smoke.cjs --write

## Testy ręczne

${buildManualQa()}

## Czego nie ruszano

- SQL/RLS/GRANT.
- Google Calendar sync.
- NotificationsCenter.
- TodayStable, poza statycznym skanem zależności.
- Backupy i stare paczki.
- Dane produkcyjne/testowe w Supabase.

## Ryzyka

- Sam statyczny skan nie potwierdza działania runtime ani sesji użytkownika.
- 401/403 JSON jest akceptowalne jako znak, że API żyje, ale nie potwierdza pełnego przepływu zalogowanego operatora.
- Jeżeli endpointy idą przez inny routing niż lista kandydatów, trzeba dopisać wykryty routing w Stage216-B2 albo rozszerzyć smoke.
- Jeżeli kalendarz ma zależność od Google Calendar sync, nie wolno jej zmieniać bez osobnego, wąskiego etapu.

## Werdykt

Status: przygotowano QA/smoke. Nie zamyka migracji Supabase. Następny ruch zależy od runtime smoke i testów ręcznych Damiana.

## Następny krok

1. Apply ZIP lokalnie.
2. Uruchomić generator/check.
3. Uruchomić build.
4. Uruchomić dev:api.
5. Uruchomić runtime smoke.
6. Jeżeli jest 500 albo NON_JSON/VITE source, zrobić Stage216-B2 jako wąski fix pod konkretny błąd.
`;
}

function buildObsidian(result) {
  return `---
typ: obsidian_project_update
project: CloseFlow / LeadFlow
stage: STAGE216B
status: prepared_qa_smoke
date: ${DATE}
---

# 2026-05-31 - CloseFlow Stage216-B tasks events calendar QA

## FAKTY

- Stage216-A5 jest traktowany jako OK według ręcznego testu Damiana: start obsługi leada nie blokuje się już na błędzie RPC v_client.
- Aktualny etap to Stage216-B: QA/smoke dla zadań, wydarzeń i kalendarza po migracji Supabase.
- Tryb pracy: ZIP-first, lokalne wdrożenie, testy, potem targetowany commit/push.
- Skan lokalny wykonano: ${result.scannedAt}.
- Dostępne pliki w skanie: ${result.totals.existingFiles}/${result.totals.expectedFiles}.

## DECYZJE DAMIANA

- Nie robić push bez PASS testów i wpisu Obsidian/_project.
- Nie używać masowego stage'owania repo.
- Nie ruszać SQL/RLS/GRANT bez wyraźnej decyzji.
- Ten etap ma być najpierw QA/smoke, nie naprawą wszystkiego naraz.

## HIPOTEZY AI

- Największe ryzyko po Stage216-A5 to nie pojedynczy komponent UI, tylko rozjazd route/API/auth JSON dla tasks/events/calendar.
- 401/403 JSON jest lepszym wynikiem niż INVALID_API_RESPONSE, HTML albo Vite source response.
- Jeżeli runtime znajdzie 500, kolejny etap powinien być Stage216-B2 i naprawiać dokładnie ten endpoint/warstwę.

## DO POTWIERDZENIA

- entity_id: DO_POTWIERDZENIA
- workspace_id: DO_POTWIERDZENIA
- project_id: DO_POTWIERDZENIA
- faktyczny workspace UUID do runtime smoke
- faktyczny routing produkcyjny tasks/events, jeżeli nie jest jednym z kandydatów smoke

## TESTY

- node scripts/check-stage216b-tasks-events-calendar-qa.cjs
- npm run build
- node tools/stage216b-tasks-events-calendar-runtime-smoke.cjs --write

## RYZYKA

- Runtime bez auth może dać 401/403 i to jest akceptowalne tylko wtedy, gdy odpowiedź jest JSON-em.
- Vite source response oznacza błąd trybu uruchomienia albo rewrite/API, nie błąd danych.
- 500 jest twardym FAIL i nie powinien być przykrywany pustym stanem UI.

## NASTĘPNY KROK

Uruchomić Stage216-B lokalnie. Jeżeli smoke przejdzie, iść do Stage216-C: Notifications / Activity / AI drafts QA. Jeżeli smoke znajdzie konkretny FAIL, przygotować Stage216-B2 jako wąski fix.

## Zapis do Obsidiana

- nazwa / alias wejściowy: CloseFlow / LeadFlow, Stage216-B
- entity_id: DO_POTWIERDZENIA
- workspace_id: DO_POTWIERDZENIA
- project_id: DO_POTWIERDZENIA
- idea_id: nie dotyczy
- report_id: STAGE216B_TASKS_EVENTS_CALENDAR_QA_2026-05-31
- canonical_name: CloseFlow / LeadFlow
- folder Obsidiana: 10_PROJEKTY/CloseFlow_LeadFlow
- mapa główna / pulpit: DO_POTWIERDZENIA
- mapa zależności: DO_POTWIERDZENIA
- ściąga plików: DO_POTWIERDZENIA
- typ wpisu: QA/smoke po migracji Supabase
- docelowa ścieżka: 10_PROJEKTY/CloseFlow_LeadFlow/2026-05-31 - CloseFlow Stage216-B tasks events calendar QA.md
- status zapisu: przygotowano ZIP
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\\Users\\malim\\Desktop\\biznesy_ai\\2.closeflow
- testy: check Stage216-B, build, runtime smoke GET-only, ręczne QA
- czego nie ruszano: SQL/RLS/GRANT, Google Calendar sync, backupy, dane runtime
- następny krok: apply ZIP i runtime smoke
`;
}

function ensureDir(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function writeIfRequested(filePath, content) {
  ensureDir(filePath);
  fs.writeFileSync(filePath, content, 'utf8');
}

function main() {
  const args = new Set(process.argv.slice(2));
  const result = scan();
  const report = buildReport(result);
  const obsidian = buildObsidian(result);

  if (args.has('--json')) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log(`${STAGE} scan: ${result.totals.existingFiles}/${result.totals.expectedFiles} source files present`);
    if (result.totals.missingFiles) {
      console.log('Missing files:');
      for (const item of result.files.filter((x) => !x.exists)) console.log(`- ${item.file}`);
    }
  }

  if (args.has('--write') || args.has('--apply')) {
    writeIfRequested(REPORT_PATH, report);
    writeIfRequested(OBSIDIAN_PATH, obsidian);
    console.log(`WROTE ${REPORT_PATH}`);
    console.log(`WROTE ${OBSIDIAN_PATH}`);
  }
}

main();
