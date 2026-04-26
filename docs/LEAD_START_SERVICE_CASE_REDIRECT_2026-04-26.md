# Lead start service case redirect

Data: 2026-04-26

## Problem

Po kliknięciu "Rozpocznij sprawę" przy leadzie użytkownik powinien od razu trafić do szczegółów sprawy.

W aplikacji główny widok szczegółów sprawy działa pod adresem /case/:caseId. Część logiki używała jednak /cases/:caseId, co mogło prowadzić do złego widoku albo powrotu na listę.

## Zmiana

- redirect po rozpoczęciu obsługi leada prowadzi na /case/:caseId
- linki do szczegółów sprawy w LeadDetail są znormalizowane do /case/:caseId
- App.tsx zachowuje alias /cases/:caseId jako zabezpieczenie dla starszych linków
- testy release gate pilnują, żeby ten błąd nie wrócił

## Sprawdzenie ręczne

1. Wejdź w szczegóły leada.
2. Kliknij "Rozpocznij sprawę".
3. Po sukcesie aplikacja ma od razu otworzyć szczegóły konkretnej sprawy.
4. W tej sprawie można dalej uzupełniać dane.

## Kryterium zakończenia

- npm.cmd run verify:closeflow:quiet przechodzi
- node scripts/scan-polish-mojibake.cjs przechodzi
