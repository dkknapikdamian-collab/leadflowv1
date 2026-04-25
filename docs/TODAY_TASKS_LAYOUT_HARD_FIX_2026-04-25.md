# Today tasks layout hard fix

Data: 2026-04-25

## Cel

Naprawic widok Zadania na dzis, gdzie tytul zadania byl sciskany do pionowej kolumny po jednej literze.

## Przyczyna

Wiersz zadania pozwalal przyciskom i szybkiemu odkladaniu zabrac zbyt duzo szerokosci. Blok tekstu mial min-w-0 i mogl skurczyc sie prawie do zera.

## Zmiana

- glowne wiersze Today moga zawijac sie przez sm:flex-wrap,
- blok tekstu ma basis-full oraz sm:basis-72,
- grupa akcji moze zejsc do osobnego wiersza,
- szybkie odkladanie ma w-full i max-w-full,
- przyciski szybkiego odkladania maja whitespace-nowrap,
- test pilnuje, zeby nie wrocily klasy powodujace sciskanie tytulu.

## Kryterium zakonczenia

- npm.cmd run verify:closeflow:quiet przechodzi,
- Zadania na dzis nie pokazuja tekstu po jednej literze,
- przyciski moga byc pod tekstem, zamiast sciskac tytul.
