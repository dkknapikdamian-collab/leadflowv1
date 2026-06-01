# CloseFlow / LeadFlow - Stage216M-R6-R2 Client data card polish

## FAKTY
- Etap dotyczy wyłącznie karty `Dane klienta` w `ClientDetail`.
- Wzorem jest karta `Dane leada` w `LeadDetail`.
- Po Stage216M-R6-R1 przycisk `Edytuj dane` nadal wymaga dopasowania pozycji, koloru i wymiaru.

## DECYZJE DAMIANA
- Poprawić ułożenie przycisku `Edytuj dane`.
- Zrobić przycisk niebieski.
- Dostosować wysokość i szerokość kafelka do wzoru z leada.

## HIPOTEZY AI
- Problem jest CSS-owy, nie wymaga zmiany API ani danych.
- Najbezpieczniejszy patch to nadpisanie finalnego stylu karty po Stage216M-R6-R1.

## TESTY
- Guard Stage216M-R6-R2.
- `git diff --check`.
- `npm run build`.

## NASTĘPNY KROK
Po wdrożeniu porównać screenshoty `Dane klienta` i `Dane leada` na tym samym viewportcie.
