# Obsidian payload - STAGE232C_CLIENTS_RELATION_TILE_SOURCE_OF_TRUTH

Data: 2026-06-15 Europe/Warsaw
Projekt: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Folder Obsidian: 10_PROJEKTY/CloseFlow_Lead_App

## Decyzja do zapisania

Zakładka `Klienci` ma być relacyjną kontrolą ruchu, nie katalogiem kontaktów.

## Problem

Audyt wykazał, że kilka kafelków/filtrów w `/clients` może kłamać produktowo:

- `Aktywni` liczy niearchiwalnych, ale helper mówi `z otwartą sprawą`.
- `Bez sprawy` liczy dobrze, ale klik nie filtruje realnie.
- `Prowizja` wymaga jednej definicji z wierszem i prawym railem.
- `Bez ruchu` nie może być liczone jako brak leadów.
- Filtry kontaktu klientów muszą widzieć related records, nie tylko sam rekord klienta.
- Kolory i styl mają zostać w globalnym UI systemie.

## Etap

Dopisać do centralnej kolejki:

`STAGE232C_CLIENTS_RELATION_TILE_SOURCE_OF_TRUTH`

## Następny krok

Po STAGE232A/STAGE232B albo wcześniej, jeśli Damian chce kontynuować audyt zakładek zamiast wdrożenia runtime, przekazać stage deweloperowi z guardami i testem ręcznym.
