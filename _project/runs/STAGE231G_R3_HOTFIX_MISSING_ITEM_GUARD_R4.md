# STAGE231G_R3_HOTFIX_MISSING_ITEM_GUARD_R4

Data: 2026-06-14 11:30 Europe/Warsaw
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Project: CloseFlow / LeadFlow

## Powod

Poprzedni commit STAGE231G_R3 zostal wypchniety po czerwonym guardzie, a hotfix R3 przerwal na bledzie generatora testu. Ten hotfix jest idempotentny i nie uzywa template literal interpolation w generowanych plikach.

## Zmiana

- leadNextActionEntries filtruje przez !isMissingItemTimelineEntry(entry) oraz zostawia tylko task/event.
- nextTimelineEntry fallbackuje do leadNextActionEntries, nie do calej timeline.
- Guard i test STAGE231G_R3 sprawdzaja realny ksztalt useMemo i blokuja powrot fallbacku do pelnej timeline.
- Wpisy _project/04 i _project/08 wyczyszczono z mojibake, trailing whitespace i blednej sciezki ests/.

## Testy do uruchomienia

- node scripts/check-stage231g-r3-lead-detail-function-mapping.cjs
- node --test tests/stage231g-r3-lead-detail-function-mapping.test.cjs
- npm run build
- git diff --check -- src/pages/LeadDetail.tsx scripts/check-stage231g-r3-lead-detail-function-mapping.cjs tests/stage231g-r3-lead-detail-function-mapping.test.cjs _project/04_ETAPY_ROZWOJU_APLIKACJI.md _project/08_CHANGELOG_AI.md _project/runs/STAGE231G_R3_HOTFIX_MISSING_ITEM_GUARD_R4.md _project/obsidian_updates/2026-06-14_STAGE231G_R3_HOTFIX_MISSING_ITEM_GUARD_R4.md

## Audyt ryzyk

- Nie dotykano SQL, Google Calendar, billing/trial, CaseDetail, ClientDetail ani globalnego layoutu.
- Ryzyko regresji: jezeli getNearestPlannedAction zwroci ID usunietego albo zamknietego wpisu, UI pokaze pierwszy realny leadNextActionEntries zamiast braku/missing_item.
- Ryzyko lokalne: working tree nadal zawiera stare niepowiazane zmiany 231D0D/231D0E/231D0F/231D0H; nie wolno ich dodac do tego commita.