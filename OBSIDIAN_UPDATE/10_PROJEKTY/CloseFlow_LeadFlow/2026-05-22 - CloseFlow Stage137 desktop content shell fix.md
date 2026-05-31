# CloseFlow Stage137 — Desktop Content Shell Fix

Data: 2026-05-22  
Status: przygotowano ZIP  
Typ: UI desktop shell / source truth

## FAKTY

- Stage136 nie poszerzył widoku wystarczająco.
- Damian pokazał `/clients`, gdzie główna zawartość nadal jest zbyt wąska i wyśrodkowana.
- Problem dotyczy głównych okien/kafelków/paneli na desktopie, nie pojedynczego elementu.
- Feedback wskazuje wiele tras: `/clients`, `/cases`, `/tasks`, `/calendar`, `/templates`, `/response-templates`, `/activity`.

## DECYZJA

Dodać Stage137:

```text
src/styles/closeflow-desktop-content-shell-stage137.css
```

Cel: uderzyć w shell:
- `main.main`
- `[data-shell-main]`
- `.view.active`
- `[data-shell-content]`
- route rooty
- layout-list
- activity shell

## TESTY

```powershell
node scripts/check-stage137-desktop-content-shell.cjs
npm.cmd run build
```

## NASTĘPNY KROK

Sprawdzić wizualnie `/clients`, `/leads`, `/cases`, `/tasks`, `/calendar`, `/templates`, `/response-templates`, `/activity`.
