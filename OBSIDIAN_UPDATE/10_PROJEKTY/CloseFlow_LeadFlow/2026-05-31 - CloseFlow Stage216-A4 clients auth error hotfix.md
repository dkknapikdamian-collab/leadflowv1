# 2026-05-31 - CloseFlow Stage216-A4 clients auth error hotfix

## FAKTY

- Stage216-A2 runtime smoke na `dev:api` potwierdził, że `/api/leads` i `/api/cases` zwracają kontrolowane `AUTH_REQUIRED 401` jako JSON bez sesji Bearer.
- `/api/clients` zwrócił `FAIL 500 AUTHORIZATION_BEARER_REQUIRED`.
- To nie jest błąd SQL/RLS/GRANT. To niespójny auth-error handling w endpointzie clients.
- Stage216-A4 dotyczy tylko `/api/clients` i guardów/raportów.

## DECYZJE DAMIANA

- Idziemy etapami po Supabase migration QA.
- Nie mieszamy napraw runtime API z SQL/RLS/GRANT, jeśli aktualny FAIL nie wskazuje na SQL.
- Każdy etap ma zapis do Obsidiana i guard.

## HIPOTEZY AI

- `api/clients.ts` mapował brak Bearera na 500, bo catch block nie delegował błędów auth/access do `writeAuthErrorResponse`.
- Po patchu `/api/clients` powinien zachować się jak `/api/leads` i `/api/cases`, czyli zwrócić `AUTH_REQUIRED 401` bez zalogowanej sesji.

## TESTY

Automatyczne:

```powershell
node scripts/check-stage216a4-clients-auth-error-hotfix.cjs
npm run build
```

Runtime po commicie:

```powershell
npm run dev:api
node tools/stage216a2-lcc-runtime-smoke.cjs --write
```

Oczekiwane minimum:

- `/api/leads`: `AUTH_REQUIRED 401`
- `/api/clients`: `AUTH_REQUIRED 401`
- `/api/cases`: `AUTH_REQUIRED 401`
- brak `500 AUTHORIZATION_BEARER_REQUIRED`
- brak `NON_JSON_RESPONSE`
- brak `VITE_DEV_API_SOURCE_RESPONSE`

## RYZYKA

- To nie potwierdza jeszcze pełnego zalogowanego CRUD.
- Do pełnego runtime L/C/C smoke będzie potrzebny realny Bearer token albo test przez zalogowaną przeglądarkę.

## CZEGO NIE RUSZANO

- SQL
- RLS
- GRANT
- dane Supabase
- UI pages
- API leads/cases
- Calendar/Tasks/Notifications

## NASTĘPNY KROK

Zastosować Stage216-A4, commit/push, ponowić Stage216-A2 runtime smoke na `dev:api`. Jeśli `/api/clients` przestanie zwracać 500 i przejdzie na `AUTH_REQUIRED 401`, zamknąć A4 i przejść do logged-in/browser L/C/C smoke.
