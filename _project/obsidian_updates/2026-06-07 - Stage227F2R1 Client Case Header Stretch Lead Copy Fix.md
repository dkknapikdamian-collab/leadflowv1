# Stage227F2R1 — Client/Case Header Stretch + Lead Copy Fix

Data: 2026-06-07 Europe/Warsaw
Projekt: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Typ wpisu: UI/layout polish + shared detail shell

## Decyzja

Kartoteka klienta i Kartoteka sprawy mają używać tej samej logiki szerokości detail shell: brak rosnących bocznych fos, pełna stabilna szerokość contentu, spójny gutter.

## Wdrożono

- LeadDetail: Telefon/Kopiuj jako stabilny układ dwukolumnowy, bez ucinania tekstu.
- ClientDetail: rozciągnięcie headera i shell do pełnej szerokości wspólnego canvasu.
- CaseDetail: rozciągnięcie headera, top grid i shell do pełnej szerokości wspólnego canvasu.
- Guard/test Stage227F2R1.

## Czego nie ruszano

- SQL, Supabase, model danych.
- Akcje, notatki, finanse, kalendarz.
- LeadDetail logika runtime.

## Ryzyka po etapie

- Wymagany visual check po deployu: LeadDetail, ClientDetail, CaseDetail i scroll.
- Możliwy mały F2R2, jeśli konkretna szerokość prawego/lewego raila wymaga dostrojenia.
