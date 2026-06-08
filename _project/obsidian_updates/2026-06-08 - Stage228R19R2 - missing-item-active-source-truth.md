# 2026-06-08 - Stage228R19R2 - missing-item-active-source-truth

- data i godzina: 2026-06-08 22:20 Europe/Warsaw
- projekt: CloseFlow / LeadFlow
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- typ wpisu: BUGFIX / SOURCE OF TRUTH / MASS PREFLIGHT

## Problem

Po Stage228R18R5 usuwany Brak nadal wracal po hard refreshu. Hard-delete work_item nie wystarczyl, bo aktywna lista mogla byc odtwarzana z activity/timeline.

## Decyzja

Aktywne Braki w LeadDetail musza pochodzic tylko z linkedTasks/work_items. Activity zostaje historia i nie moze odtworzyc aktywnego kafla.

## Test

Lead -> dodaj Brak -> hard refresh -> Usun -> hard refresh -> Brak nie wraca.

## Ryzyka

Jesli ten sam objaw wystepuje w ClientDetail, potrzebny jest osobny sweep klienta. Nie kasowano historii activity.
