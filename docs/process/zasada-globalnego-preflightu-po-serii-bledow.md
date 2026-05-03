# Zasada globalnego preflightu po serii błędów

Status: obowiązuje dla dalszych paczek wdrożeniowych CloseFlow / LeadFlow.

## Cel

Gdy pojawia się podejrzenie wielu błędów z rzędu, nie rozdrabniamy pracy na kolejne drobne hotfixy. Najpierw stabilizujemy stan repozytorium i wykrywamy możliwie dużo problemów naraz. Celem jest oszczędność czasu, mniej fałszywych paczek i mniej kruchych patcherów.

## Kiedy uruchamiać ten tryb

Tryb globalnego preflightu jest obowiązkowy, gdy wystąpi co najmniej jeden z poniższych warunków:

1. Dwie lub więcej paczek z rzędu pada na patcherze, guardzie, TypeScript albo buildzie.
2. Pojawia się błąd składni w pliku patchera `.cjs` lub `.ps1`.
3. Patcher pada przez brak anchora / kotwicy w pliku źródłowym.
4. Poprawki zaczynają zostawiać częściowe lokalne zmiany w repo.
5. Vercel pokazuje inny błąd niż lokalny build albo buduje starszy commit.
6. Nie mamy pewności, czy problem jest w kodzie aplikacji, patcherze, konfiguracji czy migracji.

## Zasada główna

Po wykryciu takiej serii błędów zatrzymujemy małe hotfixy i robimy jeden globalny preflight:

1. backup lokalnego stanu,
2. reset tylko plików dotkniętych nieudanymi etapami,
3. weryfikacja składni wszystkich skryptów `.cjs`,
4. walidacja `package.json`,
5. odpalenie guardów krytycznych dla aktualnego obszaru,
6. `tsc --noEmit`,
7. `npm run build`,
8. zapis raportu do pliku,
9. dopiero potem przygotowanie jednej większej, stabilnej paczki.

## Czego nie robić

- Nie wysyłać kolejnych paczek naprawiających pojedynczy objaw, gdy poprzednie 2+ paczki padały.
- Nie zgadywać, czy problem jest w Google Cloud, Vercel albo Supabase, jeśli patcher nie przeszedł lokalnie.
- Nie patchować dużych plików React po kruchych anchorach, jeśli da się podpiąć zmianę niżej w stabilniejszej warstwie.
- Nie mieszać kilku nieudanych częściowych stanów bez backupu i resetu zakresowego.

## Minimalny globalny preflight

W trybie globalnym paczka musi sprawdzić co najmniej:

```powershell
node -e "JSON.parse(require('fs').readFileSync('package.json','utf8')); console.log('package.json OK')"
Get-ChildItem scripts -Filter *.cjs | ForEach-Object { node --check $_.FullName }
npm.cmd run check:google-calendar-stage07c-settings-auth-snapshot
npm.cmd run check:google-calendar-stage08d-runtime-ui-sync
npm.cmd run check:google-calendar-stage09b-full-calendar-parity
npm.cmd run check:google-calendar-stage09e-safe-source-url
npx.cmd tsc --noEmit
npm.cmd run build
```

Zakres guardów można rozszerzyć zależnie od modułu, ale nie wolno pomijać `tsc --noEmit` i `npm run build`.

## Forma dostarczenia

Każda kolejna paczka w tym trybie ma zawierać:

- jeden ZIP,
- jedno główne polecenie PowerShell do wklejenia,
- backup lokalnych zmian przed resetem,
- raport końcowy z PASS/FAIL,
- brak automatycznego zgadywania kolejnego małego hotfixa po pierwszym błędzie.

## Kryterium powrotu do normalnych etapów

Wracamy do małych etapów dopiero wtedy, gdy globalny preflight przechodzi albo jasno pokazuje pojedynczy, konkretny blocker.
