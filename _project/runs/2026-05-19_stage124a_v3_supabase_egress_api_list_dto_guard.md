# 2026-05-19 - Stage124A V3 Supabase egress API list DTO guard

## Cel

Zmniejszyc Supabase egress bez ucinania funkcjonalnosci aplikacji przez rozdzielenie list API od detail API.

## Scan-first confirmation

- project_id: closeflow_lead_app
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- Obsidian contract: `00_SYSTEM/PRODUCTION_DATA_EGRESS_AND_QUERY_CONTRACT - wzorzec dla aplikacji produkcyjnych.md`
- problem: list endpoints zwracaly pelne rekordy przez `select=*` i wysokie limity.

## FAKTY Z KODU / PLIKOW

- `src/lib/supabase-fallback.ts` jest glownym klientem API dla fetchy frontu.
- `/leads` laduje rownolegle leads/cases/tasks/events/clients.
- `api/leads.ts`, `api/clients.ts`, `api/cases.ts` mialy listowe `select=*`.
- `api/tasks.ts` / `api/events.ts` moga istniec lokalnie i zawierac `work_items?select=*`; V3 patchuje je warunkowo.

## DECYZJE DAMIANA

- Naprawiac produkcyjnie bez ucinania funkcjonalnosci aplikacji.
- Pracowac paczkami ZIP, bez samodzielnego pushowania.
- Zapisywac problem w Obsidianie jako wzorzec do unikania w przyszlych aplikacjach.

## ZMIANY

- List endpoints: explicit ListDTO select constants.
- Detail endpoints: full detail payload po `id` zostaje dozwolony.
- Cache GET: 10s -> 30s, czyszczony po mutacjach.
- Guard: `scripts/check-stage124-supabase-egress-contract.cjs`.
- V3: patcher Node zamiast kruchego PowerShell `-replace`.

## TESTY AUTOMATYCZNE

- `node scripts/check-stage124-supabase-egress-contract.cjs`
- `node --test tests/stage124-supabase-egress-contract.test.cjs`
- `npm run build`

## TESTY RECZNE DO WYKONANIA

- /leads lista + lead detail
- /clients lista + client detail
- /cases lista + case detail
- /tasks lista/status/delete
- /calendar month + selected day + edit modal
- Supabase Usage / Logs Top Paths po normalnej sesji

## RYZYKA

- Jesli lista potrzebuje pola spoza ListDTO, dopisac je jawnie do stalej ListDTO. Nie wracac do `select=*`.
- To Stage124A. Stage124B powinien zajac sie date-range queries dla calendar/tasks i dalsza deduplikacja auth/workspace.

## GIT / ZIP STATUS

- ZIP/local-only.
- Commit/push tylko jesli Damian uruchomi `-CommitPush` albo sam doda pliki jawnie.
