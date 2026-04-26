$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
$LogDir = Join-Path $Root "logs"
New-Item -ItemType Directory -Force -Path $LogDir | Out-Null
Set-Location $Root

"[$(Get-Date -Format s)] Start lokalny" | Tee-Object -FilePath (Join-Path $LogDir "app.log") -Append

if (!(Test-Path "node_modules")) {
  "[$(Get-Date -Format s)] Instaluję zależności npm" | Tee-Object -FilePath (Join-Path $LogDir "app.log") -Append
  npm.cmd install 2>&1 | Tee-Object -FilePath (Join-Path $LogDir "app.log") -Append
}

Start-Process "http://localhost:3000"
npm.cmd run dev 2>&1 | Tee-Object -FilePath (Join-Path $LogDir "app.log") -Append
