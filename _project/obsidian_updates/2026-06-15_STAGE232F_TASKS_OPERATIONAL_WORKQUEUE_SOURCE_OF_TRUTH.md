# Obsidian payload - STAGE232F_TASKS_OPERATIONAL_WORKQUEUE_SOURCE_OF_TRUTH

Data: 2026-06-15 Europe/Warsaw
Projekt: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Folder Obsidian: 10_PROJEKTY/CloseFlow_Lead_App

## Decyzja do zapisania

Zakładka `Zadania` ma być operacyjną kolejką pracy, nie zwykłą listą tasków.

## Problem

Audyt wykazał:

- fundament jest dobry: TasksStable ma jasne predykaty active/today/overdue/done,
- `Aktywne` oznacza wszystkie niezrobione, ale UI powinno to wyjaśniać,
- daty są klasyfikowane przez `slice(0,10)`, co może źle działać przy UTC/strefie,
- `Najpilniejsze zadania` jest globalne, mimo aktywnego filtra; trzeba to jawnie nazwać albo zmienić zachowanie,
- `Bez powiązania` sprawdza tylko leadId/caseId/clientId,
- `done` miesza completed/closed/cancelled/canceled,
- klik urgent item używa search po tytule, a lepszy docelowo jest selectedTaskId/anchor,
- UI jest zasadniczo spójny, ale tone `Aktywne` top vs rail wymaga ujednolicenia.

## Etap

Dopisać do centralnej kolejki:

`STAGE232F_TASKS_OPERATIONAL_WORKQUEUE_SOURCE_OF_TRUTH`

## Następny krok

Po decyzji Damiana przekazać stage deweloperowi z guardem i testem ręcznym.
