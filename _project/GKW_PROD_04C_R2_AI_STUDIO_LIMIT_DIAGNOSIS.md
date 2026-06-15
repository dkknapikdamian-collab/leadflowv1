# Jak rozpoznać, czy AI Studio skończyło limit — GKW-PROD-04C-R2

Data: 2026-06-15 11:30 Europe/Warsaw  
Status: aktywna dokumentacja uzupełniająca do `_project/AI_PROVIDER_RUNTIME_SETUP.md`

## Najważniejsza zasada

`CONTROLLED_SKIP` nie jest dowodem wyczerpanego limitu.

Controlled skip oznacza, że system bezpiecznie zatrzymał próbę, bo brakowało pewnego elementu: credential, credential resolution, health albo quota/capacity state.

## Trzy różne przypadki

### 1. MISSING_CREDENTIAL

Brakuje `credentialRef`, zmiennej ENV albo credentialRef nie rozwiązuje się do aktywnego konta.

To nie jest quota exhausted.

### 2. QUOTA_UNKNOWN_OR_NOT_TRACKED

Credential istnieje, ale system nie zna pozostałego limitu.

Jeżeli provider API nie zwraca realnego remaining quota, zapisujemy `quotaSource=unknown`. Nie wolno udawać, że znamy `remainingTokens` albo `remainingRequests`.

Przy owner approval i `maxEstimatedCost` można wykonać controlled real probe.

### 3. QUOTA_EXHAUSTED_CONFIRMED / RATE_LIMITED_CONFIRMED

To jest fakt dopiero wtedy, gdy realny provider call został wykonany i API zwróciło błąd quota/rate/limit.

## Komendy lokalne

Guard:

`node --test --test-concurrency=1 runtime/tests/gkw-prod-04c-real-quota-fallback-proof.test.mjs`

Real probe:

`node scripts/gkw-prod-04c-r2-real-quota-fallback-proof.mjs --provider google_ai_studio --real-probe --owner-approved --max-estimated-cost 5`

Quota burn / fallback proof:

`node scripts/gkw-prod-04c-r2-real-quota-fallback-proof.mjs --provider google_ai_studio --quota-burn --fallback-required --owner-approved --max-attempts 20 --max-estimated-cost 5`

## Artifact dowodowy

`_project/fixtures/gkw-prod-04c/provider-readiness/quota_fallback_proof.json`

Pola wymagane:

- primaryProvider
- primaryModel
- primaryAttemptStatus
- primaryErrorClass
- primaryQuotaStatus
- primaryUsage
- fallbackAttempted
- fallbackProvider
- fallbackModel
- fallbackAttemptStatus
- fallbackUsage
- fallbackReason
- tokenEstimateBeforeCall
- quotaDecisionBeforeCall
- usageLedgerWritten
- codexBlocked
- noRawSecrets
- realProof

## Warunek przejścia dalej

Można iść dalej tylko przy jednym z wyników:

- EXECUTED_AI_STUDIO_SUCCESS
- EXECUTED_AI_STUDIO_QUOTA_EXHAUSTED plus FALLBACK_EXECUTED_AND_VALIDATED
- FALLBACK_EXECUTED_AND_VALIDATED

Nie można iść dalej przy:

- CONTROLLED_SKIP_MISSING_CREDENTIAL
- CONTROLLED_SKIP_QUOTA_UNKNOWN
- FALLBACK_NOT_READY

## Ryzyko

Największe ryzyko to fałszywy PASS: uznanie controlled skip albo mocka za realne działanie. Dlatego strict wrapper waliduje, że fallback nie użył tego samego provider/account jako dowodu drugiego calla.
