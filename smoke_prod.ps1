Set-Location $PSScriptRoot

# Runs production smoke without rebuilding (assumes existing build output).
cmd /c "npm run smoke:prod"

Read-Host "Enter"

