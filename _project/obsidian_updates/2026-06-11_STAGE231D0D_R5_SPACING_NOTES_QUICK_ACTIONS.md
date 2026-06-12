# Obsidian update - STAGE231D0D-R5

Data: 2026-06-12 07:39 Europe/Warsaw
Projekt: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze

## Decyzja Damiana
- Notatki wyciągnąć wyżej.
- Zachować spójny odstęp między kafelkami.
- Prawy rail można delikatnie podnieść.
- Z szybkich akcji usunąć "Wpłata prowizji".
- Wpłata prowizji zostaje w rozliczeniu sprawy.

## Status
Do zapisania po PASS/PUSH.

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
