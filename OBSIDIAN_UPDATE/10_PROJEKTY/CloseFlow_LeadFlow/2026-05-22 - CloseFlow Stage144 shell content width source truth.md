# CloseFlow Stage144 — Shell Content Width Source Truth

Data: 2026-05-22  
Status: przygotowano ZIP  
Typ: UI desktop width / shell content parent

## FAKTY

- Frame nadal mierzy `width=262`.
- Parent frame’u ma `parentDataShellContent=true`.
- Wniosek: źródło prawdy szerokości musi być na `.view.active[data-shell-content]`, nie na dziecku frame.

## DECYZJA

Dodać `src/styles/closeflow-shell-content-width-source-truth-stage144.css`.

Szerokość właścicielska:
```css
.view.active[data-shell-content="true"]
```

Frame:
```css
[data-shell-content="true"] > [data-cf-work-width-frame="true"]
```
ma wypełniać rodzica.

## TESTY

```powershell
node scripts/check-stage144-shell-content-width-source-truth.cjs
npm.cmd run build
```
