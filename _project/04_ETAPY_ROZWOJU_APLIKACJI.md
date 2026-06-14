# 04_ETAPY_ROZWOJU_APLIKACJI - CloseFlow / LeadFlow

Data utworzenia: 2026-06-12 23:59 Europe/Warsaw  
Status: ACTIVE / CANONICAL  
Typ: centralna kolejność etapów rozwoju aplikacji  
Repo: dkknapikdamian-collab/leadflowv1  
Branch: dev-rollout-freeze  
Canonical name: CloseFlow / LeadFlow  
Obsidian folder: 10_PROJEKTY/CloseFlow_Lead_App

## Cel pliku

Ten plik odpowiada na pytanie:

```txt
Co wdrażamy teraz, co później i w jakiej kolejności?
```

Ten plik nie jest ledgerem wszystkich starych hotfixów. Ma być czytelną kolejką etapów decyzyjnych.

Powiązane pliki centralne:

- `_project/04_KIERUNEK_ROZWOJU_APLIKACJI.md` - kierunek i uzasadnienie rozwoju,
- `_project/04_ZNALEZIONE_PROBLEMY_DO_ANALIZY.md` - problemy znalezione przez AI/audyt do decyzji Damiana,
- `_project/15_SQL_LEDGER_AND_TESTED_SQL.md` - spis SQL, migracji i testów SQL; każdy użyty SQL ma mieć wynik i status testu,
- `_project/07_NEXT_STEPS.md` - stary plik pomocniczy z historią i wieloma blokami; nie powinien być jedyną kolejką.

## Zasada etapów

Każdy etap musi mieć:

- audyt przed etapem,
- sprawdzenie, czy nie istnieje już częściowo,
- zakres,
- czego nie ruszać,
- guard/test,
- test ręczny dla Damiana,
- audyt po etapie,
- update `_project` i Obsidiana albo payload do synchronizacji,
- selektywny commit/push po PASS.

Nie wdrażać etapów z luźnej rozmowy, jeśli nie są wpisane albo potwierdzone w tym pliku.

## Kolejność główna - produkt i sprzedaż

### STAGE-A35-OWNER-CONTROL-BASELINE

Status: NAJBLIŻSZY GŁÓWNY ETAP DO ROZPISANIA / WDROŻENIA

Cel:

Zbudować pierwszy widoczny owner-control audit w aplikacji.

Ma pokazać:

- leady bez następnego kroku,
- leady bez kontaktu 7+ dni,
- leady bez kontaktu 14+ dni,
- sprawy bez ruchu,
- sprawy z wartością/pieniędzmi, ale bez następnego kroku,
- rekordy bez odpowiedzialnego,
- rekordy z notatką, ale bez zadania/follow-upu.

Widoczny efekt:

- właściciel widzi listę rzeczy do ruszenia,
- aplikacja pokazuje realne ryzyka, nie ozdobne metryki,
- wynik można użyć do demo i oferty CloseFlow Control Sprint.

Nie ruszać:

- AI parsera,
- ciężkiego BI,
- ERP/faktur/KSeF,
- automatycznych wysyłek.

Guard/test:

- guard wymaga metryk: no-next-step, 7d silence, 14d silence, stale cases, money-without-next-step,
- test ręczny: porównać liczby z listą leadów/spraw.

### STAGE-A35B-MANDATORY-NEXT-STEP-CONTRACT

Status: PO A35

Cel:

Każdy aktywny lead/sprawa ma mieć jasny następny krok albo świadomy status `brak kolejnego kroku`.

Zakres:

- ujednolicić definicję next step,
- pokazać last contact / next step / silence age / risk na detailach,
- dodać szybkie akcje: ustaw follow-up, dodaj zadanie, dodaj notatkę, oznacz jako martwy/utracony,
- historia aktywności ma zasilać status ryzyka.

Nie ruszać:

- AI Drafts rebuild,
- automatyzacji mail/SMS,
- pełnej przebudowy Today.

Guard/test:

- detail views mają widoczny kontrakt last-contact / next-step / silence-age / risk.

### STAGE231A2_DOCUMENT_BLOCKERS_LITE

Status: PO A35B ALBO RÓWNOLEGLE JAKO MAŁY ETAP, jeśli Damian chce szybki efekt sprzedażowy

Cel:

Dodać dokumenty/braki jako element kontroli procesu, nie jako martwe załączniki.

Zakres V1:

- dokument wymagany,
- dokument otrzymany,
- dokument do poprawy,
- dokument nie dotyczy,
- dokument blokuje leada/klienta/sprawę,
- opcjonalny link do pliku,
- notatka,
- data dodania,
- widoczność w LeadDetail i ClientDetail.

Ważne:

Na start preferowany jest wariant metadane/checklista/link, bez ciężkiego uploadu, jeżeli storage/RLS nie jest potwierdzone.

