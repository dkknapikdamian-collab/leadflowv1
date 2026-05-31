# 2026-05-31 - CloseFlow Stage216-A leads clients cases functional QA

## FAKTY

- Stage216-A is a functional QA gate for Leads / Clients / Cases after Stage215 coverage matrix.
- The frontend API wrapper throws INVALID_API_RESPONSE when an endpoint returns non-JSON/raw content, so runtime endpoint checks matter.
- Server Supabase access requires SUPABASE_SERVICE_ROLE_KEY and a Supabase URL, so missing env can still break API while build passes.
- Clients and cases APIs require workspace context and scoped write access for mutations.
- No SQL, RLS, GRANT, data mutation, cleanup, or runtime UI patch is performed by this stage.

## DECYZJE DAMIANA

- Do not repair every module at once.
- Stage216-A only covers Leads / Clients / Cases.
- Runtime write probes are opt-in only and disabled by default.
- If Stage216-A finds runtime FAILs, split fixes into Stage216-A1/A2/A3 rather than one large risky patch.

## HIPOTEZY AI

- Likely failure class #1: detail pages can fail after hard refresh if id/detail endpoint shape differs from list DTO assumptions.
- Likely failure class #2: relation creation lead → client → case can fail through workspace scoping or duplicate conflict logic.
- Likely failure class #3: empty-state UI may be acceptable visually but still hide INVALID_API_RESPONSE errors in console.

## DO POTWIERDZENIA

- Realny workspace id do runtime probe.
- Czy runtime probe ma być tylko GET-only, czy później dopuszczamy write probe w trybie testowym.
- Czy FAIL-e z lead/client/case mają iść jako Stage216-A1/A2/A3.

## TESTY

- `node scripts/check-stage216a-lcc-functional-qa.cjs`
- `npm run build`
- manual QA dla `/leads`, `/clients`, `/cases`, `/leads/:id`, `/clients/:clientId`, `/cases/:id`
- opcjonalny GET-only probe: `node tools/stage216a-lcc-api-probe.cjs`

## RYZYKA

- API może zwracać HTML/error shell i frontend pokaże `INVALID_API_RESPONSE`.
- Write access może być inny niż read access.
- Detail pages mogą mieć inne kontrakty niż list DTO.

## ZAKRES

- Leads
- Clients
- Cases
- Detail pages
- Relacje lead → client → case

## CZEGO NIE RUSZANO

- SQL
- RLS
- GRANT
- dane Supabase
- Calendar
- NotificationsCenter
- Tasks/Events
- backupy

## NASTĘPNY KROK

- Uruchomić Stage216-A guard/build.
- Wykonać manual QA.
- Potem Stage216-A1 dla pierwszego realnego FAIL-a.
