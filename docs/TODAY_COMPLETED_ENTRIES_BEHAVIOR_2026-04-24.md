# Today completed entries behavior

Data: 2026-04-24

## Problem

Ekran Dziś pokazuje zadania, wydarzenia i akcje leadów. Po naprawie kalendarza wykonane wydarzenia powinny zachowywać się spójnie także tutaj.

## Decyzja

Ekran Dziś traktuje jako wykonane:

```text
task.status = done
event.status = completed
event.status = done
```

## Efekt w UI

Wykonany wpis:

- zostaje widoczny w danym dniu,
- jest traktowany jako zakończony,
- trafia pod aktywne wpisy,
- może zostać przywrócony przez tę samą akcję.

## Zakres

Zmiana dotyczy sortowania i rozpoznawania wykonanych wpisów na ekranie Dziś.