Nie ruszać:

- pełnego DMS,
- publicznego portalu klienta,
- storage upload, jeśli etap tego jawnie nie obejmuje,
- SQL/RLS bez osobnej decyzji.

Guard/test:

- dokumenty nie mieszają się z notatkami,
- status dokumentu nie ginie po odświeżeniu,
- brak dokumentu może być widoczny jako bloker.

### STAGE-A41-CONTACT-CADENCE-GRID

Status: PO A35B / PO DOCUMENT_BLOCKERS_LITE

Cel:

Dodać siatkę kontaktu: dziś, 1 dzień ciszy, 2 dni, 3 dni, 5 dni, 7 dni, 14 dni.

Zakres:

- rekord pokazuje osobę/firmę,
- typ: lead/klient/sprawa,
- ostatni kontakt,
- następny krok,
- wartość sprawy, jeśli istnieje,
- status ryzyka,
- szybkie akcje.

Nie ruszać:

- browser notifications jako głównej funkcji,
- sekwencera mailowego,
- automatycznych wysyłek.

Guard/test:

- bucket 7d/14d musi wynikać z obliczania ostatniego kontaktu, nie ze statycznego tekstu.

### STAGE-A42-LOST-LEAD-RESCUE

Status: PO A41

Cel:

Osobny ekran `Do odzyskania`.

Zakres:

- brak ruchu 7+ dni,
- 14 dni ciszy,
- brak następnego kroku,
- wartościowe leady bez aktywności,
- niedokończone szkice,
- leady bez właściciela,
- szybkie akcje: odezwij się dziś, utwórz zadanie, odłóż, dodaj notatkę, przygotuj szkic, oznacz jako martwy/utracony.

- automatyzacji marketingowych,
- wysyłki bez zatwierdzenia.

- ekran wymaga kryteriów 7d, 14d, no-next-step i quick actions.

### STAGE-A46-SALES-FUNNEL-MOVEMENT-VIEW

Status: PO A41 LUB PO A42, zależnie od aktualnego stanu lejka

Lejek ma pokazywać ruch, ciszę, brak kroku, ryzyko i pieniądze, nie tylko etap.

- etap,
- wiek kontaktu,
- ostatni kontakt,
- następny krok,
- dni bez ruchu,
- wartość/potencjalna prowizja,
- risk flag,
- szybkie akcje.

- forecastingu enterprise,
- kopii klasycznego kanbana CRM.

- karta lejka zawiera next-step, silence-age, risk, quick actions.

### STAGE-A45-FINANCE-WATCHLIST

Status: PO A42/A46

Lista pieniędzy do ruszenia, nie księgowość.

- sprawy z wartością, ale bez następnego kroku,
- prowizje do rozliczenia,
- wpłaty po terminie,
- brak daty płatności,
- korekty do sprawdzenia,
- duże kwoty bez ruchu 7+ dni.

- KSeF,
- fakturowania,
- banków,
- ERP,
- księgowości.

- finance watchlist nie importuje modułów księgowych/ERP ani nie obiecuje fakturowania.

### STAGE-A44-OWNER-DIGEST-WEEKLY-REPORT

Status: PO A35/A41/A42/A45, bo digest powinien korzystać z tych danych

Dzienny/tygodniowy raport właściciela jako lista decyzji.

Zakres daily:

- co dziś ruszyć,
- kto nie ma następnego kroku,
- kto ma 7/14 dni ciszy,
- które sprawy stoją,
- jakie pieniądze wymagają ruchu.

Zakres weekly:

- ile leadów weszło,
- ile leadów bez next step,
- ile 7d/14d ciszy,
- ile spraw bez ruchu,
- ile pieniędzy bez ruchu,
- największe ryzyko tygodnia.

- newslettera,
- dashboardu wykresów dla ozdoby,
- wysyłki maili, jeśli produkcyjny email nie jest gotowy.

- digest ma listę ryzyk i akcji, nie tylko metryki.

### STAGE-A36-DRAFTS-REBUILD

Status: PO OWNER-CONTROL CORE / NIE JAKO PIERWSZY WYRÓŻNIK

Jedna skrzynka szkiców: ręczny szkic, wklejony tekst, dyktowanie, parser, AI.

- zatwierdź jako lead,
- zatwierdź jako zadanie,
- zatwierdź jako wydarzenie,
- zatwierdź jako notatka,
- zatwierdź jako follow-up,
- zachowaj kontekst LeadDetail/ClientDetail/CaseDetail.

- automatycznej wysyłki wiadomości,
- automatycznego finalnego zapisu bez akceptacji.

- AI drafts confirm-first,
- brak automatycznego finalnego zapisu bez akceptacji.

### STAGE240_LEADFLOW_SMART_PROSPECTING_OPPORTUNITY_FINDER

Status: WYSOKA WARTOŚĆ / PÓŹNIEJ, po stabilizacji podstawowego CRM i owner-control core

