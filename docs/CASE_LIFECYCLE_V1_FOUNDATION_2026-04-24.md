# Case lifecycle V1 foundation

Data: 2026-04-24

## Po co to jest

Ten etap dodaje wspólną logikę, która opisuje realny stan sprawy po przejściu leada do obsługi.

## Co rozpoznaje

```text
blocked
waiting_approval
ready_to_start
in_progress
completed
needs_next_step
```

## Dlaczego to ważne

Sprawa ma być jedną prawdą operacyjną po sprzedaży. Lead zostaje historią pozyskania, a dalsze decyzje i praca mają wynikać ze stanu sprawy.

## Co zwraca logika

- czy sprawa jest zablokowana,
- czy czeka na akceptację,
- czy jest gotowa do startu,
- czy jest w realizacji,
- czy jest zakończona,
- czy brakuje kolejnego kroku,
- jaki jest najbliższy sensowny ruch operatora.

## Zakres

To jest fundament bez zmiany wyglądu ekranu. Następny etap może podpiąć tę logikę do CaseDetail jako panel "co teraz zrobić".
