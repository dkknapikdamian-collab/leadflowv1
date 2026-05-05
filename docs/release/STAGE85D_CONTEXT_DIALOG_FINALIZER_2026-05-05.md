# Stage85D - context action dialogs finalizer

## Cel

Domknąć Stage85B/Stage86B po błędzie w teście i błędzie runnera Stage85C.

## Problem

Implementacja formularza miała poprawny zapis kontekstu, ale test używał niebezpiecznego regexu z optional chaining. Dodatkowo runner Stage85C sprawdzał LASTEXITCODE po zwykłym Write-Host, co mogło fałszywie zatrzymać proces.

## Zmiana

- poprawiono runner PowerShell tak, żeby nie traktował komend PowerShell jako błędnego native exit code,
- poprawiono guardy/testy Stage85 tak, żeby optional chaining sprawdzać literalnie,
- dodano guard i test Stage85D,
- nie zmieniono logiki zapisu zadania/wydarzenia/notatki poza zmianami Stage85B.

## Kryterium zakończenia

Przechodzą:

- check:stage85-context-action-dialog-unification,
- test:stage85-context-action-dialog-unification,
- check:stage85d-context-dialog-finalizer,
- test:stage85d-context-dialog-finalizer,
- check:polish-mojibake,
- build produkcyjny.
