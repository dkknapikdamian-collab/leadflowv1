# STAGE227G1R1 — Today Reason Copy + Shift Visibility Repair

## Cel
Domknąć wizualny błąd po G1: w Dziś nie wolno pokazywać tekstu "Powód:" i przy kartach task/event muszą być widoczne akcje +1D/+3D/+1W.

## Zakres
- TodayStable: usuwa wszystkie runtime helpery zaczynające się od "Powód:".
- WorkItemCard: filtruje helper zaczynający się od Powód/Powod nawet jeżeli jakiś widok go poda.
- WorkItemCard: utrzymuje widoczne shiftActions z klasami kalendarza.

## Poza zakresem
- Brak SQL.
- Brak zmiany modelu danych.
- Brak pushu w tym kroku.
