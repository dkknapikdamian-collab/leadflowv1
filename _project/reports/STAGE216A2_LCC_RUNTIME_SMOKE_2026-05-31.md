---
typ: raport_stage
stage: Stage216-A2
status: prepared
project: CloseFlow / LeadFlow
data: 2026-05-31
repo: dkknapikdamian-collab/leadflowv1
branch: dev-rollout-freeze
---

# Stage216-A2 - LCC runtime GET-only smoke

## Cel

Sprawdzić runtime API i manualny smoke dla rdzenia CRM po migracji Supabase:

- Leads
- Clients
- Cases
- detail routes
- list endpoints
- reakcję na HTML/non-JSON zamiast JSON, czyli ryzyko `INVALID_API_RESPONSE`

To jest etap GET-only. Nie zapisuje danych, nie wykonuje POST/PATCH/DELETE, nie zmienia SQL/RLS/GRANT.

## Fakty

- Stage216-A dodał bramkę QA i dokumentację L/C/C.
- Stage216-A2 dodaje runtime probe, który może sprawdzić realną aplikację pod `CLOSEFLOW_APP_URL`.
- Probe obsługuje opcjonalny nagłówek workspace przez `CLOSEFLOW_WORKSPACE_ID`.
- `AUTH_REQUIRED` jest klasyfikowane oddzielnie od `FAIL`, bo bez sesji/auth wiele endpointów może poprawnie zwrócić JSON 401/403.
- `NON_JSON_HTML_RESPONSE` jest twardym FAIL, bo frontendowa warstwa może to później pokazać jako `INVALID_API_RESPONSE`.

## Decyzje Damiana

- Nie robimy teraz SQL/RLS/GRANT.
- Nie przechodzimy jeszcze do Tasks/Events/Calendar, dopóki L/C/C nie ma runtime smoke.
- Nie wrzucamy testowych rekordów do produkcyjnej bazy w tym etapie.

## Hipotezy AI

- Jeżeli probe pokaże `FETCH_FAILED`, najczęściej nie działa lokalny serwer lub URL jest błędny.
- Jeżeli probe pokaże `AUTH_REQUIRED`, konieczny będzie manualny smoke w zalogowanej aplikacji albo osobny etap z sesją/auth.
- Jeżeli probe pokaże `NON_JSON_HTML_RESPONSE`, trzeba zrobić Stage216-A3 jako fix konkretnego endpointu lub routingu.

## Manual smoke checklist

Sprawdź w zalogowanej aplikacji:

```text
/leads
/leads/:id albo /lead/:id zgodnie z routingiem aplikacji
/clients
/clients/:id albo /client/:id zgodnie z routingiem aplikacji
/cases
/cases/:id albo /case/:id zgodnie z routingiem aplikacji
```

Dla każdej trasy:

```text
1. CTRL+F5.
2. Brak białego ekranu.
3. Brak INVALID_API_RESPONSE.
4. Empty state jest czytelny, jeśli nie ma danych.
5. Lista ładuje się bez ręcznego przechodzenia po aplikacji.
6. Detail page dla istniejącego rekordu nie pokazuje błędu odczytu.
7. Konsola bez czerwonych błędów API.
```

## Runtime probe

```powershell
cd "C:\Users\malim\Desktop\biznesy_ai\2.closeflow"
$env:CLOSEFLOW_APP_URL="http://localhost:3000"
$env:CLOSEFLOW_WORKSPACE_ID="TU_REALNY_WORKSPACE_UUID"
node tools/stage216a2-lcc-runtime-smoke.cjs --write
```

Jeżeli testujesz produkcję:

```powershell
$env:CLOSEFLOW_APP_URL="https://closeflowapp.vercel.app"
node tools/stage216a2-lcc-runtime-smoke.cjs --write
```

## Interpretacja wyników

- PASS: endpoint zwraca JSON o oczekiwanym kształcie.
- AUTH_REQUIRED: endpoint działa jako JSON, ale wymaga auth/workspace context.
- NOT_FOUND_OK: detail endpoint poprawnie zwrócił 404 dla nieistniejącego rekordu.
- FAIL: wymaga Stage216-A3.

## Zakazy

- Nie używać `git add .`.
- Nie ruszać SQL/RLS/GRANT.
- Nie zapisywać danych testowych w produkcyjnej bazie.
- Nie mieszać z Tasks/Events/Calendar.

## Następny krok

Po probe i manual smoke:

- jeżeli brak FAIL: Stage216-B Tasks/Events/Calendar functional QA,
- jeżeli FAIL w L/C/C: Stage216-A3, konkretny fix dla endpointu/UI, który padł.
