---
typ: implementation_stage
doc_role: active_stage_contract
status: active
canonical: true
project_id: closeflow_lead_app
canonical_name: CloseFlow / LeadFlow / CaseFlow
stage_id: LF-PROD-SOT-G15-R23L_LUCIDE_NAMESPACE_REGISTRY_CAST_REPAIR
verified_at: 2026-08-07 Europe/Warsaw
source_repo: dkknapikdamian-collab/leadflowv1
source_branch: stage/lf-prod-sot-g15-r23l-lucide-namespace-registry-cast-repair-r1
source_ref: 787b9e0f5d2172c0fbd399807ee53b2f6e8cde49
base_branch: dev-rollout-freeze
base_ref: 21f27150df059e79e066fa0cba97cbd3483eda76
pr: 50
docsys_owner: APPLICATION_REPOSITORY
migrated_from: obsidian-vault/10_PROJEKTY/CloseFlow_Lead_App/STAGES/LF-PROD-SOT-G15-R23L_LUCIDE_NAMESPACE_REGISTRY_CAST_REPAIR.md
master_roadmap: 10_PROJEKTY/CloseFlow_Lead_App/STAGES/LF-V1_MASTER_EXECUTION_ROADMAP.md
remote_evidence:
  - github_actions_run:29866995867
  - github_actions_artifact:8509628225
  - github_actions_artifact_digest:sha256:f9072d543d79937123d76932acc2da72b5f9fe0a8de3fa911741ab50ace5554c
  - tsc_log_sha256:fe6cb8013043b74b96915adec1d73ee3434008ce191c4e97120f925ed66f0916
  - local_acceptance_package:CLOSEFLOW_G15_R23L_ACCEPT_MERGE_SYNC_R1.zip
  - local_acceptance_package_sha256:b8b5ac7c49f71f1454db3a01d9fcaf5e595b3697b3914b9f70448a7e4ab6f275
control_plane_resolution:
  id: CONTROL-00
  execution_branch: codex/closeflow-v1-e2e-roadmap
  execution_base_branch: dev-rollout-freeze
  execution_base_ref: ab0f5c85f6cb3636c483debd13c04c5e29779c81
  historical_pr_role: EVIDENCE_ONLY_REEXECUTION_REQUIRED
---

# G15-R23L — Lucide namespace registry cast repair

## Stan

`REMOTE_GATES_PASS / DRAFT_PR_OPEN / LOCAL_ACCEPTANCE_PACKAGE_READY / EXACT_LOCAL_AND_MERGE_PENDING`

## CONTROL-00 execution handoff

The historical stage branch and PR #50 remain immutable evidence. They are not the implementation source for this run. The controller resolved the control plane to `codex/closeflow-v1-e2e-roadmap` from `dev-rollout-freeze@ab0f5c85f6cb3636c483debd13c04c5e29779c81`; the minimal R23L diff must be reproduced and reverified there. No PASS is inherited from PR #50.

## Wejście diagnostyczne

```text
src/components/ui-system/icon-registry.ts(6,21) TS2352
Conversion of the lucide-react namespace to Record<string, LucideIcon> requires an unknown bridge.
```

## Analiza przyczyny

Rejestr ikon celowo odczytuje eksport `Trash2` przez dynamiczny klucz i zachowuje fallback `X`. TypeScript odrzuca bezpośredni cast namespace importu do `Record<string, LucideIcon>` i wymaga jawnego przejścia przez `unknown`.

Naprawa jest wyłącznie typową granicą statyczną. Nie może zmienić wybranej ikony, dynamicznego klucza, fallbacku, map encji ani map aplikacji.

## Zakres implementacji

1. `src/components/ui-system/icon-registry.ts`:
   - zamienić wyłącznie `Lucide as Record<string, LucideIcon>` na `Lucide as unknown as Record<string, LucideIcon>`.
2. focused test i byte-scope guard.

## Allowlista

PR może zawierać dokładnie trzy pliki:

1. `src/components/ui-system/icon-registry.ts`;
2. `scripts/check-g15-r23l-lucide-namespace-registry-cast.cjs`;
3. `tests/lf-prod-sot-g15-r23l-lucide-namespace-registry-cast.test.cjs`.

