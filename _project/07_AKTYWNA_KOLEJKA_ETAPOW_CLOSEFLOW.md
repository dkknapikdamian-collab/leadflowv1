# 07_AKTYWNA_KOLEJKA_ETAPOW_CLOSEFLOW - CloseFlow / LeadFlow

Data: 2026-06-12 21:08 Europe/Warsaw  
Status: ACTIVE_STAGE_QUEUE_INDEX  
Typ: scalony indeks etapow aplikacji, napraw i kierunku rozwoju  
Repo: dkknapikdamian-collab/leadflowv1  
Branch: dev-rollout-freeze  
Canonical name: CloseFlow / LeadFlow  
Obsidian folder: 10_PROJEKTY/CloseFlow_Lead_App

## Cel

Ten plik jest jedna scalona kolejka robocza etapow CloseFlow.

Powod: w repo byly osobne zrodla etapow:

- `_project/07_NEXT_STEPS.md` - AI Draft Inbox, pre-production backlog, AI Opportunity Finder,
- `_project/CLOSEFLOW_VISUAL_TILE_SYSTEM.md` i `_project/CLOSEFLOW_VISUAL_TILE_ATLAS.md` - kierunek kafelkow UI,
- `_project/07_REPAIR_STAGES_HIDDEN_AUDIT_FINDINGS.md` - etapy STAGE232A-F po audycie.

Decyzja Damiana z 2026-06-12: STAGE232A-F nie maja wisiec osobno. Maja byc powiazane z ta sama kolejka rozwoju aplikacji. Najpierw aplikacja, widoczne funkcje, produkcja i stabilnosc. Potem techniczne porzadki.

## Obowiazek przy kazdym etapie

Przed etapem developer czyta:

- `AGENTS.md`,
- `_project/00_PROJECT_MEMORY_PROTOCOL.md`,
- `_project/04_STAGE_AUDIT_PROTOCOL_CLOSEFLOW.md`,
- `_project/04_ZNALEZIONE_PROBLEMY_DO_ANALIZY.md`,
- ten plik,
- plik zrodlowy dla wybranego etapu.

Kazdy etap wymaga `AUDYT PRZED ETAPEM`, guard/test, `AUDYT PO ETAPIE`, run report i payload Obsidiana.

Znalezione problemy spoza zakresu etapu ida do `_project/04_ZNALEZIONE_PROBLEMY_DO_ANALIZY.md`, a nie sa naprawiane po cichu.

---

# KOLEJKA WDROZENIA

## BLOK 0 - app/product safety przed dalsza praca

1. `STAGE232A_PUBLIC_PREVIEW_ROUTES_PRODUCTION_LOCK`  
   Status: NAJBLIZSZY_ETAP.  
   Cel: zamknac publiczne preview routes w produkcji i ograniczyc fixture preview data.

2. `STAGE232B_CHUNK_BOUNDARY_RUNTIME_STABILITY`  
   Status: PO_232A.  
   Cel: sprawdzic granice ladowania duzych stron i stary problem lazy/chunk.

3. `STAGE232C_AUTH_ENV_FAIL_CLOSED`  
   Status: PO_232B albo przed AI parserem.  
   Cel: uporzadkowac produkcyjny kontrakt auth/env bez ruszania bazy.

## BLOK 1 - wizualny kierunek aplikacji / kafelki wedlug lejka

Zrodlo: `_project/CLOSEFLOW_VISUAL_TILE_SYSTEM.md` i `_project/CLOSEFLOW_VISUAL_TILE_ATLAS.md`.

4. `STAGE231D0G_WAVE1_LEADS_VISUAL_TILE_MIGRATION` - `/leads`.
5. `STAGE231D0G_WAVE1_CLIENTS_VISUAL_TILE_MIGRATION` - `/clients`.
6. `STAGE231D0G_WAVE1_CASES_VISUAL_TILE_MIGRATION` - `/cases`.
7. `STAGE231D0G_WAVE1_CASE_DETAIL_VISUAL_GUARD_OR_SAFE_MIGRATION` - `/case/:caseId`.
8. `STAGE231D0G_WAVE1_CLIENT_DETAIL_VISUAL_TILE_MIGRATION` - `/clients/:clientId`.

Zasada: `/funnel` jest wzorcem. Nie robic masowej przebudowy wszystkich stron naraz.

## BLOK 2 - AI Draft Inbox / Quick Capture / dyktowanie

Zrodlo: `_project/07_NEXT_STEPS.md`, sekcja STAGE230.

