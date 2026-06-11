# STAGE231D0B-R10/R7 - Client finance chip start alignment

Data: 2026-06-11 HH:mm Europe/Warsaw
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze

## FAKTY Z KODU

- R10/R6 istnieje w CSS source truth i ustawia wspolny grid dla primary/secondary ClientListCard.
- Finance chips sa w kolumnie 4.
- Manual QA pokazal, ze ogolny layout jest dobry, ale tekst chipow finansowych nie zaczyna sie w tej samej osi.

## DECYZJA DAMIANA

- Wyrownac start tekstu "Aktywna prowizja" i "Zarobione lacznie".
- Nie wymuszac rownej szerokosci chipow.
- Dlugosc tekstu moze dyktowac koniec chipa.

## ZMIANY

- Dodano blok CSS STAGE231D0B-R10-R7_FINANCE_CHIP_START_ALIGN.
- Dodano justify-items/start oraz place-self center start dla chipow finansowych.
- Zaktualizowano guard D0B o marker R10/R7.

## TESTY DO URUCHOMIENIA

- npm run check:stage231d0b-client-list-card-freeze
- node --test tests/stage231d0b-client-list-card-freeze.test.cjs
- git diff --check
- npm run build

## MANUAL QA

- /clients po deployu.
- Chipa "Aktywna prowizja" i "Zarobione lacznie" zaczynaja sie w tej samej osi.
- Chipa moga miec rozna dlugosc.
- Nie ma nachodzenia tekstu na sasiednie pola.

## RYZYKA

- To etap wizualny; automatyczny guard nie mierzy pikseli.
- Jesli po deployu nadal widac przesuniecie, nastepna korekta powinna dotyczyc tylko CSS finance column, bez ruszania danych.