## Niezmienialny zakres

Nie zmieniać nazw ikon, klucza `Trash2`, fallbacku `X`, `ENTITY_ICON_MAP`, `APP_ICON_LUCIDE_MAP`, UI, CSS, zależności, DELETE ani Google Calendar. Nie dodawać `any` i nie importować nowej zależności.

## Potwierdzone dowody zdalne

```text
PR=50
HEAD=787b9e0f5d2172c0fbd399807ee53b2f6e8cde49
BASE=21f27150df059e79e066fa0cba97cbd3483eda76
MERGEABLE=YES
DRAFT=YES
CHANGED_FILES=3
ALLOWLIST=PASS
VERCEL_2_CLOSEFLOW=SUCCESS
VERCEL_CLOSEDOCKAPP=SUCCESS
GITHUB_ACTIONS_R23A=PASS
TSC_ERROR_COUNT=49
GLOBAL_ERROR_COUNT=0
NON_ACTIVE_ERROR_COUNT=0
PRODUCTION_BUILD=PASS
FOCUSED_R23L_RECONSTRUCTED_TESTS=3/3_PASS
BYTE_SCOPE_RECONSTRUCTED_GUARD=PASS
```

Focused guard i testy zostały dodatkowo uruchomione na odtworzonym dokładnym diffie base→head. Nie zastępuje to wymaganego exact local verification na repo właściciela, ale potwierdza poprawność samego zakresu R23L.

## Zarejestrowane findingi mapy

Kontrakt wcześniejszy błędnie nazywał kandydat finansowy „pierwszym błędem” i wskazywał linię `(142,5) TS2353`. Świeży artefakt exact head pokazuje:

```text
ACTUAL_RAW_FIRST_ERROR=src/hooks/useFirebaseSession.ts(2,10) TS2300 Duplicate identifier 'User'
FINANCE_CANDIDATE=src/lib/finance/finance-client-summary.ts(140,5) TS2561 plannedAmount
```

To finding dokumentacyjno-routingowy. Nie jest regresją R23L. Następny etap może zostać nazwany dopiero po domknięciu R23L i formalnym wyborze jednej przyczyny z pełnej świeżej mapy.

## Wymagane dowody lokalne

- exact local/origin branch SHA: `787b9e0f5d2172c0fbd399807ee53b2f6e8cde49`;
- changed-file allowlist: PASS;
- dependency manifests unchanged: PASS;
- focused R23L tests: PASS;
- R23L byte-scope guard: PASS;
- zgodność lokalnego logu TSC z exact artefaktem SHA-256 `fe6cb8013043b74b96915adec1d73ee3434008ce191c4e97120f925ed66f0916`;
- TypeScript debt: `50 -> 49`;
- global errors: `0`;
- non-active errors: `0`;
- production build: PASS;
- diagnostic cleanup: PASS;
- clean worktree;
- `.stversions/` i `.stignore`: zachowane;
- squash merge PR #50 przy niezmienionym head;
- exact merge-SHA local reverify na `dev-rollout-freeze`.

## Pakiet lokalny

```text
PACKAGE=CLOSEFLOW_G15_R23L_ACCEPT_MERGE_SYNC_R1.zip
SHA256=b8b5ac7c49f71f1454db3a01d9fcaf5e595b3697b3914b9f70448a7e4ab6f275
```

Pakiet wykonuje pre-merge gate, merge tylko po PASS, synchronizację lokalnego `dev-rollout-freeze` i post-merge exact SHA gate. Nie routuje automatycznie R23M.

## Polityka wdrożenia

`GITHUB_MERGE_PLUS_FULL_LOCAL_TESTS_IS_SUFFICIENT`. Vercel ma status `WAIVED_BY_OWNER` i nie jest bramką.

Po PASS i exact merge-SHA reverify nie tworzyć automatycznie szerokiego R23M. Najpierw zapisać wynik świeżej mapy TypeScript i utworzyć dokładnie jeden kolejny etap zgodnie z master roadmapą.
