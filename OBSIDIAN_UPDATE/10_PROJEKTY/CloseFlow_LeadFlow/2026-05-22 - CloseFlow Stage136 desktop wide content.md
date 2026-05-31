# CloseFlow Stage136 — Desktop Wide Content

Data: 2026-05-22  
Status: przygotowano ZIP  
Typ: UI desktop layout / szerokość kontenerów

## FAKTY

- Damian wskazał, że główne okna są za wąskie na komputerze.
- Chodzi o szerokość całych paneli/list/kafelków, nie o pojedynczy kliknięty element.
- Problem widoczny jest szczególnie przy `/clients`, ale feedback obejmuje też `/cases`, `/tasks`, `/calendar`, `/templates`, `/response-templates`, `/activity`.

## DECYZJA

Dodać desktop-only CSS source truth:

```text
src/styles/closeflow-desktop-wide-content-stage136.css
```

Aktywne tylko od `1280px`.

## TESTY

```powershell
node scripts/check-stage136-desktop-wide-content.cjs
npm.cmd run build
```

## NASTĘPNY KROK

Sprawdzić wizualnie główne widoki na komputerze. Jeśli jeden widok dalej zostaje wąski, wskazać route i selector z DevTools/admin feedback.
