# CloseFlow Stage145 — Route Root Width Normalization

Data: 2026-05-23  
Status: przygotowano ZIP lokalny  
Typ: UI desktop width / route-root source truth

## FAKTY

- Bug recorder wskazał realny root `Dziś` jako `main.mx-auto.flex.w-full.max-w-7xl`.
- PowerShell scan potwierdził wiele rootów z `mx-auto/max-w-*`.
- Console na `/clients` pokazała, że wcześniejszy frame ma `width=262`, więc frame nie może być źródłem prawdy.

## DECYZJA

Przestać dokładać wrappery CSS i znormalizować:
- `Layout.tsx`,
- route-rooty,
- `PageShell.tsx`,
- jeden finalny CSS `closeflow-route-root-width-normalization-stage145.css`.

## TESTY

```powershell
node scripts/check-stage145-route-root-width-normalization.cjs
npm.cmd run build
```

## NASTĘPNY KROK

Po wdrożeniu lokalnym sprawdzić wszystkie główne zakładki i wkleić wynik runtime audytu, jeśli szerokość nadal nie dochodzi pod oczekiwany punkt topbara.
