# 2026-05-31 - CloseFlow Stage214 repo hygiene backup audit

STATUS: AUDIT_ONLY
NO_DELETE_EXECUTED
NO_GIT_ADD_DOT

## FAKTY

- Stage213C-A/B/C zostały domknięte przed Stage214.
- Lokalny working tree zawiera dużo nieśledzonych backupów, plików .bak, patchy i folderów archiwalnych.
- Stage214 nie usuwa i nie przenosi plików.
- Stage214 tworzy mapę ryzyka, żeby przypadkiem nie dodać lokalnego śmietnika do repo.

## PODSUMOWANIE

- total status entries excluding Stage214 files: 115
- untracked entries: 115
- tracked modified entries unrelated to Stage214: 0

| category | count | action now | recommendation |
|---|---:|---|---|
| local_backups_root | 1 | audit only, no delete | Keep outside commits. Consider moving outside repo or adding a narrow ignore rule after manual review. |
| project_backups | 61 | audit only, no delete | Do not commit raw backups. Decide whether selected final reports should be archived; otherwise ignore or move outside repo. |
| project_archive | 1 | audit only, no delete | Review separately. Archive folders may be legitimate, but untracked archive dumps should not be swept into commit. |
| patch_backup | 2 | audit only, no delete | Do not commit emergency patch backups. Keep only if explicitly needed for rollback evidence. |
| bak_files | 50 | audit only, no delete | Do not commit .bak files. Prefer one documented report over scattered backup copies. |

## DECYZJA

Nie używać `git add .`. Nie commitować backupów, .bak ani dumpów archiwalnych. Najpierw osobna decyzja, potem ewentualny Stage214-B cleanup.

## RYZYKA

- Backupi mogą zawierać stare wersje kodu, które po przypadkowym commicie przywrócą błędy.
- Zbyt szerokie .gitignore może ukryć ważny raport albo guard.
- Usuwanie bez mapy może skasować plik potrzebny do odtworzenia wcześniejszego etapu.

## NASTĘPNY KROK

Po commicie Stage214 audit: zdecydować, czy robimy Stage214-B jako bezpieczny cleanup albo tylko .gitignore hardening.
