# OBSIDIAN_UPDATE_MANIFEST_STAGE221_CLOSEFLOW_OWNER_CONTROL_ROADMAP

Data: 2026-06-04  
Stage: `STAGE221_OWNER_CONTROL_ROADMAP_AFTER_CRM_RESEARCH`  
Repo: `dkknapikdamian-collab/leadflowv1`  
Branch: `dev-rollout-freeze`  
Local path: `C:\Users\malim\Desktop\biznesy_ai\2.closeflow`  
Obsidian vault: `C:\Users\malim\Desktop\biznesy_ai\00_OBSIDIAN_VAULT`  
Obsidian folder: `10_PROJEKTY\CloseFlow_Lead_App`  

## Plik do Obsidiana

Źródło w repo po apply:

```text
_project/obsidian_updates/2026-06-04 - CloseFlow - owner control roadmap po researchu CRM.md
```

Docelowo w vault:

```text
10_PROJEKTY\CloseFlow_Lead_App\2026-06-04 - CloseFlow - owner control roadmap po researchu CRM.md
```

## Status

- status zapisu: przygotowano ZIP
- runtime UI: nietknięte
- repo code: tylko guard dokumentacyjny
- _project: aktualizowane przez apply script
- Obsidian: plik kopiowany automatycznie, jeśli vault istnieje lokalnie

## Komenda testowa po apply

```powershell
node scripts/check-stage221-owner-control-roadmap-memory.cjs
git diff --check
```

## Komenda selektywnego commit/push repo

Nie używać `git add .`.

```powershell
cd "C:\Users\malim\Desktop\biznesy_ai\2.closeflow"
git status --short
git add -- `
  "_project/07_NEXT_STEPS.md" `
  "_project/04_DECISIONS.md" `
  "_project/06_GUARDS_AND_TESTS.md" `
  "_project/08_CHANGELOG_AI.md" `
  "_project/12_IMPLEMENTATION_LEDGER.md" `
  "_project/13_TEST_HISTORY.md" `
  "_project/roadmaps/2026-06-04 - CloseFlow owner control roadmap po researchu CRM.md" `
  "_project/runs/STAGE221_OWNER_CONTROL_ROADMAP_2026_06_04.md" `
  "_project/obsidian_updates/2026-06-04 - CloseFlow - owner control roadmap po researchu CRM.md" `
  "scripts/check-stage221-owner-control-roadmap-memory.cjs" `
  "OBSIDIAN_UPDATE_MANIFEST_STAGE221_CLOSEFLOW_OWNER_CONTROL_ROADMAP.md"
git commit -m "docs(closeflow): add owner-control roadmap stages after CRM research"
git push origin dev-rollout-freeze
```

## Komenda selektywnego commit/push Obsidiana, jeśli vault jest repo git

```powershell
cd "C:\Users\malim\Desktop\biznesy_ai\00_OBSIDIAN_VAULT"
git status --short
git add -- "10_PROJEKTY/CloseFlow_Lead_App/2026-06-04 - CloseFlow - owner control roadmap po researchu CRM.md"
git commit -m "docs(closeflow): add owner-control roadmap after CRM research"
git push
```
