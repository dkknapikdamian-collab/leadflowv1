# STAGE232I3_OWNER_CONTROL_MISSING_BLOCKER_CROSS_ENTITY_INTEGRATION

- data i godzina: 2026-06-18 19:56 Europe/Warsaw
- canonical_name: CloseFlow / LeadFlow
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- status: TECH_IN_REPO / LOCAL_GUARDS_PASS / NEEDS_MANUAL_SMOKE
- SQL: NIE
- Owner Control: TAK, przez istniejacy Today owner-control baseline
- CaseDetail runtime: NIE RUSZANO
- ClientDetail runtime: NIE RUSZANO

## Scan report

Project: CloseFlow / LeadFlow
Read mode: targeted Owner Control / Today / missing_item integration
Files read:
- AGENTS.md
- _project/00_AI_START_SPIS_TRESCI.md
- _project/CODEX_CONTEXT_INDEX.md
- _project/contracts/STAGE232I0_MISSING_BLOCKER_CROSS_ENTITY_CONTRACT.md
- _project/runs/STAGE232I1_CASE_DETAIL_MISSING_BLOCKER_RUNTIME.md
- _project/runs/STAGE232I2_CLIENT_DETAIL_MISSING_BLOCKER_RUNTIME.md
- _project/obsidian_updates/2026-06-18_STAGE232I2_CLIENT_DETAIL_MISSING_BLOCKER_RUNTIME.md
- src/pages/TodayStable.tsx
- src/lib/owner-control/owner-control-baseline.ts
- src/lib/work-items/normalize.ts
- src/App.tsx
- Obsidian 00_START and 04/09/10/11 central notes

## Zakres wdrozenia

- Dodano owner-control-missing-blockers helper.
- buildOwnerControlBaseline wciaga aktywne task/work item missing_item przed generycznymi taskami.
- Generyczne task rows pomijaja missing_item, zeby ten sam rekord nie pojawial sie dwa razy.
- Wpisy maja [Lead], [Sprawa], [Klient] w statusLabel.
- Dedup key: sourceEntityType + sourceEntityId + item.id.
- entityType: task i entityId: item.id zachowuja istniejaca akcje Today Zrobione, czyli resolve zrodlowego itemu.
- href prowadzi do zrodla: /leads/:id, /case/:id, /clients/:id.
- Nie ma SQL.
- Nie ma aktywnego case_items.
- Nie bylo runtime zmian ClientDetail/CaseDetail.

## Testy lokalne wykonane przez skrypt

- node scripts/check-stage232i3-owner-control-missing-blocker-cross-entity-integration.cjs: PASS
- node --test tests/stage232i3-owner-control-missing-blocker-cross-entity-integration.test.cjs: PASS
- node scripts/check-cf-runtime-00-source-truth.cjs: PASS po dopisaniu I3 scope compat
- npm run build: PASS
- npm run verify:closeflow:quiet: PASS
- git diff --check: PASS

## Manual smoke wymagany

1. Przygotuj lead z aktywnym Brakiem.
2. Przygotuj sprawe z aktywnym Brakiem.
3. Przygotuj klienta z aktywnym Brakiem.
4. Wejdz na Today / Owner Control.
5. Sprawdz, ze widzisz [Lead], [Sprawa], [Klient].
6. Dodaj blokade w sprawie.
7. Sprawdz, ze Owner Control pokazuje ja jako Blokada.
8. Kliknij Otworz przy [Sprawa] - ma prowadzic do CaseDetail.
9. Kliknij Otworz przy [Klient] - ma prowadzic do ClientDetail.
10. Kliknij Uzupelnione na wpisie [Lead].
11. Sprawdz, ze znika z Owner Control i ze zrodlowego LeadDetail.
12. Odswiez strone.
13. Sprawdz, ze rozwiazane wpisy nie wracaja.
14. Sprawdz, ze ten sam Brak nie pojawia sie dwa razy.

## Risk audit

- Etap nie jest CLOSED bez manual smoke Damiana.
- Braki bez jawnego source entity sa pomijane, bo Owner Control nie moze bezpiecznie rozwiazywac kopii.
- Blokada nie jest zgadywana po tytule; tylko status=blocking_missing_item albo blocksProgress=true.
- Nie wolno wracac do case_items jako aktywnego zrodla.
- Nie mieszac z finansami, kalendarzem, billingiem ani A35 redesignem.

<!-- STAGE232I3_CLOSE_STATUS_SYNC_OWNER_SMOKE_OK -->
## 2026-06-22 22:00 Europe/Warsaw - STAGE232I3_CLOSE_STATUS_SYNC_OWNER_SMOKE_OK

Status: PASS_PUSHED / CLOSED / OWNER_SMOKE_OK

Owner smoke Damian: PASS.

Potwierdzone automatycznie przed zamknieciem:
- commit e26833fb obecny na dev-rollout-freeze / origin/dev-rollout-freeze,
- commit c395c393 obecny w historii,
- 
ode scripts/check-stage232i3-owner-control-missing-blocker-cross-entity-integration.cjs: PASS,
- 
ode --test tests/stage232i3-owner-control-missing-blocker-cross-entity-integration.test.cjs: PASS 6/6,
- 
pm run build: PASS,
- 
pm run verify:closeflow:quiet: PASS,
- git diff --check: PASS.

Zakres status-sync:
- zamknieto I3 jako etap techniczny,
- dopisano manual smoke Damiana jako PASS,
- next po I3/K ustawiony na STAGE232G_CALENDAR_OPERATIONAL_SOURCE_OF_TRUTH,
- nie ruszano runtime.

Czego nie ruszano:
- finanse / prowizje,
- kalendarz runtime,
- billing,
- SQL / RLS,
- MissingItemsManagerDialog,
- ClientDetail runtime,
- CaseDetail runtime,
- LeadDetail runtime.

Risk audit:
- Najwieksze ryzyko bylo potraktowanie I3 jako swiezego runtime i nadpisanie dzialajacych Brakow/Blokad. Ten etap jest docs/router-only.
- Nie rozpisywac STAGE232G do budowy, dopoki centralne pliki nie wskazuja tej kolejki po zamknietym I3/K.
<!-- /STAGE232I3_CLOSE_STATUS_SYNC_OWNER_SMOKE_OK -->
