# CloseFlow Stage158 — Overlay Portal Density Source Truth

Data: 2026-05-23  
Status: przygotowano ZIP lokalny  
Typ: UI / overlay density / portal scale

## FAKTY

- Główna aplikacja po Stage157 jest skalowana do wyglądu 80%.
- Podokienka, np. „Nowy lead”, pozostały za duże.
- Najbardziej prawdopodobna przyczyna: portale renderowane poza `#root > .app`.
- Podokienka wymagają osobnego, ale powiązanego source truth skali.

## DECYZJE DAMIANA

- Dostosować skalę podokienek.
- Dotyczy wszystkich podokienek, nie tylko jednego formularza.
- Każda poprawka musi mieć guard.
- Bez pusha/deploya przed akceptacją.

## HIPOTEZY AI

- Stage158 powinien dziedziczyć skalę ze Stage157.
- Backdrop/overlay powinien zostać pełnoekranowy, a skalować trzeba dialog content, popover content, toast/prompt content.

## TESTY

```powershell
node scripts/check-stage158-overlay-portal-density.cjs
npm.cmd run build
```

## NASTĘPNY KROK

Sprawdzić główne podokienka lokalnie.
