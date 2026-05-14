# CLOSEFLOW_CALENDAR_SELECTED_DAY_HANDLERS_RUNTIME_FIX_V10_FINALIZE_2026-05-13

Finalizacja po przerwanym V9.

Cel:
- nie uruchamiać `git ls-files --error-unmatch` na nieistniejących plikach,
- nie generować TypeScriptu jako kruchych stringów w helperze,
- nie wracać do kolejnych drobnych repairów,
- zamknąć częściowo zastosowany V9,
- zachować kompatybilne nazwy handlerów wymagane przez istniejące guardy.

Zakres:
- `src/pages/Calendar.tsx`
- aktywne pliki V9, jeśli istnieją
- nowy guard V10 finalize

Ważne:
- stare nieudane helpery V1-V8 są usuwane tylko z working tree i indeksu,
- inne lokalne śmieci z ClientDetail / VisualSystem / FIN14 nie są ruszane.
