# STAGE231E2-R3 — Trial 14d i audyt planów

Status: READY_FOR_IMPLEMENTATION
Data: 2026-06-12
Projekt: CloseFlow / LeadFlow
Branch: dev-rollout-freeze

## Cel

Sprawdzić i naprawić rozjazd między deklarowanym trialem 14 dni a UI pokazującym większą liczbę dni, np. 18 dni. Następnie sprawdzić, czy każdy plan ma poprawnie przypisane funkcje, limity, UI, backend i komunikaty.

## Potwierdzony problem

Repo ma dwa źródła prawdy dla triala:

1. `src/lib/plans.ts` — aktywny model produktu:
   - `TRIAL_DAYS = 14`
   - `PLAN_IDS.trial = trial_14d`
   - nazwa planu: `Trial 14 dni`

2. `src/lib/workspace.ts` — stary klientowy fallback:
   - `planId: trial_21d`
   - `subscriptionStatus: trial_active`
   - `trialEndsAt = Date.now() + 21 dni`

Dodatkowo UI w sidebarze i Billing liczy dni z `workspace.trialEndsAt`, więc jeżeli baza albo fallback zwraca datę za 18 dni, UI pokaże 18 dni, nawet gdy model produktu mówi 14 dni.

## Hipoteza przyczyny 18 dni

Najbardziej prawdopodobne: workspace został utworzony wcześniej przez stary 21-dniowy fallback albo w bazie nadal ma `trial_ends_at` ustawione według starego 21-dniowego triala. Po kilku dniach pozostało 18 dni.

## Zakres etapu

### Pliki do przeczytania

- `AGENTS.md`
- `_project/00_PROJECT_MEMORY_PROTOCOL.md`
- `_project/04_STAGE_AUDIT_PROTOCOL_CLOSEFLOW.md`
- `_project/07_AKTYWNA_KOLEJKA_ETAPOW_CLOSEFLOW.md`
- `_project/04_ZNALEZIONE_PROBLEMY_DO_ANALIZY.md`
- `src/lib/plans.ts`
- `src/lib/access.ts`
- `src/lib/workspace.ts`
- `src/hooks/useWorkspace.ts`
- `src/components/Layout.tsx`
- `src/pages/Billing.tsx`
- `src/pages/Login.tsx`
- `api/me.ts`
- `api/workspace-settings.ts`, jeśli istnieje
- testy i guardy związane z planami, billingiem i trialem

### Audyt przed zmianą

Developer ma sprawdzić:

- gdzie dokładnie UI pokazuje liczbę dni triala,
- czy `trialDaysLeft` pochodzi z `access.trialDaysLeft`,
- czy `access.trialDaysLeft` liczy się z `workspace.trialEndsAt`,
- czy dane z `/api/me` mają `trialEndsAt` za 14 czy 18/21 dni,
- czy lokalny fallback `src/lib/workspace.ts` jest jeszcze używany produkcyjnie,
- czy baza ma stare wartości `trial_21d` albo `trial_ends_at` dalej niż 14 dni od startu,
- czy `trial_21d` zostaje tylko jako legacy alias, czy nadal generuje nowe workspace.

## Naprawa wymagana

1. Usunąć aktywne generowanie `trial_21d` z runtime.
2. `src/lib/workspace.ts` ma używać `TRIAL_DAYS`, `TRIAL_MS` i `PLAN_IDS.trial` z `src/lib/plans.ts`, nie literałów 21 dni.
3. UI nie może pokazywać więcej niż realny kontrakt triala bez jasnego powodu.
4. Dla starych workspace z 21 dniami developer ma przygotować decyzję:
   - opcja A: zachować istniejące stare triale do końca, ale nowe zawsze 14 dni,
   - opcja B: przyciąć stare triale do 14 dni migracją/admin action,
   - opcja C: pokazywać ostrzeżenie `legacy trial`, ale nie mieszać tego z nowymi kontami.
5. Przygotować SQL/admin-check tylko jako osobny blok do ręcznego uruchomienia, jeśli będzie potrzebny.

## Audyt planów

Developer ma przygotować matrix planów:

- Free
- Basic
- Pro
- AI
- Trial

Dla każdej funkcji:

- minimalny plan według `plans.ts`,
- czy UI pokazuje to samo,
- czy Billing pokazuje to samo,
- czy Settings pokazuje to samo,
- czy backend/API blokuje to samo,
- czy funkcja jest realnie gotowa, beta, wymaga konfiguracji, czy niedostępna,
- czy nie dajemy funkcji w niższym planie przez admin/app-owner override bez świadomej decyzji.

Funkcje obowiązkowe:

- AI / full AI,
- light parser,
- light drafts,
- daily digest,
- Google Calendar,
- weekly report,
- CSV import,
- recurring reminders,
- browser notifications,
- limity leadów,
- limity zadań,
- limity wydarzeń,
- limity szkiców,
- limity AI daily/monthly.

## Guardy / testy

Dodać albo zaktualizować:

- `scripts/check-stage231e2-trial-14d-contract.cjs`
- `scripts/check-stage231e2-plan-entitlement-matrix.cjs`
- test kontraktu `TRIAL_DAYS = 14`
- test, że aktywne runtime nie tworzy nowych `trial_21d`
- test, że Billing/Login/Layout pokazują spójny trial 14 dni
- test, że plan matrix obejmuje wszystkie funkcje z `PlanFeatures`

## Testy do uruchomienia

- `node scripts/check-stage231e2-trial-14d-contract.cjs`
- `node scripts/check-stage231e2-plan-entitlement-matrix.cjs`
- `npm run build`
- `git diff --check`

Jeżeli test nie istnieje jeszcze przed etapem, developer ma go dodać albo wpisać SKIP z powodem.

## Test ręczny Damiana

1. Założyć nowe konto testowe.
2. Sprawdzić sidebar: ma pokazać maksymalnie 14 dni triala na starcie.
3. Sprawdzić Billing: `Trial do` ma odpowiadać 14 dniom.
4. Sprawdzić Login: copy mówi 14 dni.
5. Sprawdzić stare konto z 18 dniami i ustalić, czy to legacy workspace czy aktualny błąd.
6. Sprawdzić plan features w Billing i Settings.

## Czego nie ruszać

- Google Calendar sync runtime poza audytem plan gate,
- AI runtime,
- płatności Stripe,
- SQL bez osobnego pliku i decyzji,
- Visual Tile Wave,
- mobile readability.

## Warunek ukończenia

Etap jest zamknięty dopiero gdy:

- nie ma aktywnego runtime generującego `trial_21d`,
- nowe konto dostaje trial 14 dni,
- UI nie pokazuje 18/21 dni dla nowego triala,
- stare 21-dniowe workspace są sklasyfikowane jako legacy albo przycięte po decyzji,
- plan entitlement matrix istnieje,
- guardy przechodzą,
- build przechodzi,
- run report istnieje,
- znalezione problemy są dopisane do centralnego rejestru albo raport mówi: brak nowych.
