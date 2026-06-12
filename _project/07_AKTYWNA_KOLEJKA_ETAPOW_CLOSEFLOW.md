# 07_AKTYWNA_KOLEJKA_ETAPOW_CLOSEFLOW - CloseFlow / LeadFlow

Data: 2026-06-12 22:25 Europe/Warsaw  
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
- Google Calendar, daily digest, weekly report i mobile UX byly rozproszone po kodzie i starszych etapach,
- domena, maile, szkice, AI, platnosci i rozliczenia byly obecne jako wymagania/fragmenty kodu, ale nie byly spiete w jednej kolejce.

Decyzja Damiana z 2026-06-12: STAGE232A-F nie maja wisiec osobno. Wszystkie aktywne i odnalezione etapy maja byc powiazane z ta sama kolejka rozwoju aplikacji. Najpierw aplikacja, realni uzytkownicy, konta nieadminowskie, plany, produkcja i stabilnosc. Potem techniczne porzadki.

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

## BLOK 0 - konta, plany, dostep i synchronizacje

Te etapy maja pierwszenstwo przed kosmetyka, bo sprawdzaja czy aplikacja dziala nie tylko na koncie Damiana i czy sprzedawane plany zgadzaja sie z realnym dostepem.

1. `STAGE231E_NON_ADMIN_ACCOUNT_FEATURE_ACCESS_AUDIT`  
   Status: NAJBLIZSZY_ETAP_PO_DEEP_SCAN.  
   Cel: sprawdzic wszystkie opcje przewidziane dla zwyklych uzytkownikow i czlonkow workspace.  
   Zakres: Google Calendar, digest, weekly report, powiadomienia, ustawienia, AI/drafts, kalendarz, zadania, leady, klienci, sprawy.  
   Warunek: powstaje mapa dostepu: admin-only / owner-only / plan-feature / workspace-member / hidden / dev-only.

2. `STAGE231E2_PLAN_ENTITLEMENT_MATRIX_AND_OFFER_AUDIT`  
   Status: OBOWIAZKOWE_PO_231E_PRZED_NAPRAWAMI_PLANOWANYCH_FUNKCJI.  
   Cel: sprawdzic, ktore funkcje i limity naleza do planow Free / Basic / Pro / AI / Trial i czy zgadza sie to z UI, backendem, oferta, cennikiem, komunikatami oraz realnym dostepem.  
   Zakres: `src/lib/plans.ts`, `src/lib/access.ts`, `useWorkspace`, Billing, Settings, Google Calendar, daily digest, weekly report, CSV import, recurring reminders, browser notifications, AI/drafts, limity leadow/zadan/eventow/draftow i limity AI.  
   Warunek: powstaje plan entitlement matrix z werdyktem dla kazdej funkcji: OK / ZA_DUZO_DANE_W_PLANIE / ZABLOKOWANE_MIMO_PLANU / BRAK_OFERTY / BRAK_BACKEND_GUARD / DO_DECYZJI_DAMIANA.

3. `STAGE231F_GOOGLE_CALENDAR_MULTI_USER_SYNC_AUDIT_AND_FIX`  
   Status: PILNE_PO_231E_I_231E2_ALBO_OD_RAZU_JESLI_SYNC_BLOKUJE_TESTY.  
   Cel: zweryfikowac i naprawic problem Google Calendar na kontach innych niz konto Damiana.  
   Zakres: status, connect, disconnect, sync-inbound, sync-outbound, workspace, user, plan gate, test zwyklego uzytkownika.  
   Warunek: zwykly uprawniony uzytkownik ma jasny wynik: synchronizacja dziala albo widzi poprawny komunikat braku uprawnien. Nie moze byc cichego braku synchronizacji.

