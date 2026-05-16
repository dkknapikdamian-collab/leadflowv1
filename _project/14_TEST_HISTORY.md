# 14_TEST_HISTORY - CloseFlow / LeadFlow

## 2026-05-16 - Memory protocol and Obsidian mapping closeout

### TESTY AUTOMATYCZNE

- GitHub connector presence checks for required files and markers.
- Dedicated runtime tests were not executed because this was an organizational stage and no runtime UI, routing, product logic, styles or architecture were changed.

### GUARDY

BRAK DEDYKOWANEGO GUARDA DLA ETAPU MAPOWANIA OBSIDIANA — wykonano testy obecnosci plikow i markerow przez GitHub scan.

### TESTY RECZNE

BRAK POTWIERDZONEGO TESTU RECZNEGO — etap organizacyjny, bez zmian runtime UI.

### DO POTWIERDZENIA LOKALNIE

After pulling locally, run:

```powershell
$AppRepo="C:\Users\malim\Desktop\biznesy_ai\2.closeflow"
$Vault="C:\Users\malim\Desktop\biznesy_ai\00_OBSIDIAN_VAULT"

Test-Path "$AppRepo\AGENTS.md"
Test-Path "$AppRepo\_project\00_PROJECT_MEMORY_PROTOCOL.md"
Test-Path "$AppRepo\_project\STAGE_TEMPLATE_MINIMAL.md"
Test-Path "$AppRepo\_project\runs\2026-05-16_0854_closeflow_memory_protocol_v1.md"
Select-String -Path "$AppRepo\AGENTS.md" -Pattern "DAMIAN_MINIMAL_PROJECT_MEMORY_PROTOCOL_START"

Test-Path "$Vault\10_PROJEKTY\CloseFlow_Lead_App\00_START - CloseFlow Lead App.md"
Select-String -Path "$Vault\PROJECTS.md" -Pattern "CloseFlow_Lead_App"

git -C $AppRepo status --short
git -C $Vault status --short
```
