# STAGE34 - Calendar readability, completed status and form contrast

## Cel

Poprawić kalendarz bez zmiany routingu, API i modelu danych.

Zakres:
- czytelniejsze wpisy w widoku miesiąca,
- brak obcinania istotnego tekstu w kalendarzu,
- wpisy zrobione zostają w kalendarzu, ale są wyraźnie przekreślone,
- tygodniowy kalendarz dostaje szersze źródła dat zadań i leadów,
- formularze dodawania/edycji zadań, wydarzeń i powiązań mają biały input + ciemny tekst,
- modale nie są przycinane na telefonie.

## Zmienione pliki

- `src/styles/stage34-calendar-readability-status-forms.css`
- `src/index.css`
- `src/pages/Calendar.tsx`
- `src/lib/scheduling.ts`
- `src/lib/calendar-items.ts`
- `scripts/apply-stage34-calendar-readability-status-forms.cjs`
- `scripts/check-stage34-calendar-readability-status-forms.cjs`

## Nie zmieniaj

- logiki auth,
- routingu,
- API,
- Supabase schema,
- modelu danych,
- billing/access.

## Test ręczny

Sprawdź:
1. Kalendarz, widok miesiąca.
2. Czy dłuższe tytuły są czytelniejsze i nie zamieniają się w nieczytelne strzępy.
3. Czy wpisy `zrobione` są przekreślone.
4. Kalendarz tygodniowy, czy widzi zadania z `dueAt`, `scheduledAt`, `nextActionAt`, `followUpAt`.
5. Formularz dodawania wydarzenia.
6. Formularz edycji wydarzenia.
7. Formularz dodawania zadania.
8. Mobile 390px, 430px, 768px.

## Kryterium zakończenia

- brak białego tekstu na białym / ciemnym tle w formularzach,
- widok miesiąca jest czytelniejszy,
- wykonane wpisy są wizualnie przekreślone,
- tygodniowy kalendarz widzi więcej właściwych wpisów,
- `lint` i `build` przechodzą.
