# STAGE220A33 - no tab-switch reload and no red blob behind delete action

## Cel
Naprawić dwa problemy w CaseDetail:
- `Usuń sprawę` ma zostać czerwonym destrukcyjnym actionem, ale bez czerwonej plamy/pigułki za tekstem.
- Przejście do innej karty przeglądarki i powrót nie może powodować twardego odświeżenia aplikacji, które kasuje nieopisane wpisy albo zamyka otwarte modale.

## Zakres techniczny
- `src/styles/visual-stage13-case-detail-vnext.css`
- `src/pwa/chunk-asset-reload-guard.ts`
- `scripts/check-stage220a33-no-tab-switch-reload-delete-blob.cjs`
- `package.json` prebuild guard wiring

## Decyzje
- Po przełączeniu karty przeglądarki aktualna sesja widoku jest chroniona przed automatycznym `window.location.reload()` wykonywanym przez chunk asset guard.
- Hard reload pozostaje tylko jako ostatnia awaryjna ścieżka, gdy nie ma aktywnego formularza, modala ani tab-return/hidden-tab contextu.
- Akcja `Usuń sprawę` zachowuje czerwony tekst i ikonę, ale bez czerwonego tła/pseudo-elementu.

## Czego nie ruszano
- API.
- Supabase.
- Logika usuwania sprawy.
- Algorytm finansów i prowizji.
- Service worker registration policy.

## Testy
```powershell
node scripts/check-stage220a33-no-tab-switch-reload-delete-blob.cjs
npm run build
```

## Test ręczny
1. Otwórz sprawę.
2. Otwórz modal albo zacznij wpisywać dane.
3. Przejdź na inną kartę przeglądarki.
4. Wróć do aplikacji.
5. Aplikacja nie powinna się twardo odświeżyć ani kasować wpisu/modala.
6. Sprawdź `Usuń sprawę`: czerwony tekst/ikona, bez czerwonej plamy za napisem.
