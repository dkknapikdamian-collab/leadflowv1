# 04_ZNALEZIONE_PROBLEMY_DO_ANALIZY - CloseFlow / LeadFlow

Data utworzenia: 2026-06-12 20:28 Europe/Warsaw  
Ostatnia aktualizacja: 2026-06-12 23:59 Europe/Warsaw  
Status: ACTIVE  
Typ: centralny rejestr problemow znalezionych podczas audytow etapow  
Repo: dkknapikdamian-collab/leadflowv1  
Branch: dev-rollout-freeze  
Canonical name: CloseFlow / LeadFlow  
Obsidian folder: 10_PROJEKTY/CloseFlow_Lead_App

## Cel

Ten plik jest nowym wpisem obok kierunku/etapow aplikacji. Nie jest lista etapow do automatycznego wdrozenia.

Tu trafiaja realne problemy, niedociagniecia i ryzyka znalezione podczas audytu przed etapem, audytu po etapie, pracy developera, testow, guardow albo recznego sprawdzania aplikacji.

Celem jest oddzielenie:

- etapow zatwierdzonych do wdrozenia,
- od problemow znalezionych, ktore Damian pozniej analizuje i decyduje, czy robimy z nich etap.

## Zasada glowna

Kazdy realny problem znaleziony przy pracy nad etapem ma zostac wpisany tutaj, jezeli:

- nie jest aktualnym zakresem wykonywanego etapu,
- nie jest juz zapisany jako etap naprawczy,
- nie jest juz zapisany w aktualnym kierunku rozwoju,
- ma dowod w kodzie, UI, guardzie, tescie, dokumentacji albo zachowaniu aplikacji,
- moze wplywac na jakosc, spojność, bezpieczenstwo, dane, UX albo koszty pozniejszej naprawy.

Nie wpisywac spekulacji bez dowodu. Nie robic losowego polowania po repo. Wpisywac tylko to, co wyszlo realnie przy audycie albo sprawdzaniu powiazanych miejsc.

## Co wpisywac

Przyklady problemow, ktore maja trafic do tego pliku:

- przyciski tej samej akcji maja inne kolory, rozmiary, etykiety albo zrodlo prawdy,
- kafelek wyglada jak ten sam wzorzec, ale uzywa innego komponentu albo lokalnego stylu,
- ekran ma dwa warianty tej samej funkcji,
- dane sa pobierane z innego zrodla niz reszta modulu,
- usuniecie lub zapis dziala optymistycznie, ale moze wrocic po refetchu,
- trasa jest dostepna publicznie, chociaz powinna byc gated,
- guard lapie jeden string, a nie klase bledu,
- dokumentacja mowi co innego niz kod,
- komentarz/TODO/FIXME dotyczy aktualnie ruszanego modulu,
- funkcja wyglada na niedokonczona albo podlaczona tylko czesciowo,
- modul ma obejscie, ktore maskuje stary blad,
- UI jest nieczytelne w 5 sekund albo odbiega od zaakceptowanego wzorcem,
- brakuje testu/guardu dla powtarzalnej klasy bledu.

## Czego tu nie wpisywac

- rzeczy juz ujetych w aktywnym etapie,
- rzeczy juz ujetych w kierunku rozwoju,
- hipotez bez dowodu,
- subiektywnych zmian estetycznych bez zwiazku z zaakceptowanym wzorcem,
- wielkich refaktorow bez konkretnego problemu,
- starych historycznych smieci, jesli nie dotykaja aktywnego modulu.

## Statusy wpisow

Uzywac jednego statusu:

- `NOWE` - znalezione, jeszcze bez decyzji Damiana,
- `DO_ANALIZY_DAMIANA` - wymaga decyzji, czy robimy etap,
- `PRZYJETE_DO_ETAPU` - Damian zaakceptowal, trzeba utworzyc etap,
- `ODLOZONE` - nie teraz,
- `ODRZUCONE` - nie naprawiamy,
- `ZDUPLIKOWANE` - powiazane z innym wpisem,
- `ZAMKNIETE` - naprawione i potwierdzone.

## Format wpisu

```txt
### YYYY-MM-DD HH:mm Europe/Warsaw - [krotka nazwa problemu]

- id: FOUND-YYYYMMDD-NN
- status: NOWE / DO_ANALIZY_DAMIANA / PRZYJETE_DO_ETAPU / ODLOZONE / ODRZUCONE / ZDUPLIKOWANE / ZAMKNIETE
- znalezione przy etapie:
- ekran / trasa:
- modul / pliki:
- problem:
- dowod:
- dlaczego to problem:
- ryzyko:
- priorytet wstepny: P1 / P2 / P3 / P4
- czy jest juz w etapach/kierunku: NIE / TAK, gdzie:
- propozycja dalszego kroku:
- decyzja Damiana:
- powiazany etap, jesli powstanie:
```

