# 2026-06-20 — STAGE232I4_R16X_MISSING_BLOCKER_TOGGLE_STATE_AND_ACTION_LABEL

- Projekt: CloseFlow / LeadFlow
- Repo: dkknapikdamian-collab/leadflowv1
- Branch: dev-rollout-freeze
- Powód: po R16W checkbox `Blokuje` klikał się bez błędu, ale UI zostawał zaznaczony, ponieważ blocker był nadal wyprowadzany z `priority=high`, a handler nie zmieniał priority przy toggle.
- Zmiana: toggle mapuje `blocksProgress` na legalne `priority`: `high`/`medium`, nie wysyła `missing_item` do `work_items.status`, a UI zachowuje zatwierdzony compact layout.
- Testy: guard, node test, build, diff-check, smoke runtime.
- Ryzyko: jeżeli backend ignoruje priority na PATCH, potrzebny następny etap w `src/server/task-route-stage124f.ts`.
