$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

if (!(Test-Path ".\.env")) {
  $localKey = (([guid]::NewGuid().ToString("N")) + ([guid]::NewGuid().ToString("N")))
  "PORT=8787`nKABELKI_BRIDGE_KEY=$localKey" | Set-Content -Encoding utf8 ".\.env"
  Write-Host "Created local .env for POC. Do not commit it."
}

Write-Host "Stopping existing listener on 8787 if present..."
$pidLines = netstat -ano | Select-String ":8787\s+.*LISTENING"
foreach ($line in $pidLines) {
  $parts = ($line.ToString() -split "\s+") | Where-Object { $_ -ne "" }
  if ($parts.Count -gt 0) {
    $pidValue = [int]$parts[-1]
    Write-Host "Stop PID $pidValue"
    Stop-Process -Id $pidValue -Force -ErrorAction SilentlyContinue
  }
}

Write-Host "Starting Kabelki ChatGPT Bridge POC on localhost:8787"
npm start