## Instrukcja dla developera / Codexa

Przy kazdym etapie developer ma:

1. Przeczytac ten plik razem z `AGENTS.md`, `_project/00_PROJECT_MEMORY_PROTOCOL.md`, `_project/04_STAGE_AUDIT_PROTOCOL_CLOSEFLOW.md` i `_project/STAGE_TEMPLATE_MINIMAL.md`.
2. W audycie przed etapem sprawdzic, czy w ruszanym obszarze sa juz wpisy `NOWE`, `DO_ANALIZY_DAMIANA` albo `PRZYJETE_DO_ETAPU`.
3. Jezeli podczas audytu znajdzie realny problem poza zakresem etapu, ma dodac wpis tutaj, a nie naprawiac go po cichu.
4. Jezeli problem jest krytyczny i blokuje etap, ma zatrzymac etap i opisac blokade.
5. Jezeli problem nie blokuje etapu, ma wpisac go tutaj i kontynuowac tylko zatwierdzony zakres.
6. W run report musi napisac: `Znalezione problemy: brak nowych` albo podac ID nowych wpisow.

## Relacja do etapow

Ten plik nie zastępuje `_project/04_ETAPY_ROZWOJU_APLIKACJI.md`, `_project/04_KIERUNEK_ROZWOJU_APLIKACJI.md`, `_project/07_NEXT_STEPS.md` ani `_project/07_REPAIR_STAGES_HIDDEN_AUDIT_FINDINGS.md`.

Przeplyw decyzyjny:

1. Problem znaleziony podczas audytu trafia tutaj.
2. Damian decyduje, czy to naprawiamy.
3. Dopiero po decyzji powstaje etap w pliku etapow / roadmapy.
4. Po wdrozeniu wpis w tym pliku dostaje status `ZAMKNIETE` i link do etapu.

## Aktualne wpisy

### 2026-06-12 23:59 Europe/Warsaw - Burdel w roadmapie i brak trzech centralnych plikow decyzyjnych

- id: FOUND-20260612-01
- status: PRZYJETE_DO_ETAPU
- znalezione przy etapie: audit kierunku rozwoju aplikacji po pytaniu Damiana o digest, szkice, kalendarz, pilnowanie leadow, dokumenty i pozyskiwanie leadow
- ekran / trasa: nie dotyczy bezposrednio UI; problem dotyczy `_project` i pamieci projektu
- modul / pliki:
  - `_project/07_NEXT_STEPS.md`
  - `_project/03_CURRENT_STAGE.md`
  - `_project/04_DECISIONS.md`
  - `_project/06_GUARDS_AND_TESTS.md`
  - `_project/10_PROJECT_TIMELINE.md`
  - `_project/12_IMPLEMENTATION_LEDGER.md`
  - `_project/13_TEST_HISTORY.md`
- problem: informacje o etapach, kierunku rozwoju, problemach technicznych, Smart Prospecting / AI Opportunity Finder i starych hotfixach byly rozrzucone po kilku dlugich plikach. Przy pytaniu Damiana o kierunek aplikacji AI moglo pominac istotny kierunek growth, mimo ze byl zapisany w repo.
- dowod: `AI Opportunity Finder / Smart Prospecting` byl zapisany w dlugim `_project/07_NEXT_STEPS.md`, ale nie istnial czysty centralny plik kierunku rozwoju ani centralny plik etapow odpowiadajacy na pytanie "co robimy teraz i pozniej".
- dlaczego to problem: kolejny chat/Codex moze czytac zly fragment, uznac stary helper za aktualna kolejke albo pominac wazny kierunek produktu. To zwieksza ryzyko chaosu etapow, przepisywania pomyslow i zlych priorytetow.
- ryzyko: decyzje produktowe beda gubic sie w historii, a aplikacja bedzie rozwijana przypadkowymi funkcjami zamiast jednym kierunkiem owner-control + Smart Prospecting jako pozniejszy growth module.
- priorytet wstepny: P1
- czy jest juz w etapach/kierunku: CZESCIOWO, stare wpisy byly w `_project/07_NEXT_STEPS.md`, ale brakowalo centralnych plikow kanonicznych.
- propozycja dalszego kroku: utworzyc i utrzymywac trzy centralne pliki: `_project/04_KIERUNEK_ROZWOJU_APLIKACJI.md`, `_project/04_ETAPY_ROZWOJU_APLIKACJI.md`, `_project/04_ZNALEZIONE_PROBLEMY_DO_ANALIZY.md`.
- decyzja Damiana: Damian wskazal, ze powinny byc trzy pliki odpowiadajace na pytanie: `Etapy`, `Kierunek rozwoju`, `Problemy znalezione przez AI`.
- powiazany etap, jesli powstanie: `CF-DOCS-ROADMAP-CANON-001`

