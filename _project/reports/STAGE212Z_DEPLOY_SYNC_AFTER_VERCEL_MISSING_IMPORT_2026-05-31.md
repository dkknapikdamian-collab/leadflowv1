# STAGE212Z - Deploy sync after Vercel missing import

## FAKTY
- Vercel build na commicie 80b2491 padł, bo src/App.tsx importował CSS, którego nie było w GitHub.
- Przyczyna: lokalny build przeszedł dzięki plikom nieśledzonym przez Git.
- Poprzedni push był za wąski i obejmował tylko końcówkę Stage212, a nie wszystkie zależne pliki projektu.

## ZAKRES
- Synchronizacja sensownych plików projektu:
  - src
  - scripts
  - docs
  - tests
  - _project raporty/runs/manifests
  - OBSIDIAN_UPDATE dla CloseFlow
  - package files
- Bez git add ..
- Bez backupów, .bak, patchy, dist, node_modules i lokalnych kopii.

## TESTY
- Stage212T guard
- Stage212Y guard
- Stage212X/V notifications guard
- npm run build

## CZEGO NIE RUSZANO
- Supabase
- RLS
- dane produkcyjne
- deployment manualny poza pushem
