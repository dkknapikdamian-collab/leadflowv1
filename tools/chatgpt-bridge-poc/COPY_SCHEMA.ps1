Set-Location $PSScriptRoot
Get-Content ".\openapi.yaml" -Raw | Set-Clipboard
Write-Host "Schema copied."
