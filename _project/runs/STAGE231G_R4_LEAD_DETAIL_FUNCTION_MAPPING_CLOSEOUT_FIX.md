# STAGE231G_R4_LEAD_DETAIL_FUNCTION_MAPPING_CLOSEOUT_FIX

Data: 2026-06-14 11:45 Europe/Warsaw
Status: PASS_WITH_VISUAL_FOLLOWUP / R4D_DO_TEST_AND_PUSH
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Local path: C:\\Users\\malim\\Desktop\\biznesy_ai\\2.closeflow

## FAKTY Z KODU / PLIKOW

- R3 exists and is technically closed for potential, next-action, main missing_item filtering and R3 static test.
- LeadDetail still contains legacy local MissingItemQuickActionModal creation path before this R4.
- Overflow Pozostale dzialania still deletes task-like missing_item through normal task delete before this R4.
- Work-row CSS still has a fragile grid before this R4.
- package.json has no dedicated typecheck script; typecheck is SKIP unless a script is later added.

## DECYZJE DAMIANA

- Do not move this pattern to CaseDetail before LeadDetail R4 closeout passes.
- Keep one canonical missing_item creation path in LeadDetail: ContextActionDialogs / blocker.
- Do not touch SQL, Google Calendar, billing/trial, CaseDetail or ClientDetail in this stage.

## AUDYT PRZED ETAPEM

### Scan method

GitHub connector + local ZIP package prepared for Damian local apply.

### Repo files read

- AGENTS.md
- _project/00_PROJECT_MEMORY_PROTOCOL.md
- _project/04_STAGE_AUDIT_PROTOCOL_CLOSEFLOW.md
- package.json
- src/pages/LeadDetail.tsx
- src/styles/visual-stage14-lead-detail-vnext.css
- scripts/check-stage231g-r3-lead-detail-function-mapping.cjs
- tests/stage231g-r3-lead-detail-function-mapping.test.cjs
- _project/runs/STAGE231G_R3_LEAD_DETAIL_FUNCTION_MAPPING_AND_OPERATIONAL_CLOSEOUT.md

### Obsidian notes read

OBSIDIAN_LOCAL_UNAVAILABLE in this chat runtime. Payload prepared in _project/obsidian_updates.

### Current implementation map

- Missing item creation has two paths: legacy local modal and ContextActionDialogs blocker.
- Main action accordion already uses hard missing_item delete.
- Overflow remaining actions still needs explicit missing_item delete branch.
- Work-row markers exist but CSS does not yet guarantee safe medium-width layout.

### Scope

Only LeadDetail closeout:
- remove legacy local missing-item modal path,
- fix overflow missing_item delete,
- harden work-row CSS,
- add R4 guard/test,
- update _project and Obsidian payload.

### Do not touch

- SQL / Supabase schema,
- Google Calendar,
- billing/trial,
- CaseDetail,
- ClientDetail,
- AI Drafts,
- global layout outside LeadDetail CSS touched by this file.

## ZNALEZIONE PROBLEMY

No new issue outside R4 scope. actorId/ownerId remains a separate future audit item and is not fixed in R4.

## WDROZENIE

R4 patch removes legacy MissingItemQuickActionModal from LeadDetail, routes overflow missing_item delete through handleDeleteLeadMissingItemStage228R15(entry), hardens work-row CSS and adds guard/test.

## TESTY AUTOMATYCZNE

Required local commands:
- node scripts/check-stage231g-r3-lead-detail-function-mapping.cjs
- node --test tests/stage231g-r3-lead-detail-function-mapping.test.cjs
- node scripts/check-stage231g-r4-lead-detail-function-mapping-closeout.cjs
- node --test tests/stage231g-r4-lead-detail-function-mapping-closeout.test.cjs
- npm run build
- npm run typecheck only if package.json contains typecheck script; otherwise SKIP
- git diff --check

## TESTY RECZNE

TEST RECZNY DO WYKONANIA:
1. Open a LeadDetail page.
2. Click Brak quick action and confirm it opens shared ContextActionDialogs blocker flow.
3. Add a missing item.
4. Hard refresh.
5. Confirm it appears in Braki i blokady, not as normal Najblizsze dzialanie.
6. Create more than 5 work entries so Pozostale dzialania appears.
7. Delete a missing_item from overflow and hard refresh.
8. Confirm the missing item does not return.
9. Check medium-width viewport: title/content does not collide with status/actions.

## AUDYT PO ETAPIE

To be filled after local PASS and manual verification.

## BRAKI I RYZYKA

- actorId/ownerId in activities is not handled in this R4 and should become a separate audit stage.
- Existing dirty working tree files from 231D0D/231D0E/231D0F/231D0H must not be included in this commit.

## GIT / ZIP STATUS

LOCAL_PACKAGE_PREPARED. Commit/push only after PASS.

## 2026-06-14 R4C - red-push repair

Status: DO_TEST_AND_PUSH
Cel: naprawa po commicie 62f7917a i nieudanym R4B, gdzie R4 guard/test były czerwone.
Zmiany:
- usunięto legacy MissingItemQuickActionModal z LeadDetail,
- usunięto lokalny opener/zapis braku z LeadDetail,
- zostawiono Brak wyłącznie przez ContextActionDialogs/blocker,
- poprawiono overflow delete missing_item na handleDeleteLeadMissingItemStage228R15(entry),
- dopięto CSS work-row actions/status/content dla średnich szerokości.
## 2026-06-14 R4D - work-row one-line alignment guard

Status: LOCAL_PACKAGE_PREPARED / DO_TEST_AND_PUSH
Cel: poprawiÄ‡ zgĹ‚oszony wizualnie rozjazd wierszy w "DziaĹ‚ania leada", gdzie status i akcje miaĹ‚y nie trzymaÄ‡ jednego wiersza.
Zmiany:
- usuniÄ™to konfliktowy override `minmax(250px, auto)` dla `.lead-detail-stage228d-action-center .lead-detail-work-row`,
- wymuszono desktopowy ukĹ‚ad: ikona / treĹ›Ä‡ / status / akcje w jednym wierszu,
- akcje majÄ… `flex-wrap: nowrap` na desktopie,
- Ĺ›rednie/mobile szerokoĹ›ci majÄ… kontrolowany fallback z akcjami w kolumnie 2,
- R4 guard rozszerzony o blokadÄ™ powrotu `minmax(250px, auto)`,
- dodano R4D guard i test.
Testy wymagane:
- R3 guard/test,
- R4 guard/test,
- R4D guard/test,
- build,
- git diff --check.
Manual:
- sprawdziÄ‡ widok z 2+ akcjami w "NajbliĹĽsze dziaĹ‚ania",
- status, treĹ›Ä‡ i przyciski majÄ… byÄ‡ w jednym desktopowym wierszu,
- przy Ĺ›redniej szerokoĹ›ci brak kolizji tekstu z przyciskami.