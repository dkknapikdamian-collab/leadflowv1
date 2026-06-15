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
- moze wplywac na jakosc, spojnoÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ, bezpieczenstwo, dane, UX albo koszty pozniejszej naprawy.

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

Ten plik nie zastĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âpuje `_project/04_ETAPY_ROZWOJU_APLIKACJI.md`, `_project/04_KIERUNEK_ROZWOJU_APLIKACJI.md`, `_project/07_NEXT_STEPS.md` ani `_project/07_REPAIR_STAGES_HIDDEN_AUDIT_FINDINGS.md`.

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
- problem: kierunek "uÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄytkownik wybiera branÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Â/miasto/problem, system znajduje firmy, ocenia potencjaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡, tworzy powÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇd kontaktu, zapisuje leady i ustawia follow-up" istnial w repo, ale nie byl wyeksponowany w centralnym kierunku rozwoju.
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

Problem: karta leada pokazywaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡a potencjaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ i statusy, ale czĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹ÂÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ kafelkÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw nie prowadziÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡a do jasnej operacji. Dodatkowo formularz tworzenia leada miaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ pole dealValue opisane zbyt ogÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇlnie jako "WartoÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ", przez co uÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄytkownik nie widziaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡, Ä‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄe moÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄe od razu wpisaĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ potencjaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡.

Zakres naprawy: LeadDetail + Leads create form + guard/test. Bez SQL, Google Calendar, billing/trial, CaseDetail i ClientDetail.

## 2026-06-14 10:45 Europe/Warsaw - STAGE231G_R7_POTENTIAL_ONLY_SOURCE_AND_WORKROW_FIX

Status: PRZYJETE_DO_HOTFIXA

Problem: rĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âczny test Damiana wykazaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡, Ä‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄe CTA PotencjaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ otwieraÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡o peÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡nĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ edycjĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Â leada zamiast maÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ego modala tylko dla wartoÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşci. Dodatkowo zapisana wartoÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ mogÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡a nie byĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ widoczna, bo API PATCH zapisywaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ tylko value, a kontrakt odczytu preferuje deal_value przed value. Wiersze dziaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡aÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąÄľ zrzucaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡y przycisk Zrobione poza liniĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Â na desktopie.

Zakres: LeadDetail potential-only modal, api/leads value + deal_value source truth, work-row alignment CSS, guard/test. Bez SQL, Google Calendar, billing/trial, CaseDetail i ClientDetail.

## STAGE231G_R4_LEAD_DETAIL_FUNCTION_MAPPING_CLOSEOUT_FIX

Data: 2026-06-14 11:45 Europe/Warsaw
Status: PRZYJETE_DO_ETAPU
Problem: po R3 w LeadDetail zostaly trzy luki: legacy MissingItemQuickActionModal, zly delete missing_item w overflow oraz kruchy CSS work-row.
Decyzja: naprawic w R4, zanim analogiczny mapping zostanie przeniesiony na CaseDetail.

## 2026-06-14 Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ STAGE231H_R1B_CASE_DETAIL_RUNTIME_REPAIR

- Status: LOCAL_APPLIED / DO_TEST_AND_PUSH
- Scope: CaseDetail runtime repair for fake dictation, nextAction missing fallback, contractValue percent-only behavior, payment history copy, and full payment source in case history.
- SQL: NOT_TOUCHED.
- Deferred: cost lifecycle edit/delete and canonical case_item dual-path decision remain R1C/R1D.

## 2026-06-14 Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ STAGE231H_R1B_CASE_DETAIL_RUNTIME_REPAIR_AND_CLOSEOUT

- Status: LOCAL_APPLIED / DO_TEST_AND_PUSH
- Scope: fixed shared CaseFinanceEditorDialog contractValue clearing bug after R1B.
- Guard: scripts/check-stage231h-r1b-case-detail-runtime-repair.cjs now covers CaseDetail and shared finance dialog.
- Decision: case_item source truth decision: two UI entries, one case_items contract.
- Risk: cost lifecycle left as R1C.
- SQL: NOT_TOUCHED.

