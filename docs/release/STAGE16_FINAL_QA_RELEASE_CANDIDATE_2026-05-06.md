# Stage 16 - Final QA, routing, buttons and regression

## Cel
Dodać release-candidate evidence i statyczne guardy dla routingu oraz mapy głównych przycisków.

## Zakres
- route smoke test dla głównych ścieżek aplikacji,
- alias `/today` do Today,
- alias `/support` do SupportCenter,
- mapa przycisków z akcją, zapisem, access gate, toastem, loadingiem i błędem,
- manual QA checklist,
- release evidence command,
- env matrix bez sekretów.

## Nie zmieniono
- logiki produktowej,
- danych,
- billingu,
- AI,
- Google Calendar.

## Kryterium
Nie ma zielonego światła bez wygenerowanego release evidence i przejścia smoke/regression checks.
