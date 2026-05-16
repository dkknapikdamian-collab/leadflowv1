# STAGE_TEMPLATE_MINIMAL - CloseFlow / LeadFlow

Use this template for every meaningful stage.

## 1. Scope

- Stage name:
- Date:
- Operator:
- App repo branch: `dev-rollout-freeze`
- Obsidian branch: `main`
- Runtime change: YES/NO

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

## 3. Report baskets

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

## 4. Closure rule

The stage is not closed unless:
- run report exists
- scan proof exists
- `_project/` is updated
- Obsidian is updated or included in ZIP
- tests/guards are recorded
- manual test status is recorded
- app push is done or skipped with reason
- Obsidian push is done or skipped with reason
