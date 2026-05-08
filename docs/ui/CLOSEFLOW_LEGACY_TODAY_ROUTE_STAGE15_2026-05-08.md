# CloseFlow Legacy Today route Stage15 - 2026-05-08

CLOSEFLOW_LEGACY_TODAY_ROUTE_STAGE15
LEGACY_TODAY_TSX_INACTIVE_UI_SURFACE_STAGE15

## Cel

Stage15 nie przebudowuje ekranu Dzis i nie refaktoryzuje starego `src/pages/Today.tsx`. Celem jest zamkniecie decyzji, czy stare Today.tsx jest aktywnym ekranem, czy tylko legacy inactive UI surface generujacym szum w danger/style audit.

## Aktywny route Dziś

FAKT Z KODU: aktywny komponent route jest ustawiony w `src/App.tsx` przez:

```tsx
const Today = lazy(() => import('./pages/TodayStable'));
```

Route `/` renderuje `<Today />`.
Route `/today` renderuje `<Today />`.

Wniosek: `/` i `/today` prowadza do `src/pages/TodayStable.tsx`, a nie do `src/pages/Today.tsx`.

## Status TodayStable

`src/pages/TodayStable.tsx` jest aktywnym ekranem Dzis. Stage15 nie zmienia jego UI ani logiki. Stage15 tylko potwierdza, ze plik istnieje, zawiera marker Stage14 i ze `SectionHeaderIcon` nie wywoluje samego siebie.

## Status Today.tsx

`src/pages/Today.tsx` zostaje oznaczony jako legacy inactive UI surface markerem:

```text
LEGACY_TODAY_TSX_INACTIVE_UI_SURFACE_STAGE15
```

To nie jest refaktor i nie jest migracja. Marker oznacza tylko, ze plik nie jest aktywnym route dla ekranu Dzis na obecnym branchu. Plik zostaje w repo, bo moze byc potrzebny historycznie, testowo albo jako zrodlo porownawcze.

## Decyzja

Decyzja Stage15: legacy inactive.

Nie usuwamy Today.tsx, bo Stage15 nie jest etapem kasowania pliku. Nie migrujemy Today.tsx, bo aktywny ekran dziala przez TodayStable. Gdyby route w przyszlosci wskazal znowu Today.tsx, guard ma zatrzymac kontrakt i wymagany bedzie osobny Stage15B.

## Wplyw na danger/style audit

`scripts/check-closeflow-danger-style-contract.cjs` nadal skanuje lokalne czerwone style i nadal blokuje local danger/red zbyt blisko delete/trash/destructive actions. Stage15 nie wycisza aktywnych plikow globalnie.

Zmiana dotyczy tylko klasyfikacji `src/pages/Today.tsx`: czerwone legacy klasy w tym pliku sa raportowane jako `legacy inactive Today.tsx exception`, a nie jako aktywny UI debt.

Aktywne pliki, takie jak Activity, Dashboard, NotificationsCenter, Calendar i TodayStable, nadal pozostaja w normalnym audycie.

## Co zostaje na Etap 16

1. Zdecydowac, czy czyscimy pozostale aktywne czerwone/rose miejsca w Activity, Dashboard i NotificationsCenter.
2. Ustalic, czy stary Today.tsx ma zostac jako archiwum, czy pozniej ma dostac osobny etap usuniecia po potwierdzeniu braku importow i test dependencies.
3. Nie mieszac tego z logika danych, AI, billingiem ani Supabase.
