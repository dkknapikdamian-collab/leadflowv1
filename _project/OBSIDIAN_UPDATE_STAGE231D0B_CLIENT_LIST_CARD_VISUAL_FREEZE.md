# STAGE231D0B — Client List Card Visual Freeze

Data: 2026-06-10 Europe/Warsaw
Status: SUPERSEDED_BY_R8_MASS_ENCODING_RESCUE / DO_NOT_TREAT_INITIAL_PUSH_AS_CLOSED
Canonical name: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
Folder Obsidiana: 10_PROJEKTY/CloseFlow_Lead_App

## Decyzja Damiana

Z kafelka klienta usuwamy:
- Leady
- Aktywna sprawa

Powód: klient jest już pozyskanym leadem, a jeden klient może mieć wiele spraw.

## Docelowe metryki kafelka

- Aktywna prowizja
- Zarobione łącznie
- Sprawy
- Najbliższa akcja jako czysty slot bez prefiksu w samym kafelku

## Źródła finansowe

- Aktywna prowizja = suma prowizji z aktywnych spraw klienta.
- Zarobione łącznie = suma wpłaconej prowizji ze wszystkich spraw klienta.

## Status jakości

Pierwszy push STAGE231D0B miał uszkodzone polskie znaki. R8 jest etapem naprawczym i masowym sweepem encodingu dla plików tego etapu.
