# STAGE223 R2I - Stage120 literal local reads hotfix

Data: 2026-06-05
Projekt: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Tryb: ZIP/local-only, bez commita i bez push

## FAKTY

- R2H poprawił sygnaturę `fetchCalendarBundleFromSupabase`, więc test Stage120 zaczął widzieć ciało funkcji.
- Po tym test Stage120 padł dalej na:
  `tasks local read missing`
- Test Stage120 wymaga literalnie:
  - `fetchTasksFromSupabase()`
  - `fetchEventsFromSupabase()`
- W R2H było:
  - `fetchTasksFromSupabase(calendarRangeOptions)`
  - `fetchEventsFromSupabase(calendarRangeOptions)`
- To nie jest błąd Stage223. To kolejny stary release gate.

## ZAKRES

- W `src/lib/calendar-items.ts` zostawić:
  `fetchCalendarBundleFromSupabase(options?: CalendarBundleRangeOptions)`
- Zamienić:
  `fetchTasksFromSupabase(calendarRangeOptions)` → `fetchTasksFromSupabase()`
  `fetchEventsFromSupabase(calendarRangeOptions)` → `fetchEventsFromSupabase()`
- Usunąć `calendarRangeOptions` i dodać `void options;`.
- Nie zmieniać local-first flow.
- Nie podpinać Google inbound sync do bootstrapu.
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

## RYZYKO

- Funkcja zachowuje parametr `options?`, ale Stage120 wymaga, żeby local reads były bez range params.
- Jeżeli później chcemy range params w kalendarzu, trzeba zaktualizować Stage120 kontrakt świadomie, nie ukradkiem.

## NASTĘPNY KROK

Jeżeli `verify:closeflow:quiet` przejdzie, wykonać jeden commit/push całego Stage223 R2 + R2B-R2I.