4. `STAGE231G_DAILY_DIGEST_AND_WEEKLY_REPORT_ACCESS_DELIVERY_AUDIT`  
   Status: DO_WDROZENIA_PO_231F_LUB_RAZEM_Z_ACCOUNT_SCOPE_JESLI_DOTYCZY.  
   Cel: uporzadkowac poranny digest i raport tygodniowy jako realne funkcje workspace, a nie rozproszony backend bez jasnego miejsca w kolejce.  
   Zakres: widocznosc UI, plan gate, harmonogram, odbiorca workspace, test wysylki, diagnostyka, log wysylki, konta nieadminowskie.  
   Warunek: wiadomo czy funkcja jest aktywna, ukryta, admin-only, plan-only albo odlozona. Jesli ma dzialac, musi miec test zwyklego uzytkownika i guard.

5. `STAGE231G2_DAILY_DIGEST_PRODUCT_SCOPE_AND_COPY`  
   Status: PRZED_WLACZENIEM_DIGESTU_U_UZYTKOWNIKOW.  
   Cel: zdecydowac, co dokladnie ma zawierac poranny digest i czego nie wolno mu obiecywac.  
   Zakres: dzisiejsze zadania, zalegle zadania, wydarzenia, leady bez ruchu, follow-upy, ryzyka, nowe szkice, linki do akcji, odbiorca, godzina, strefa, plan, unsubscribe/disable, brak wysylki pustych maili.  
   Warunek: powstaje kontrakt tresci digestu, test danych pustych/pelnych i reczny preview.

6. `STAGE231G3_WEEKLY_REPORT_PRODUCT_SCOPE_AND_COPY`  
   Status: PRZED_WLACZENIEM_RAPORTU_TYGODNIOWEGO.  
   Cel: zdecydowac, co dokladnie ma zawierac raport tygodniowy i czy jest raportem wlasciciela, managera czy zwyklego uzytkownika.  
   Zakres: nowe leady, utracone leady, follow-up discipline, sprawy, zadania, platnosci/rozliczenia, ryzyka, ranking najwazniejszych akcji, brak obietnic AI bez dzialajacego AI.  
   Warunek: powstaje kontrakt tresci raportu, preview i guard, ze raport nie wysyla pustych albo mylacych danych.

7. `STAGE231H_MOBILE_READABILITY_APP_WIDE_AUDIT_AND_FIX`  
   Status: DO_DODANIA_DO_WIDOCZNEJ_APLIKACJI_PRZED_MASOWA_FALA_UI.  
   Cel: sprawdzic i poprawic czytelnosc aplikacji na telefonie, nie tylko dyktowanie.  
   Zakres: kontrast, male fonty, overflow, przyciski, karty, sidebar/header, tabele/listy, formularze, modale, Today, Leads, Clients, Cases, Calendar, Settings, Notifications.  
   Warunek: checklist/guard mobilnego viewportu i test na telefonie.

## BLOK 1 - produkcyjna konfiguracja: domena, maile, wysylka i AI

Te etapy sa konieczne przed pokazaniem aplikacji szerzej. Nie sa kosmetyka. Bez nich aplikacja moze wygladac gotowo, ale nie bedzie produkcyjnie domknieta.

8. `STAGE231I_PRODUCTION_DOMAIN_AND_MAILBOX_SETUP_PLAN`  
   Status: PRE_PRODUCTION_REQUIRED.  
   Cel: zaplanowac i przygotowac produkcyjna domene, adresy mailowe i zasady nadawcow/odbiorcow.  
   Zakres: domena aplikacji, DNS, skrzynka kontaktowa, skrzynka support, adres nadawczy systemowy, reply-to, no-reply, SPF/DKIM/DMARC, lista env do Vercel, test dostarczalnosci i zasada gdzie uzytkownik moze odpisac.  
   Warunek: powstaje checklist domeny i maila, bez wpisywania sekretow do repo.

