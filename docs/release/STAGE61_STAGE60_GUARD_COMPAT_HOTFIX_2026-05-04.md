# STAGE61_STAGE60_GUARD_COMPAT_HOTFIX

Data: 2026-05-04
Branch: dev-rollout-freeze

## Cel
Naprawa kompatybilności guarda Stage60 po korekcie Stage61.

## Kontekst
Stage60 usunął zły przycisk notatki. Stage61 poprawił kierunek: właściwy przycisk notatki ma zostać w panelu create-actions, a usunięty ma być tylko górny duplikat w nagłówku sekcji „Najważniejsze działania”.

## Zmiana
Guard Stage60 nie wymaga już starego tekstu `duplicate note action button removed by Stage60` w guardzie Stage57. Wymaga teraz kierunku Stage61: `note action button retained in create panel`.

## Runtime
Nie zmieniono runtime ani UI. Zmiana dotyczy tylko guard/test alignment.
