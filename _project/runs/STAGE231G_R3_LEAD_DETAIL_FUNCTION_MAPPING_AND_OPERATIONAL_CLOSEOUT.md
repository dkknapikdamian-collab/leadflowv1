# STAGE231G_R3_LEAD_DETAIL_FUNCTION_MAPPING_AND_OPERATIONAL_CLOSEOUT

Data: 2026-06-14 10:48 Europe/Warsaw  
Status: DO TESTU LOKALNEGO / PO WDROZENIU PATCHA  
Repo: dkknapikdamian-collab/leadflowv1  
Branch: dev-rollout-freeze  
Obsidian folder: 10_PROJEKTY/CloseFlow_Lead_App

## SCAN REPORT

Repo files read / wymagane:
- AGENTS.md
- _project/00_PROJECT_MEMORY_PROTOCOL.md
- _project/04_STAGE_AUDIT_PROTOCOL_CLOSEFLOW.md
- _project/04_ZNALEZIONE_PROBLEMY_DO_ANALIZY.md
- _project/04_KIERUNEK_ROZWOJU_APLIKACJI.md
- _project/04_ETAPY_ROZWOJU_APLIKACJI.md
- _project/06_GUARDS_AND_TESTS.md
- _project/13_TEST_HISTORY.md
- src/pages/LeadDetail.tsx
- src/styles/visual-stage14-lead-detail-vnext.css

Obsidian/project-memory files read:
- GitHub/_project copy used.
- Lokalny Obsidian: DO_SYNCHRONIZACJI przez payload.

## AUDYT PRZED ETAPEM â€” MAPA FUNKCJI

| Element UI | ĹąrĂłdĹ‚o danych | Handler / funkcja | Zapis | Refetch/local update | Status |
|---|---|---|---|---|---|
| NastÄ™pny krok | linkedTasks/linkedEvents -> timeline | openLinkedTaskEditor/openLinkedEventEditor albo handleCreateQuickTask | task/event | loadLead silent | OK |
| PotencjaĹ‚ | leadFinance/getLeadFinance | handleStartPotentialEditingStage231G/handleSavePotentialStage231GR7 | updateLeadInSupabase dealValue | setLead + loadLead silent | POPRAWIONE |
| Cisza / ryzyko | activityTruth + nextMove + risk settings | handleCreateQuickTask / handleUpdateStatus(contacted) | task/status | context event / loadLead | OK |
| Blokada | leadBlockerEntries | handleResolveLeadMissingItemStage228R13 / handleDeleteLeadMissingItemStage228R15 / openLeadContextAction(blocker) | task missing_item | loadLead silent | OK |
| Dane leada | lead | handleUpdateLead | updateLeadInSupabase | loadLead | OK |
| Kopiuj telefon/e-mail | lead.phone/email | copyValue | clipboard | brak potrzeby refetch | OK |
| Historia aktywnoĹ›ci | activities | addActivity/edit/delete note | activities | fetchActivities/loadLead | RYZYKO: actorId null |
| NajbliĹĽsze dziaĹ‚ania | activeLeadWorkEntries bez missing_item | task/event handlers | task/event | loadLead silent | POPRAWIONE/STRZEĹ»ONE |
| Braki i blokady | missing_item from linkedTasks | resolve/delete missing | update/hardDelete task | loadLead silent | OK |
| Wszystkie aktywne | activeLeadWorkEntries | task/event/missing handlers | task/event | loadLead silent | OK |
| Notatki | activities note | add/edit/delete note | activities | loadLead | OK |
| Szybkie akcje | QuickActionsBar | note/task/event/blocker/lost/service | real modal/write | loadLead/context event | OK |
| Finanse leada | leadFinance + leadPayments | edit potential/payment dialogs | lead/payment/activity | loadLead | OK |

## ZMIANY W PATCHU

- poprawiono parser potencjaĹ‚u z /s+/g na /\\s+/g,
- dodano jawny marker lead-detail-work-row__icon,
- dodano CSS zabezpieczajÄ…cy content/status/actions przed zlewaniem,
- dodano warunkowe usuwanie missing_item przez handleDeleteLeadMissingItemStage228R15 w overflow,
- stary opener lokalnego braku przekierowany do kanonicznej Ĺ›cieĹĽki ContextActionDialogs/blocker,
- dodano guard i test statyczny etapu.

## TESTY AUTOMATYCZNE

Do uruchomienia lokalnie po apply:

`powershell
npm run build
npm run typecheck
node scripts/check-stage231g-r3-lead-detail-function-mapping.cjs
node --test tests/stage231g-r3-lead-detail-function-mapping.test.cjs
git diff --check
`

## TESTY RECZNE DLA DAMIANA

1. Lead z potencjaĹ‚em 0 -> ustaw 12000 -> refresh -> zostaje.
2. Dodaj zadanie -> refresh -> zostaje.
3. Klik Jutro -> refresh -> termin zmieniony.
4. Klik Zrobione -> refresh -> status zostaje.
5. Dodaj wydarzenie -> refresh -> zostaje.
6. Dodaj brak -> brak jest w Braki/Blokada, nie w NajbliĹĽsze dziaĹ‚ania.
7. RozwiÄ…ĹĽ brak -> refresh -> nie wraca.
8. Dodaj drugi brak -> UsuĹ„ brak -> refresh -> nie wraca.
9. Dodaj zaliczkÄ™ 2000 -> finanse przeliczone.
10. Dodaj notatkÄ™ -> refresh -> zostaje.
11. Oznacz utracony -> status zostaje.
12. Rozpocznij obsĹ‚ugÄ™ -> powstaje/otwiera siÄ™ sprawa.

## AUDYT PO ETAPIE

- co mogĹ‚o siÄ™ zepsuÄ‡: parser kwoty, usuwanie brakĂłw w overflow, ukĹ‚ad dĹ‚ugich wierszy dziaĹ‚aĹ„.
- co sprawdzono obok: quick actions, top cards, finance panel, missing_item hard delete path.
- podobne miejsca: CaseDetail/ClientDetail nie ruszane.
- nowe problemy wykryte: actorId/ownerId aktywnoĹ›ci pozostajÄ… ryzykiem osobnego etapu.
- problemy Ĺ›wiadomie nie ruszone: Google Calendar, billing/trial, SQL, CaseDetail, ClientDetail, AI Drafts.
- guard/test dowodzÄ…cy: scripts/check-stage231g-r3-lead-detail-function-mapping.cjs oraz tests/stage231g-r3-lead-detail-function-mapping.test.cjs.
- manual test dla Damiana: 12 krokĂłw powyĹĽej.
- wpĹ‚yw na Obsidian/_project: payload przygotowany.
- nastÄ™pny najlepszy krok: wykonaÄ‡ lokalny manual test i dopiero wtedy selektywny commit/push.

## GIT / ZIP STATUS

- tryb: ZIP/local apply
- status: patch przygotowany do lokalnego apply
- SQL: nie ruszano