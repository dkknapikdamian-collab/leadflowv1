# Obsidian payload - STAGE232E_FUNNEL_OWNER_DECISION_SOURCE_OF_TRUTH

Data: 2026-06-15 Europe/Warsaw
Projekt: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Folder Obsidian: 10_PROJEKTY/CloseFlow_Lead_App

## Decyzja do zapisania

Zakładka `Lejek` ma być listą decyzji właściciela, nie kanbanem.

## Problem

Audyt wykazał:

- fundament jest dobry: Lejek jest już projektowany jako decision list,
- `Do ruchu teraz` jest szerokie i wymaga jawnej definicji albo zmiany nazwy,
- `Bez kroku` musi oznaczać brak przyszłego/aktywnego next move,
- `Cisza 7+` nie może mieszać braku daty z realną ciszą,
- `Pieniądze` miesza wartość leadów i prowizję spraw, więc wymaga jasnej nazwy,
- owner filter i stage filter resetują się nawzajem; to może zostać w R1, ale musi być jawne,
- `Priorytet teraz` jest priorytetem w aktywnym filtrze, nie globalnym, jeśli user filtruje.

## Etap

Dopisać do centralnej kolejki:

`STAGE232E_FUNNEL_OWNER_DECISION_SOURCE_OF_TRUTH`

## Następny krok

Po decyzji Damiana przekazać stage deweloperowi z guardem i testem ręcznym.
