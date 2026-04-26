# Today quick snooze test selfcheck fix

Data: 2026-04-26

## Problem

Poprzedni test miał własny self-check, który szukał tekstu `assert.match(source,`.

Ten tekst występował w samym regexie self-checka, więc test wykrywał samego siebie i padał.

## Zmiana

- usunięto self-check, który sam siebie łapał
- zostawiono krótkie komunikaty błędów przez expectText / expectPattern
- nie zmieniono logiki aplikacji
- nie zmieniono release gate

## Kryterium zakończenia

- `npm.cmd run verify:closeflow:quiet` przechodzi
- `node scripts/scan-polish-mojibake.cjs` przechodzi
