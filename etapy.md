# etapy.md

## Status

To jest robocza roadmapa po scaleniu Lead Flow i Fortecy w jeden produkt.

## ETAP 0 — dokumentacja i jedna prawda produktu

### Cel
Zamknąć raz na zawsze, czym jest produkt po scaleniu.

### Wynik etapu
- istnieje nadrzędny dokument `product-scope-v2.md`,
- `agent.md`, `zakres_v1_lead_followup_app_2026-04-03.md`, `kierunek.txt` i `kontrola leadów.txt` nie przeczą już sobie,
- developer nie zgaduje, czy budujemy 1 system czy 2 aplikacje,
- mamy jasno zapisane, że `Sprawy` są modułem tego samego systemu.

### Czego nie robić w tym etapie
- nie ruszać kodu produktu,
- nie ruszać jeszcze modelu danych,
- nie ruszać auth,
- nie ruszać billingu.

## ETAP 1 — zamrożenie IA i shella produktu

### Cel
Przygotować shell produktu pod docelowe menu i nową strukturę ekranów.

### Zakres
- potwierdzić finalne menu operatora,
- przygotować miejsce dla `Sprawy`,
- utrzymać `Dziś` jako centrum dowodzenia,
- nie wprowadzać jeszcze ciężkiej logiki operacyjnej.

## ETAP 2 — przejście lead -> sprawa

### Cel
Dodać spójny model przejścia z warstwy sprzedaży do warstwy operacyjnej.

### Zakres
- zdefiniować moment przejścia po `won` albo `ready to start`,
- przygotować relację lead -> sprawa,
- utrzymać jedną historię klienta.

## ETAP 3 — moduł Sprawy

### Cel
Wprowadzić realny moduł po sprzedaży.

### Zakres
- lista spraw,
- status sprawy,
- kompletność,
- blokery,
- następny ruch operacyjny,
- podstawowa oś aktywności.

## ETAP 4 — portal klienta

### Cel
Dać klientowi wejście do tej samej sprawy przez link.

### Zakres
- checklisty,
- uploady,
- akceptacje,
- brakujące materiały,
- prosty status kompletności.

## ETAP 5 — dashboard połączony

### Cel
Połączyć warstwę sprzedaży i warstwę operacyjną na ekranie `Dziś`.

### Zakres
- zaległości sprzedażowe,
- zaległości operacyjne,
- blokady po sprzedaży,
- priorytety dnia dla operatora.

## ETAP 6 — domknięcie platformy

### Cel
Domknąć dostęp, płatności, stabilność i spójność końcową.

### Zakres
- access control,
- billing,
- trial,
- QA,
- edge-case flow,
- spójność mobilna i desktopowa.

## Kolejność nadrzędna

1. Jedna prawda produktu
2. Jedna IA
3. Lead -> sprawa
4. Sprawy
5. Portal klienta
6. Dashboard połączony
7. QA / access / billing polish
