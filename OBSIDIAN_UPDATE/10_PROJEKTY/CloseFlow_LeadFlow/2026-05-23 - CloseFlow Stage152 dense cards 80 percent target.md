# CloseFlow Stage152 — Dense Cards 80 Percent Target

Data: 2026-05-23  
Status: przygotowano ZIP lokalny  
Typ: UI / denser cards / 80 percent target

## FAKTY

- Stage151 poprawił kafelki, ale dalej są za duże.
- Damian wskazał, że po zejściu do 70-80% zoomu widok zaczyna być dobry.
- Nie chcemy używać zoomu ani skalowania całej aplikacji.
- Stage149 zostaje źródłem prawdy szerokości.

## DECYZJE DAMIANA

- Jeszcze mocniej zmniejszyć kafelki.
- Każda poprawka ma mieć osobny guard.
- Zachować jedno źródło prawdy szerokości.
- Nie robić hacków per zakładka.

## HIPOTEZY AI

- Najbezpieczniejszy kierunek: Stage152 jako kolejny plik source truth ładowany po Stage151.
- Strojenie powinno odbywać się przez zmienne `--cf152-*`.

## TESTY

```powershell
node scripts/check-stage152-dense-cards-80-percent-target.cjs
npm.cmd run build
```

## NASTĘPNY KROK

Sprawdzić główne zakładki lokalnie. Jeśli nadal za duże, zmniejszać tylko zmienne Stage152.
