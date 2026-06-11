

# STAGE231D0D_R4_TOTAL_TO_COLLECT_AND_JSX_RESCUE

Data: 2026-06-11 Europe/Warsaw

Status: przygotowano R4 rescue po częściowym R3.

Fakty wejściowe:
- R3 patch applied, ale guard zatrzymał etap na braku tekstu "Razem do pobrania" w pierwszej karcie rozliczenia.
- W pliku istnieje caseCostsSummaryStage231D2.totalToCollectAmount, więc R4 używa istniejącego modelu kosztów.

Zakres zmian:
- src/pages/CaseDetail.tsx
- src/styles/visual-stage13-case-detail-vnext.css
- _project aktualizacje

Brak zmian:
- SQL
- model kosztów
- Google Calendar
- ClientDetail runtime
