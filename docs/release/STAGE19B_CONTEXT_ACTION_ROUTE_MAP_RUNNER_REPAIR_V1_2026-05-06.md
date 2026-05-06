# STAGE19B_CONTEXT_ACTION_ROUTE_MAP_RUNNER_REPAIR_V1

Data: 2026-05-06

## Cel

Naprawa runnera Stage19 po bledzie PowerShell `TrimStart` przy kopiowaniu payloadu.

## Naprawa

- Nie zmienia logiki aplikacji.
- Nie zmienia wizualizacji.
- Zastepuje kruche `.TrimStart("\\", "/")` kopiowaniem opartym o regex `^[\\/]+`.
- Zachowuje kumulacyjna paczke Stage11-19.

## Kryterium

Apply-script przechodzi przez kopiowanie payloadu, odpala guardy Stage11-19, build, commit i push.
