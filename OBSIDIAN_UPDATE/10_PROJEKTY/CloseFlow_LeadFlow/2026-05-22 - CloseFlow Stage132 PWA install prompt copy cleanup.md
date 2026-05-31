# CloseFlow Stage132 — PWA Install Prompt Copy Cleanup

Data: 2026-05-22  
Status: przygotowano ZIP  
Typ: UI microcopy cleanup

## FAKTY

- Damian wskazał popup „Dodaj CloseFlow do ekranu głównego telefonu”.
- Teksty o service workerze, cache i danych klienta brzmią technicznie i nieprodukcyjnie.
- Decyzja: zostawić tylko prosty komunikat instalacyjny.

## DECYZJA DAMIANA

Wywalić teksty:
- o danych klienta,
- o cache,
- o service workerze,
- inne nienaturalne teksty techniczne.

Zostawić:
- tytuł,
- `Otwieraj aplikację jak zwykłą apkę.`,
- `Dodaj do ekranu`,
- `Nie teraz`.

## TESTY

```powershell
node scripts/check-stage132-pwa-install-copy-cleanup.cjs
npm.cmd run build
```

## NASTĘPNY KROK

Sprawdzić popup lokalnie i wskazać następny element UI do czyszczenia.
