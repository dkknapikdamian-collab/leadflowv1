# CloseFlow Stage141 — Shared Work Width Frame

Data: 2026-05-22  
Status: przygotowano ZIP  
Typ: UI desktop width source truth / Layout wrapper

## FAKTY

- Damian wymaga jednej szerokości roboczej dla każdej zakładki.
- Dotychczasowe poprawki CSS nie wystarczyły, bo route’y mają różne rooty i własne `max-width`.
- W `Layout.tsx` dzieci route’ów były renderowane bez wspólnego wrappera.

## DECYZJA

Dodać jeden realny wrapper w `Layout.tsx`:

```tsx
<div className="cf-work-width-frame" data-cf-work-width-frame="true">
  {children}
</div>
```

I jeden CSS source truth:

```text
src/styles/closeflow-shared-work-width-frame-stage141.css
```

## ZAKRES

Wszystkie zakładki renderowane przez `Layout.tsx`:
`/`, `/leads`, `/clients`, `/cases`, `/tasks`, `/calendar`, `/templates`, `/response-templates`, `/activity` oraz podstrony.

## TESTY

```powershell
node scripts/check-stage141-shared-work-width-frame.cjs
npm.cmd run build
```

## NASTĘPNY KROK

Sprawdzić, czy prawa krawędź contentu jest taka sama na każdej zakładce. Jeśli nie, mierzyć `data-cf-work-width-frame` w DevTools.
