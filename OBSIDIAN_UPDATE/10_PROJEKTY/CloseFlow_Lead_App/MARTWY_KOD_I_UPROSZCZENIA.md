# MARTWY_KOD_I_UPROSZCZENIA — CloseFlow / LeadFlow

Ten plik jest aktualizowany cyklicznie i nie wolno go kasować.
Powinien być sprawdzany codziennie rano.
Nowe znaleziska dopisywane są na górze.
Po faktycznym usunięciu albo uproszczeniu kodu wpis ma zostać jawnie zamknięty lub wykreślony w tym samym pliku z dowodem commita, testu albo guarda.
Nie wolno usuwać wpisów bez śladu.
Pełne znaleziska martwego kodu, halucynacji dokumentacji i uproszczeń dla tego projektu trafiają tylko tutaj.
Raporty godzinowe mogą zawierać tylko krótkie podsumowanie i ID wpisu.

---

## LF-DEAD-2026-07-01-004

- Data: 2026-07-01
- Projekt: CloseFlow / LeadFlow
- Pliki:
  - `src/pages/Today.tsx`
  - `src/pages/TodayStable.tsx`
  - `src/App.tsx`
  - `scripts/check-visual-stage17-today-hard-1to1.cjs`
  - `package.json`
- Znalezisko: `src/pages/Today.tsx` jest opisany w samym pliku jako nieaktywny legacy UI surface, a aktywny routing `/` i `/today` idzie przez `TodayStable`. Jednocześnie stary plik nadal zawiera dużą ilość runtime kodu, importów, CSS i markerów guardów. Guard `check-visual-stage17-today-hard-1to1` dalej wymaga markera w `src/pages/Today.tsx`, więc plik wygląda jak martwa powierzchnia utrzymywana dla historycznych guardów, nie dla publicznego runtime.
- Dowód:
  - `src/pages/Today.tsx` deklaruje `Legacy guard compatibility markers for inactive Today.tsx` i `Active / and /today route through TodayStable`.
  - `src/App.tsx` importuje aktywną stronę Today jako `lazyPage(() => import('./pages/TodayStable'), 'TodayStable')`.
  - `src/pages/TodayStable.tsx` deklaruje, że celowo omija legacy scheduler stack z `Today.tsx`.
  - `scripts/check-visual-stage17-today-hard-1to1.cjs` nadal wymaga markera `VISUAL_STAGE17_TODAY_HTML_HARD_1TO1` w `src/pages/Today.tsx`.
  - `package.json` ma `check:visual-stage17-today-hard-1to1` w długim łańcuchu `lint`.
- Sprawdzenia wykonane:
  - Sprawdzono routing w `src/App.tsx`.
  - Sprawdzono komentarze/status w `src/pages/Today.tsx`.
  - Sprawdzono aktywną implementację w `src/pages/TodayStable.tsx`.
  - Sprawdzono guard historyczny `scripts/check-visual-stage17-today-hard-1to1.cjs`.
  - Sprawdzono wpis w `package.json` i obecność guarda w łańcuchu lint.
- Ocena ryzyka: średnie. Samo usunięcie `Today.tsx` prawdopodobnie nie powinno zmienić publicznego runtime, ale może rozbić historyczne guardy i dokumentację wizualną. To wymaga najpierw decyzji, czy historyczne guardy mają zostać przepisane na `TodayStable`, zamknięte jako false positive, czy przeniesione do archiwum.
- Rekomendacja: `DECISION_NEEDED`
- Proponowany etap cleanup: `LF-DEAD-CLEANUP-TODAY-LEGACY-SURFACE-001`
- Status: `OPEN`
- Commit/test/guard po zamknięciu: `PENDING`
