# CloseFlow — Calendar Skin Scope Repair + Deep Visual Audit V2

## Cel

Naprawić regresję po poprzedniej paczce kalendarza:

- globalny lewy sidebar / menu dostał białe kafelki po wejściu w Kalendarz,
- główna część kalendarza prawie się nie zmieniła,
- trzeba sprawdzić, czy aktywne są stare warstwy wizualne i gdzie mogą mieszać.

## Diagnoza

Poprzednia skórka używała szerokiego selektora:

```css
#root .cf-html-shell:has([data-cf-page-header-v2="calendar"]) ...
```

To było za szerokie.

`cf-html-shell` obejmuje cały shell aplikacji, więc gdy na stronie był header kalendarza, CSS mógł dotknąć także globalnego lewego menu.

## Naprawa

Nowy scope:

```css
#root [data-cf-page-header-v2="calendar"] ~ * ...
```

Czyli:

- stylujemy tylko elementy po headerze Kalendarza,
- nie stylujemy całego app shell,
- nie dotykamy globalnego menu,
- nie ukrywamy panelu bocznego w kalendarzu,
- nie zmieniamy danych ani JSX.

## Co zmienia paczka

Nadpisuje:

```text
src/styles/closeflow-calendar-skin-only-v1.css
```

Dopisuje marker do:

```text
src/pages/Calendar.tsx
```

Dodaje audyt:

```text
tools/audit-closeflow-calendar-skin-scope-repair-audit-v2.cjs
docs/ui/CLOSEFLOW_CALENDAR_SKIN_SCOPE_REPAIR_AUDIT_V2.generated.json
docs/ui/CLOSEFLOW_CALENDAR_SKIN_SCOPE_REPAIR_AUDIT_V2.generated.md
```

## Czego nie zmienia

- `Calendar.tsx` strukturalnie,
- renderowania panelu bocznego,
- API,
- Supabase,
- handlerów dodawania/edycji/usuwania,
- routingu,
- globalnego sidebaru.

## Wynik oczekiwany

Po deployu:

- lewy sidebar nie zmienia się na biały po wejściu w Kalendarz,
- kalendarz nadal ma jasną skórkę w treści,
- raport audytu pokaże aktywne stare importy i ryzykowne selektory.
