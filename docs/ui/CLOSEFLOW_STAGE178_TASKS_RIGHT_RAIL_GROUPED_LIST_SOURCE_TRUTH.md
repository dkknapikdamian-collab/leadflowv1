# CloseFlow Stage178 — Tasks Right Rail and Grouped List Source Truth

## Routing

- canonical_name: CloseFlow / LeadFlow
- repo: `dkknapikdamian-collab/leadflowv1`
- branch: `dev-rollout-freeze`
- local path: `C:\Users\malim\Desktop\biznesy_ai\2.closeflow`
- Obsidian folder: `10_PROJEKTY/CloseFlow_LeadFlow`

## Decision

Turn `/tasks` into an operational panel:
- left work stack with search and grouped task list,
- right rail with filters, urgent tasks and quick focus,
- same search source truth as previous stages,
- same visual density family as Leads/Clients right rail.

## Scope

Adds:
- `Filtry zadań`,
- `Najpilniejsze zadania`,,
- task grouping: `Zaległe`, `Dziś`, `Nadchodzące`, `Bez terminu`, `Zrobione`.

## Guard

`node scripts/check-stage178-tasks-right-rail-grouped-list-source-truth.cjs`


## Stage179 update

- Poprawiono polskie znaki w tekstach panelu zadań.
- Usunięto kartę `Szybki fokus` z prawego panelu.
- Pozostają: `Filtry zadań` i `Najpilniejsze zadania`.
