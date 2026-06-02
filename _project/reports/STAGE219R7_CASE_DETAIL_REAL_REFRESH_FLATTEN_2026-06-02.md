# STAGE219-R7 - CaseDetail real refresh + flat cards

## FAKTY
- Stage219-R6 ZIP nie zmienił plików źródłowych, bo apply nie znalazł anchoru i finalny commit zawierał tylko raporty/skrypty.
- Użytkownik potwierdził, że dodane wydarzenie wciąż nie daje widocznej wzmianki w sprawie.

## ZAKRES
- Wspólny host dialogów wysyła event `closeflow:context-action-saved` po zapisie notatki, zadania albo wydarzenia.
- `CaseDetail` nasłuchuje eventu i odświeża dane sprawy.
- Dodana jest sekcja `Ostatnie działania w sprawie` dla ostatnich zadań/wydarzeń.
- Kolorowe kafle są spłaszczone, a cienkie opisy ukryte.
- Nazwa sprawy w górnym kaflu jest trzymana w jednym wierszu.

## TESTY
- `node scripts/check-stage219r7-case-detail-real-refresh-flatten.cjs`
- `npm run build`
- `git diff --check`

## CZEGO NIE RUSZANO
- Supabase schema
- SQL
- API