### 2026-06-12 23:59 Europe/Warsaw - AI Opportunity Finder byl ukryty w dlugim pliku zamiast w kierunku rozwoju

- id: FOUND-20260612-02
- status: PRZYJETE_DO_ETAPU
- znalezione przy etapie: audit kierunku rozwoju aplikacji
- ekran / trasa: przyszly modul growth / smart prospecting
- modul / pliki:
  - `_project/07_NEXT_STEPS.md`
  - `_project/04_KIERUNEK_ROZWOJU_APLIKACJI.md`
  - `_project/04_ETAPY_ROZWOJU_APLIKACJI.md`
- problem: kierunek "użytkownik wybiera branżę/miasto/problem, system znajduje firmy, ocenia potencjał, tworzy powód kontaktu, zapisuje leady i ustawia follow-up" istnial w repo, ale nie byl wyeksponowany w centralnym kierunku rozwoju.
- dowod: fragment `LeadFlow AI Opportunity Finder` w `_project/07_NEXT_STEPS.md` opisywal Smart Prospecting / Opportunity Finder jako modul pozyskiwania leadow, ale znajdowal sie w dlugim pliku z innymi etapami i historia.
- dlaczego to problem: jest to wazny kierunek growth i przewaga produktu, ale moze zostac pominiety przy priorytetyzacji, jesli AI czyta tylko skrot albo nowsze hotfixy.
- ryzyko: aplikacja bedzie rozwijana tylko jako CRM po otrzymaniu leadow, a nie jako system domykajacy caly ruch: wykrycie okazji -> zapis leada -> follow-up -> owner report.
- priorytet wstepny: P2
- czy jest juz w etapach/kierunku: TAK, przeniesione do `_project/04_KIERUNEK_ROZWOJU_APLIKACJI.md` i `_project/04_ETAPY_ROZWOJU_APLIKACJI.md`.
- propozycja dalszego kroku: traktowac `STAGE240_LEADFLOW_SMART_PROSPECTING_OPPORTUNITY_FINDER` jako pozniejszy growth module po stabilizacji owner-control core.
- decyzja Damiana: kierunek ma byc widoczny przy pytaniu o rozwoj aplikacji.
- powiazany etap, jesli powstanie: `STAGE240_LEADFLOW_SMART_PROSPECTING_OPPORTUNITY_FINDER`

### 2026-06-13 - Globalny quiet gate blokowany przez historyczny mojibake/BOM
- id: FOUND-20260613-03
- status: DO_ANALIZY_DAMIANA
- znalezione przy etapie: STAGE231F_R3
- problem: `verify:closeflow:quiet` zatrzymuje sie na Stage98 mojibake hard gate w wielu starszych plikach poza zakresem Owner Control.

### FOUND-20260613-04 - Stare guardy Stage228R5 nie zgadzaja sie z aktywnym prebuild
- status: DO_ANALIZY_DAMIANA
- obszar: infrastruktura guardow tworzenia klienta/sprawy
- dowod: guard wymaga swojej komendy w `prebuild`, ale aktywny `prebuild` zawiera tylko finalne guardy delete flow R25/R41.
- decyzja w tym pakiecie: nie rozszerzano prebuild; build i nowy dedykowany guard przechodza.
- dowod: m.in. Calendar.tsx, TasksStable.tsx, ClientDetail.tsx, stare CSS/testy/skrypty.
- ryzyko: pelny release gate pozostaje czerwony mimo zielonych dedykowanych testow etapu.
- propozycja: osobny kontrolowany etap encoding/guard scope, bez mieszania z Owner Control.

### 2026-06-13 - Podwojny klucz savedRecord w ContextActionDialogs
- id: FOUND-20260613-04
- status: DO_ANALIZY_DAMIANA
- znalezione przy etapie: STAGE231F_R3 build audit
- problem: esbuild ostrzega o podwojnym kluczu `savedRecord` w jednym obiekcie.
- dowod: `src/components/ContextActionDialogs.tsx` okolice linii 196-198.
- ryzyko: pierwsza wartosc jest zawsze nadpisywana, co utrudnia rozumienie kontraktu zapisu.
- propozycja: osobny maly bugfix z testem kontraktu dialogu.

### 2026-06-13 - Globalny migration guard blokowany przez stare migracje portalu
- id: FOUND-20260613-05
- status: DO_ANALIZY_DAMIANA
- znalezione przy etapie: STAGE231F_R3 migration preflight
- problem: `verify:migrations:supabase` zglasza `POSSIBLE_SECRET_IN_MIGRATION` dla dwoch migracji z 2026-05-02.
- dowod: `20260502100000_portal_uploads_storage_bucket.sql` i `20260502_portal_uploads_storage_bucket.sql`.
- ryzyko: globalny migration guard pozostaje czerwony niezaleznie od nowej migracji Stage231F R3.
- propozycja: osobny audyt starych migracji portalu i doprecyzowanie guarda.

