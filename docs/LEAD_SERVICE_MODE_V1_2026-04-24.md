# Lead service mode V1

Data: 2026-04-24

## Cel

Po rozpoczeciu obslugi lead ma zostac archiwalnym zrodlem sprzedazy, a dalsza praca ma isc przez sprawe.

## Co zmienia etap

- przekierowanie po starcie obslugi idzie na aktualna trase /case/:id,
- LeadDetail dostaje flage leadOperationalArchive,
- szybkie dodawanie zadan z leada jest blokowane, gdy lead jest juz w obsludze,
- szybkie dodawanie wydarzen z leada jest blokowane, gdy lead jest juz w obsludze,
- operator dostaje jasny komunikat, ze dalsze akcje trzeba dodawac w sprawie.

## Dlaczego

V1 ma miec jedna prawde operacyjna po sprzedazy. Lead zostaje historia sprzedazy, a sprawa jest miejscem dalszej realizacji.

## Kryterium zakonczenia

- po starcie obslugi aplikacja prowadzi do /case/:id,
- LeadDetail nie tworzy nowych szybkich zadan i wydarzen dla leada bedacego juz w obsludze,
- test lead-service-mode-v1.test.cjs przechodzi,
- verify:closeflow:quiet przechodzi.
