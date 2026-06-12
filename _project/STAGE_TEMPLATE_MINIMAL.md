# STAGE_TEMPLATE_MINIMAL - CloseFlow / LeadFlow

Use this template for every meaningful stage.

## 1. Scope

- Stage name:
- Date:
- Operator:
- App repo branch: `dev-rollout-freeze`
- Obsidian branch: `main`
- Runtime change: YES/NO
- Visual place in app where Damian verifies result:
- Route/screen:
- What must not be touched:

## 2. Scan proof

### Method

- Commands/tools used:

### Folders found

- App repo:
- `_project/`:
- `scripts/`:
- `tests/`:
- `docs/`:
- Obsidian CloseFlow section:

### Folders missing

- List missing paths and impact.

### Files read

Repo:
- `AGENTS.md`
- `_project/00_PROJECT_MEMORY_PROTOCOL.md`
- `_project/04_STAGE_AUDIT_PROTOCOL_CLOSEFLOW.md`
- `_project/STAGE_TEMPLATE_MINIMAL.md`
- latest `_project/runs/`
- `package.json`
- touched files

Obsidian:
- `START.md`
- `00_START_TUTAJ.md`
- `PROJECTS.md`
- `00_INSTRUKCJA_OBSIDIAN_DLA_AI.md`
- `10_PROJEKTY/CloseFlow_Lead_App/*`

### Source-of-truth map

- App repo:
- `_project/`:
- Obsidian:
- Chat:

### Conflicts

- Repo vs Obsidian:
- Repo vs chat:
- Obsidian vs chat:

## 3. AUDYT PRZED ETAPEM

### Stage existence map

- What already exists:
- Where it exists:
- What is missing:
- What conflicts:
- Existing guards/tests:
- Missing guards/tests:

### Area map

- User-visible screen/route:
- Components/modules:
- Data source:
- Actions affected:
- Similar places to inspect:
- Shared components/helpers:
- What must not be touched:

### Real adjacent problems found

List only real, evidence-based problems. Do not add speculative cleanup.

- Problem:
- Evidence:
- Risk:
- Fix now or later:

### Regression risks before implementation

- UI risk:
- Data risk:
- Auth/security risk:
- Routing risk:
- Supabase/RLS risk:
- Docs/Obsidian drift risk:

### Guard/test plan

- Automated guard/test:
- Build/typecheck:
- Manual test for Damian:
- If no guard: reason and risk:

## 4. Report baskets

### FAKTY Z KODU / PLIKOW

### DECYZJE DAMIANA

### HIPOTEZY / PROPOZYCJE AI

### DO POTWIERDZENIA

### TESTY AUTOMATYCZNE

### GUARDY

### TESTY RECZNE

Use exact status:
`BRAK POTWIERDZONEGO TESTU RECZNEGO`, unless Damian confirmed a manual test.

### POTWIERDZENIA DAMIANA

### BRAKI I RYZYKA

### WPLYW NA OBSIDIANA

### WPLYW NA KIERUNEK ROZWOJU

### NASTEPNY KROK

### GIT / ZIP STATUS

## 5. AUDYT PO ETAPIE

### Cause check

- Original problem:
- Root cause fixed or only symptom masked:
- Evidence:

### Related-place check

- Similar places checked:
- Shared components/helpers checked:
- Places intentionally not touched and why:

### Regression check

- UI/readability:
- Routing:
- Auth/gating:
- Data/refetch/optimistic update:
- Status/mapping:
- Mobile, if relevant:
- Docs/project memory:

### New problems found

List only real problems found during this stage.

- Problem:
- Evidence:
- Severity:
- Add to which backlog/stage:

### Verification result

- Guards/tests run:
- Result:
- Checks not run and why:
- Manual test for Damian:

### Closure decision

- Closed: YES/NO
- If NO, blocker:
- Next best step:

## 6. Closure rule

The stage is not closed unless:
- run report exists
- scan proof exists
- `AUDYT PRZED ETAPEM` exists
- `_project/` is updated
- Obsidian is updated or included in ZIP
- tests/guards are recorded
- manual test status is recorded
- `AUDYT PO ETAPIE` exists
- app push is done or skipped with reason
- Obsidian push is done or skipped with reason
