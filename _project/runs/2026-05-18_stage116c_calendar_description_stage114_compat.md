# Stage116C - Calendar DialogDescription Stage114 compatibility

## Status
DO WDROŻENIA / RELEASE GATE REPAIR.

## Problem
Stage116B V3 naprawił focused Stage116 guard i build, ale pełny `verify:closeflow:quiet` zatrzymał się na lokalnym guardzie `tests/stage114-calendar-modal-viewport-contract.test.cjs`.

Błąd z logu:
`Create event modal description missing.`

## Przyczyna
Stage116B V3 uprościł `DialogDescription` do bare taga pod obecny Stage116 regex, ale starszy Stage114D guard wymaga markerów opisu modala kalendarza, np. `data-calendar-modal-description="create-event"`.

## Decyzja
Nie wyłączać ani Stage116, ani Stage114D. Zrobić kompatybilny opis:
- jeden `DialogDescription` na header,
- opis z markerami `data-calendar-modal-description` i `data-stage114-calendar-modal-description`,
- tekst zawiera słowo `kalendarz`,
- Stage116 guard zostaje wymagający, ale akceptuje atrybuty na `DialogDescription`.

## Pliki
- `src/pages/Calendar.tsx`
- `tests/stage116-dialog-description-accessibility-contract.test.cjs`
- `tools/patch-stage116c-calendar-description-stage114-compat.cjs`
- `_project/runs/2026-05-18_stage116c_calendar_description_stage114_compat.md`

## Testy automatyczne
- `node --test tests/stage116-dialog-description-accessibility-contract.test.cjs`
- `node --test tests/stage114-calendar-modal-viewport-contract.test.cjs`, jeśli plik istnieje lokalnie
- `npm run build`
- `npm run verify:closeflow:quiet`

## Zasada procesu
Commit/push tylko po zielonym focused guard, build i full quiet release gate.

## Test ręczny
- Otworzyć modal dodawania wydarzenia w kalendarzu.
- Otworzyć modal dodawania zadania w kalendarzu.
- Otworzyć modal edycji wpisu z kalendarza.
- Konsola bez warningu Radix `Missing Description or aria-describedby`.
