# STAGE231E2_ACCOUNT_TRIAL_BOOTSTRAP_BLOCKER_R1

Data: 2026-06-12 23:59 Europe/Warsaw
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze

## FAKTY Z KODU

- `src/lib/plans.ts` definiuje `TRIAL_DAYS = 21`, `PLAN_IDS.trial = trial_21d` oraz funkcje `normalizePlanId`, `buildPlanAccessModel`.
- Przed R1 `normalizePlanId` dla nierozpoznanego statusu/planu kończył się domyślnym `PLAN_IDS.trial`.
- `api/me.ts` tworzy nowe workspace z `DEFAULT_PLAN_ID = PLAN_IDS.trial`, `DEFAULT_STATUS = trial_active` oraz `trial_ends_at = buildTrialEndsAt()`.
- `api/me.ts` ma mechanizm `shouldRepairFreshTrialBootstrap`, ale jest ograniczony oknem `BROKEN_BOOTSTRAP_REPAIR_WINDOW_MS`.
- `src/hooks/useWorkspace.ts` bierze `accessOverride` z `/api/me`, więc błędny status dostępu blokuje testy funkcji planowych, w tym Google Calendar.

## DECYZJE DAMIANA

- Damian zgłosił blocker: każde nowo założone konto startuje z nieaktualnego triala.
- Nie wolno dalej testować STAGE231F Google Calendar, jeśli konto testowe ma błędny status planu.

## HIPOTEZY / PROPOZYCJE AI

- Najbardziej prawdopodobna klasa błędu: bootstrap konta/workspace lub normalizacja planu wpada w trial mimo niepełnego/starego stanu.
- Bezpieczny pierwszy fix: nierozpoznany status/planu nie może po cichu dostać funkcji trialowych; musi fail-closed do Free.
- Jeśli po R1 nowe konto nadal pokazuje expired trial, potrzebny będzie R2 w `api/me.ts`: rozszerzenie repair tylko dla `authIntent=register` / świeżego bootstrapu, bez odnawiania starych triali wszystkim.

## AUDYT PRZED ETAPEM

Problem blokujący: nie można ręcznie sprawdzić Google Calendar na zwykłym koncie, bo konto nie ma poprawnego aktywnego dostępu.

Miejsca sprawdzone:
- `AGENTS.md`
- `_project/07_AKTYWNA_KOLEJKA_ETAPOW_CLOSEFLOW.md`
- `src/lib/plans.ts`
- `src/lib/access.ts`
- `src/lib/workspace.ts`
- `src/hooks/useWorkspace.ts`
- `src/lib/supabase-fallback.ts`
- `src/lib/supabase-auth.ts`
- `api/me.ts`
- `package.json`

## CO ZMIENIONO

1. `src/lib/plans.ts`
   - zmieniono ostatni fallback w `normalizePlanId` z trial na Free.
   - dodano marker `STAGE231E2_ACCOUNT_TRIAL_BOOTSTRAP_BLOCKER`.
   - efekt: nieznane albo niepełne stany planu nie dostają już automatycznie trialowych funkcji.

2. `scripts/check-stage231e2-account-trial-bootstrap.cjs`
   - dodano guard sprawdzający, że unknown plan fallback nie wraca do trial.
   - guard sprawdza też obecność bounded repair logic w `api/me.ts`.

## TESTY / GUARDY

Do uruchomienia lokalnie:

```powershell
node scripts/check-stage231e2-account-trial-bootstrap.cjs
npm run build
git diff --check
```

Nie uruchomiono lokalnie w tym środowisku, bo zmiana była wykonana przez GitHub connector bez node_modules/runtime.

## AUDYT PO ETAPIE

Co naprawiono:
- Usunięto niebezpieczny domyślny model: unknown plan/status => trial.

Czego nie naprawiono w R1:
- R1 nie odnawia automatycznie wszystkich starych expired triali.
- R1 nie wykonuje SQL na bazie.
- R1 nie zmienia `api/me.ts`, poza statyczną kontrolą guardem.

Ryzyko:
- Jeśli przyczyna jest wyłącznie w `/api/me` albo w danych bazy, R1 może nie wystarczyć do aktywacji nowego triala. Wtedy potrzebny R2.

## ZNALEZIONE PROBLEMY

- FOUND-20260612-TRIAL-BOOTSTRAP-R1: Nowe lub niepełne konta nie mogą być traktowane jako trial przez frontendową normalizację planu, jeśli backend nie potwierdza aktywnego triala.

## OBSIDIAN PAYLOAD

folder Obsidiana: `10_PROJEKTY/CloseFlow_Lead_App`
typ wpisu: blocker / account trial bootstrap / guard
status zapisu: zapisane w repo `_project/runs`; Obsidian lokalny do synchronizacji

## NASTĘPNY KROK

Po `git pull` uruchomić guard i build. Następnie założyć świeże konto testowe:

1. Jeżeli pokazuje aktywny trial / dostęp pozwalający testować Google Calendar zgodnie z planem: wrócić do STAGE231F testów ręcznych.
2. Jeżeli nadal pokazuje expired trial: wdrożyć R2 w `api/me.ts` i ewentualny SQL dla świeżych błędnych workspace.