9. `STAGE230B_QUICK_CAPTURE_INBOX_BEZ_AI`.
10. `STAGE230C_PHONE_DICTATION_DUPLICATE_WORDS_AUDIT`.
11. `STAGE230D_AI_PARSER_PROPOSAL_ENDPOINT`.
12. `STAGE230E_AI_REVIEW_CARD_W_INBOXIE_SZKICOW`.
13. `STAGE230F_APPLY_ENGINE_PO_ZATWIERDZENIU`.
14. `STAGE230G_VOICE_FIRST_POLISH_MOBILE_UX`.
15. `STAGE230H_AI_EVAL_PACK`.

Zasada: raw draft ma byc zapisany przed AI, a AI nie wykonuje akcji bez zatwierdzenia.

## BLOK 3 - pre-production core backlog

Zrodlo: `_project/07_NEXT_STEPS.md`, sekcja STAGE230A3.

16. `STAGE231A_DOCUMENTS_FOR_LEADS`.
17. `STAGE231B_COSTS_AND_FINANCIAL_ITEMS`.
18. `STAGE231C_SIMPLIFY_TASK_EVENT_EDITING`.
19. `STAGE231D_START_SCREEN_PRODUCTION_READINESS`.

## BLOK 4 - wave 2 visual / operational surfaces

Zrodlo: `_project/CLOSEFLOW_VISUAL_TILE_ATLAS.md`.

20. `STAGE231D0G_WAVE2_TODAY_VISUAL_TILE_MIGRATION` - `/today`.
21. `STAGE231D0G_WAVE2_TASKS_VISUAL_TILE_MIGRATION` - `/tasks`.
22. `STAGE231D0G_WAVE2_CALENDAR_VISUAL_TILE_MIGRATION` - `/calendar`.
23. `STAGE231D0G_WAVE2_BILLING_VISUAL_TILE_MIGRATION` - `/billing`.
24. `STAGE231D0G_WAVE2_ACTIVITY_VISUAL_TILE_MIGRATION` - `/activity`.
25. `STAGE231D0G_WAVE2_NOTIFICATIONS_VISUAL_TILE_MIGRATION` - `/notifications`.

## BLOK 5 - wave 3 support/settings/templates

26. `STAGE231D0G_WAVE3_TEMPLATES_VISUAL_TILE_MIGRATION` - `/templates`.
27. `STAGE231D0G_WAVE3_RESPONSE_TEMPLATES_VISUAL_TILE_MIGRATION` - `/response-templates`.
28. `STAGE231D0G_WAVE3_SETTINGS_VISUAL_TILE_MIGRATION` - `/settings`.
29. `STAGE231D0G_WAVE3_SETTINGS_AI_VISUAL_TILE_MIGRATION` - `/settings/ai`.
30. `STAGE231D0G_WAVE3_SUPPORT_VISUAL_TILE_MIGRATION` - `/support`.

## BLOK 6 - technical/docs hygiene po app core

Zrodlo: `_project/07_REPAIR_STAGES_HIDDEN_AUDIT_FINDINGS.md`.

31. `STAGE232D_DOCS_ENCODING_SWEEP`.
32. `STAGE232E_POLISH_MOJIBAKE_GUARD_SCOPE`.
33. `STAGE232F_GUARD_RUNNER_CROSS_PLATFORM_CLEANUP`.

## BLOK 7 - pozniejszy growth / pre-CRM

Zrodlo: `_project/07_NEXT_STEPS.md`, AI Opportunity Finder.

34. `STAGE240A_SMART_SEARCH_INPUT_AND_MANUAL_IMPORT`.
35. `STAGE240B_OPPORTUNITY_REASON_SCHEMA`.
36. `STAGE240C_AI_SCORING_AND_PRIORITY`.
37. `STAGE240D_CREATE_LEADS_WITH_REASON_AND_FOLLOWUP`.
38. `STAGE240E_MONTHLY_OPPORTUNITY_MONITORING`.

---

# Najblizszy etap

Najblizszy etap: `STAGE232A_PUBLIC_PREVIEW_ROUTES_PRODUCTION_LOCK`.

Powod: maly, waski, produkcyjnie wazny i nie koliduje z kierunkiem aplikacji.

Nastepny po nim: `STAGE232B_CHUNK_BOUNDARY_RUNTIME_STABILITY`.

Po 232B Damian decyduje:

- jesli priorytetem jest techniczne zamkniecie app safety: robimy `STAGE232C_AUTH_ENV_FAIL_CLOSED`,
- jesli priorytetem jest widoczna aplikacja: wchodzimy w `STAGE231D0G_WAVE1_LEADS_VISUAL_TILE_MIGRATION`.
