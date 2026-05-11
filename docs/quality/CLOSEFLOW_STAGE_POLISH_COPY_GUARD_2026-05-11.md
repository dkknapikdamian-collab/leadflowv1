# CLOSEFLOW_STAGE_POLISH_COPY_GUARD_2026-05-11

## Cel
Nowe etapy mają zbiorczo pilnować polskich znaków, zamiast poprawiać pojedyncze słowa po fakcie.

## Zakres domyślny
Guard `check:closeflow-stage-polish-guard` skanuje:
- pliki bieżącego etapu,
- pliki zmienione lokalnie względem `HEAD`,
- pliki staged.

To jest tryb do commitów etapowych.

## Raport etapowy
Domyślny raport jest deterministyczny i może być trzymany w repo:

```text
docs/quality/closeflow-stage-polish-guard-report.json
```

Nie zawiera dynamicznej daty, żeby samo uruchomienie checka nie brudziło `git status`.

## Tryb globalny
Szeroki audyt można uruchomić tak:

```powershell
$env:CLOSEFLOW_POLISH_GUARD_SCOPE="all"; npm.cmd run check:closeflow-stage-polish-guard; Remove-Item Env:CLOSEFLOW_POLISH_GUARD_SCOPE
```

Tryb globalny może znaleźć stary dług techniczny. Domyślnie zapisuje raport poza tracked flow:

```text
.closeflow-recovery-backups/closeflow-stage-polish-guard-report-all.json
```

## Zasada
Jeżeli etap dodaje dokument, check albo tekst UI, musi przejść przez guard przed commitem. Jeżeli globalny raport pokazuje stary dług, robimy osobny etap porządkowy zamiast mieszać go z funkcjonalnością.
