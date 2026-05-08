# CloseFlow — TodayStable remaining severity/status cleanup — Stage 14

Data: 2026-05-08
Zakres: TODAYSTABLE REMAINING SEVERITY / STATUS CLEANUP

## Cel

Domknięto pozostałe jednoznaczne lokalne klasy red/rose/amber w aktywnym ekranie `TodayStable` bez przebudowy ekranu Dziś i bez dotykania starego `src/pages/Today.tsx`.

## Zakres plików

- `src/pages/TodayStable.tsx`
- `scripts/check-closeflow-today-stable-remaining-severity-contract.cjs`
- `package.json`
- `docs/ui/CLOSEFLOW_TODAY_STABLE_REMAINING_SEVERITY_STAGE14_2026-05-08.md`

Nie było potrzeby dopisywać nowych wariantów do `src/styles/closeflow-alert-severity.css` ani `src/styles/closeflow-list-row-tokens.css`, bo potrzebne tokeny `cf-alert`, `cf-severity-*`, `cf-status-pill` i `cf-progress-pill` już istnieją.

## Klasyfikacja TodayStable

- Pozostałe lokalne red/rose/amber miejsca sklasyfikowane w `TodayStable`: **0**
- Przepięte na alert/severity: **0**
- Przepięte na status/progress: **0**
- Zostawione jako wyjątek: **0**

## Tabela pozostałych wyjątków

| Linia | Token | Klasyfikacja | Powód |
|---:|---|---|---|
| brak | brak | brak | brak |

## Potwierdzenia zakresu

- `Today.tsx jest poza zakresem` i nie został modyfikowany przez ten etap.
- Nie zmieniono logiki ładowania, filtrowania, widoczności sekcji, zapisu, usuwania, done/restore ani AI drafts.
- Nie zmieniono API, Supabase, auth, billing, routingu ani danych.
- Zachowano naprawę z Etapu 10 repair: `SectionHeaderIcon` nie wywołuje samego siebie, a `SectionHeader` używa `<SectionHeaderIcon tone={tone} icon={icon} />`.

## Co zostaje na Etap 15

Etap 15 powinien być osobnym, kontrolowanym przeglądem wizualnych wyjątków, które nie są jednoznacznym alertem, statusem, metryką ani akcją danger. Nie należy mieszać go z przebudową `TodayStable`, kafelkami, headerami, list row, action placement ani formularzami.
