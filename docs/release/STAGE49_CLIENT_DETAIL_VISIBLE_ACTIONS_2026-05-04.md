# STAGE49 — ClientDetail readable next action and note actions

## Cel

Naprawić dwa realne problemy UX na ekranie klienta:

1. Tekst najbliższej/następnej akcji potrafił być niewidoczny przez biały tekst na jasnym tle.
2. W sekcji notatek przyciski typu `Dyktuj` i `Dodaj notatkę` mogły być niewidoczne lub wyglądać jak puste elementy.

## Zakres

- Tylko `ClientDetail`.
- Tylko kontrast i widoczność akcji.
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

## Kryterium zakończenia

Na ekranie klienta tekst następnej akcji oraz przyciski notatek są widoczne na jasnym tle.
