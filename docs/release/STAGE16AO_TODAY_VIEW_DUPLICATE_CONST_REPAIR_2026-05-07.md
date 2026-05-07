# Stage16AO - Today view customizer duplicate const repair

Cel: naprawic lokalny stan po przerwanym Stage16AN, gdzie `TODAY_VIEW_STORAGE_KEY` zostal wstawiony dwa razy i build Vite padal na duplikacie symbolu.

Zakres:
- `src/pages/TodayStable.tsx`
- `package.json`
- `scripts/check-today-view-customizer.cjs`
- `tests/today-view-customizer.test.cjs`

Kryterium:
- `TODAY_VIEW_STORAGE_KEY` wystepuje dokladnie raz.
- Przycisk `Widok` pozostaje w ekranie Dzis.
- Widocznosc kafelkow i list jest kontrolowana przez zapis w localStorage.
- Build, check, test krytyczny i quiet release gate przechodza.