9. `STAGE231J_TRANSACTIONAL_EMAILS_AND_NON_SENDING_EMAILS_CONTRACT`  
   Status: PRE_PRODUCTION_REQUIRED.  
   Cel: rozdzielic maile wysylkowe od niewysylkowych/placeholderow i ustalic, ktore funkcje realnie wysylaja maila.  
   Zakres: digest, weekly report, potwierdzenia, powiadomienia, test send, no-reply, support reply, log wysylek, retry, blad dostawcy, maile w dev/staging/production.  
   Warunek: matrix maili: wysyla / nie wysyla / preview-only / owner-only / wymaga wlaczenia.

10. `STAGE231K_AI_DRAFT_SEND_AND_APPROVAL_FLOW_REPAIR`  
    Status: PILNE_PRZED_UZYWANIEM_SZKICOW_PRODUKCYJNIE.  
    Cel: naprawic przeplyw szkicow, ktore obecnie nie wysylaja albo nie maja jasnej granicy miedzy szkicem, zatwierdzeniem i wysylka.  
    Zakres: AI Draft Inbox, Templates, draft status, approve/send, provider mail, brak auto-send bez zgody, log akcji, bledy wysylki, test zwyklego uzytkownika i ownera.  
    Warunek: szkic nie znika, nie wysyla sie bez zatwierdzenia, a po zatwierdzeniu ma jasny status: sent / failed / pending / preview-only.

11. `STAGE231L_AI_RUNTIME_PROVIDER_AND_FEATURE_REPAIR`  
    Status: PILNE_PRZED_OBIETNICA_PLANU_AI.  
    Cel: sprawdzic i naprawic AI, ktore obecnie nie dziala albo nie ma pewnego provider/env/model flow.  
    Zakres: AI settings, provider/env, parser, draft generation, eval pack, plan AI, fallback lokalny/regulowy, komunikaty gdy AI nieaktywne, brak udawania pelnego AI.  
    Warunek: AI ma jasny status: dziala / dziala lokalnie / wylaczone / wymaga konfiguracji. UI i billing mowia to samo.

## BLOK 2 - app/product safety przed dalsza praca

12. `STAGE232A_PUBLIC_PREVIEW_ROUTES_PRODUCTION_LOCK`  
    Status: PO_BLOKU_0_ALBO_WASKI_FIX_JESLI_DAMIAN_CHCE_NATYCHMIAST.  
    Cel: zamknac publiczne preview routes w produkcji i ograniczyc fixture preview data.

13. `STAGE232B_CHUNK_BOUNDARY_RUNTIME_STABILITY`  
    Status: PO_232A.  
    Cel: sprawdzic granice ladowania duzych stron i stary problem lazy/chunk.

14. `STAGE232C_AUTH_ENV_FAIL_CLOSED`  
    Status: PO_232B albo przed AI parserem.  
    Cel: uporzadkowac produkcyjny kontrakt auth/env bez ruszania bazy.

## BLOK 3 - platnosci, rozliczenia i start screen przed produkcja

15. `STAGE231M_BILLING_PAYMENTS_SETTLEMENTS_AND_PLAN_DISPLAY_AUDIT`  
    Status: PRE_PRODUCTION_REQUIRED.  
    Cel: zrobic szczegolowy audyt platnosci, statusow dostepu, wpisow platnosci, rozliczen i tego, co widzi uzytkownik po prawej stronie startowej/billingowej.  
    Zakres: Billing, plan cards, checkout, status platnosci, webhook confirmation copy, payments list, settlements tab, right rail, next payment, cancel/resume, brak Stripe/BLIK mylacego copy, zgodnosc z planami i faktycznym backendem.  
    Warunek: matrix platnosci i rozliczen ma werdykt dla kazdego statusu: pokazuje poprawnie / myli / wymaga konfiguracji / blokuje / do poprawy.

