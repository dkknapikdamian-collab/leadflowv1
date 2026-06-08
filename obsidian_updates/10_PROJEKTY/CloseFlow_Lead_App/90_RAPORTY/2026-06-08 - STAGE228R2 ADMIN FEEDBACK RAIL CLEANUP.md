# 2026-06-08 - STAGE228R2 ADMIN FEEDBACK RAIL CLEANUP

## FAKT
- Wdrożono cleanup po `closeflow_admin_feedback_2026-06-08_08-43.json`.
- Usunięto tylko wpisy jednoznaczne: karty opisowe oraz tekst trial/free w prawym Billing railu.
- Wpisy z samą kropką potraktowano jako tropy wizualne.

## ZMIANY
- Billing: bez karty `AI jako dodatek Beta`.
- Billing: prawy `Status konta` bez długiego opisu.
- Notifications: bez karty `Jak działają powiadomienia?`.
- AI Drafts: bez karty `Jak działa szkic?`.
- Funnel: separator przez `\u00b7`, bez mojibake.
- CSS source: `admin-feedback-rail-cleanup-stage228r2.css`.

## TESTY
- PASS guard Stage228R2.
- PASS Stage228R1 guard.
- PASS build.
- SKIP pełnego visual smoke: lokalnie widok zatrzymał się na `Ładowanie widoku...`.

## DO POTWIERDZENIA
- Ręcznie sprawdzić `/billing`, `/notifications`, `/ai-drafts`, `/funnel`.
