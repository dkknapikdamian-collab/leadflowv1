# Repo backup hygiene guard

Cel: backupy generowane przez paczki wdro??eniowe nie mog?? by?? ??ledzone przez Git.

Guard sprawdza, czy `git ls-files` nie zawiera katalog??w top-level typu:

- `.stage*_backup_*`
- `.global_*_backup_*`
- `.*_failed_attempts_backup_*`

Te katalogi s?? lokalnym materia??em pomocniczym i nie s?? cz????ci?? produktu.