## 2026-06-14 10:05 Europe/Warsaw - STAGE231G_LEAD_DETAIL_OPERATIONAL_WIRING_AUDIT_AND_FIX

Status: PRZYJETE_DO_ETAPU

Problem: karta leada pokazywała potencjał i statusy, ale część kafelków nie prowadziła do jasnej operacji. Dodatkowo formularz tworzenia leada miał pole dealValue opisane zbyt ogólnie jako "Wartość", przez co użytkownik nie widział, że może od razu wpisać potencjał.

Zakres naprawy: LeadDetail + Leads create form + guard/test. Bez SQL, Google Calendar, billing/trial, CaseDetail i ClientDetail.

## 2026-06-14 10:45 Europe/Warsaw - STAGE231G_R7_POTENTIAL_ONLY_SOURCE_AND_WORKROW_FIX

Status: PRZYJETE_DO_HOTFIXA

Problem: ręczny test Damiana wykazał, że CTA Potencjał otwierało pełną edycję leada zamiast małego modala tylko dla wartości. Dodatkowo zapisana wartość mogła nie być widoczna, bo API PATCH zapisywał tylko value, a kontrakt odczytu preferuje deal_value przed value. Wiersze działań zrzucały przycisk Zrobione poza linię na desktopie.

Zakres: LeadDetail potential-only modal, api/leads value + deal_value source truth, work-row alignment CSS, guard/test. Bez SQL, Google Calendar, billing/trial, CaseDetail i ClientDetail.

## STAGE231G_R4_LEAD_DETAIL_FUNCTION_MAPPING_CLOSEOUT_FIX

Data: 2026-06-14 11:45 Europe/Warsaw
Status: PRZYJETE_DO_ETAPU
Problem: po R3 w LeadDetail zostaly trzy luki: legacy MissingItemQuickActionModal, zly delete missing_item w overflow oraz kruchy CSS work-row.
Decyzja: naprawic w R4, zanim analogiczny mapping zostanie przeniesiony na CaseDetail.

## 2026-06-14 — STAGE231H_R1B_CASE_DETAIL_RUNTIME_REPAIR

- Status: LOCAL_APPLIED / DO_TEST_AND_PUSH
- Scope: CaseDetail runtime repair for fake dictation, nextAction missing fallback, contractValue percent-only behavior, payment history copy, and full payment source in case history.
- SQL: NOT_TOUCHED.
- Deferred: cost lifecycle edit/delete and canonical case_item dual-path decision remain R1C/R1D.

## 2026-06-14 — STAGE231H_R1B_CASE_DETAIL_RUNTIME_REPAIR_AND_CLOSEOUT

- Status: LOCAL_APPLIED / DO_TEST_AND_PUSH
- Scope: fixed shared CaseFinanceEditorDialog contractValue clearing bug after R1B.
- Guard: scripts/check-stage231h-r1b-case-detail-runtime-repair.cjs now covers CaseDetail and shared finance dialog.
- Decision: case_item source truth decision: two UI entries, one case_items contract.
- Risk: cost lifecycle left as R1C.
- SQL: NOT_TOUCHED.

## STAGE231H_R1C_CASE_DETAIL_COST_CORRECTION_MODAL — 2026-06-14

Status: LOCAL_APPLIED / DO_TEST_AND_PUSH

Problem: koszty sprawy dało się dodać, ale nie dało się ich skorygować ani usunąć z jednego okna rozliczenia.

Decyzja: przycisk w railu zmienia się na `Koryguj wpłatę/koszt`; okno pokazuje wpłaty/korekty oraz koszty. Koszty są czerwone i mają akcje `Koryguj` oraz `Usuń`. Pełne potwierdzenie PASS wymaga manualnego testu po refreshu.

## 2026-06-14 15:45 Europe/Warsaw — STAGE231H_R1D_FINANCE_CORRECTION_MODAL_COMPACT

- Status: LOCAL_APPLIED / DO_TEST_AND_PUSH
- Scope: compact cleanup of CaseDetail finance correction modal after R1C.
- Decision: remove redundant cost status chip from the correction list; cost status remains editable inside the cost correction form.
- Decision: commission payment is a paid commission entry by default; remove status/type selectors from add-commission-payment UI.
- Decision: remove the redundant "Korekta / prowizja" fallback label from payment rows.
- SQL: NOT_TOUCHED.
- Manual test: open Koryguj wpłatę/koszt, verify rows fit, add commission payment, add/correct/delete cost, refresh.
