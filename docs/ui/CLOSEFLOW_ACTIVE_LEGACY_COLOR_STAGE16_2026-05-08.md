# CloseFlow Active Legacy Color Stage16 - 2026-05-08

CLOSEFLOW_ACTIVE_LEGACY_COLOR_STAGE16
STAGE16_ACTIVE_CLASSIFIED_COUNT: 5
STAGE16_REWIRED_COUNT: 3
STAGE16_EXCEPTION_COUNT: 2

## Cel

Stage16 domyka aktywne pozostalosci red/rose/amber poza legacy `src/pages/Today.tsx`. Ten etap nie przebudowuje ekranow, nie zmienia routingu, nie dotyka danych, API, Supabase, auth, billing ani AI.

Zasada wykonania: przepiete zostaly tylko jednoznaczne przypadki, gdzie kolor byl metryka i mial istniejacy kontrakt `StatShortcutCard tone`. Miejsca bez jednoznacznego kontraktu zostaja jako swiadome wyjatki.

## Zrodla prawdy

- delete/danger action: `src/components/entity-actions.tsx`, `src/styles/closeflow-action-tokens.css`
- alert/severity: `src/styles/closeflow-alert-severity.css`
- status/progress: `src/styles/closeflow-list-row-tokens.css`
- metric tone: `src/components/StatShortcutCard.tsx`, `src/styles/closeflow-metric-tiles.css`
- card/empty readability: `src/styles/closeflow-card-readability.css`
- legacy inactive Today: `docs/ui/CLOSEFLOW_LEGACY_TODAY_ROUTE_STAGE15_2026-05-08.md`

## Klasyfikacja aktywnych miejsc

| plik | klasa | kategoria | decyzja | kontrakt docelowy |
|---|---|---|---|---|
| `src/pages/Dashboard.tsx` | `text-red-500`, `hover:text-red-600`, `hover:bg-red-50` | UI action color | zostawiono jako swiadomy wyjatek, bo to wylogowanie, nie delete/destructive rekordu | Stage17: osobny neutral/logout action contract, nie `cf-entity-action-danger` |
| `src/pages/Activity.tsx` | `bg-rose-50`, `text-rose-500`, `text-rose-600` | metric tile | przepieto z lokalnych klas na tone | `StatShortcutCard tone="red"` |
| `src/pages/NotificationsCenter.tsx` | `bg-rose-50`, `text-rose-500`, `text-rose-600` | metric tile / overdue | przepieto z lokalnych klas na tone | `StatShortcutCard tone="red"` |
| `src/pages/NotificationsCenter.tsx` | `bg-amber-50`, `text-amber-600`, `text-amber-600` | metric tile / snoozed | przepieto z lokalnych klas na tone | `StatShortcutCard tone="amber"` |
| `src/pages/Calendar.tsx` | `border-amber-100`, `bg-amber-50`, `text-amber-700` | entity type color | zostawiono jako swiadomy wyjatek, bo kolor rozroznia typ wpisu `Lead`, nie stan bledu ani danger action | Stage17: ewentualny entity type color token, bez mieszania z severity |
| `src/pages/Leads.tsx` | brak jednoznacznego lokalnego red/rose/amber Tailwind do przepiecia w Stage16 | status/progress / entity action surface | bez zmiany | `cf-status-pill`, `actionIconClass`, `StatShortcutCard tone`, jesli pojawi sie lokalna klasa |
| `src/pages/TasksStable.tsx` | brak lokalnego red/rose/amber Tailwind wymagajacego przepiecia | status/progress / delete action | bez zmiany, juz uzywa `tone="red"`, `cf-status-pill` i `actionButtonClass('danger')` | `StatShortcutCard tone`, `cf-status-pill`, `cf-entity-action-danger` |

## Podsumowanie liczb

- Aktywne miejsca sklasyfikowane: 5.
- Przepiete na istniejace kontrakty: 3.
- Zostawione jako aktywne wyjatki: 2.
- Legacy `Today.tsx`: osobna kategoria, nie liczona jako aktywne miejsce.

## Today.tsx legacy inactive, bez zmian

`src/pages/Today.tsx` nie zostal zmieniony w Stage16. Plik pozostaje legacy inactive UI surface zgodnie ze Stage15 i markerem:

```text
LEGACY_TODAY_TSX_INACTIVE_UI_SURFACE_STAGE15
```

Aktywne route `/` i `/today` pozostaja przypiete do `src/pages/TodayStable.tsx` przez `src/App.tsx`.

## Delete/danger blocking

Stage16 nie oslabil `scripts/check-closeflow-danger-style-contract.cjs`.

Guard Stage16 dodatkowo odpala smoke test: tworzy tymczasowy aktywny plik z `Trash2`, `Usuń` i lokalnym `text-red-600`. Oczekiwany wynik to blokada przez danger style contract. Jesli ten test nie padnie, Stage16 guard konczy sie bledem.

## Co zostaje na Etap 17

1. Zdecydowac, czy logout action w `Dashboard.tsx` dostaje osobny neutral/logout action contract zamiast lokalnych red klas.
2. Zdecydowac, czy entity type colors w `Calendar.tsx` maja dostac osobny token typu `cf-entity-type-pill`, bez mieszania z alert/severity.
3. Przejrzec wygenerowane mapy po audycie i sprawdzic, czy nowe aktywne red/rose/amber nie pojawily sie poza kontraktami.
4. Nie ruszac legacy `Today.tsx`, dopoki osobny etap nie zdecyduje o usunieciu albo archiwizacji pliku.
