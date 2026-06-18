# 2026-06-18 - STAGE232I2_CLIENT_DETAIL_MISSING_BLOCKER_RUNTIME

data i godzina: 2026-06-18 17:51 Europe/Warsaw
canonical_name: CloseFlow / LeadFlow
repo: dkknapikdamian-collab/leadflowv1
branch: dev-rollout-freeze
local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
Obsidian folder: 10_PROJEKTY/CloseFlow_Lead_App
stage: STAGE232I2_CLIENT_DETAIL_MISSING_BLOCKER_RUNTIME
status: PASS_PUSHED / CLOSED / MANUAL_SMOKE_OK

## Zakres

- ClientDetail Braki/Blokady dziala przez missing_item jako runtime source.
- Direct client missing_item zapisuje sie z clientId.
- Widok klienta agreguje Braki/Blokady ze zrodel: Klient / Lead / Sprawa.
- Badge zrodla pokazuje [Klient], [Lead], [Sprawa].
- Filtry rozdzielaja Wszystkie / Klient / Leady / Sprawy / Blokady / Braki.
- Resolve/delete dziala na rekordzie zrodlowym, nie kopii.
- Historia nie tworzy aktywnych duplikatow Brakow.
- case_items nie jest aktywnym zrodlem Brakow/Blokad.
- SQL nie byl ruszany.
- Owner Control runtime nie byl ruszany.

## Testy

- guard STAGE232I2: PASS.
- test STAGE232I2: 5/5 PASS.
- CF-RUNTIME-00 source truth guard: PASS.
- npm run build: PASS.
- npm run verify:closeflow:quiet: PASS.
- git diff --check: PASS.
- manual smoke ClientDetail: PASS.

## Ryzyka

- I3 nie moze startowac, jesli centralne statusy pokazuja I2 jako aktywne.
- Owner Control musi czytac te same missing_item sources, bez tworzenia kopii/duplikatow.
- Nie wolno wracac do case_items jako aktywnego zrodla Brakow/Blokad.

## Nastepny etap

STAGE232I3_OWNER_CONTROL_MISSING_BLOCKER_CROSS_ENTITY_INTEGRATION