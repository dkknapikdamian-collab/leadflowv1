# CloseFlow Stage156 — Real Density Tokens No Zoom

Data: 2026-05-23  
Status: przygotowano ZIP lokalny  
Typ: UI / real density tokens / no zoom

## FAKTY

- Poprawna szerokość po Stage149 ma zostać.
- Stage153/154/155 zostały odrzucone jako kierunki aktywne, bo psuły trzymanie lewej/prawej strony.
- Docelowy efekt ma przypominać zoom 70-80%, ale bez skalowania kontenerów.
- Każda poprawka ma mieć osobny guard.

## DECYZJE DAMIANA

- Wdrożyć zmniejszenie przez realne gęstości komponentów.
- Nie używać wrapper-scale/zoom/transform.
- Skala/gęstość ma być jednym źródłem prawdy wizualnym.
- Nie pushować bez akceptacji wizualnej.

## HIPOTEZY AI

- Szerokie CSS tokens scoped do route content są bezpieczniejsze niż skalowanie.
- Trzeba objąć zarówno komponentowe klasy kart, jak i Tailwindowe klasy padding/gap w route slotach.

## TESTY

```powershell
node scripts/check-stage156-real-density-tokens-no-zoom.cjs
npm.cmd run build
```

## NASTĘPNY KROK

Sprawdzić główne zakładki lokalnie i dostroić tylko zmienne Stage156.
