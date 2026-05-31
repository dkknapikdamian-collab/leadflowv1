# CloseFlow Stage135 — right rail heading source truth

Data: 2026-05-22  
Status: przygotowano ZIP  
Typ: UI source truth / napisy w kafelkach

## FAKTY

- Damian przesłał feedback z panelu admina dotyczący napisów w kafelkach prawej kolumny.
- Nie chodzi o przyciski ani listy, tylko o dokładnie kliknięte nagłówki/opisy w kafelkach.
- Wzorcowy styl wskazany przez Damiana: `Ostatnie zmiany w leadach` w `/activity`.
- Zgłoszone obszary: `/leads`, `/clients`, `/cases`, `/activity`.

## MAPA

- `/leads`: `Filtry proste`, `Najcenniejsze leady`
- `/clients`: `Filtry proste`, `Najcenniejsi klienci`
- `/cases`: `Operacyjne skróty`, `Blokery i ryzyko`
- `/activity`: `Szybkie filtry`, `Ostatnie zmiany w sprawach`, `Ostatnie zmiany w leadach`

## DECYZJA

Dodać jedno źródło prawdy CSS:
`src/styles/closeflow-right-rail-heading-source-truth-stage135.css`

Nie ruszać logiki, danych, list ani przycisków.

## TESTY

```powershell
node scripts/check-stage135-right-rail-heading-source-truth.cjs
npm.cmd run build
```

## NASTĘPNY KROK

Sprawdzić ręcznie `/leads`, `/clients`, `/cases`, `/activity`, czy nagłówki/opisy mają identyczny rozmiar, font, kolor, rytm i miejsce w kafelku.
