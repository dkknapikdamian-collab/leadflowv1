# CloseFlow Stage212Z - deploy sync po błędzie Vercel

## FAKTY
- Vercel build po commicie 80b2491 nie przeszedł przez brak importowanego pliku CSS.
- Lokalnie build przechodził, bo pliki były w katalogu roboczym, ale nie były wszystkie w Git.
- Zmieniono decyzję operacyjną: robimy szerszy sync sensownych plików projektu, a nie tylko kilka końcowych plików Stage212.

## DECYZJE DAMIANA
- Wrzucić całość zmian projektowych związanych z CloseFlow.
- Nie wrzucać przypadkowych backupów i śmieci.
- Obsidian ma dostać wpis o kierunku i błędzie deploymentu.

## RYZYKA
- Repo ma dużo lokalnych plików historycznych. Backupów i .bak nie wolno wrzucać masowo.
- Przyszłościowo trzeba zrobić osobny cleanup repo, bo obecny working tree jest zaśmiecony stage'ami.

## NASTĘPNY KROK
- Po pushu sprawdzić Vercel build.
