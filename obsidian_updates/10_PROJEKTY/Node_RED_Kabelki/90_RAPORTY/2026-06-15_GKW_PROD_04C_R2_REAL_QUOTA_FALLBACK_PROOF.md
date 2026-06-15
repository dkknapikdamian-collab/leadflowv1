# GKW PROD 04C R2 real quota fallback proof

Data: 2026-06-15 11:35 Europe/Warsaw
Status: wdrozone w repo; do lokalnego uruchomienia real probe.

Routing:
- entity_id: E002
- workspace_id: DO_POTWIERDZENIA
- project_id: P001 / Node-RED Kabelki + RaportStrony bridge
- canonical_name: Globalna Korpo Wilka / real provider readiness
- repo: dkknapikdamian-collab/node-red-kabelki
- branch: main
- folder Obsidiana: 10_PROJEKTY/Node_RED_Kabelki

Decyzja:
CONTROLLED_SKIP nie oznacza wyczerpanego limitu AI Studio. To tylko bezpieczne zatrzymanie przed realnym call z powodu braku pewnego credential/quota/health.

Hipoteza Damiana:
AI Studio moglo skonczyc limit, ale wymaga to realnej odpowiedzi API: quota, rate albo limit error.

Wdrozone pliki:
- runtime/gkw-provider-real-proof.js
- runtime/gkw-provider-real-proof-strict.js
- scripts/gkw-prod-04c-r2-real-quota-fallback-proof.mjs
- runtime/tests/gkw-prod-04c-real-quota-fallback-proof.test.mjs
- _project/fixtures/gkw-prod-04c/provider-readiness/quota_fallback_proof.json
- _project/GKW_PROD_04C_R2_AI_STUDIO_LIMIT_DIAGNOSIS.md
- _project/runs/2026-06-15_GKW_PROD_04C_R2_REAL_QUOTA_FALLBACK_PROOF.md

Warunek przejscia dalej:
OK tylko przy EXECUTED_AI_STUDIO_SUCCESS albo realnym fallback validated. STOP przy CONTROLLED_SKIP_MISSING_CREDENTIAL, CONTROLLED_SKIP_QUOTA_UNKNOWN, FALLBACK_NOT_READY.

Audyt ryzyk:
Najwieksze ryzyko to falszywy PASS. Strict wrapper blokuje fallback, jesli drugi call uzywa tego samego provider/account.