## STAGE231H_R1C_CASE_DETAIL_COST_CORRECTION_MODAL Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ 2026-06-14

Status: LOCAL_APPLIED / DO_TEST_AND_PUSH

Problem: koszty sprawy daÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡o siĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Â dodaĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ, ale nie daÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡o siĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Â ich skorygowaĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ ani usunĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦Ă„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ z jednego okna rozliczenia.

Decyzja: przycisk w railu zmienia siĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Â na `Koryguj wpÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡atĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Â/koszt`; okno pokazuje wpÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡aty/korekty oraz koszty. Koszty sĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ czerwone i majĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ akcje `Koryguj` oraz `UsuÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąÄľ`. PeÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ne potwierdzenie PASS wymaga manualnego testu po refreshu.

## 2026-06-14 15:45 Europe/Warsaw Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ STAGE231H_R1D_FINANCE_CORRECTION_MODAL_COMPACT

- Status: LOCAL_APPLIED / DO_TEST_AND_PUSH
- Scope: compact cleanup of CaseDetail finance correction modal after R1C.
- Decision: remove redundant cost status chip from the correction list; cost status remains editable inside the cost correction form.
- Decision: commission payment is a paid commission entry by default; remove status/type selectors from add-commission-payment UI.
- Decision: remove the redundant "Korekta / prowizja" fallback label from payment rows.
- SQL: NOT_TOUCHED.
- Manual test: open Koryguj wpÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡atĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Â/koszt, verify rows fit, add commission payment, add/correct/delete cost, refresh.

## STAGE231H_R1F_PAYMENT_AND_COST_FULL_CORRECTION Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ 2026-06-14 16:40 Europe/Warsaw
- Status: LOCAL_APPLIED / DO_TEST_AND_PUSH / SERVER_UI_REQUIRED
- Scope: payment correction now edits existing payment amount/date/note through updatePaymentInSupabase; cost correction edits kind/date/status/note and money fields.
- SQL: not touched.
- Risk: if payment PATCH fails on server, backend payment endpoint repair is required.


## 2026-06-14 HH:mm Europe/Warsaw Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ STAGE231H_R1F4_PAYMENT_SAVE_AND_GUARD_REPAIR
- Status: DO_TEST_AND_PUSH.
- Problem: R1F was pushed after red guards; payment save path and guards needed repair.
- SQL: NOT_TOUCHED.

## 2026-06-14 HH:mm Europe/Warsaw - STAGE231H_R1G_COST_OTHER_NAME_AND_REIMBURSABLE_FLAG
- Status: DO_TEST_AND_PUSH.
- Problem: cost kind other had no name field; reimbursable flag existed in state but not visible in UI.
- SQL: NOT_TOUCHED.

## 2026-06-14 HH:mm Europe/Warsaw - STAGE231H_R1G2_CASE_DETAIL_COST_PAYMENT_CLOSEOUT_AND_STAGE_LEDGER_SYNC
- CaseDetail finance/cost chain required ledger synchronization after runtime pushes.
- R1D name collision identified: note dictation must execute as R1D2.
- Reimbursed/returned cost marking remains a separate runtime stage R1E.
- Full product PASS is blocked until server manual UI validation is done.

## 2026-06-14 - STAGE231H_R1G2_CASE_DETAIL_COST_PAYMENT_CLOSEOUT_AND_STAGE_LEDGER_SYNC
- Status: DOCS_ONLY_CLOSEOUT / SERVER_UI_REQUIRED_AFTER_PUSH.
- R1B/R1C/R1F/R1F4/R1G are technically pushed but still require server/manual UI verification.
- R1D name collision is resolved by routing note dictation restore to STAGE231H_R1D2_CASE_DETAIL_NOTE_DICTATION_RESTORE_RUNTIME.
- Reimbursed cost marking remains STAGE231H_R1E_CASE_DETAIL_REIMBURSED_COST_MARKING.


## STAGE231H_R1G3_CASE_DETAIL_MANUAL_UI_PASS Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ closed manual verification risk

