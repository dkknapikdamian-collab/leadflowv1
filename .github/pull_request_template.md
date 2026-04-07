# Cel zmiany

Opisz krótko, co ta zmiana robi.

## Typ zmiany
- [ ] fix
- [ ] feature
- [ ] refactor
- [ ] docs
- [ ] chore

## Branch i rollout
- [ ] ta zmiana nie jest bezpośrednim funkcjonalnym push em na `main`
- [ ] zmiana była testowana na preview deploy
- [ ] testerzy nie dostają tej zmiany przed wejściem na `main`
- [ ] po merge do `main` zmiana ma trafić na stały link produkcyjny

## Zakres
- [ ] nie rusza UI bez potrzeby
- [ ] nie rusza modelu danych bez potrzeby
- [ ] nie rusza auth bez potrzeby
- [ ] nie rusza billing flow bez potrzeby

## Jak sprawdzić
1.
2.
3.

## Ryzyko
Opisz, co może się wyłożyć.

## Rollback
Wskaż:
- ostatni stabilny commit,
- jak cofnąć zmianę, jeśli produkcja siądzie.
