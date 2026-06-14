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
