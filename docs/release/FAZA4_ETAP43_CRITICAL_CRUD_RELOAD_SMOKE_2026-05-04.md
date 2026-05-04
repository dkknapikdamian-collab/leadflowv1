# FAZA 4 - Etap 4.3 - CRUD smoke test i reload persistence

**Data:** 2026-05-04  
**Branch:** `dev-rollout-freeze`  
**Zakres:** krytyczny smoke test API dla leadów, tasków, eventów, lead -> sprawa i szkiców AI.

## Cel

Ten etap dodaje twardy, powtarzalny test produkcyjnego przepływu danych.

Nie dokładamy nowej funkcji. Dokładamy dowód, że istniejące funkcje zapisują dane, odczytują je ponownie i nie znikają po odświeżeniu widoków.

## Co obejmuje smoke

Skrypt:

```text
scripts/smoke-critical-crud.cjs
```

sprawdza:

```text
GET /api/me
POST /api/leads
GET /api/leads?id=:id
PATCH /api/leads
GET /api/leads?id=:id
POST /api/tasks
GET /api/tasks
PATCH /api/tasks
GET /api/tasks
POST /api/events
GET /api/events
PATCH /api/events
GET /api/events
POST /api/system?kind=ai-drafts
PATCH /api/system?kind=ai-drafts action=confirm
POST /api/system?kind=ai-drafts
PATCH /api/system?kind=ai-drafts action=cancel
POST /api/leads action=start_service
DELETE cleanup for created smoke records
```

## Reload persistence

Automatyczny smoke nie klika UI. Sprawdza backendowy odpowiednik reloadu:

1. rekord jest utworzony,
2. rekord jest ponownie pobrany osobnym requestem GET,
3. aktualizacja jest widoczna po kolejnym GET,
4. dane task/event wracają z publicznych endpointów `/api/tasks` i `/api/events`.

Manualny reload UI nadal zostaje wymagany przed release:

```text
Today
Tasks
Calendar
LeadDetail
CaseDetail
AiDrafts
```

## Wymagane zmienne do uruchomienia live smoke

```text
CLOSEFLOW_SMOKE_BASE_URL
CLOSEFLOW_SMOKE_ACCESS_TOKEN
```

Opcjonalnie:

```text
CLOSEFLOW_SMOKE_WORKSPACE_ID
CLOSEFLOW_SMOKE_KEEP_DATA=1
CLOSEFLOW_SMOKE_AI_EXPECTED=1
```

## Jak zdobyć token

1. Otwórz aktualny preview / produkcyjną aplikację.
2. Zaloguj się na konto testowe.
3. Otwórz DevTools.
4. W Application / Local Storage znajdź token Supabase.
5. Skopiuj `access_token`.
6. Wklej go do PowerShell jako zmienną środowiskową tylko lokalnie.

Nie zapisuj tokena w repo.

## Komenda live smoke

```powershell
$env:CLOSEFLOW_SMOKE_BASE_URL="https://TWOJ-PREVIEW.vercel.app"
$env:CLOSEFLOW_SMOKE_ACCESS_TOKEN="WKLEJ_ACCESS_TOKEN"
npm.cmd run smoke:critical-crud
```

## Kryterium zakończenia etapu

Lokalny static gate przechodzi:

```text
npm.cmd run check:faza4-etap43-critical-crud-smoke
node --test tests/faza4-etap43-critical-crud-smoke.test.cjs
npm.cmd run build
```

Live smoke przechodzi na realnym preview po ustawieniu tokena:

```text
npm.cmd run smoke:critical-crud
```

Jeżeli live smoke zwróci błąd, nie idziemy dalej w funkcje. Najpierw naprawiamy konkretny endpoint.

## Następny etap

```text
FAZA 4 - Etap 4.4 - Live refresh bez ręcznego odświeżania
```
