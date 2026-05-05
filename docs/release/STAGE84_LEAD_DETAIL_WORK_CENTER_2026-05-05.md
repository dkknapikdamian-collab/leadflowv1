# Stage84 â€” Lead Detail jako centrum pracy

Data: 2026-05-05
Branch: dev-rollout-freeze

## Cel

DomknÄ…Ä‡ widok pojedynczego leada tak, ĹĽeby operator po wejĹ›ciu w rekord od razu widziaĹ‚:

- ostatni ruch,
- liczbÄ™ dni bez ruchu,
- najbliĹĽszÄ… zaplanowanÄ… akcjÄ™,
- powĂłd ryzyka,
- szybkie akcje bez skakania po ekranach.

## Zakres

Zmieniono:

- `src/pages/LeadDetail.tsx`
- `src/styles/visual-stage14-lead-detail-vnext.css`
- `scripts/check-stage84-lead-detail-work-center.cjs`
- `tests/stage84-lead-detail-work-center.test.cjs`

## Decyzja produktowa

To jest etap lekki i operacyjny. Nie dodaje nowego moduĹ‚u, nie zmienia flow lead -> sprawa i nie tworzy rekordĂłw automatycznie. Panel tylko zbiera istniejÄ…ce dane z leada, aktywnoĹ›ci, taskĂłw i wydarzeĹ„.

## Co sprawdziÄ‡ rÄ™cznie

1. WejĹ›Ä‡ w aktywnego leada.
2. SprawdziÄ‡, czy panel `Centrum pracy leada` pokazuje ostatni ruch i najbliĹĽszÄ… akcjÄ™.
3. UtworzyÄ‡ zadanie z poziomu panelu.
4. UtworzyÄ‡ wydarzenie z poziomu panelu.
5. DopisaÄ‡ notatkÄ™ z poziomu panelu.
6. WejĹ›Ä‡ w leada przeniesionego do obsĹ‚ugi i sprawdziÄ‡, czy gĹ‚ĂłwnÄ… akcjÄ… jest `OtwĂłrz sprawÄ™`.

## Kryterium zakoĹ„czenia

Lead Detail przestaje byÄ‡ tylko kartÄ… informacji. Jest maĹ‚ym centrum dowodzenia dla jednego leada.