- date: 2026-06-14 18:55 Europe/Warsaw
- status: CLOSED_FOR_CASEDETAIL_COST_PAYMENT_CHAIN
- confirmation: Damian confirmed manual server UI tests: "jest ok testy reczne".
- resolved risk: CaseDetail R1B/R1C/R1F/R1F4/R1G/R1G2 were technically pushed but needed server/manual UI confirmation.
- remaining risk:
  - R1D2 note dictation still not implemented;
  - R1E reimbursed cost marking still not implemented.


## STAGE231H_R1D2_R4_NOTES_PANEL_DICTATION_BUTTON Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ 2026-06-14 19:40 Europe/Warsaw

- status: RUNTIME_HOTFIX_PREPARED
- zakres: drugi widoczny przycisk w panelu Notatki sprawy nie moÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄe zostaĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ jako disabled Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă„Ä…Ă„ÄľNotatka gÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡osowa Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ wkrÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬ĹˇtceĂ„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă„Ä…Ă„â€ž; ma uÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄywaĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ tego samego handlera SpeechRecognition/autosave co przycisk w panelu DziaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ania sprawy.
- runtime: src/pages/CaseDetail.tsx, bez SQL i bez R1E kosztÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw zwrÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇconych.
- test: R1D2 guard/test + R1D2 R4 guard/test + build + diff-check.
- ryzyko: wczeÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşniejszy R1D2 zabezpieczaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ pierwszy przycisk, ale nie objĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦Ä‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ drugiego widocznego przycisku w panelu notatek.


## 2026-06-14 22:00 Europe/Warsaw - STAGE231H_R1D2_R6_R9_CASE_NOTE_FOLLOWUP_NOTES_CRUD_MASS_REPAIR

Status: DO_APPLY / mass repair from clean origin.
Zakres: CaseDetail note follow-up source map and notes CRUD. Notatka zostaje w activities/operator_note. Follow-up po notatce jest tasks/follow_up z workspaceId, dueAt, scheduledAt, reminderAt, date, caseId, clientId, leadId. Modal wszystkich notatek dostaje Edytuj/UsuĂ„â€šĂ˘â‚¬ĹľÄ‚â€žĂ˘â‚¬Â¦Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă„Ä…Ă„Äľ/Zapisz. Etap zastÄ‚â€žĂ˘â‚¬ĹˇÄ‚ËĂ˘â€šÂ¬ÄąÄľĂ„â€šĂ‹ÂÄ‚ËĂ˘â€šÂ¬ÄąÄľÄ‚â€ąĂ‚Âpuje runtime file bez kruchych anchorĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬ÄąË‡Ä‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡w po bĂ„â€šĂ˘â‚¬ĹľÄ‚â€žĂ˘â‚¬Â¦Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă„Ä…Ă‹â€ˇÄ‚â€žĂ˘â‚¬ĹˇÄ‚ËĂ˘â€šÂ¬ÄąÄľĂ„â€šĂ‹ÂÄ‚ËĂ˘â€šÂ¬ÄąÄľÄ‚â€ąĂ‚Âdach R6/R7/R8.


## 2026-06-14 22:15 Europe/Warsaw - STAGE231H_R1D2_R6_R9D_CASE_NOTE_FOLLOWUP_NOTES_CRUD_MASS_REPAIR_GUARD_SYNC

Status: DO_APPLY / guard-ledger sync after R9 partial apply.
Zakres: centralny R1G2 product-pass sync wymagany przez legacy R1D2 guard plus R9 mass repair. Notatka zostaje w activities/operator_note. Follow-up po notatce jest tasks/follow_up z workspaceId, dueAt, scheduledAt, reminderAt, date, caseId, clientId, leadId. Modal wszystkich notatek ma Edytuj/UsuĂ„â€šĂ˘â‚¬ĹľÄ‚â€žĂ˘â‚¬Â¦Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă„Ä…Ă„Äľ/Zapisz.


## 2026-06-14 22:30 Europe/Warsaw - STAGE231H_R1D2_R6_R9E_CASE_NOTE_FOLLOWUP_NOTES_CRUD_MASS_GUARD_SYNC

