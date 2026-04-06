Set-Location $PSScriptRoot
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
  Write-Host "Nie znaleziono npm. Zainstaluj Node.js 20+."
  Read-Host "Enter"
  exit 1
}
node scripts/launch-dev.mjs
Read-Host "Enter"
