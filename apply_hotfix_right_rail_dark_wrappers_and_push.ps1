param(
  [Parameter(Mandatory = $true)][string]$Repo,
  [Parameter(Mandatory = $true)][string]$Branch
)

$ErrorActionPreference = "Stop"

function Step($name) {
  Write-Host "== $name =="
}

function Fail($message) {
  Write-Error $message
  exit 1
}

if (-not (Test-Path -LiteralPath $Repo)) {
  Fail "Repo path not found: $Repo"
}

$BundleRoot = Split-Path -Parent $MyInvocation.MyCommand.Path

$FilesToCopy = @(
  "src/styles/hotfix-right-rail-dark-wrappers.css",
  "src/pages/Activity.tsx",
  "src/pages/AiDrafts.tsx",
  "src/pages/NotificationsCenter.tsx",
  "tests/hotfix-right-rail-dark-wrappers.test.cjs",
  "README_HOTFIX_RIGHT_RAIL_DARK_WRAPPERS.md"
)

Step "git fetch origin"
git -C $Repo fetch origin

Step "git checkout $Branch"
git -C $Repo checkout $Branch

Step "git pull --ff-only origin $Branch"
git -C $Repo pull --ff-only origin $Branch

Step "Copy hotfix files"
foreach ($rel in $FilesToCopy) {
  $src = Join-Path $BundleRoot $rel
  $dst = Join-Path $Repo $rel
  $dstDir = Split-Path -Parent $dst

  if (-not (Test-Path -LiteralPath $src)) { Fail "Missing bundle file: $src" }
  if (-not (Test-Path -LiteralPath $dstDir)) { New-Item -ItemType Directory -Force -Path $dstDir | Out-Null }

  Copy-Item -Force -LiteralPath $src -Destination $dst
}

Push-Location $Repo
try {
  Step "Test: hotfix right rail wrappers"
  node "tests/hotfix-right-rail-dark-wrappers.test.cjs"

  Step "Test: Polish mojibake"
  node "scripts/check-polish-mojibake.cjs"

  Step "Build"
  npm.cmd run build
} finally {
  Pop-Location
}

Step "Git status"
git -C $Repo status --porcelain

Step "Commit"
git -C $Repo add .
git -C $Repo commit -m "Fix dark right rail wrappers in Activity AI Drafts and Notifications"

Step "Push"
git -C $Repo push origin $Branch

Write-Host "DONE: Hotfix applied and pushed to $Branch."
