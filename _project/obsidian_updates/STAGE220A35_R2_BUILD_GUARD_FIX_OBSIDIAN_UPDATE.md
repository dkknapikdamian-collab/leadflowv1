# OBSIDIAN UPDATE — STAGE220A35-R2 Build Guard Fix

data i godzina: 2026-06-05 21:20 Europe/Warsaw
nazwa / alias wejściowy: Stage220A35-R2 — Build Guard Fix after Client Commission Finance Source Truth
entity_id: DO_POTWIERDZENIA
workspace_id: DO_POTWIERDZENIA
project_id: CloseFlow_Lead_App / DO_POTWIERDZENIA
report_id: STAGE220A35_R2_BUILD_GUARD_FIX_REPORT
canonical_name: CloseFlow / LeadFlow
folder Obsidiana: 10_PROJEKTY/CloseFlow_Lead_App
typ wpisu: hotfix guardu/builda po Stage220A35
status zapisu: NIE ZAPISANO BEZPOŚREDNIO — manifest do ręcznego przeniesienia

## Wpis do testów
Stage220A35-R2 naprawia: syntax error w guardzie Stage220A35 oraz konflikt z Stage220A14, który wymagał tokenu "Suma wpłat" w ClientDetail. Testy wymagane:
- node scripts/check-stage220a14-finance-scope-guard-lock.cjs
- node scripts/check-stage220a35-client-commission-finance.cjs
- node --test tests/stage220a35-client-commission-finance.test.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

## Wpis do ryzyk
Stage220A35 nie może być traktowany jako zamknięty po commicie b41fa542, bo build zatrzymał się na Stage220A14, a guard Stage220A35 miał błąd składni. R2 musi przejść pełny build przed powrotem do Stage227.

## Następny krok
Po PASS i push zrobić ręczny test klienta/sprawy: 69 000 PLN, 2%, prowizja 1 380 PLN, bez 0 PLN w karcie sprawy.
