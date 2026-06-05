# STAGE223 R2H - Stage120 calendar bundle signature hotfix

Data: 2026-06-05
Projekt: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Tryb: ZIP/local-only, bez commita i bez push

## FAKTY

- R2G:
  - Stage98 OK
  - Stage220A17 OK
  - case trash actions OK
  - Stage113 OK
  - Stage223 OK
  - Stage222 OK
  - build OK
- `verify:closeflow:quiet` zatrzymał release na:
  `tests/stage120-calendar-local-first-sync-and-focus-contract.test.cjs`.
- Test oczekuje, że wyciągnięta funkcja `fetchCalendarBundleFromSupabase` zawiera `Promise.all([`.
- W `src/lib/calendar-items.ts` logika już ma `Promise.all([`, ale sygnatura funkcji miała default object `options: CalendarBundleRangeOptions = {}`.
- Prosty extractor testu brał pierwsze `{` po nazwie funkcji, czyli default `{}` z parametru, nie ciało funkcji.

## ZAKRES

- Zmienić sygnaturę:
  `options: CalendarBundleRangeOptions = {}`
  na:
  `options?: CalendarBundleRangeOptions`
- W ciele funkcji dodać:
  `const calendarRangeOptions = options || {};`
- Zastąpić użycia `options` w local reads:
  `fetchTasksFromSupabase(calendarRangeOptions)`
  `fetchEventsFromSupabase(calendarRangeOptions)`
- Nie zmieniać local-first semantyki.
- Nie podłączać Google inbound sync do bootstrapu.
- Nie ruszać Activity Truth.

## TESTY

```powershell
node --test tests/stage120-calendar-local-first-sync-and-focus-contract.test.cjs
node --test tests/stage98-polish-mojibake-calendar-guard.test.cjs
node scripts/check-stage220a17-case-detail-vst-wiring.cjs
node scripts/check-closeflow-case-trash-actions.cjs
node --test tests/stage113-closeflow-logo-source-contract.test.cjs
node scripts/check-stage223-owner-movement-risk-system.cjs
node --test tests/stage223-owner-risk-runtime-contract.test.cjs
node scripts/check-stage222-owner-risk-rules-foundation.cjs
node --test tests/stage222-owner-risk-rules-foundation.test.cjs
npm run build
npm run verify:closeflow:quiet
git diff --check
```

## NASTĘPNY KROK

Jeżeli `verify:closeflow:quiet` przejdzie, wykonać jeden commit/push całego Stage223 R2 + R2B-R2H.
