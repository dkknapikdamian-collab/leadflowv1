Set-Location $PSScriptRoot

# PowerShell by default may block executing npm.ps1 depending on execution policy.
# Using cmd ensures npm.cmd is used instead.
cmd /c "npm run verify:prod"

Read-Host "Enter"

