# CloseFlow Metric Visual Parity Stage16A - 2026-05-08

CLOSEFLOW_METRIC_VISUAL_PARITY_STAGE16A

## Co bylo niespojne na screenach

- Kafelki w Zadaniach i Sprawach mialy rozne proporcje.
- Label AKTYWNE potrafil lamac sie w polowie slowa jako AKTYW / NE.
- Header strony Lista zadan nie byl wizualnie domkniety do wspolnego page hero.

## Zrodlo prawdy dla kafelkow

- Komponent: src/components/StatShortcutCard.tsx.
- Style: src/styles/closeflow-metric-tiles.css.
- Ton: data-eliteflow-metric-tone.

## Zrodlo prawdy dla page hero/header

- Style: src/styles/closeflow-page-header.css.
- Klasa: cf-page-hero.

## Ekrany podpiete

- TasksStable.tsx uzywa StatShortcutCard dla gornych metryk i cf-page-hero dla headera Lista zadan.
- Leads, Clients, Cases, AiDrafts i Activity pozostaja pod wspolnym kontraktem StatShortcutCard albo fallbackiem metryk opisanym w closeflow-metric-tiles.css.

## Jak globalnie zmienic wyglad

- Wysokosc kafla: --cf-metric-tile-min-height.
- Font labela: --cf-metric-tile-label-size.
- Font liczby: --cf-metric-tile-value-size.
- Rozmiar ikony: --cf-metric-tile-icon-size.
- Page hero/header: --cf-page-hero-* w closeflow-page-header.css.

## Decyzja

Stage16A blokuje overflow-wrap:anywhere w labelach kafelkow i chroni StatShortcutCard przed specjalnym fallbackiem TasksStable. Fallback moze stylowac tylko stare, hardcoded buttony, nie prawdziwe kafle StatShortcutCard.

## Co zostaje na Etap 16B

1. Weryfikacja wizualna po deployu na realnym UI.
2. Ewentualne dopiecie innych headerow do cf-page-hero, jesli screenshoty pokaza dalszy rozjazd.
3. Bez ruszania logiki danych, AI, billing, Supabase ani routingu.
