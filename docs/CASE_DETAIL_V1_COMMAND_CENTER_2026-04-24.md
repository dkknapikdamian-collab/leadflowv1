# Case Detail V1 command center

Data: 2026-04-24

## Co robi etap

Ten etap domyka szczegóły sprawy jako główne miejsce pracy po pozyskaniu tematu do obsługi.

Operator wchodzi w sprawę i od razu widzi:

- aktualny lifecycle sprawy,
- prosty opis, co się dzieje,
- następny ruch operatora,
- kompletność sprawy,
- liczbę braków, akceptacji i otwartych akcji,
- szybkie akcje: dodaj brak, zadanie, wydarzenie, portal, start, zakończ, wznów.

## Ważne założenie V1

Nie dodajemy wykresu. To ma być płaski, szybki panel roboczy, który prowadzi operatora do kolejnego ruchu.

## Zdarzenia w Activity

```text
case_lifecycle_started
case_lifecycle_completed
case_lifecycle_reopened
```

## Kryterium zakończenia

- `node --test tests/case-detail-v1-command-center.test.cjs` przechodzi,
- `npm.cmd run verify:closeflow:quiet` przechodzi,
- szczegóły sprawy pokazują centrum dowodzenia V1 bez psucia istniejących checklist, notatek, zadań i wydarzeń.