Moduł pozyskiwania okazji sprzedażowych na podstawie branży, miasta i problemu/sygnału.

Zakres docelowy:

- użytkownik wybiera branżę, miasto i sygnał problemu,
- system znajduje firmy,
- system ocenia potencjał,
- system tworzy powód kontaktu,
- system zapisuje leady,
- system ustawia follow-up,
- wszystko trafia do obecnego flow CloseFlow.

Etapy późniejsze:

1. `STAGE240A_SMART_SEARCH_INPUT_AND_MANUAL_IMPORT`
2. `STAGE240B_OPPORTUNITY_REASON_SCHEMA`
3. `STAGE240C_AI_SCORING_AND_PRIORITY`
4. `STAGE240D_CREATE_LEADS_WITH_REASON_AND_FOLLOWUP`
5. `STAGE240E_MONTHLY_OPPORTUNITY_MONITORING`

Nie ruszać teraz:

- osobnej aplikacji,
- generycznej bazy firm,
- scrapera bez powodu kontaktu,
- pełnej automatyzacji bez kontroli użytkownika.

- każdy lead z tego modułu musi mieć problem/sygnał i powód kontaktu,
- nie wolno tworzyć pustej bazy firm bez uzasadnienia.

### STAGE-A47-CONTROL-SPRINT-OFFER

Status: PO A35 DEMO / MOŻE IŚĆ JAKO ETAP BIZNESOWY RÓWNOLEGLE

Spiąć produkt z usługą wdrożeniową.

- nazwa oferty: `CloseFlow Control Sprint`,
- readiness audit,
- porządkowanie danych,
- ustawienie etapów,
- next-step discipline,
- contact cadence,
- owner digest,
- podstawowy finance watchlist,
- jedno szkolenie.

Test:

- 10 rozmów/demo na danych z ostatnich 30 dni,
- próba sprzedaży Control Sprint.

## Etapy techniczne / safety backlog

Te etapy są ważne, ale nie są głównym wyróżnikiem sprzedażowym.

### STAGE232A_PUBLIC_PREVIEW_ROUTES_PRODUCTION_LOCK

Status: P1 / TECHNICAL SAFETY / DO WYKONANIA PRZED SZERSZYM TESTEM

Zablokować publiczne preview routes w produkcji, jeżeli pokazują prototyp albo dane wyglądające jak realne kontakty.

### STAGE232B_CHUNK_BOUNDARY_RUNTIME_STABILITY

Status: PO 232A

Sprawdzić, czy statyczne importy LeadDetail/ClientDetail są nadal potrzebne i czy lazy/chunk boundary jest stabilny.

### STAGE232C_AUTH_ENV_FAIL_CLOSED

Status: PO 232B

Auth/env ma fail-closed w produkcji i nie maskować złej konfiguracji service-role fallbackiem.

### STAGE232D_DOCS_ENCODING_SWEEP

Status: PO APP CORE

Naprawić aktywne README/.env/docs z mojibake bez przepisywania całej historycznej lawiny.

### STAGE232E_POLISH_MOJIBAKE_GUARD_SCOPE

Status: PO 232D

Rozdzielić runtime guard od docs/project-memory guard.

### STAGE232F_GUARD_RUNNER_CROSS_PLATFORM_CLEANUP

Status: PO 232E

Ustalić jeden główny release gate i uporządkować runner pod Windows/Linux.

## Aktualny następny najlepszy etap

Rekomendacja:

```txt
STAGE-A35-OWNER-CONTROL-BASELINE
```

Zastrzeżenie:

Jeśli aplikacja ma być zaraz pokazywana testerom publicznie, przed tym albo równolegle zrobić `STAGE232A_PUBLIC_PREVIEW_ROUTES_PRODUCTION_LOCK`, bo to jest safety/hygiene.

## Warunek aktualizacji tego pliku

Po każdym zatwierdzonym etapie zmienić status w tym pliku:

- DO_WDROZENIA,
- W_TRAKCIE,
- LOCAL_ONLY,
- PASS_LOCAL,
- PUSHED,
- BLOCKED,
- ODLOZONE,
- ZAMKNIETE.

Nie zostawiać kolejności tylko w czacie.

## 2026-06-14 10:05 Europe/Warsaw - STAGE231G_LEAD_DETAIL_OPERATIONAL_WIRING_AUDIT_AND_FIX

Status: DO_WDROZENIA_LOKALNIE_R2

Cel: domknąć LeadDetail jako centrum pracy: potencjał, następny krok, ryzyko i blokady mają mieć jasne CTA, a wiersze działań nie mogą się zlewać. R2 dodatkowo dopina widoczny potencjał przy dodawaniu leada.

Warunek zamknięcia: build, typecheck, guard stage231g, node test, git diff --check, test ręczny Damiana.
