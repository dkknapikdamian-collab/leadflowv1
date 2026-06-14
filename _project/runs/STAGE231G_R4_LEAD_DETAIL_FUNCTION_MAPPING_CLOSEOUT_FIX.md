# STAGE231G_R4_LEAD_DETAIL_FUNCTION_MAPPING_CLOSEOUT_FIX

Data: 2026-06-14 11:45 Europe/Warsaw
Status: LOCAL_PACKAGE_PREPARED / DO_TEST_AND_PUSH
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
