# CloseFlow Stage134 — search and leads value card cleanup V2

Data: 2026-05-22  
Status: przygotowano ZIP V2 resume-safe  
Typ: UI cleanup / admin feedback

## FAKTY

- Stage134 V1 przerwał się na patchowaniu inputa wyszukiwarki w `Leads.tsx`.
- Przed przerwaniem mógł już skopiować pliki i dodać import CSS.
- V2 jest odporne na stan częściowy i dokańcza patch.

## DECYZJE DAMIANA

- Ujednolicić wyszukiwarki w głównych widokach.
- Usunąć brzydkie teksty i znak `?`.
- Poprawić `Najcenniejsze leady`, żeby wyglądało jak kafelek klientów.

## TESTY

```powershell
node scripts/check-stage134-search-and-value-card.cjs
npm.cmd run build
```

## NASTĘPNY KROK

Sprawdzić `/leads` i `/clients` lokalnie.
