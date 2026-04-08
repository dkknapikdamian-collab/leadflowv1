# Product Scope V2

## Status

Ten plik jest od teraz nadrzędną prawdą produktu.
Jeżeli inny dokument opisuje produkt inaczej, ten plik ma pierwszeństwo.

## Definicja produktu

To nie jest już tylko lead follow-up app.

To jest **jeden system do domykania i uruchamiania klienta**.

## Zasada nadrzędna

- **Sprzedaż = Lead Flow**
- po statusie **won** albo **ready to start** lead może przejść do **sprawy operacyjnej**
- użytkownik nie ma czuć wejścia do drugiej aplikacji
- ma czuć ciągłość tego samego systemu

## Dwie warstwy, jeden rdzeń

### Warstwa 1: Sprzedaż / Lead Flow
System pilnuje:
- kto wymaga ruchu dziś,
- kto jest zagrożony,
- jaki jest next step,
- gdzie kasa może uciec,
- które leady są overdue albo zaniedbane.

### Warstwa 2: Start realizacji / kompletność
System pilnuje:
- czego klient jeszcze nie dosłał,
- czego jeszcze nie zatwierdził,
- co blokuje start,
- czy czekamy na klienta czy na nas,
- jaki jest następny ruch operacyjny.

## Najważniejsza decyzja architektoniczna

**ClientPilot nie jest osobną aplikacją.**

To jest jeden system.

### Reguła modelu produktu
- lead żyje w warstwie sprzedażowej,
- po **won** albo **ready to start** może zostać utworzona **sprawa**,
- sprawa przejmuje pilnowanie etapu operacyjnego,
- historia klienta ma pozostać spójna.

## Finalne menu operatora

- **Dziś**
- **Leady**
- **Sprawy**
- **Zadania**
- **Kalendarz**
- **Aktywność**
- **Rozliczenia**
- **Ustawienia**

Później:
- **Szablony**
- **Klienci**

## Kierunek UI

Nowa skórka UI ma być oparta o kierunek **ClientPilot**.

To oznacza jeden spójny visual system dla:
- sidebara,
- shella operatora,
- kart,
- stat cards,
- search/filter bar,
- list,
- detail headers,
- badge'y statusów,
- dialogów,
- formularzy,
- shella portalu klienta.

## Co zostaje z obecnego Lead Flow

Zostaje:
- filozofia panelu pilnowania ruchu,
- ekran `Dziś` jako centrum decyzji,
- logika next step / overdue / risk / waiting too long,
- zadania,
- kalendarz,
- przypomnienia,
- snooze,
- auth,
- billing,
- workspace,
- trial,
- jedna baza prawdy.

## Granice ETAPU 0

Ten dokument nie wdraża jeszcze:
- zmian w kodzie,
- zmian w logice danych,
- zmian w auth,
- zmian w billing.

To jest etap zamrożenia definicji produktu i jednej prawdy dokumentacyjnej.

## Reguła dla developera

Jeżeli trafisz na starą nazwę albo opis typu:
- lead follow-up app,
- osobna ClientPilot,
- osobny portal materiałów,

to traktuj to jako opis historyczny.

Aktualna definicja brzmi:

> **jeden system do domykania i uruchamiania klienta**

