# Calendar entry relation links

Data: 2026-04-24

## Problem

Wpisy w kalendarzu mogły być powiązane z leadem albo sprawą, ale użytkownik nie miał szybkiego przejścia z poziomu samego wpisu.

## Decyzja

Każdy wpis kalendarza z relacją pokazuje szybkie linki:

```text
leadId -> Otwórz lead
caseId -> Otwórz sprawę
```

## Efekt w UI

- Użytkownik może z wydarzenia przejść do powiązanego leada.
- Użytkownik może z zadania przejść do powiązanej sprawy.
- Kalendarz staje się centrum operacyjnym, a nie tylko listą terminów.

## Zakres

Zmiana dotyczy tylko prezentacji wpisów w kalendarzu.
Nie zmienia zapisu danych, SQL ani logiki statusów.