Status: DO_APPLY / MASS_GUARD_SYNC_CONTINUATION
Zakres: masowe domkniÄ‚â€žĂ˘â‚¬ĹˇÄ‚ËĂ˘â€šÂ¬ÄąÄľĂ„â€šĂ‹ÂÄ‚ËĂ˘â€šÂ¬ÄąÄľÄ‚â€ąĂ‚Âcie klasy bĂ„â€šĂ˘â‚¬ĹľÄ‚â€žĂ˘â‚¬Â¦Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă„Ä…Ă‹â€ˇÄ‚â€žĂ˘â‚¬ĹˇÄ‚ËĂ˘â€šÂ¬ÄąÄľĂ„â€šĂ‹ÂÄ‚ËĂ˘â€šÂ¬ÄąÄľÄ‚â€ąĂ‚ÂdĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬ÄąË‡Ä‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡w legacy markerĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬ÄąË‡Ä‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡w. Synchronizuje R1G2, R1D2 R4, R9, R9D i R9E w centralnych ledgerach oraz uruchamia peĂ„â€šĂ˘â‚¬ĹľÄ‚â€žĂ˘â‚¬Â¦Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă„Ä…Ă‹â€ˇny chain guardĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬ÄąË‡Ä‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡w/testĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬ÄąË‡Ä‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡w/build.


## 2026-06-14 22:40 Europe/Warsaw - STAGE231H_R1D2_R6_R9F_CASE_NOTE_FOLLOWUP_NOTES_CRUD_GUARD_REGEX_MASS_FIX

Status: DO_APPLY / MASS_GUARD_REGEX_FIX
Zakres: naprawa klasy bĂ„â€šĂ˘â‚¬ĹľÄ‚â€žĂ˘â‚¬Â¦Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă„Ä…Ă‹â€ˇÄ‚â€žĂ˘â‚¬ĹˇÄ‚ËĂ˘â€šÂ¬ÄąÄľĂ„â€šĂ‹ÂÄ‚ËĂ˘â€šÂ¬ÄąÄľÄ‚â€ąĂ‚Âdu guardĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬ÄąË‡Ä‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡w R9D/R9E: sprawdzenie runtime regex
eplace(/\s+/g, ' ') w guardzie musi mieÄ‚â€žĂ˘â‚¬ĹˇÄ‚ËĂ˘â€šÂ¬ÄąÄľĂ„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚â€ąĂ˘â‚¬Ë‡ podwĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬ÄąË‡Ä‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡jnie escapowany backslash. Bez tego guard szuka bĂ„â€šĂ˘â‚¬ĹľÄ‚â€žĂ˘â‚¬Â¦Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă„Ä…Ă‹â€ˇÄ‚â€žĂ˘â‚¬ĹˇÄ‚ËĂ˘â€šÂ¬ÄąÄľĂ„â€šĂ‹ÂÄ‚ËĂ˘â€šÂ¬ÄąÄľÄ‚â€ąĂ‚Âdnego
eplace(/s+/g, ' ').


## 2026-06-14 22:50 Europe/Warsaw - STAGE231H_R1D2_R6_R9G_CASE_NOTE_FOLLOWUP_NOTES_CRUD_LOCAL_TASKS_GUARD_MASS_FIX