16. `STAGE231M2_START_SCREEN_RIGHT_RAIL_PAYMENTS_AND_ENTRIES_AUDIT`  
    Status: PRZEDPRODUKCYJNY_UI_AUDIT.  
    Cel: sprawdzic prawa strone startowa / dashboard / billing rail pod katem platnosci, wpisow, statusow, pustych stanow i czy uzytkownik rozumie co ma zrobic.  
    Zakres: Dashboard/Today/Billing right rail, wpisy platnosci, status dostepu, nastepna platnosc, komunikaty trial/free/paid/failed/canceled, CTA i brak dublowania informacji.  
    Warunek: prawa strona nie obiecuje funkcji, ktore nie dzialaja, i nie ukrywa problemow platnosci.

## BLOK 4 - wizualny kierunek aplikacji / kafelki wedlug lejka

Zrodlo: `_project/CLOSEFLOW_VISUAL_TILE_SYSTEM.md` i `_project/CLOSEFLOW_VISUAL_TILE_ATLAS.md`.

17. `STAGE231D0G_WAVE1_LEADS_VISUAL_TILE_MIGRATION` - `/leads`.
18. `STAGE231D0G_WAVE1_CLIENTS_VISUAL_TILE_MIGRATION` - `/clients`.
19. `STAGE231D0G_WAVE1_CASES_VISUAL_TILE_MIGRATION` - `/cases`.
20. `STAGE231D0G_WAVE1_CASE_DETAIL_VISUAL_GUARD_OR_SAFE_MIGRATION` - `/case/:caseId`.
21. `STAGE231D0G_WAVE1_CLIENT_DETAIL_VISUAL_TILE_MIGRATION` - `/clients/:clientId`.

Zasada: `/funnel` jest wzorcem. Nie robic masowej przebudowy wszystkich stron naraz.

## BLOK 5 - AI Draft Inbox / Quick Capture / dyktowanie

Zrodlo: `_project/07_NEXT_STEPS.md`, sekcja STAGE230.

22. `STAGE230B_QUICK_CAPTURE_INBOX_BEZ_AI`.
23. `STAGE230C_PHONE_DICTATION_DUPLICATE_WORDS_AUDIT`.
24. `STAGE230D_AI_PARSER_PROPOSAL_ENDPOINT`.
25. `STAGE230E_AI_REVIEW_CARD_W_INBOXIE_SZKICOW`.
26. `STAGE230F_APPLY_ENGINE_PO_ZATWIERDZENIU`.
27. `STAGE230G_VOICE_FIRST_POLISH_MOBILE_UX`.
28. `STAGE230H_AI_EVAL_PACK`.

Zasada: raw draft ma byc zapisany przed AI, a AI nie wykonuje akcji bez zatwierdzenia. STAGE230G dotyczy voice-first/mobile quick capture; nie zastepuje app-wide mobile readability z STAGE231H. Naprawa wysylki szkicow jest teraz osobnym etapem STAGE231K, bo dotyczy produkcyjnego approval/send flow.

## BLOK 6 - pre-production core backlog

Zrodlo: `_project/07_NEXT_STEPS.md`, sekcja STAGE230A3.

29. `STAGE231A_DOCUMENTS_FOR_LEADS`.
30. `STAGE231B_COSTS_AND_FINANCIAL_ITEMS`.
31. `STAGE231C_SIMPLIFY_TASK_EVENT_EDITING`.
32. `STAGE231D_START_SCREEN_PRODUCTION_READINESS`.

## BLOK 7 - wave 2 visual / operational surfaces

Zrodlo: `_project/CLOSEFLOW_VISUAL_TILE_ATLAS.md`.

33. `STAGE231D0G_WAVE2_TODAY_VISUAL_TILE_MIGRATION` - `/today`.
34. `STAGE231D0G_WAVE2_TASKS_VISUAL_TILE_MIGRATION` - `/tasks`.
35. `STAGE231D0G_WAVE2_CALENDAR_VISUAL_TILE_MIGRATION` - `/calendar`.
36. `STAGE231D0G_WAVE2_BILLING_VISUAL_TILE_MIGRATION` - `/billing`.
37. `STAGE231D0G_WAVE2_ACTIVITY_VISUAL_TILE_MIGRATION` - `/activity`.
38. `STAGE231D0G_WAVE2_NOTIFICATIONS_VISUAL_TILE_MIGRATION` - `/notifications`.

