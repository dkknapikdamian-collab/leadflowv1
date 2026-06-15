# Obsidian payload - STAGE232D_CASES_OPERATIONAL_TILES_SOURCE_OF_TRUTH

Data: 2026-06-15 Europe/Warsaw
Projekt: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Folder Obsidian: 10_PROJEKTY/CloseFlow_Lead_App

## Decyzja do zapisania

Zakładka `Sprawy` ma być realnym centrum obsługi spraw, nie listą statusów z ozdobnymi kafelkami.

## Problem

Audyt wykazał:

- `Czeka na klienta` miesza blokady i akceptacje.
- `Sprawy bez ruchu` używa tego samego licznika co `Czeka na klienta`.
- `Portal klienta` liczy `leadId`, nie `portalReady`.
- `Blokery i ryzyko` pokazuje pierwsze sprawy z listy, nie najważniejsze ryzyka.
- `Braki 0` może być fałszywe, bo lista nie przekazuje checklist/items do lifecycle.
- Badge `Brak następnego ruchu` może być fałszywy, bo risk helper nie dostaje poprawnego nextMove.
- `Najbliższy termin w sprawie` może mieszać realny termin z `updatedAt`.

## Etap

Dopisać do centralnej kolejki:

`STAGE232D_CASES_OPERATIONAL_TILES_SOURCE_OF_TRUTH`

## Następny krok

Po wdrożeniu wcześniejszych STAGE232 albo po decyzji Damiana, przekazać stage deweloperowi z guardem i testem ręcznym.
