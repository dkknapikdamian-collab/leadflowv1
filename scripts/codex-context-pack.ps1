$ErrorActionPreference = "Stop"

$Repo = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot "..")).Path
$OutDir = Join-Path $Repo "_LOCAL_CHECKS\codex-context"
$OutFile = Join-Path $OutDir "closeflow-context-pack.md"
$Fence = [string]([char]96) * 3

New-Item -ItemType Directory -Force -Path $OutDir | Out-Null

$Files = @(
  "AGENTS.md",
  "_project/CODEX_CONTEXT_INDEX.md",
  "_project/00_PROJECT_MEMORY_PROTOCOL.md",
  "_project/04_STAGE_AUDIT_PROTOCOL_CLOSEFLOW.md",
  "_project/04_STAGE_AUDIT_PROTOCOL_CLOSEFLOW__FOUND_PROBLEMS_ADDENDUM.md",
  "_project/04_ZNALEZIONE_PROBLEMY_DO_ANALIZY.md",
  "_project/04_ETAPY_ROZWOJU_APLIKACJI.md",
  "_project/04_KIERUNEK_ROZWOJU_APLIKACJI.md",
  "_project/06_GUARDS_AND_TESTS.md",
  "_project/07_NEXT_STEPS.md",
  "_project/08_CHANGELOG_AI.md",
  "_project/13_TEST_HISTORY.md",
  "package.json"
)

$Builder = [System.Text.StringBuilder]::new()
[void]$Builder.AppendLine("# CloseFlow bounded Codex context pack")
[void]$Builder.AppendLine("")
[void]$Builder.AppendLine("Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')")
[void]$Builder.AppendLine("Repo: $Repo")
[void]$Builder.AppendLine("")
[void]$Builder.AppendLine("This pack uses an exact file list. It does not recurse through the repo or Obsidian vault.")
[void]$Builder.AppendLine("")

foreach ($File in $Files) {
  $Path = Join-Path $Repo $File
  [void]$Builder.AppendLine("---")
  [void]$Builder.AppendLine("## $File")
  [void]$Builder.AppendLine("")

  if (Test-Path -LiteralPath $Path) {
    [void]$Builder.AppendLine($Fence)
    [void]$Builder.AppendLine((Get-Content -LiteralPath $Path -Raw))
    [void]$Builder.AppendLine($Fence)
  } else {
    [void]$Builder.AppendLine("MISSING: $File")
  }

  [void]$Builder.AppendLine("")
}

$Utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($OutFile, $Builder.ToString(), $Utf8NoBom)

Write-Host "Context pack written:" -ForegroundColor Cyan
Write-Host $OutFile
