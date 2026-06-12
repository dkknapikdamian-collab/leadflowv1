# STAGE231E2_R5_TRIAL_14D_WORKSPACE_FALLBACK_AND_PLAN_MATRIX

Data: 2026-06-13
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Tryb: ZIP local-only, bez pushu z czatu

## FAKTY Z KODU

- `src/lib/plans.ts` ma aktywny kontrakt triala 14 dni: `TRIAL_DAYS = 14`, `TRIAL_MS`, `PLAN_IDS.trial = trial_14d`.
- `src/lib/plans.ts` trzyma `trial_21d` jako legacy alias dla starych workspace.
- `src/lib/workspace.ts` przed etapem nadal tworzył lokalny fallback `trial_21d` i `trialEndsAt` +21 dni.
- `api/me.ts` tworzy nowe workspace przez `TRIAL_MS` z `plans.ts`.
- `Layout.tsx` po R4 korzysta z `access.trialDaysLeft`, ale `access.ts` liczył tę wartość z daty `workspace.trialEndsAt`.
- `Billing.tsx` przed etapem miało fallback display `trial_21d` i datę `Trial do` bezpośrednio z `workspace.trialEndsAt`.

## DECYZJE DAMIANA

- Trial produktu ma mieć 14 dni.
- Nie wolno zostawiać aktywnych ścieżek runtime, które tworzą 21-dniowy trial.
- ZIP local-only, testy lokalne, push dopiero po PASS.

## AUDYT PRZED ETAPEM

Problem nie był tylko w sidebarze. Istniały trzy osobne źródła rozjazdu:

1. Centralny model `plans.ts` mówił 14 dni.
2. Klientowy fallback `workspace.ts` nadal mógł stworzyć 21 dni.
3. UI liczył dni z daty zapisanej w workspace, więc stare dane mogły pokazywać 18/21 dni.

## CO ZMIENIONO

- `src/lib/workspace.ts`: lokalny fallback bierze `PLAN_IDS.trial` i `TRIAL_MS` z `plans.ts`, nie tworzy `trial_21d`.
- `src/hooks/useWorkspace.ts`: lokalny fallback bierze `PLAN_IDS.trial` i `TRIAL_MS` z `plans.ts`.
- `src/lib/access.ts`: wyświetlany `trialDaysLeft` jest przycinany do aktywnego kontraktu `TRIAL_DAYS`.
- `src/pages/Billing.tsx`: fallback display planu nie zwraca `trial_21d`; aktywny trial wyświetla datę kontraktową z `access.trialDaysLeft`.
- Dodano matrix planów `_project/06_STAGE231E2_PLAN_ENTITLEMENT_MATRIX.md`.
- Dodano guard trial contract.
- Dodano guard plan entitlement matrix.

## TESTY / GUARDY

Do uruchomienia lokalnie:

```powershell
node scripts/check-stage231e2-trial-14d-contract.cjs
node scripts/check-stage231e2-plan-entitlement-matrix.cjs
node scripts/check-stage231e2-r4-trial-card-access-source.cjs
node scripts/check-stage231e2-r2-trial-14d-lock.cjs
node scripts/check-stage231e2-account-trial-bootstrap.cjs
npm run build
git diff --check
```

## TEST RĘCZNY

1. Założyć nowe konto testowe.
2. Sidebar: maksymalnie 14 dni.
3. Billing: `Trial do` odpowiada aktywnemu kontraktowi 14 dni.
4. Login: tekst 14 dni.
5. Stare konto z 18/21 dniami traktować jako legacy data case.

## AUDYT PO ETAPIE

- Naprawiono aktywne generowanie `trial_21d` w lokalnym fallbacku.
- Nie przycięto istniejących danych w bazie, bo to wymaga osobnej decyzji SQL/admin.
- Plan matrix wykazuje, że Google Calendar i weekly report są Pro+ i wymagają konfiguracji; to nie jest naprawa runtime Google Calendar.

## ZNALEZIONE PROBLEMY

- Legacy workspace z dłuższym `trial_ends_at` mogą nadal istnieć w bazie. Rekomendacja: na razie zostawić, a ewentualne przycięcie zrobić osobnym SQL/admin action po decyzji Damiana.
- Settings/Billing copy dla integracji providerowych powinno być uproszczone dla zwykłego użytkownika w osobnym etapie UI copy.

## RYZYKA

- Jeśli backend dalej zwróci stare `trial_ends_at`, dostęp może nadal obowiązywać do daty w bazie. Ten etap ogranicza nowe ścieżki i UI display, nie migruje danych.
- Capping `trialDaysLeft` w UI może ukryć legacy dłuższy trial, ale jest zgodny z decyzją produktu 14 dni.

## OBSIDIAN PAYLOAD

Zobacz `_project/obsidian_updates/2026-06-13_STAGE231E2_R5_TRIAL_14D_WORKSPACE_FALLBACK_AND_PLAN_MATRIX.md`.

## NASTĘPNY KROK

Po lokalnym PASS i ręcznym teście świeżego konta: selektywny commit/push tylko plików R5. Potem wrócić do STAGE231F Google Calendar user scope.
