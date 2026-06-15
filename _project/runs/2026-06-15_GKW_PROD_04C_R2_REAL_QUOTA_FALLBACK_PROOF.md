# GKW-PROD-04C-R2 — Real Quota Diagnosis + Real Fallback Proof

Data: 2026-06-15 11:25 Europe/Warsaw  
Repo: dkknapikdamian-collab/node-red-kabelki  
Branch: main  
Status: WDROŻONE PRZEZ GITHUB CONNECTOR, WYMAGA LOKALNEGO URUCHOMIENIA GUARDA I REAL PROBE Z ENV

## Scan report

Repo files read / checked:

- AGENTS.md
- runtime/gkw-provider-readiness.js
- runtime/provider-account-runtime-source.js
- scripts/gkw-prod-04c-provider-readiness-inspector.mjs
- scripts/gkw-prod-04c-build-real-drill-plan.mjs
- runtime/tests/gkw-prod-04c-provider-readiness-wiring.test.mjs
- package.json
- _project/AI_PROVIDER_RUNTIME_SETUP.md
- _project/runs/2026-06-14_GKW_PROD_04C_PROVIDER_READINESS_WIRING.md
- obsidian_updates/10_PROJEKTY/Node_RED_Kabelki/90_RAPORTY/2026-06-14 - GKW PROD 04C provider readiness wiring.md

Obsidian/project-memory checked through repo payloads:

- obsidian_updates/10_PROJEKTY/Node_RED_Kabelki/90_RAPORTY/2026-06-14 - GKW PROD 04C provider readiness wiring.md

## Fakt z repo

Poprzedni wynik CONTROLLED_SKIP_MISSING_CREDENTIAL_OR_QUOTA nie dowodzi, że AI Studio skończyło limit. To oznaczało tylko, że system nie miał bezpiecznego dowodu gotowości credential/quota/health do realnego calla.

## Co wdrożono

Dodano warstwę dowodową bez ruszania Node-RED flows, PDF, D1, Resend, UI ani final send:

- runtime/gkw-provider-real-proof.js
- runtime/gkw-provider-real-proof-strict.js
- scripts/gkw-prod-04c-r2-real-quota-fallback-proof.mjs
- runtime/tests/gkw-prod-04c-real-quota-fallback-proof.test.mjs
- _project/fixtures/gkw-prod-04c/provider-readiness/quota_fallback_proof.json

## Nowe statusy / rozróżnienia

- SIMULATED_FALLBACK_PASS
- CONTROLLED_SKIP_MISSING_CREDENTIAL
- CONTROLLED_SKIP_QUOTA_UNKNOWN
- EXECUTED_AI_STUDIO_SUCCESS
- EXECUTED_AI_STUDIO_QUOTA_EXHAUSTED
- FALLBACK_EXECUTED_AND_VALIDATED
- FALLBACK_NOT_READY

## Nowa klasyfikacja blokerów

- MISSING_CREDENTIAL
- CREDENTIAL_UNRESOLVED
- QUOTA_UNKNOWN_OR_NOT_TRACKED
- QUOTA_EXHAUSTED_CONFIRMED
- RATE_LIMITED_CONFIRMED
- HEALTH_NOT_ACTIVE
- MODEL_NOT_DISCOVERED
- MODEL_NOT_OWNER_APPROVED
- PROVIDER_READY_FOR_REAL_PROBE
- PROVIDER_READY_FOR_QUOTA_BURN

## Jak uruchomić lokalnie

Guard jednostkowy:

node --test --test-concurrency=1 runtime/tests/gkw-prod-04c-real-quota-fallback-proof.test.mjs

Real probe:

node scripts/gkw-prod-04c-r2-real-quota-fallback-proof.mjs --provider google_ai_studio --real-probe --owner-approved --max-estimated-cost 5

Quota burn / fallback proof:

node scripts/gkw-prod-04c-r2-real-quota-fallback-proof.mjs --provider google_ai_studio --quota-burn --fallback-required --owner-approved --max-attempts 20 --max-estimated-cost 5

## Dowód / artifact

Główny artifact:

_project/fixtures/gkw-prod-04c/provider-readiness/quota_fallback_proof.json

Fixture w repo jest tylko schema fixture i nie jest realnym dowodem. Realny dowód powstaje dopiero po lokalnym uruchomieniu z ENV.

## Co blokuje przejście dalej

Nie idziemy do GKW-RS-03 przy:

- CONTROLLED_SKIP_MISSING_CREDENTIAL
- CONTROLLED_SKIP_QUOTA_UNKNOWN
- FALLBACK_NOT_READY

Dalej można iść tylko przy:

- EXECUTED_AI_STUDIO_SUCCESS
- EXECUTED_AI_STUDIO_QUOTA_EXHAUSTED plus FALLBACK_EXECUTED_AND_VALIDATED
- FALLBACK_EXECUTED_AND_VALIDATED

## Testy

Dodany guard obejmuje:

- quota exhausted is not inferred from CONTROLLED_SKIP
- missing credential is classified separately from quota exhausted
- quota unknown is classified separately from quota exhausted
- quota unknown may allow real probe only with ownerApproved + maxEstimatedCost
- real quota exhausted requires provider error evidence
- fallback proof requires second provider/model/account
- fallback proof fails if fallback provider is NOT_READY
- remaining limit cannot be reported as known when quotaSource=unknown
- token estimate must exist before real probe
- usage ledger flag must exist after real provider attempt
- simulated fallback cannot be labeled as real fallback
- no raw secrets in quota/fallback proof artifact

## Audyt ryzyk po etapie

Ryzyka:

1. Real probe wymaga lokalnych ENV. GitHub connector nie ma dostępu do sekretów Damiana.
2. Real quota exhaustion nie może być wymuszone w repo bez kontrolowanego zużywania limitu.
3. Fallback musi mieć drugi provider/model/account. Ten etap blokuje fałszywe zaliczenie fallbacku tym samym kontem.
4. Fixture nie jest dowodem realnego działania. Jest tylko schematem artifactu.
5. Nie aktualizowano istniejącego package.json, więc guard trzeba uruchomić bezpośrednią komendą node --test.

## Czego nie ruszano

- data/flows.json
- data/.flows.json.backup
- runtime/data secrets/state jako commitowany stan
- Node-RED UI
- PDF
- Resend
- Stripe
- D1
- scheduler
- final send
- audytomat-stron repo

## Następny krok

Lokalnie uruchomić guard i real probe. Jeśli wynik to CONTROLLED_SKIP albo FALLBACK_NOT_READY, najpierw naprawić provider setup, nie iść dalej.
