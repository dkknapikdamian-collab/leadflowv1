$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
$LogDir = Join-Path $Root "logs"
New-Item -ItemType Directory -Force -Path $LogDir | Out-Null
Set-Location $Root

"[$(Get-Date -Format s)] Start testów" | Tee-Object -FilePath (Join-Path $LogDir "test.log") -Append

if (!(Test-Path "node_modules")) {
  "[$(Get-Date -Format s)] Instaluję zależności npm" | Tee-Object -FilePath (Join-Path $LogDir "test.log") -Append
  npm.cmd install 2>&1 | Tee-Object -FilePath (Join-Path $LogDir "test.log") -Append
}

npm.cmd run test:stage 2>&1 | Tee-Object -FilePath (Join-Path $LogDir "test.log") -Append
if ($LASTEXITCODE -ne 0) {
  "[$(Get-Date -Format s)] Testy nie przeszły" | Tee-Object -FilePath (Join-Path $LogDir "error.log") -Append
  exit $LASTEXITCODE
}

"[$(Get-Date -Format s)] Testy przeszły. Uruchamiam aplikację" | Tee-Object -FilePath (Join-Path $LogDir "app.log") -Append
Start-Process "http://localhost:3000"
npm.cmd run dev 2>&1 | Tee-Object -FilePath (Join-Path $LogDir "app.log") -Append
