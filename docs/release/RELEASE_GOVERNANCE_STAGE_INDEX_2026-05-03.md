# FAZA 0 — Release governance i jedno źródło prawdy

Ten dokument blokuje chaos nazewnictwa etapów. Od tego miejsca paczki i commity mają być nazywane zgodnie z mapą release, nie losowymi nazwami technicznymi.

## Aktualna kolejność

### FAZA 0 — Release governance i jedno źródło prawdy

#### Etap 0.1 — Release Candidate Evidence Gate

Status: wdrożony technicznie, nazewnictwo zablokowane w tym etapie.

W repo musi istnieć:

- `scripts/print-release-evidence.cjs`
- `npm run audit:release-evidence`
- docelowy plik generowany przez skrypt: `docs/release/RELEASE_CANDIDATE_EVIDENCE_2026-05-02.md`

Cel etapu 0.1: audytor widzi jeden branch, jeden commit, jeden deployment, package.json, skrypty, build, testy, env matrix bez sekretów i znane ograniczenia.

#### Etap 0.2 — Mapa domen / deploymentów / publicznych źródeł

Status: wdrożony tym pakietem.

W repo musi istnieć:

- `docs/release/CLOSEFLOW_PUBLIC_SOURCE_MAP_2026-05-02.md`

Cel etapu 0.2: audytor nie miesza aktualnej aplikacji z landingiem, starym preview, archiwalną domeną albo publiczną stroną marketingową.

### FAZA 1 — UI truth, copy truth, legal truth

Następny etap po FAZIE 0.

#### Etap 1.1 — Prawda produktu w UI/copy/legal

Nie zaczynać przed domknięciem FAZY 0.

#### Etap 1.2 — Guard UI Truth

Nie zaczynać przed Etapem 1.1.

## Zasada dla kolejnych paczek

Każda kolejna paczka musi mieć w nazwie etap zgodny z tą mapą, np.:

- `closeflow_faza1_etap11_ui_copy_legal_truth_YYYY-MM-DD.zip`
- `closeflow_faza1_etap12_ui_truth_guards_YYYY-MM-DD.zip`
- `closeflow_faza2_etap21_workspace_isolation_request_scope_YYYY-MM-DD.zip`

Nazwy typu `p0_postfix`, `hotfix`, `smoke` mogą być używane tylko jako dopisek techniczny w środku dokumentu, nie jako główna nazwa etapu.
