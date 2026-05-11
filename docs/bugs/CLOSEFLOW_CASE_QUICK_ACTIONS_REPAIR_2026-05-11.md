# CLOSEFLOW CASE QUICK ACTIONS REPAIR 2026-05-11

## Problem
Pierwsza paczka ETAP 5 uszkodziła JSX w `CaseDetail.tsx`: stary panel tworzenia akcji został przecięty w złym miejscu, co zostawiło niedomknięte tagi `aside/div/main`.

## Naprawa
Ta paczka najpierw przywraca śledzone pliki dotknięte przez nieudane wdrożenie do `HEAD`, potem aplikuje bezpieczniejszy wariant:

- dodaje `CaseQuickActions`,
- dodaje `AddCaseMissingItemDialog`,
- renderuje szybkie akcje na początku prawej kolumny `CaseDetail`,
- usuwa stary panel po markerach `data-case-create-actions-panel="true"` i `case-detail-create-action-card`, jeśli istnieje,
- dodaje check statyczny i build gate.

## Zakres
Nie zmienia relacji case -> client, routingu klienta, globalnej aktywności ani modelu checklist.
