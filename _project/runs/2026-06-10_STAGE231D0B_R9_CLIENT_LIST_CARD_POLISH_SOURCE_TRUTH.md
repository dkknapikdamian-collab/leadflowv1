# STAGE231D0B-R9 — ClientListCard visual polish + source truth cleanup

Data: 2026-06-10 Europe/Warsaw
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Status: LOCAL_ONLY_PACKAGE_APPLIED_PENDING_PUSH

## FAKTY Z KODU

- ClientListCard zachowuje układ 2-wierszowy.
- ClientListCard dalej pokazuje telefon, e-mail, aktywną prowizję, sprawy, zarobione łącznie i najbliższą akcję.
- Zakazane etykiety pozostają zakazane: Leady oraz Aktywna sprawa.
- Runtime leadów nie został przebudowany.

## DECYZJE DAMIANA

- Karta klienta zostaje jako baza.
- Metryki finansowe mają być lżejsze i nie wyglądać jak długie zielone belki.
- Leady mapujemy jako następny wariant wizualny, ale bez przebudowy w tym etapie.

## CSS SOURCE OF TRUTH MAP

- Aktywne źródło ClientListCard: src/styles/closeflow-record-list-source-truth.css.
- Blok R8 unscoped rescue został zastąpiony blokiem STAGE231D0B-R9 scoped do #root .cf-html-view.main-clients-html .row.client-row.cf-client-row-two-line.
- Finance values: .cf-client-active-commission oraz .cf-client-lifetime-earned są kompaktowymi chipami z width: fit-content i max-width cap.
- clients-next-action-layout.css został zabezpieczony przez :not(.cf-client-row-two-line), żeby legacy grid nie nadpisywał ClientListCard.

## VISUAL DECISION

- Nie zmieniać danych ani kolejności pól w ClientListCard.
- Zmieniać tylko ciężar wizualny metryk finansowych i konflikt CSS.
- Nie ruszać top layoutu, trial bannera ani right rail filtrów.

## LEADLISTCARD MAPPING

- UI Dictionary dostał szkic LeadListCard / lead-opportunity-row.
- LeadListCard ma używać tego samego record-list source truth, ale innego payloadu biznesowego.
- Runtime leadów nie jest częścią tego etapu.

## TESTS

Do wykonania przez APPLY:

- npm run check:stage231d0b-client-list-card-freeze
- node --test tests/stage231d0b-client-list-card-freeze.test.cjs
- npm run check:visual-stage05-clients jeśli istnieje
- npm run check:visual-stage03-leads jeśli istnieje
- git diff --check
- npm run build

## RISKS

- Manual QA nadal jest wymagany, bo guard nie widzi realnego odbioru wizualnego chipów.
- CSS dla list ma długą historię warstw, więc każdy kolejny etap musi sprawdzać konflikt source truth.
- Build nadal może pokazywać istniejący warning duplicate savedRecord w ContextActionDialogs.tsx; to osobny bug-sweep, nie R9.

## MANUAL QA

- /clients ma zachować 2 wiersze.
- Telefon i e-mail mają być czytelne.
- Aktywna prowizja i Zarobione łącznie mają być kompaktowe, nie szerokie belki.
- Mobile bez poziomego scrolla.
