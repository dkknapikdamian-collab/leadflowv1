# STAGE49 â€” ClientDetail readable next action and note actions

## Cel

NaprawiÄ‡ dwa realne problemy UX na ekranie klienta:

1. Tekst najbliĹĽszej/nastÄ™pnej akcji potrafiĹ‚ byÄ‡ niewidoczny przez biaĹ‚y tekst na jasnym tle.
2. W sekcji notatek przyciski typu `Dyktuj` i `Dodaj notatkÄ™` mogĹ‚y byÄ‡ niewidoczne lub wyglÄ…daÄ‡ jak puste elementy.

## Zakres

- Tylko `ClientDetail`.
- Tylko kontrast i widocznoĹ›Ä‡ akcji.
- Bez zmiany API, danych, Supabase, routingu i logiki biznesowej.

## Zmienione pliki

- `src/styles/visual-stage12-client-detail-vnext.css`
- `scripts/check-stage49-client-detail-visible-actions.cjs`
- `tests/stage49-client-detail-visible-actions.test.cjs`
- `package.json`

## Weryfikacja

- `npm.cmd run check:stage49-client-detail-visible-actions`
- `node --test tests/stage49-client-detail-visible-actions.test.cjs`
- `npm.cmd run build`

## Kryterium zakoĹ„czenia

Na ekranie klienta tekst nastÄ™pnej akcji oraz przyciski notatek sÄ… widoczne na jasnym tle.