Status: DO_APPLY / MASS_LOCAL_TASKS_GUARD_FIX
Zakres: naprawa klasy bĂ„â€šĂ˘â‚¬ĹľÄ‚â€žĂ˘â‚¬Â¦Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă„Ä…Ă‹â€ˇÄ‚â€žĂ˘â‚¬ĹˇÄ‚ËĂ˘â€šÂ¬ÄąÄľĂ„â€šĂ‹ÂÄ‚ËĂ˘â€šÂ¬ÄąÄľÄ‚â€ąĂ‚Âdu guardĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬ÄąË‡Ä‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡w R9E/R9F: runtime poprawnie dopina nowy follow-up task do lokalnego 	asks przez setTasks((current) => dedupeCaseTasks([normalizedCreated, ...current], caseId, caseData));, a guard nie moĂ„â€šĂ˘â‚¬ĹľÄ‚â€žĂ˘â‚¬Â¦Ă„â€šĂ˘â‚¬ĹľÄ‚â€ąÄąÄ„e wymagaÄ‚â€žĂ˘â‚¬ĹˇÄ‚ËĂ˘â€šÂ¬ÄąÄľĂ„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚â€ąĂ˘â‚¬Ë‡ nieistniejÄ‚â€žĂ˘â‚¬ĹˇÄ‚ËĂ˘â€šÂ¬ÄąÄľĂ„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚â€šĂ‚Â¦cej skĂ„â€šĂ˘â‚¬ĹľÄ‚â€žĂ˘â‚¬Â¦Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă„Ä…Ă‹â€ˇadni previousTasks.

## STAGE231H_R1D2_R10C_CASE_DETAIL_ACTION_MAP_FOLLOWUP_NOTES_FINANCE_LOADING

- Data: 2026-06-14 23:45 Europe/Warsaw
- Status: TECH_STAGE_IN_PROGRESS
- Zakres: CaseDetail action map, note follow-up display/source map, quick note local append, finance loading flicker removal.
- Audyt: R10 failed on brittle anchor. R10C uses regex/whole-class source-aware patch and guard.

### STAGE231H_R1D2_R11_NOTE_PANEL_FOLLOWUP_PROMPT_MAP_GUARD
- data: 2026-06-14T20:31:30.095Z
- status: DO_TEST_AND_PUSH
- zakres: notatki CaseDetail pokazujĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ do 5 wpisÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw, majĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ tooltip peÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡nej treÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşci, szybka notatka otwiera ten sam prompt follow-upu co dyktowanie, a follow-up w dziaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡aniach pokazuje treÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ notatki jako opis.
- guard: scripts/check-stage231h-r1d2-r11-note-panel-followup-prompt-map-guard.cjs

## STAGE231H_R1D2_R12D_CASE_QUICK_NOTE_SCOPE_CLIENT_DEDUPE_FINAL_ANCHORLESS

- data: 2026-06-15 Europe/Warsaw
- status: DO_APPLY / final anchorless repair
- zakres: CaseQuickActions explicit case scope, ContextNoteDialog handoff order, CaseDetail quick note local append + prompt, ClientDetail action dedupe
- guard: scripts/check-stage231h-r1d2-r12d-case-quick-note-scope-client-dedupe-final-anchorless.cjs
- test: tests/stage231h-r1d2-r12d-case-quick-note-scope-client-dedupe-final-anchorless.test.cjs
- SQL: nie dotyczy

## STAGE231H_R1D2_R14F_NOTE_DELETE_LINKED_FOLLOWUP_EXPANDED_PANEL_ARROW_SAFE

- Data: 2026-06-15T11:25:01.568Z
- Typ: CaseDetail notes panel / linked follow-up delete / guard
- Zakres: CaseDetail notatki sprawy, follow-up po notatce, kasowanie powiÄ‚â€žĂ˘â‚¬Â¦zanego taska.
- Status: LOCAL_APPLIED_PENDING_VERIFY

## ZAMKNIĂ„ÂTE / PRZYJĂ„ÂTE DO ETAPU - 2026-06-15 15:10 Europe/Warsaw
- R15C: follow-up po notatce mÄ‚Ĺ‚gÄąâ€š zostaĂ„â€ˇ osierocony i miaÄąâ€š odwrÄ‚Ĺ‚conĂ„â€¦ hierarchiĂ„â„˘ tekstu w dziaÄąâ€šaniach.

## STAGE_BRANCH_AUDIT_001_MAIN_QUARANTINE_AND_DEV_FREEZE_GUARD - 2026-06-15 18:35 Europe/Warsaw

Problem: main i dev-rollout-freeze są rozjechane. Merge/rebase z main może rozwalić aktualny stan aplikacji. main zostaje objęty kwarantanną.
