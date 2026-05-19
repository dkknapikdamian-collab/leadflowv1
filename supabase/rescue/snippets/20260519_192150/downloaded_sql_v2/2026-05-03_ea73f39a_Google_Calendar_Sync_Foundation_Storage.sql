$ErrorActionPreference="Stop"
$Repo="C:\Users\malim\Desktop\biznesy_ai\2.closeflow"
$Out="C:\Users\malim\Desktop\biznesy_ai\_SUPABASE_RESCUE\closeflow_$(Get-Date -Format yyyyMMdd_HHmmss)"
New-Item -ItemType Directory -Force $Out | Out-Null
Set-Location $Repo

"== GIT ==" | Tee-Object "$Out\00_scan.txt"
git branch --show-current | Tee-Object "$Out\00_scan.txt" -Append
git status --short | Tee-Object "$Out\00_scan.txt" -Append

"== LOCAL SQL FILES ==" | Tee-Object "$Out\01_sql_files.txt"
Get-ChildItem $Repo -Recurse -File -Include *.sql |
  Where-Object { $_.FullName -notmatch "\\node_modules\\|\\dist\\|\\_backup_local\\" } |
  Select-Object FullName,Length,LastWriteTime |
  Format-Table -AutoSize | Out-String | Tee-Object "$Out\01_sql_files.txt"

"== SUPABASE FOLDER ==" | Tee-Object "$Out\02_supabase_folder.txt"
if(Test-Path "$Repo\supabase"){
  Get-ChildItem "$Repo\supabase" -Recurse -File |
    Select-Object FullName,Length,LastWriteTime |
    Format-Table -AutoSize | Out-String | Tee-Object "$Out\02_supabase_folder.txt"
} else {
  "BRAK folderu supabase w repo" | Tee-Object "$Out\02_supabase_folder.txt"
}

"== DONE =="
"Backup scan folder: $Out"
