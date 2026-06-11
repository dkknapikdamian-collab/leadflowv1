# 2026-06-11 19:45 Europe/Warsaw - STAGE231D0C/R7 ClientDetail left rail spacing

## Routing
- canonical_name: CloseFlow / LeadFlow
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
- Obsidian folder: 10_PROJEKTY/CloseFlow_Lead_App

## Decyzja
Po STAGE231D0C/R6 widok ClientDetail jest dobry, ale lewy rail startuje za wysoko. Zachowujemy zaakceptowane górne kafelki i obniżamy lewy rail do rytmu prawych kart.

## Zakres
- CSS spacing only.
- Marker: STAGE231D0C_R7_CLIENT_DETAIL_LEFT_RAIL_SPACING
- Lewy rail dostaje desktopowy top offset.
- Lewy i prawy rail dostają ten sam card gap.
- Mobile/tablet bez offsetu.

## Testy
- R7 spacing guard
- R7 node test
- ClientDetail baseline regression
- ClientListCard regression
- Optional Stage231B0 R9 regression
- build
- git diff --check

## Ryzyka
- Offset jest wizualny i może wymagać korekty, jeśli zmieni się header/shell.
- Nie dotykać zaakceptowanych top overview tiles.
