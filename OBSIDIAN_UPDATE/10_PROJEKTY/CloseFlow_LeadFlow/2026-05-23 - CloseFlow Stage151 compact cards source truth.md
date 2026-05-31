# CloseFlow Stage151 — Compact Cards Source Truth

Data: 2026-05-23  
Status: przygotowano ZIP lokalny  
Typ: UI / compact cards / guard per correction

## FAKTY

- Stage149 jest akceptowanym source truth szerokości.
- Stage150 jest source truth typografii.
- Kafelki nadal są za duże.
- Damian wprowadził zasadę: każda poprawka musi mieć nowy guard.

## DECYZJE DAMIANA

- Każda poprawka = nowy guard.
- Zaczynamy od delikatnego zmniejszenia kafelków.
- Wszystkie kafelki w całej aplikacji mają być spójnie mniejsze.
- Nie ruszać szerokości per zakładka.

## HIPOTEZY AI

- Najbezpieczniej dodać osobny CSS source truth dla kart po Stage150.
- Strojenie powinno odbywać się przez zmienne `--cf151-*`, nie przez ręczne poprawki komponentów.

## TESTY

```powershell
node scripts/check-stage151-compact-cards-source-truth.cjs
npm.cmd run build
```

## NASTĘPNY KROK

Sprawdzić główne zakładki lokalnie i dopiero potem commit bez pusha.
