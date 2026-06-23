# STAGE232G_R1F_CALENDAR_TODAY_FINAL_PARITY_GUARD_AND_SMOKE

Data: 2026-06-23 17:35 Europe/Warsaw
canonical_name: CloseFlow / LeadFlow
repo: dkknapikdamian-collab/leadflowv1
branch: dev-rollout-freeze
local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
Obsidian folder: 10_PROJEKTY/CloseFlow_Lead_App

## Status

READY_TO_APPLY_ZIP / FINAL_GUARD_AND_SMOKE / NO_NEW_RUNTIME_FEATURES

## Cel

Zamknąć aktualnie przekazaną serię `STAGE232G` dla Calendar/Today przez finalny guard parytetu i checklistę smoke.

## Zakres

R1F nie dodaje nowej funkcji i nie powinien zmieniać runtime UI.

Dotykane pliki:
- centralne pliki `_project` i router Obsidiana,
- `_project/runs/STAGE232G_R1F_CALENDAR_TODAY_FINAL_PARITY_GUARD_AND_SMOKE.md`,
- `_project/obsidian_updates/2026-06-23_STAGE232G_R1F_CALENDAR_TODAY_FINAL_PARITY_GUARD_AND_SMOKE.md`,
- `scripts/check-stage232g-r1f-calendar-today-final-parity-guard-and-smoke.cjs`,
- `tests/stage232g-r1f-calendar-today-final-parity-guard-and-smoke.test.cjs`,
- `scripts/check-cf-runtime-00-source-truth.cjs` tylko allowlist.

## Co sprawdza guard

- R1A: shared operational entry contract istnieje i zawiera parity fingerprint.
- R1B: Today używa adaptera/wrapperów kontraktu.
- R1C: lead shadow ma policy/dedup i nie ma destructive actions.
- R1D: Calendar/Today używają action policy.
- R1E: Calendar DOM normalizers są gated przez policy.
- R1E1: `api/work-items.ts` ma hotfix Vercel TS blocker i brak unsafe `.blocksProgress`.
- R1F: dokumentacja, guard, test i CF_RUNTIME_00 allowlist istnieją.

## Manual smoke checklist po deployu

1. Calendar month/week: wejście w kalendarz, zmiana widoku, brak crasha.
2. Calendar tooltip/kolory: tooltip i kolory wpisów nadal działają.
3. Calendar actions: task/event complete/delete/restore/edit/shift zgodnie z policy.
4. Today task/event/lead shadow: wpisy są widoczne i nie dublują się.
5. Lead shadow: brak fake done/delete; destructive actions nie są aktywne.
6. DevTools: brak czerwonych błędów runtime.
7. Vercel: build po pushu R1F zielony.

## Testy wymagane lokalnie

- R1F guard: PASS
- R1F node test: PASS
- R1E1 work-items guard: PASS
- CF_RUNTIME_00: PASS
- npm run build: PASS
- npm run verify:closeflow:quiet: PASS
- git diff --check: PASS

## Ryzyka

Guard sprawdza source anchors i kontrakty, ale nie zastępuje ręcznego smoke w przeglądarce. Jeżeli Vercel albo smoke pokaże błąd z tej serii, dopuszczalny jest tylko hotfix pod ten błąd.

## Decyzja właściciela

Po zamknięciu R1F nie proponować nowych etapów. Wyjątek: błąd, który wyjdzie z aktualnie wykonywanej serii.

NEXT_PLANNED_STAGE: NONE
Allowed after R1F: only bugfixes from current series if test, Vercel or manual smoke fails.
