# STAGE220A35 — Client Commission Finance Source Truth — REPORT

Data: 2026-06-05 21:05 Europe/Warsaw

## FAKTY
- Wartość transakcji/sprawy i prowizja są osobnymi pojęciami.
- Dla 69 000 PLN i 2% prowizja należna wynosi 1 380 PLN.
- ClientDetail nie powinien pokazywać 69 000 PLN jako kwoty prowizji do domknięcia.

## DECYZJE
- Wartość transakcji zostaje podstawą procentu.
- Prowizja stała zostaje wpisywana jako gotowa kwota.
- Klient pokazuje prowizję należną/wpłaconą/do zapłaty, a wartość transakcji jako osobną informację.

## AUDYT RYZYK
- Ryzyko błędnego lejka sprzedażowego: Stage227 musi dziedziczyć poprawione wartości prowizyjne.
- Ryzyko UX: użytkownik musi widzieć różnicę między wartością transakcji i prowizją.
- Ryzyko danych: nie zmieniano schematu bazy ani RLS.

## STATUS
Do testu lokalnego i push po PASS.
