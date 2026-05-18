# 2026-05-18 - Stage119 V5 - release gate harness and missing tests audit

## Cel
Naprawic Stage119 po V1-V4 przez harness, ktory najpierw sprawdza lokalny katalog roboczy, kopiuje wymagane testy, deduplikuje requiredTests i raportuje wszystkie brakujace testy przed pelnym verify.

## Scan-first confirmation
- Repo: dkknapikdamian-collab/leadflowv1
- Branch: dev-rollout-freeze
- Obsidian: 10_PROJEKTY/CloseFlow_Lead_App
- Przeczytano: AGENTS.md, _project protocol, dashboard Obsidiana, PROJECTS.md, Calendar.tsx, stage98 guard, closeflow-release-check-quiet.cjs, package scripts.
- Konflikt: lokalne ponowienia V2/V3/V4 mogly zostawic duplikaty w requiredTests albo uruchamiac node poza repo.

## Fakty z kodu / plikow
- Stage98 guard ma istniec lokalnie przed pierwszym node --test.
- Stage119 test ma wykrywac duplikaty i brakujace pliki w requiredTests.
- Apply V5 uruchamia komendy przez Push-Location do repo aplikacji, zeby nie zalezec od aktualnego cwd PowerShella.

## Decyzje Damiana
- Poprawiac wiecej bledow naraz i lapac je przed kolejnymi slepymi upadkami.
- Pracowac przez ZIP i polecenie push.

## Testy automatyczne
- node --test tests/stage98-polish-mojibake-calendar-guard.test.cjs
- node --test tests/stage119-calendar-release-gate-trust.test.cjs
- node tools/audit-stage119-v5-required-tests.cjs <repo>
- npm run verify:closeflow:quiet

## Test reczny
TEST RECZNY DO WYKONANIA po zielonym gate: /calendar hard refresh, week, month, selected day, create/edit modal, +1H/+1D/+1W, done, delete.

## Braki i ryzyka
- Jesli requiredTests zawiera inne brakujace pliki ze starszych paczek, V5 przerwie run i wypisze pelna liste zamiast chowac problem w verify.
- Runtime UI kalendarza nie jest zmieniany w tym etapie.

## Git / ZIP status
ZIP package. Commit/push tylko po przejsciu guardow i verify.
