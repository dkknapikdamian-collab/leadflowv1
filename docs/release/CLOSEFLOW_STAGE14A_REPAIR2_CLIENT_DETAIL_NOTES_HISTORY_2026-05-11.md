# CloseFlow Stage 14A Repair2 — ClientDetail notes/history

## Cel

Domknięcie czerwonego checka po Stage14A. Poprzednia komenda przepuściła commit mimo błędu checka, bo PowerShell nie zatrzymał się na niezerowym exit code z npm.

## Zakres

- ClientDetail: zakładka Sprawy jako domyślna i pierwsza w kontrakcie typu.
- ClientDetail: usunięcie akcji Dodaj notatkę z bocznych szybkich akcji.
- ClientDetail: realna lista notatek klienta pod kartą notatki, z jednowierszowym skrótem i title.
- ClientDetail: historia i ostatnie ruchy bez technicznego bełkotu typu client_note / Aktywność klienta / Brak daty.
- PowerShell: komenda Repair2 ma zatrzymywać się po każdym nieudanym checku/buildzie przez $LASTEXITCODE.

## Nie zmieniać

- Nie usuwać karty Krótka notatka.
- Nie zmieniać modelu klienta.
- Nie przenosić pracy operacyjnej ze sprawy do klienta.
- Nie dodawać nowych statusów klienta.

## Weryfikacja

- npm.cmd run check:stage14a-clientdetail-notes-history-repair2
- npm.cmd run check:stage14a-clientdetail-notes-history
- npm.cmd run build
- test ręczny /clients/:id
