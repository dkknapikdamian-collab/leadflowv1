# STAGE220A34 - tab-return state preservation audit

## Cel
Naprawić problem, że po przejściu do innej karty przeglądarki i powrocie CloseFlow pokazuje ładowanie / odświeża widok, zamyka modal i kasuje niezapisany formularz.

## Diagnoza
A33 chronił `chunk-asset-reload-guard.ts`, ale to nie zamykało całej klasy problemów. Audyt wskazał dwa dodatkowe miejsca:

1. `AppChunkErrorBoundary` miał własną ścieżkę `window.location.reload()` i własny fallback `Odświeżamy aplikację`. To omijało intencję A33 i mogło unmountować cały routing przy błędzie chunka po powrocie do karty.
2. `useSupabaseSession` ustawiał nowy obiekt użytkownika po każdym auth event / token refresh. W `App.tsx` efekt zależy od `user`, więc taki sam użytkownik jako nowy obiekt uruchamiał `profileLoading`, a root aplikacji zwracał pełny ekran `Ładowanie aplikacji...`, co unmountowało otwarte modale i formularze.

## Decyzja
Nie robimy twardego reloadu ani root-loading overlay po samym powrocie do karty, jeśli użytkownik ma aktywny modal, focus w polu lub wpisane dane.

## Zakres techniczny
- `src/hooks/useSupabaseSession.ts` — deduplikacja stabilnego użytkownika, żeby token refresh / taki sam auth event nie robił `setUser` i nie odpalał globalnego profile bootstrapu.
- `src/components/AppChunkErrorBoundary.tsx` — użycie wspólnego reload guarda i blokada fallback/unmount, gdy jest chroniony stan UI.
- `scripts/check-stage220a34-tab-return-state-preservation.cjs` — guard regresji.
- `package.json` — guard dopięty do prebuild.

## Czego nie ruszano
- API.
- Supabase schema.
- Logika finansów.
- Logika usuwania sprawy.
- Polityka rejestracji service workera.

## Testy
```powershell
node scripts/check-stage220a34-tab-return-state-preservation.cjs
npm run build
```

## Test ręczny
1. Otwórz sprawę.
2. Otwórz `Dodaj wpłatę`.
3. Wpisz tekst/kwotę.
4. Przejdź na inną kartę przeglądarki.
5. Wróć.
6. Modal i wpis mają zostać. Nie powinno być globalnego `Ładowanie aplikacji...` ani `Odświeżamy aplikację`.
