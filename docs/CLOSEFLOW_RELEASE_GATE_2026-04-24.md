# CloseFlow release gate

Data: 2026-04-24

## Po co to jest

W jednej z poprawek test tekstowy przeszedł, ale `npm run build` wykrył uszkodzony JSX. Od teraz przed commitem/pushem większej paczki używamy jednej bramki:

```powershell
npm.cmd run verify:closeflow
```

## Co sprawdza

Bramka uruchamia:

1. produkcyjny build Vite,
2. test blokady `next_action_title`,
3. test ścieżki lead-klient-sprawa,
4. test centrum relacji klienta,
5. test zachowania wykonanych wpisów w kalendarzu,
6. test przywracania wpisów w kalendarzu,
7. test zachowania wykonanych wpisów na ekranie Dziś,
8. test etykiety Przywróć na ekranie Dziś.

## Zasada pracy

Jeśli `verify:closeflow` nie przejdzie, nie robimy commita i nie robimy pusha.

To jest lokalna bramka bezpieczeństwa dla gałęzi:

```text
dev-rollout-freeze
```
