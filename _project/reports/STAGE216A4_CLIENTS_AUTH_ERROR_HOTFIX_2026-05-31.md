# STAGE216-A4 - Clients auth error hotfix

- date: 2026-05-31
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- scope: /api/clients auth error response normalization
- mode: runtime bugfix, no SQL/RLS/GRANT/data changes

## FAKTY

Stage216-A2 runtime smoke po uruchomieniu `dev:api` potwierdził, że lokalne API nie zwraca już Vite source code dla L/C/C. `/api/leads` i `/api/cases` zwracają kontrolowane `AUTH_REQUIRED 401` jako JSON, natomiast `/api/clients` zwraca `FAIL 500 AUTHORIZATION_BEARER_REQUIRED`.

To oznacza niespójny handling błędów auth w `api/clients.ts`. Endpoint klienta powinien zwrócić strukturalny JSON auth error tak jak pozostałe endpointy, a nie traktować brak Bearera jako wewnętrzny błąd 500.

`src/server/_supabase-auth.ts` udostępnia `writeAuthErrorResponse(res, error)`, który obsługuje `RequestAuthError`, `status`, `statusCode` i `code`.

## DECYZJE DAMIANA

- Lecimy dalej po migracji Supabase etapami, bez mieszania SQL/RLS/GRANT z QA runtime.
- Naprawiamy konkretny FAIL z runtime smoke, nie robimy szerokiego refaktoru.
- Nie commitujemy niekwalifikowanego smoke result z błędnego trybu, ale kwalifikowane wyniki runtime zapisujemy w raportach etapów.

## HIPOTEZY AI

- Przyczyna `500 AUTHORIZATION_BEARER_REQUIRED` w `/api/clients` to catch block, który dotąd mapował każdy błąd inny niż `CLIENT_NOT_FOUND` na 500.
- Po delegowaniu błędów z `code/status/statusCode` do `writeAuthErrorResponse`, `/api/clients` powinien zachowywać się jak `/api/leads` i `/api/cases`, czyli zwracać 401 JSON bez prawidłowego Bearera.

## ZAKRES ZMIANY

- `api/clients.ts`
  - import `writeAuthErrorResponse` z `src/server/_supabase-auth.js`
  - catch block deleguje strukturalne auth/access errors do `writeAuthErrorResponse`
  - zachowuje fallback `CLIENT_NOT_FOUND -> 404`, inne runtime errors -> 500
- `scripts/check-stage216a4-clients-auth-error-hotfix.cjs`
  - guard zmiany
- ten raport
- Obsidian update

## CZEGO NIE RUSZANO

- SQL
- RLS
- GRANT
- dane Supabase
- UI pages
- API leads/cases
- runtime smoke tool Stage216-A2 poza wcześniejszym Stage216-A3
- Calendar/Tasks/Notifications

## TESTY AUTOMATYCZNE

Po zastosowaniu patcha:

```powershell
node scripts/check-stage216a4-clients-auth-error-hotfix.cjs
npm run build
```

## TEST RUNTIME PO PATCHU

W oknie 1:

```powershell
cd "C:\Users\malim\Desktop\biznesy_ai\2.closeflow"
npm run dev:api
```

W oknie 2:

```powershell
cd "C:\Users\malim\Desktop\biznesy_ai\2.closeflow"
$env:CLOSEFLOW_APP_URL="http://localhost:3000"
$env:CLOSEFLOW_WORKSPACE_ID="PRAWDZIWY_WORKSPACE_UUID"
node tools/stage216a2-lcc-runtime-smoke.cjs --write
```

Oczekiwane minimum bez sesji Bearer:

- `/api/leads`: `AUTH_REQUIRED 401`
- `/api/clients`: `AUTH_REQUIRED 401`
- `/api/cases`: `AUTH_REQUIRED 401`
- zero `NON_JSON_RESPONSE`
- zero `VITE_DEV_API_SOURCE_RESPONSE`
- zero `500 AUTHORIZATION_BEARER_REQUIRED`

## RYZYKA

- Ten etap nie potwierdza jeszcze zalogowanego, pełnego CRUD. On naprawia tylko spójność błędu auth dla `/api/clients`.
- Prawdziwy zalogowany smoke nadal wymaga realnego Bearer tokena z sesji Supabase, nie samego workspace UUID.

## NASTĘPNY KROK

Po PASS i push: ponowić Stage216-A2 runtime smoke. Jeżeli wszystkie trzy list endpointy dadzą kontrolowane `AUTH_REQUIRED 401` bez sesji, Stage216-A4 jest zamknięty i można przejść do logged-in/browser smoke L/C/C albo do przygotowania probe z Bearer tokenem.
