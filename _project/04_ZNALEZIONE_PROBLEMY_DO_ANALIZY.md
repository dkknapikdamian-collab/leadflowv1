# 04_ZNALEZIONE_PROBLEMY_DO_ANALIZY - CloseFlow / LeadFlow

Data utworzenia: 2026-06-12 20:28 Europe/Warsaw  
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
- UI jest nieczytelne w 5 sekund albo odbiega od zaakceptowanego wzorca,
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

Ten plik nie zastępuje `_project/07_NEXT_STEPS.md` ani `_project/07_REPAIR_STAGES_HIDDEN_AUDIT_FINDINGS.md`.

Przeplyw decyzyjny:

1. Problem znaleziony podczas audytu trafia tutaj.
2. Damian decyduje, czy to naprawiamy.
3. Dopiero po decyzji powstaje etap w pliku etapow / roadmapy.
4. Po wdrozeniu wpis w tym pliku dostaje status `ZAMKNIETE` i link do etapu.

## Aktualne wpisy

Brak wpisow na start. Ten plik zostal utworzony jako centralne miejsce dla przyszlych znalezisk z audytow.


### 2026-06-13 00:45 Europe/Warsaw - Google Calendar personal sync needs durable work_items owner fields

- id: FOUND-20260613-01
- status: PRZYJETE_DO_ETAPU
- znalezione przy etapie: STAGE231F_R1_GOOGLE_CALENDAR_USER_SCOPE_SAFETY_LOCK
- ekran / trasa: Settings / Google Calendar sync-inbound / sync-outbound
- modul / pliki: src/server/google-calendar-outbound.ts, src/server/google-calendar-inbound.ts, work_items
- problem: personal Google Calendar sync needs a durable per-row owner/user field for calendar-visible work_items. Without it, a member sync can either over-sync the whole workspace or skip unowned records.
- dowod: previous outbound implementation fetched work_items only by workspace_id; inbound payload did not guarantee source_user_id/google_calendar_user_id persistence in older schemas.
- dlaczego to problem: private Google Calendar sync must not push another user's workspace tasks/events into a member's personal calendar.
- ryzyko: users may miss expected sync for records without owner fields until schema/product model is confirmed.
- priorytet wstepny: P1
- czy jest juz w etapach/kierunku: TAK, STAGE231F_R3_GOOGLE_CALENDAR_PERSONAL_SYNC_ITEM_SCOPE
- propozycja dalszego kroku: confirm work_items ownership schema and add SQL/guard if required; keep R1 fail-closed safety lock until then.
- decyzja Damiana: V1 ma byc personal sync, workspace-wide calendar only as later explicit admin mode.
- powiazany etap, jesli powstanie: STAGE231F_R3_GOOGLE_CALENDAR_PERSONAL_SYNC_ITEM_SCOPE
