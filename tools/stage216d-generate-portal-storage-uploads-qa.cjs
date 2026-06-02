const fs = require('fs');
const path = require('path');

const root = process.cwd();
const WRITE = process.argv.includes('--write');
const REPORT = path.join(root, '_project/reports/STAGE216D_PORTAL_STORAGE_UPLOADS_QA_LOCAL_ONLY_2026-06-01.md');
const OBS = path.join(root, 'OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/2026-06-01 - CloseFlow Stage216-D portal storage uploads QA local only.md');

const files = [
  'package.json',
  'vercel.json',
  'api/system.ts',
  'api/storage-upload.ts',
  'api/portal.ts',
  'api/client-portal-session.ts',
  'api/client-portal-tokens.ts',
  'src/server/_portal-token.ts',
  'src/server/_portal-storage.ts',
  'src/lib/supabase-fallback.ts',
  'src/pages/ClientPortal.tsx',
  'src/pages/CaseDetail.tsx',
  '_project/reports/STAGE216C_NOTIFICATIONS_ACTIVITY_AI_DRAFTS_QA_2026-05-31.md',
  '_project/reports/STAGE216C2_AI_DRAFTS_AUTH_JSON_HOTFIX_2026-06-01.md',
];

const markerDefs = [
  ['portal rewrite', /api\/portal|client-portal-session|client-portal-tokens/i],
  ['storage upload route', /storage-upload|storage-upload-health|PORTAL_STORAGE/i],
  ['portal token/session', /PORTAL_TOKEN|PORTAL_SESSION|portalSession|x-portal-session/i],
  ['portal case bundle', /portalSession|ClientPortal|case-items|portal case/i],
  ['upload health secret', /PORTAL_STORAGE_HEALTH_SECRET|x-closeflow-storage-check-secret|CRON_SECRET/i],
  ['no real upload smoke clue', /dataBase64|PORTAL_FILE_REQUIRED|PORTAL_FILE_UPLOAD/i],
  ['auth json clue', /AUTHORIZATION_BEARER_REQUIRED|writeAuthErrorResponse|RequestAuthError/i],
  ['Vite or HTML risk clue', /Vite|INVALID_API_RESPONSE|text\/html|NON_JSON/i],
];

function read(rel) {
  const full = path.join(root, rel);
  if (!fs.existsSync(full)) return '';
  return fs.readFileSync(full, 'utf8');
}

function count(re, text) {
  const m = text.match(new RegExp(re.source, re.flags.includes('g') ? re.flags : re.flags + 'g'));
  return m ? m.length : 0;
}

