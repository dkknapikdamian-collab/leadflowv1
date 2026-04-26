# Wdrożenie paczki do lokalnego repo

```powershell
$Repo = "C:\Users\malim\Desktop\biznesy_ai\2.closeflow"
$Branch = "dev-rollout-freeze"
$Zip = "$HOME\Downloads\closeflow_quick_lead_capture_stage_2026-04-26.zip"
$Temp = "$HOME\Downloads\closeflow_quick_lead_capture_stage_2026-04-26_unpacked"

if (Test-Path $Temp) { Remove-Item -Recurse -Force $Temp }
Expand-Archive -Force $Zip $Temp

Set-Location $Repo
git fetch origin
git checkout $Branch

Copy-Item -Recurse -Force (Join-Path $Temp "*") $Repo

npm.cmd install
npm.cmd run test:stage
npm.cmd run build
```

# Commit i push później

```powershell
Set-Location "C:\Users\malim\Desktop\biznesy_ai\2.closeflow"

git status --short
git add .
git commit -m "Add notifications center and snooze reminders"
git push origin dev-rollout-freeze
```
