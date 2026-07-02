# LF-PROD-SOT-004J - Manual smoke and next runtime import decision

## Status

MANUAL_SMOKE_PENDING / NEXT_RUNTIME_IMPORT_BLOCKED / NO_RUNTIME_CHANGE / NO_UI_CHANGE / NO_CSS_CHANGE / NO_SQL_CHANGE

## Linki SOT / mapa wejsciowa

- Centralny indeks map SOT: 10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/00_MAPY_I_ZALEZNOSCI_SOT.md
- Poprzedni etap: LF-PROD-SOT-004I_CALENDAR_DATE_TIME_BOUNDARY_READONLY_RUNTIME_IMPORT
- Obsidian 004I: 10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/LF-PROD-SOT-004I_CALENDAR_DATE_TIME_BOUNDARY_READONLY_RUNTIME_IMPORT.md
- App run 004I: _project/runs/LF-PROD-SOT-004I_CALENDAR_DATE_TIME_BOUNDARY_READONLY_RUNTIME_IMPORT.md
- Ten etap realizuje: MANUAL_SMOKE_REQUIRED_BEFORE_NEXT_RUNTIME_IMPORT / NEXT_RUNTIME_IMPORT_DECISION_NEEDED

## Manual smoke checklist

- Calendar page checked: NOT_DONE
- Today page checked: NOT_DONE
- Tasks page checked: NOT_DONE
- TasksStable page checked: NOT_DONE
- Calendar day counts checked: NOT_DONE
- Today task/event counts checked: NOT_DONE
- task/event status labels checked: NOT_DONE
- date precedence checked: NOT_DONE
- date-only defaults checked: NOT_DONE
- Google Calendar sync untouched checked: NOT_DONE
- console errors checked: NOT_DONE

## Smoke result

MANUAL_SMOKE_PENDING

## Next runtime import decision

NEXT_RUNTIME_IMPORT_DECISION:
BLOCKED_UNTIL_MANUAL_SMOKE_PASS

Decision reason:
Manual smoke was not confirmed as PASS, so the next runtime import must stay blocked.

Next proposed stage:
MANUAL_SMOKE_REQUIRED_BEFORE_NEXT_RUNTIME_IMPORT

## Czego nie ruszano

- runtime changes in 004J: NONE
- Calendar runtime: NOT_TOUCHED
- Tasks runtime: NOT_TOUCHED
- Today runtime: NOT_TOUCHED
- Google Calendar sync: NOT_TOUCHED
- Google Calendar mapper: NOT_TOUCHED
- remote calendar provider: NOT_TOUCHED
- UI components: NOT_TOUCHED
- CSS: NOT_TOUCHED
- SQL: NOT_TOUCHED
- Supabase/API: NOT_TOUCHED
- UI/CSS/SQL/Supabase/API: NOT_TOUCHED
- CaseDetail runtime: NOT_TOUCHED
- Finance runtime: NOT_TOUCHED

## Wyniki wykonanych komend

- npm run verify:lf-prod-sot-004i-calendar-date-time-boundary-readonly-runtime-import: PASS
- npm run verify:lf-prod-sot-004j-manual-smoke-and-next-runtime-import-decision: PASS
- node --test tests/lf-prod-sot-004j-manual-smoke-and-next-runtime-import-decision.test.cjs: PASS
- npm run guard:routes:canonical: PASS
- npm run guard:ui:patch-layers: PASS
- npm run check:polish-mojibake: PASS
- npm run build: PASS
- git diff --check: PASS
- App commit: TO_BE_CREATED_AFTER_COMMIT

## Risk audit

- 004I was first runtime import.
- Manual smoke is mandatory before next runtime import.
- 004J does not change runtime.
- Today is recommended as next candidate only if smoke is PASS.
- CaseDetail and Finance remain blocked for later.

## Zapis do Obsidiana

- data/time: 2026-07-02 23:12 Europe/Warsaw
- name/alias: LF-PROD-SOT-004J_MANUAL_SMOKE_AND_NEXT_RUNTIME_IMPORT_DECISION
- canonical_name: CloseFlow / LeadFlow
- Obsidian folder: 10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY
- target file/path: 10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/LF-PROD-SOT-004J_MANUAL_SMOKE_AND_NEXT_RUNTIME_IMPORT_DECISION.md
- save status: PREPARED_BY_LOCAL_SCRIPT
- Obsidian GitHub sync: TO_RUN_AFTER_APP_PASS
- Obsidian local sync: TO_RUN_AFTER_OBSIDIAN_PUSH
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
- manual smoke result: MANUAL_SMOKE_PENDING
- next runtime import decision: BLOCKED_UNTIL_MANUAL_SMOKE_PASS
- tests: PASS
- risk audit: 004J is a gate stage; no runtime import in 004J.
- what was not touched: Calendar/Tasks/Today runtime, Google Calendar sync/mapper/provider, UI/CSS, SQL, Supabase/API, CaseDetail, Finance.
- next step: Run manual smoke before any next runtime import.

## Wynik

KONIEC ETAPU LF-PROD-SOT-004J.