## BLOK 8 - wave 3 support/settings/templates

39. `STAGE231D0G_WAVE3_TEMPLATES_VISUAL_TILE_MIGRATION` - `/templates`.
40. `STAGE231D0G_WAVE3_RESPONSE_TEMPLATES_VISUAL_TILE_MIGRATION` - `/response-templates`.
41. `STAGE231D0G_WAVE3_SETTINGS_VISUAL_TILE_MIGRATION` - `/settings`.
42. `STAGE231D0G_WAVE3_SETTINGS_AI_VISUAL_TILE_MIGRATION` - `/settings/ai`.
43. `STAGE231D0G_WAVE3_SUPPORT_VISUAL_TILE_MIGRATION` - `/support`.

## BLOK 9 - technical/docs hygiene po app core

Zrodlo: `_project/07_REPAIR_STAGES_HIDDEN_AUDIT_FINDINGS.md`.

44. `STAGE232D_DOCS_ENCODING_SWEEP`.
45. `STAGE232E_POLISH_MOJIBAKE_GUARD_SCOPE`.
46. `STAGE232F_GUARD_RUNNER_CROSS_PLATFORM_CLEANUP`.

## BLOK 10 - pozniejszy growth / pre-CRM

Zrodlo: `_project/07_NEXT_STEPS.md`, AI Opportunity Finder.

47. `STAGE240A_SMART_SEARCH_INPUT_AND_MANUAL_IMPORT`.
48. `STAGE240B_OPPORTUNITY_REASON_SCHEMA`.
49. `STAGE240C_AI_SCORING_AND_PRIORITY`.
50. `STAGE240D_CREATE_LEADS_WITH_REASON_AND_FOLLOWUP`.
51. `STAGE240E_MONTHLY_OPPORTUNITY_MONITORING`.

---

# Najblizszy etap

Najblizszy etap po deep scan 2026-06-12: `STAGE231E_NON_ADMIN_ACCOUNT_FEATURE_ACCESS_AUDIT`.

Powod: Damian wskazal powazny problem, ze Google Calendar dziala inaczej na koncie Damiana niz na innych kontach. Kod pokazuje wiele funkcji gated przez role i plan features, dlatego najpierw trzeba zrobic mape dostepnosci opcji na zwyklym koncie.

Nastepny po nim: `STAGE231E2_PLAN_ENTITLEMENT_MATRIX_AND_OFFER_AUDIT`.

Po 231E2 Damian decyduje:

- jesli blokuje realna synchronizacja: robimy `STAGE231F_GOOGLE_CALENDAR_MULTI_USER_SYNC_AUDIT_AND_FIX`,
- jesli trzeba domknac wysylke i maile: robimy `STAGE231I_PRODUCTION_DOMAIN_AND_MAILBOX_SETUP_PLAN` oraz `STAGE231J_TRANSACTIONAL_EMAILS_AND_NON_SENDING_EMAILS_CONTRACT`,
- jesli wysylka szkicow/AI ma byc testowana produkcyjnie: robimy `STAGE231K_AI_DRAFT_SEND_AND_APPROVAL_FLOW_REPAIR` i `STAGE231L_AI_RUNTIME_PROVIDER_AND_FEATURE_REPAIR`,
- jesli priorytetem jest billing: robimy `STAGE231M_BILLING_PAYMENTS_SETTLEMENTS_AND_PLAN_DISPLAY_AUDIT`,
- jesli priorytetem jest UI na telefonie: robimy `STAGE231H_MOBILE_READABILITY_APP_WIDE_AUDIT_AND_FIX`.
