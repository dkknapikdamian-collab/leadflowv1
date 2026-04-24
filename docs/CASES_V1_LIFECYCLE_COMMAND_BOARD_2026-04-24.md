# Cases V1 lifecycle command board

Data: 2026-04-24

## Co robi etap

Ten etap podpina fundament cyklu życia sprawy bezpośrednio pod listę Spraw.

Operator nie musi zgadywać, czy sprawa stoi, czeka na akceptację, jest gotowa czy po prostu nie ma kolejnego kroku.

## Zakres

- lista Spraw pobiera zadania i wydarzenia powiązane ze sprawami,
- każda sprawa dostaje wynik z `resolveCaseLifecycleV1`,
- kafelki statystyk pokazują dodatkowo `Akceptacje` oraz `Bez kroku`,
- lista Spraw ma filtry `approval` i `needs_next_step`,
- karta sprawy pokazuje prosty komunikat: co się dzieje i jaki jest następny ruch operatora,
- karta pokazuje też ryzyko, liczbę otwartych akcji, braki wymagane i elementy do akceptacji.

## Ważne

Nie dodajemy wykresu. To jest celowo płaski panel operacyjny, bo V1 ma być szybkie i czytelne.

## Kryterium zakończenia

- `node --test tests/cases-v1-lifecycle-command-board.test.cjs` przechodzi,
- `npm.cmd run verify:closeflow:quiet` przechodzi,
- ekran Spraw nadal się buduje i pokazuje listę bez błędów.
