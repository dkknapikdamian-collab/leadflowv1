# 2026-05-31 - CloseFlow Stage216-A2 LCC runtime smoke

## FAKTY

- Stage216-A2 dodaje GET-only runtime smoke dla Leads / Clients / Cases.
- Probe nie wykonuje POST/PATCH/DELETE.
- Probe sprawdza `/api/leads`, `/api/clients`, `/api/cases` oraz detail endpointy, jeśli lista zwróci rekordy z `id`.
- Probe wykrywa HTML/non-JSON jako twardy FAIL, bo to może powodować `INVALID_API_RESPONSE` w aplikacji.
- Etap nie rusza SQL/RLS/GRANT.

## DECYZJE DAMIANA

- Najpierw domykamy rdzeń L/C/C.
- Nie przechodzimy jeszcze do Tasks/Events/Calendar, jeśli runtime L/C/C pokaże FAIL.
- Nie dodajemy testowych rekordów do produkcyjnego Supabase w tym etapie.

## HIPOTEZY AI

- `FETCH_FAILED` oznacza zwykle, że lokalna aplikacja nie działa pod `CLOSEFLOW_APP_URL`.
- `AUTH_REQUIRED` oznacza, że API odpowiada JSON-em, ale wymaga sesji/workspace/auth context.
- `NON_JSON_HTML_RESPONSE` jest kandydatem na Stage216-A3.

## TESTY

Automatyczne:

```powershell
node scripts/check-stage216a2-lcc-runtime-smoke.cjs
npm run build
```

Opcjonalny runtime GET-only probe:

```powershell
cd "C:\Users\malim\Desktop\biznesy_ai\2.closeflow"
$env:CLOSEFLOW_APP_URL="http://localhost:3000"
$env:CLOSEFLOW_WORKSPACE_ID="TU_REALNY_WORKSPACE_UUID"
node tools/stage216a2-lcc-runtime-smoke.cjs --write
```

Manual smoke:

```text
/leads
/clients
/cases
/lead detail
/client detail
/case detail
```

## RYZYKA

- Probe bez zalogowanej sesji może pokazać `AUTH_REQUIRED`, co nie jest błędem endpointu.
- Runtime FAIL wymaga osobnego Stage216-A3, nie szerokiej naprawy wszystkiego naraz.

## NASTĘPNY KROK

Jeżeli Stage216-A2 nie pokaże FAIL w L/C/C: przejść do Stage216-B Tasks / Events / Calendar functional QA.
Jeżeli pokaże FAIL: zrobić Stage216-A3 dla konkretnego endpointu lub widoku.

## Zapis do Obsidiana

- nazwa / alias wejściowy: CloseFlow / Stage216-A2 LCC runtime smoke
- entity_id: DO_POTWIERDZENIA
- workspace_id: DO_POTWIERDZENIA
- project_id: CloseFlow / LeadFlow
- report_id: STAGE216A2_LCC_RUNTIME_SMOKE_2026-05-31
- canonical_name: CloseFlow / LeadFlow
- folder Obsidiana: OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow
- typ wpisu: runtime smoke QA / GET-only probe
- status zapisu: przygotowano ZIP
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
- testy: guard Stage216-A2 + build + opcjonalny runtime probe
- czego nie ruszano: SQL, RLS, GRANT, dane Supabase, runtime UI, Tasks/Events/Calendar
- następny krok: Stage216-A2 probe/manual smoke albo Stage216-A3 fix.
