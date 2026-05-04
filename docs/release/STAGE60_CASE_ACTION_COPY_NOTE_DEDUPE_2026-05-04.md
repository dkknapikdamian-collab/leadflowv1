# STAGE60_CASE_ACTION_COPY_NOTE_DEDUPE

Data: 2026-05-04
Branch: dev-rollout-freeze

## Cel

Usunac z widoku szczegolow sprawy duplikujaca tresc i duplikujacy przycisk notatki po dodaniu bocznych akcji operacyjnych.

## Zmieniono

- Usunieto copy: "Zadania, wydarzenia, braki i notatki powiazane ze sprawa."
- Usunieto glowny przycisk akcji z atrybutem data-case-create-action=note.
- Zostawiono logike notatki i helper openCaseNoteDialog, bo notatka nadal jest dostepna z bocznej sekcji.
- Zaktualizowano guardy Stage57/58/59 pod nowy lancuch Stage60.

## Nie zmieniono

- Nie ruszano API.
- Nie zmieniano modelu danych.
- Nie usuwano modala notatki ani flow Stage59 follow-up po notatce.

## Check

- npm.cmd run check:stage60-case-action-copy-note-dedupe
- npm.cmd run test:stage60-case-action-copy-note-dedupe
- npm.cmd run verify:case-operational-ui
- npm.cmd run build
