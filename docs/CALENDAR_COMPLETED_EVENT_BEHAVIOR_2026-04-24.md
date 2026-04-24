# Calendar completed event behavior

Data: 2026-04-24

## Problem

W kalendarzu zadania ze statusem `done` były przekreślane i przesuwane na dół dnia, ale wydarzenia oznaczone jako `completed` dalej wyglądały jak aktywne.

## Decyzja

Kalendarz traktuje jako wykonane:

```text
task.status = done
event.status = completed
event.status = done
```

## Efekt w UI

Wykonany wpis:

- zostaje w tym samym dniu,
- jest wyszarzony,
- jest przekreślony,
- trafia na dół listy dnia.

## Zakres

Zmiana dotyczy tylko prezentacji i sortowania wpisów w kalendarzu.
