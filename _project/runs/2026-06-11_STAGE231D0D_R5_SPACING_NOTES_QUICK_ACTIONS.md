# STAGE231D0D-R5 - spacing / notes lift / quick actions cleanup

Data: 2026-06-12 07:39 Europe/Warsaw
Status: READY_FOR_TEST

## Zmiany
- Naprawiono składnię guardów R2/R3/R4.
- Dodano R5 guard/test.
- Podciągnięto notatki do góry przez CSS override.
- Ujednolicono odstęp kafelków na 14px.
- Delikatnie podniesiono prawy rail.
- Usunięto "Wpłata prowizji" z CaseQuickActions.
- Wpłata prowizji zostaje w rozliczeniu sprawy.

## Testy
- R5 guard/test
- R4 guard/test
- R3 guard/test
- R2 guard/test
- D0C/D0B regression
- git diff --check
- npm run build

## Ryzyka
- Sprawdzić ręcznie 100% scale.
- Sprawdzić mobile/tablet.
- Sprawdzić, czy przyciski w rozliczeniu dalej otwierają wpłatę i koszt.

---

## 2026-06-12 07:58 Europe/Warsaw - STAGE231D0D-R5 repair after red guard push

Status: REPAIR_READY_FOR_TEST

Naprawa:
- usunięto "Wpłata prowizji" z CaseQuickActions,
- dodano "Dodaj koszt" do kompaktowego rozliczenia sprawy,
- dodano spacing marker i wspólny odstęp kafelków 14px,
- dodano micro-lift prawego raila,
- zachowano wpłatę prowizji tylko w rozliczeniu sprawy.

Powód:
Poprzedni R5 został wypchnięty mimo czerwonych guardów po błędzie ścieżek względnych .NET/PowerShell.
