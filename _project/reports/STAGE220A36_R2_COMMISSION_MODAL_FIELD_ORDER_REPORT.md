# STAGE220A36-R2 — Commission Modal Field Order — REPORT

Data: 2026-06-05 22:00 Europe/Warsaw

## FAKTY
- Stage220A36 działał logicznie, ale kolejność pól dalej mogła mylić.
- R2 ustawia kolejność: rodzaj prowizji → stawka procentowa → wartość prowizji → podstawa procentu → waluta/status.
- Prowizja stała pozostaje ręcznie wpisywaną wartością prowizji.
- Prowizja procentowa pozostaje wyliczana od osobnej podstawy transakcji/zlecenia.

## AUDYT RYZYK
- Nie ruszano Supabase, RLS, backendu płatności ani obliczeń helpera.
- Zmiana dotyczy UI, guardów i testów.
- Manualny test musi sprawdzić fixed i percent w modalu.

## STATUS
Do testu lokalnego i push po PASS.
