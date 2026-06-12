# 07_AKTYWNA_KOLEJKA_ETAPOW_CLOSEFLOW - CloseFlow / LeadFlow

Data: 2026-06-12 22:10 Europe/Warsaw  
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
- `_project/07_REPAIR_STAGES_HIDDEN_AUDIT_FINDINGS.md` - etapy STAGE232A-F po audycie,
- Google Calendar, daily digest, weekly report i mobile UX byly rozproszone po kodzie i starszych etapach.

Decyzja Damiana z 2026-06-12: STAGE232A-F nie maja wisiec osobno. Wszystkie aktywne i odnalezione etapy maja byc powiazane z ta sama kolejka rozwoju aplikacji. Najpierw aplikacja, realni uzytkownicy, konta nieadminowskie, produkcja i stabilnosc. Potem techniczne porzadki.

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

## BLOK 0 - konta nieadminowskie, dostep i synchronizacje

Te etapy maja pierwszenstwo przed kosmetyka, bo sprawdzaja czy aplikacja dziala nie tylko na koncie Damiana.

1. `STAGE231E_NON_ADMIN_ACCOUNT_FEATURE_ACCESS_AUDIT`  
   Status: WDROZONE_MAPA_I_GUARD_DO_LOKALNEGO_PASS.  
   Cel: sprawdzic wszystkie opcje przewidziane dla zwyklych uzytkownikow i czlonkow workspace.  
   Zakres: Google Calendar, digest, weekly report, powiadomienia, ustawienia, AI/drafts, kalendarz, zadania, leady, klienci, sprawy.  
   Warunek: powstala mapa dostepu: `_project/07_STAGE231E_NON_ADMIN_FEATURE_ACCESS_MATRIX.md`; guard: `scripts/check-stage231e-non-admin-feature-access-map.cjs`; run report: `_project/runs/2026-06-12_STAGE231E_NON_ADMIN_ACCOUNT_FEATURE_ACCESS_AUDIT.md`.

2. `STAGE231F_GOOGLE_CALENDAR_MULTI_USER_SYNC_AUDIT_AND_FIX`  
   Status: NAJBLIZSZY_ETAP_PO_STAGE231E.  
   Cel: zweryfikowac i naprawic problem Google Calendar na kontach innych niz konto Damiana.  
   Zakres: status, connect, disconnect, sync-inbound, sync-outbound, workspace, user, plan gate, test zwyklego uzytkownika.  
   Warunek: zwykly uprawniony uzytkownik ma jasny wynik: synchronizacja dziala albo widzi poprawny komunikat braku uprawnien. Nie moze byc cichego braku synchronizacji.

3. `STAGE231G_DAILY_DIGEST_AND_WEEKLY_REPORT_ACCESS_DELIVERY_AUDIT`  
   Status: DO_WDROZENIA_PO_231F_LUB_RAZEM_Z_ACCOUNT_SCOPE_JESLI_DOTYCZY.  
   Cel: uporzadkowac poranny digest i raport tygodniowy jako realne funkcje workspace, a nie rozproszony backend bez jasnego miejsca w kolejce.  
   Zakres: widocznosc UI, plan gate, harmonogram, odbiorca workspace, test wysylki, diagnostyka, log wysylki, konta nieadminowskie.  
   Warunek: wiadomo czy funkcja jest aktywna, ukryta, admin-only, plan-only albo odlozona. Jesli ma dzialac, musi miec test zwyklego uzytkownika i guard.

4. `STAGE231H_MOBILE_READABILITY_APP_WIDE_AUDIT_AND_FIX`  
   Status: DO_DODANIA_DO_WIDOCZNEJ_APLIKACJI_PRZED_MASOWA_FALA_UI.  
   Cel: sprawdzic i poprawic czytelnosc aplikacji na telefonie, nie tylko dyktowanie.  
   Zakres: kontrast, male fonty, overflow, przyciski, karty, sidebar/header, tabele/listy, formularze, modale, Today, Leads, Clients, Cases, Calendar, Settings, Notifications.  
   Warunek: checklist/guard mobilnego viewportu i test na telefonie.

## BLOK 1 - app/product safety przed dalsza praca

5. `STAGE232A_PUBLIC_PREVIEW_ROUTES_PRODUCTION_LOCK`  
   Status: WDROZONE_WASKI_FIX_DO_LOKALNEGO_PASS.  
   Cel: zamknac publiczne preview routes w produkcji i ograniczyc fixture preview data.

6. `STAGE232B_CHUNK_BOUNDARY_RUNTIME_STABILITY`  
   Status: PO_232A.  
   Cel: sprawdzic granice ladowania duzych stron i stary problem lazy/chunk.

7. `STAGE232C_AUTH_ENV_FAIL_CLOSED`  
   Status: PO_232B albo przed AI parserem.  
   Cel: uporzadkowac produkcyjny kontrakt auth/env bez ruszania bazy.

## BLOK 2 - wizualny kierunek aplikacji / kafelki wedlug lejka

Zrodlo: `_project/CLOSEFLOW_VISUAL_TILE_SYSTEM.md` i `_project/CLOSEFLOW_VISUAL_TILE_ATLAS.md`.

8. `STAGE231D0G_WAVE1_LEADS_VISUAL_TILE_MIGRATION` - `/leads`.
9. `STAGE231D0G_WAVE1_CLIENTS_VISUAL_TILE_MIGRATION` - `/clients`.
10. `STAGE231D0G_WAVE1_CASES_VISUAL_TILE_MIGRATION` - `/cases`.
11. `STAGE231D0G_WAVE1_CASE_DETAIL_VISUAL_GUARD_OR_SAFE_MIGRATION` - `/case/:caseId`.
12. `STAGE231D0G_WAVE1_CLIENT_DETAIL_VISUAL_TILE_MIGRATION` - `/clients/:clientId`.

