# CloseFlow — Calendar Color + Tooltip Skin V2

## Cel

Poprawić to, czego nie załatwiła sama jasna skórka:

1. dodać wyraźniejsze kolory wpisów w kalendarzu,
2. dodać tooltip na hover, gdy tekst w kafelku jest ucięty,
3. nie ruszać globalnego sidebaru,
4. nie zmieniać struktury kalendarza ani logiki danych.

## Decyzja

To nadal jest bezpieczny etap visual-only + mały runtime enhancer.

Nie przebudowujemy miesiąca. Dodajemy efekt w `Calendar.tsx`, który po renderze:
- rozpoznaje krótkie etykiety `Zad`, `Zadanie`, `Wyd`, `Wydarzenie`, `Tel`, `Telefon`, `Lead`,
- dodaje im `data-cf-calendar-kind`,
- dodaje rodzicowi `data-cf-calendar-row-kind`,
- długim lub uciętym tekstom dodaje natywny `title`,
- dzięki temu po najechaniu widać pełny tekst.

## Źródło prawdy

Nowy plik:

```text
src/styles/closeflow-calendar-color-tooltip-v2.css
```

Kolory:
- wydarzenie: fiolet,
- zadanie: zieleń,
- telefon/lead: niebieski,
- usuń: czerwony.

## Nie zmienia

- API,
- Supabase,
- tworzenia zadań,
- tworzenia wydarzeń,
- edycji,
- usuwania,
- routingu,
- layoutu sidebaru.

## Audyt

Generuje:
- `docs/ui/CLOSEFLOW_CALENDAR_COLOR_TOOLTIP_V2_DEEP_AUDIT.generated.md`
- `docs/ui/CLOSEFLOW_CALENDAR_COLOR_TOOLTIP_V2_DEEP_AUDIT.generated.json`
