# CLOSEFLOW_CLIENT_DETAIL_NEXT_ACTION_TILE_POLISH_2026-05-12

## Cel
Poprawa kafelka â€žNajbliĹĽsza zaplanowana akcjaâ€ť na widoku klienta.

## Zakres
- Plik widoku: `src/pages/ClientDetail.tsx`
- Plik stylu: `src/styles/visual-stage12-client-detail-vnext.css`
- Guard: `scripts/check-client-detail-next-action-tile-polish-2026-05-12.cjs`

## Co naprawia etap
- kafelek nie jest juĹĽ Ĺ›ciskany przez rĂłwne wiersze bocznej kolumny,
- gĹ‚Ăłwny tytuĹ‚ akcji ma czytelnÄ… hierarchiÄ™ i moĹĽe siÄ™ zawijaÄ‡,
- opis, termin i kontekst nie sÄ… ucinane,
- chip/status nie przykleja siÄ™ do tekstu,
- zmiana jest ograniczona do ClientDetail i nie zmienia logiki danych.

## Kryterium zakoĹ„czenia
- `node scripts/check-client-detail-next-action-tile-polish-2026-05-12.cjs` przechodzi,
- `npm run build` przechodzi,
- w UI kafelek â€žNajbliĹĽsza zaplanowana akcjaâ€ť jest wyĹĽszy, czytelny i nie ucina treĹ›ci.