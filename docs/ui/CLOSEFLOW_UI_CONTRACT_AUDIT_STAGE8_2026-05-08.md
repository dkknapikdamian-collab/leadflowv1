# CloseFlow UI contract audit Stage 8 — 2026-05-08

Marker: STAGE8_DOCUMENTED_LEGACY_EXCEPTIONS

## Cel

Etap 8 nie usuwa każdego koloru z aplikacji. Ten etap klasyfikuje lokalne klasy kolorów z mapy stylów i usuwa tylko te przypadki, które da się bezpiecznie przypisać do istniejącego kontraktu bez zmiany logiki, układu ani znaczenia UI.

## Źródła prawdy użyte w decyzjach

| Obszar | Kontrakt docelowy |
|---|---|
| destructive/delete action | `src/components/entity-actions.tsx`, `src/styles/closeflow-action-tokens.css` |
| action clusters | `src/styles/closeflow-action-clusters.css` |
| form/modal actions | `src/styles/closeflow-form-actions.css` |
| surface/right-card | `src/styles/closeflow-surface-tokens.css` |
| metric tone | `src/components/StatShortcutCard.tsx`, `src/styles/closeflow-metric-tiles.css` |
| page headers | `src/styles/closeflow-page-header.css` |
| status/progress | `src/styles/closeflow-list-row-tokens.css` |
| readable card/empty state | `src/styles/closeflow-card-readability.css` |

## Kategorie klasyfikacji

- destructive/delete action
- status/progress
- metric tone
- readable card/empty state
- real system alert/error
- unrelated legacy visual style do później

## Klasyfikacja lokalnych kolorów z mapy stylów

| plik | linia z mapy | klasa | kategoria | decyzja | kontrakt docelowy |
|---|---:|---|---|---|---|
| `src/components/AppChunkErrorBoundary.tsx` | 100-101 | `border-rose-200`, `text-rose-700` | real system alert/error | zostawiono jako świadomy wyjątek, bo brak kontraktu alertów systemowych | przyszły kontrakt alert/error |
| `src/pages/Activity.tsx` | 699 | `bg-rose-50`, `text-rose-500`, `text-rose-600` | real system alert/error or schedule/status surface | zostawiono jako świadomy wyjątek, bo kontekst nie jest delete action | przyszły kontrakt alert/status surface |
| `src/pages/Calendar.tsx` | 287 | `border-rose-100`, `bg-rose-50`, `text-rose-700` | real system alert/error or schedule/status surface | zostawiono jako świadomy wyjątek, bo to status overdue, nie delete | przyszły kontrakt calendar/status pill |
| `src/pages/Dashboard.tsx` | 228, 333-336 | `text-red-500`, `text-red-600`, `bg-red-50` | real system alert/error | zostawiono jako świadomy wyjątek, bo dashboard error/alert wymaga osobnego kontraktu | przyszły kontrakt alert/error |
| `src/pages/Leads.tsx` | 758-759 | `text-rose-600`, `bg-rose-50`, `text-rose-500` | status/progress | zostawiono jako wyjątek do następnego status pass, bo wymaga sprawdzenia semantyki listy | `cf-status-pill` / list row contract |
| `src/pages/NotificationsCenter.tsx` | 643 | `bg-rose-50`, `text-rose-500`, `text-rose-600` | real system alert/error | zostawiono jako świadomy wyjątek, bo powiadomienia wymagają alert/status contract | przyszły kontrakt notification severity |
| `src/pages/TasksStable.tsx` | 163 | `bg-rose-50`, `text-rose-700`, `border-rose-100` | status/progress | zostawiono jako wyjątek, bo aktywny route używa TasksStable i wymaga osobnego status pass | `cf-status-pill` / list row contract |
| `src/pages/Templates.tsx` | 411 | `bg-rose-600` | status/progress | naprawiono, bo badge Obowiązkowe jednoznacznie mapuje się do statusu red | `cf-status-pill[data-cf-status-tone="red"]` |
| `src/pages/Today.tsx` | 1286-1317 | `border-red-100`, `bg-red-50`, `border-red-200`, `bg-red-100`, `text-red-700`, `text-red-950`, `text-red-800` | real system alert/error or schedule/status surface | zostawiono jako świadomy wyjątek, bo Today ma własne sekcje ryzyka i wymaga osobnego kontraktu alertów | przyszły kontrakt today alert/status sections |
| `src/pages/Today.tsx` | 2182-2850 | `border-rose-200`, `text-rose-700`, `text-rose-600`, `bg-rose-50`, `border-rose-100`, `text-rose-500` | real system alert/error or schedule/status surface | zostawiono jako świadomy wyjątek, bo to nie jest delete action i dotyczy sekcji ryzyka/statusów | przyszły kontrakt today alert/status sections |
| `src/pages/TodayStable.tsx` | 897, 990, 1108 | `text-rose-700`, `border-rose-200`, `border-rose-100`, `bg-rose-50` | real system alert/error or schedule/status surface | zostawiono jako świadomy wyjątek, bo aktywny ekran TodayStable wymaga osobnego status pass | przyszły kontrakt today stable status sections |

## Podsumowanie liczbowe

| metryka | liczba |
|---|---:|
| sklasyfikowane lokalne klasy red/rose z aktualnego danger audit | 65 |
| naprawione w tym etapie | 1 |
| zostawione jako świadome wyjątki | 64 |
| blokujące przypadki przy `Trash2` / `Usuń` / delete action | 0 |

## co naprawiono

- `src/pages/Templates.tsx`: lokalny badge `bg-rose-600 text-white` dla `Obowiązkowe` został przepięty na `cf-status-pill` z `data-cf-status-tone="red"`.
- `scripts/check-closeflow-danger-style-contract.cjs`: guard dalej blokuje lokalny danger/red przy delete/trash, ale raportuje pozostałe legacy kolory jako udokumentowany audyt Stage8.
- Dodano `scripts/check-closeflow-ui-contract-audit-stage8.cjs`, żeby pilnować dokumentu, klasyfikacji i bezpiecznej naprawy.

## co zostawiono jako wyjątek

- Prawdziwe błędy systemowe i alerty, np. `AppChunkErrorBoundary`, `Dashboard`.
- Statusy i ryzyka w `Today` / `TodayStable`, bo wymagają osobnego kontraktu sekcji alert/status.
- Statusy w `Calendar`, `NotificationsCenter`, `TasksStable`, `Leads`, jeśli nie są jednoznacznie objęte już istniejącym kontraktem.
- Nie usuwano czerwieni z błędów tylko dlatego, że jest czerwona.

## co zostaje na kolejny etap

1. Kontrakt alert/error/severity dla systemowych komunikatów i sekcji ryzyka.
2. Osobny pass dla `TodayStable` status/alert sections.
3. Osobny pass dla `Calendar` overdue/status pill.
4. Osobny pass dla `NotificationsCenter` notification severity.
5. Ewentualne przenoszenie statusów `Leads` i `TasksStable` na `cf-status-pill`, ale tylko po sprawdzeniu semantyki.