const rows = files.map((rel) => {
  const full = path.join(root, rel);
  const exists = fs.existsSync(full);
  const text = exists ? read(rel) : '';
  return {
    rel,
    exists,
    lines: text ? text.split(/\r?\n/).length : 0,
    fetch: count(/\bfetch\s*\(/, text),
    callApi: count(/\bcallApi\s*\(/, text),
    methodPost: count(/method\s*:\s*['"]POST['"]|method === ['"]POST['"]/i, text),
    methodGet: count(/method\s*:\s*['"]GET['"]|method === ['"]GET['"]|method === ['"]HEAD['"]/i, text),
    markers: markerDefs.filter(([, re]) => re.test(text)).map(([name]) => name),
  };
});

const existing = rows.filter((r) => r.exists).length;
const missing = rows.filter((r) => !r.exists).map((r) => r.rel);
const markerCounts = new Map();
for (const row of rows) for (const marker of row.markers) markerCounts.set(marker, (markerCounts.get(marker) || 0) + 1);
const markerSummary = [...markerCounts.entries()].sort((a, b) => b[1] - a[1]);

function mdTableRow(row) {
  return `| ${row.rel} | ${row.exists ? 'OK' : 'MISSING'} | ${row.lines} | ${row.fetch} | ${row.callApi} | ${row.methodGet} | ${row.methodPost} | ${row.markers.join('; ') || '-'} |`;
}

const generatedAt = new Date().toISOString();
const report = `---
typ: project_report
stage: STAGE216D
status: local_only_qa_smoke
project: CloseFlow / LeadFlow
date: 2026-06-01
---

# STAGE216-D - Portal / Storage / Uploads QA local-only

## Routing

- canonical_name: CloseFlow / LeadFlow
- entity_id: DO_POTWIERDZENIA
- workspace_id: DO_POTWIERDZENIA
- project_id: DO_POTWIERDZENIA
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\\Users\\malim\\Desktop\\biznesy_ai\\2.closeflow
- Obsidian vault: C:\\Users\\malim\\Desktop\\biznesy_ai\\00_OBSIDIAN_VAULT
- Obsidian folder: 10_PROJEKTY/CloseFlow_LeadFlow
- tryb pracy: LOCAL-ONLY, bez commita i bez push

## Teza etapu

Stage216-D nie robi realnych uploadów i nie dotyka SQL/RLS/GRANT. To lokalna bramka diagnostyczna dla portalu klienta, sesji/tokenów portalowych oraz health uploadów po migracji Supabase.

## Wynik skanu lokalnego

- scanned_at: ${generatedAt}
- cwd: ${root}
- expected files: ${files.length}
- existing files: ${existing}
- missing files: ${missing.length}

## Mapa plików

| Plik | Status | Linie | fetch | callApi | GET markers | POST markers | Markery |
|---|---:|---:|---:|---:|---:|---:|---|
${rows.map(mdTableRow).join('\n')}

## Braki / ryzyka z routingu

${missing.length ? missing.map((m) => `- ${m}`).join('\n') : '- brak brakujących plików w skanie'}

Szczególnie sprawdzić, czy przekierowania `vercel.json` do `/api/portal` mają faktyczny handler. Jeżeli `/api/client-portal-session` lub `/api/client-portal-tokens` zwracają HTML/Vite source albo 404 bez JSON, następny etap powinien być Stage216-D2 route repair.

## Podsumowanie markerów

${markerSummary.length ? markerSummary.map(([name, value]) => `- ${name}: ${value}`).join('\n') : '- brak markerów'}

## Runtime smoke GET-only

Do uruchomienia lokalnie po starcie dev API:

\`\`\`powershell
cd "C:\\Users\\malim\\Desktop\\biznesy_ai\\2.closeflow"
npm run dev:api
\`\`\`

Drugie okno:

\`\`\`powershell
cd "C:\\Users\\malim\\Desktop\\biznesy_ai\\2.closeflow"
$env:CLOSEFLOW_APP_URL="http://localhost:3000"
node tools/stage216d-portal-storage-uploads-runtime-smoke.cjs --write
\`\`\`

Akceptowalne lokalnie:

- JSON 401/403/405/400 jako kontrolowany auth/session/method/config response,
- CONFIG_REQUIRED_500 dla brakującego sekretu health/storage w środowisku lokalnym, ale to jest finding env, nie naprawa kodu,
- PASS_JSON_200 tylko dla endpointów, które rzeczywiście są publiczne albo health z poprawnym sekretem.

Twardy FAIL:

- HTML zamiast JSON,
- Vite/source response,
- 500 bez rozpoznanego config/auth/session kodu,
- FETCH_FAILED przy działającym dev API.

## Manual QA bez realnego uploadu

- Otworzyć aplikację lokalnie.
- Sprawdzić czy portal klienta nie pokazuje białej strony przy braku sesji.
- Sprawdzić czy brak tokena/sesji daje zrozumiały komunikat, nie crash.
- Nie wysyłać realnego pliku w tym etapie.
- Nie tworzyć tokenów ani sesji ręcznie bez osobnego D2/D3.

## Czego nie ruszano

- SQL/RLS/GRANT
- Google Calendar sync
- realne uploady
- realne dane runtime
- backupy
- Node_RED_Kabelki
- git commit/push

## Następny krok

Jeżeli smoke pokaże tylko kontrolowane JSON/config responses, Stage216-D można uznać za lokalnie przejrzany i dopiero potem zdecydować, czy robimy D2 route repair. Jeżeli pokaże HTML/Vite/niekontrolowane 500, robimy Stage216-D2 jako wąski fix.
`;

const obsidian = `---
typ: obsidian_project_update
project: CloseFlow / LeadFlow
stage: STAGE216D
status: local_only_qa_smoke
date: 2026-06-01
---

# 2026-06-01 - CloseFlow Stage216-D portal storage uploads QA local only

## FAKTY

- Stage216-C2 zostało technicznie zamknięte: AI Drafts zwraca kontrolowane 401 JSON zamiast 500.
- Aktualny etap Stage216-D jest lokalny i nie ma być commitowany ani pushowany.
- Zakres: portal klienta, sesje/tokeny portalowe, storage upload health, upload endpointy.
- Skan lokalny ma sprawdzić także ryzyko routingu `/api/portal`.

## DECYZJE DAMIANA

- Wdrażamy lokalnie.
- Nie dajemy do gita na razie.
- Nie używać `git add .`.
- Nie ruszać SQL/RLS/GRANT bez wyraźnej decyzji.
- Nie robić realnego uploadu w pierwszym smoke.

## HIPOTEZY AI

- Największe ryzyko Stage216-D to route gap między `vercel.json` a fizycznymi handlerami portalu.
- Storage health może zwrócić kontrolowany config error, jeżeli lokalnie brakuje sekretu health albo Supabase storage env.
- HTML/Vite response będzie oznaczać błąd routingu, nie błąd danych.

## TESTY

- `node scripts/check-stage216d-portal-storage-uploads-qa.cjs`
- `npm run build`
- `node tools/stage216d-portal-storage-uploads-runtime-smoke.cjs --write`

## RYZYKA

- Local `vercel dev` na Windows zgłaszał wcześniej watcher `EPERM`. Traktować jako osobny problem dev-runnera, jeśli API mimo tego odpowiada.
- Vault Obsidiana ma równoległe zmiany Node_RED_Kabelki, więc nie commitować vaulta globalnie.

## NASTĘPNY KROK

Uruchomić Stage216-D local-only. Jeżeli runtime pokaże HTML/Vite/niekontrolowane 500, przygotować Stage216-D2 jako wąski route/API fix. Bez commita/pusha do czasu decyzji Damiana.

## Zapis do Obsidiana

- nazwa / alias wejściowy: CloseFlow / LeadFlow, Stage216-D
- entity_id: DO_POTWIERDZENIA
- workspace_id: DO_POTWIERDZENIA
- project_id: DO_POTWIERDZENIA
- idea_id: nie dotyczy
- report_id: STAGE216D_PORTAL_STORAGE_UPLOADS_QA_LOCAL_ONLY_2026-06-01
- canonical_name: CloseFlow / LeadFlow
- folder Obsidiana: 10_PROJEKTY/CloseFlow_LeadFlow
- typ wpisu: local-only QA/smoke po migracji Supabase
- docelowa ścieżka: 10_PROJEKTY/CloseFlow_LeadFlow/2026-06-01 - CloseFlow Stage216-D portal storage uploads QA local only.md
- status zapisu: przygotowano lokalnie, bez git
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\\Users\\malim\\Desktop\\biznesy_ai\\2.closeflow
- testy: guard/build/runtime do wykonania lokalnie
- czego nie ruszano: SQL/RLS/GRANT, Google Calendar sync, realne uploady, Node_RED_Kabelki, git push
- następny krok: local apply + runtime smoke
`;

if (WRITE) {
  fs.mkdirSync(path.dirname(REPORT), { recursive: true });
  fs.writeFileSync(REPORT, report, 'utf8');
  fs.mkdirSync(path.dirname(OBS), { recursive: true });
  fs.writeFileSync(OBS, obsidian, 'utf8');
  console.log(`Stage216-D scan: ${existing}/${files.length} source files present`);
  if (missing.length) {
    console.log('Missing files:');
    for (const m of missing) console.log('- ' + m);
  }
  console.log('WROTE ' + path.relative(root, REPORT));
  console.log('WROTE ' + path.relative(root, OBS));
} else {
  console.log(report);
}