Zasada: `/funnel` jest wzorcem. Nie robic masowej przebudowy wszystkich stron naraz.

## BLOK 3 - AI Draft Inbox / Quick Capture / dyktowanie

Zrodlo: `_project/07_NEXT_STEPS.md`, sekcja STAGE230.

13. `STAGE230B_QUICK_CAPTURE_INBOX_BEZ_AI`.
14. `STAGE230C_PHONE_DICTATION_DUPLICATE_WORDS_AUDIT`.
15. `STAGE230D_AI_PARSER_PROPOSAL_ENDPOINT`.
16. `STAGE230E_AI_REVIEW_CARD_W_INBOXIE_SZKICOW`.
17. `STAGE230F_APPLY_ENGINE_PO_ZATWIERDZENIU`.
18. `STAGE230G_VOICE_FIRST_POLISH_MOBILE_UX`.
19. `STAGE230H_AI_EVAL_PACK`.

Zasada: raw draft ma byc zapisany przed AI, a AI nie wykonuje akcji bez zatwierdzenia. STAGE230G dotyczy voice-first/mobile quick capture; nie zastepuje app-wide mobile readability z STAGE231H.

## BLOK 4 - pre-production core backlog

Zrodlo: `_project/07_NEXT_STEPS.md`, sekcja STAGE230A3.

20. `STAGE231A_DOCUMENTS_FOR_LEADS`.
21. `STAGE231B_COSTS_AND_FINANCIAL_ITEMS`.
22. `STAGE231C_SIMPLIFY_TASK_EVENT_EDITING`.
23. `STAGE231D_START_SCREEN_PRODUCTION_READINESS`.

## BLOK 5 - wave 2 visual / operational surfaces

Zrodlo: `_project/CLOSEFLOW_VISUAL_TILE_ATLAS.md`.

24. `STAGE231D0G_WAVE2_TODAY_VISUAL_TILE_MIGRATION` - `/today`.
25. `STAGE231D0G_WAVE2_TASKS_VISUAL_TILE_MIGRATION` - `/tasks`.
26. `STAGE231D0G_WAVE2_CALENDAR_VISUAL_TILE_MIGRATION` - `/calendar`.
27. `STAGE231D0G_WAVE2_BILLING_VISUAL_TILE_MIGRATION` - `/billing`.
28. `STAGE231D0G_WAVE2_ACTIVITY_VISUAL_TILE_MIGRATION` - `/activity`.
29. `STAGE231D0G_WAVE2_NOTIFICATIONS_VISUAL_TILE_MIGRATION` - `/notifications`.

## BLOK 6 - wave 3 support/settings/templates

30. `STAGE231D0G_WAVE3_TEMPLATES_VISUAL_TILE_MIGRATION` - `/templates`.
31. `STAGE231D0G_WAVE3_RESPONSE_TEMPLATES_VISUAL_TILE_MIGRATION` - `/response-templates`.
32. `STAGE231D0G_WAVE3_SETTINGS_VISUAL_TILE_MIGRATION` - `/settings`.
33. `STAGE231D0G_WAVE3_SETTINGS_AI_VISUAL_TILE_MIGRATION` - `/settings/ai`.
34. `STAGE231D0G_WAVE3_SUPPORT_VISUAL_TILE_MIGRATION` - `/support`.

## BLOK 7 - technical/docs hygiene po app core

Zrodlo: `_project/07_REPAIR_STAGES_HIDDEN_AUDIT_FINDINGS.md`.

35. `STAGE232D_DOCS_ENCODING_SWEEP`.
36. `STAGE232E_POLISH_MOJIBAKE_GUARD_SCOPE`.
37. `STAGE232F_GUARD_RUNNER_CROSS_PLATFORM_CLEANUP`.

## BLOK 8 - pozniejszy growth / pre-CRM

Zrodlo: `_project/07_NEXT_STEPS.md`, AI Opportunity Finder.

38. `STAGE240A_SMART_SEARCH_INPUT_AND_MANUAL_IMPORT`.
39. `STAGE240B_OPPORTUNITY_REASON_SCHEMA`.
40. `STAGE240C_AI_SCORING_AND_PRIORITY`.
41. `STAGE240D_CREATE_LEADS_WITH_REASON_AND_FOLLOWUP`.
42. `STAGE240E_MONTHLY_OPPORTUNITY_MONITORING`.

---

# Najblizszy etap

Najblizszy etap po STAGE231E 2026-06-12: `STAGE231F_GOOGLE_CALENDAR_MULTI_USER_SYNC_AUDIT_AND_FIX`.

Powod: STAGE231E potwierdzil, ze Google Calendar ma frontowy gate przez `isAdmin || isAppOwner || access.features.googleCalendar` oraz requesty z workspace/user headers, ale realny multi-user/token/backend contract wymaga osobnego testu i naprawy.

Nastepny po nim: `STAGE231G_DAILY_DIGEST_AND_WEEKLY_REPORT_ACCESS_DELIVERY_AUDIT` albo `STAGE231H_MOBILE_READABILITY_APP_WIDE_AUDIT_AND_FIX` wedlug decyzji Damiana po wyniku 231F.

Po 231F Damian decyduje:

- jesli wysylka maili/digestow ma byc aktywna produkcyjnie: robimy `STAGE231G_DAILY_DIGEST_AND_WEEKLY_REPORT_ACCESS_DELIVERY_AUDIT`,
- jesli priorytetem jest UI na telefonie: robimy `STAGE231H_MOBILE_READABILITY_APP_WIDE_AUDIT_AND_FIX`,
- dopiero potem wracamy do `STAGE232B_CHUNK_BOUNDARY_RUNTIME_STABILITY` albo do fal wizualnych.
