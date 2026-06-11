# STAGE231D0B-R10/R11 - ClientListCard fixed column axis

Data: 2026-06-11 HH:mm Europe/Warsaw
Canonical: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Folder Obsidiana: 10_PROJEKTY/CloseFlow_Lead_App

## Decyzja
Teksty w kazdym kafelku klienta maja zaczynac sie w stalej osi kolumny. Dlugosc tekstu moze zmieniac koniec chipa/tekstu, ale nie start.

## Zakres
- CSS fixed axis dla ClientListCard.
- Guard D0B rozszerzony o R10/R11.

## Nie ruszano
- Leady.
- Trial banner.
- Filtry.
- Top layout.
- SQL / Supabase.

## Testy
- D0B guard.
- Node test.
- diff check.
- build.
- Manual QA /clients.

## Ryzyka
- Wymagany screenshot po deployu.
- Historyczne bloki R7/R8/R9 pozostaja jako warstwy deprecated; R10/R11 jest finalnym override.
