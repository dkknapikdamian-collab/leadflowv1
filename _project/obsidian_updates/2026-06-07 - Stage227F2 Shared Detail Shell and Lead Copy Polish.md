# Stage227F2 — Shared Detail Shell and Lead Copy Polish

Data: 2026-06-07 Europe/Warsaw
Projekt: CloseFlow / LeadFlow
Typ wpisu: UI polish / shared layout

## Decyzja

Naprawiamy to jako wspólny problem layoutowy, nie jako osobne łatki dla ClientDetail i CaseDetail.

## Wdrożono lokalnie

- LeadDetail: naprawa ucinanego przycisku Kopiuj/etykiety Telefon w headerze.
- ClientDetail i CaseDetail: wspólny shell/gutter/szerokość contentu.
- Guard/test Stage227F2.

## Czego nie ruszano

- SQL
- Supabase
- logika danych
- akcje
- notatki
- finanse
- kalendarz

## Test ręczny

- LeadDetail: sprawdzić, czy Telefon + Kopiuj nie są ucięte.
- ClientDetail: sprawdzić szerokość, fosa, czytelność kart.
- CaseDetail: sprawdzić szerokość, fosa, czytelność kart.
