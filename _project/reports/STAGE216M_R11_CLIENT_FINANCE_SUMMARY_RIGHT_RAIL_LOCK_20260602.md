# STAGE216M-R11 — ClientDetail finance, summary and right rail lock

## Cel
Domknąć dwa widoczne problemy po R10-R4:

1. W prawej szynie ClientDetail ma być widoczny trzeci kafel `Finanse klienta`.
2. Zakładka `Podsumowanie` nie może pokazywać jednego dużego kafla `Najbliższa zaplanowana akcja`; ma mieć trzy równe kafle: akcja, kompletność, finanse.

## Zakres
- CSS visual/source-truth lock dla prawej szyny ClientDetail.
- CSS visual/source-truth lock dla sekcji `Podsumowanie`.
- Guard kontraktu.
- Aktualizacja Obsidiana.

## Czego nie ruszano
- API.
- Supabase.
- Runtime płatności.
- Dane.
- Stage216D.
- Backup patchy.

## Testy
- `node tests/stage216m-r11-client-finance-summary-right-rail-lock-contract.test.cjs`
- `git diff --check`
- `npm run build`

## Następny krok
Po wdrożeniu porównać ekran klienta i potwierdzić:
- prawa szyna: `Najbliższe działania`, `Główna sprawa`, `Finanse klienta`;
- podsumowanie: trzy kafle, nie jeden wielki hero.
