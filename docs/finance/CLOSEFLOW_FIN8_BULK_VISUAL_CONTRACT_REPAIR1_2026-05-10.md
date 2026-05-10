# CLOSEFLOW FIN-8 bulk visual contract repair REPAIR1 — 2026-05-10

## Cel

Naprawia błąd składni w narzędziu zbiorczej naprawy FIN-8/FIN-6. Poprzednia paczka przerwała pracę na parserze Node, zanim dotknęła aplikacji.

## Zakres

- Zachowuje podejście zbiorcze.
- Naprawia generowanie `PaymentList.tsx` bez zagnieżdżonych nieucieczonych template stringów.
- Nie zmienia zakresu biznesowego FIN-8.
- Nie stage’uje `docs/release` ani `docs/ui`.

## Bramki

Paczka odpala FIN-8, FIN-6, FIN-7, FIN-5, API-0, runtime data-contract, import-boundary, TypeScript i build.
