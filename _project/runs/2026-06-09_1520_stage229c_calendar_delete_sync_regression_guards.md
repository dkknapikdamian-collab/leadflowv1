# Stage229C - calendar delete sync regression guards

- data i godzina: 2026-06-09 15:20 Europe/Warsaw
- project_id: CloseFlow / LeadFlow
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
- typ wpisu: guard consolidation / regression protection
- status: prepared by ZIP runner

## Fakty

- Stage228R63 zamknal no-flicker delete/add build path.
- Stage229A zamknal show_in_calendar=false dla done/deleted/canceled work_items i SQL backfill pending_delete.
- Stage229B2 dodal remote Google Calendar delete dla pending_delete i hidden/closed rows.
- Damian potwierdzil, ze manualny stan wyglada ok i chce guardy na kalendarz oraz wszystko, co bylo poprawiane.

## Zakres

- Guard sprawdza task/event route hidden calendar statuses.
- Guard sprawdza softDeleteTaskInSupabase no-flicker + hidden flags.
- Guard sprawdza R25 hardDeleteTaskFromSupabase literal contract.
- Guard sprawdza Google outbound pending_delete remote delete.
- Guard sprawdza api/work-items direct remote delete po hidden/closed update/delete.
- Guard sprawdza SQL backfill Stage229A.
- Guard usuwa build warning duplicate savedRecord i pilnuje savedRecord payload.

## Testy

- R25/R41/R229A/R229B2/R229C guards.
- R229B2/R229C tests.
- npm run build.
- git diff --check.

## Audyt ryzyk po etapie

- Ryzyko: guard jest mocny i moze blokowac refaktor, jesli zmieni sie nazewnictwo funkcji bez przeniesienia kontraktu.
- Ryzyko: realny Google remote delete dalej wymaga tokenu/connection i uruchomienia sync endpointu albo mutacji.
- Ryzyko: duplicate savedRecord cleanup jest bezpieczny, bo zachowuje canonical savedRecord ?? null.
