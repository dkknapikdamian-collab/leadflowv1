# 2026-06-25_STAGE232G_R7A_CALENDAR_ACTION_SOURCE_IDENTITY_DEDUPE

Data/czas: 2026-06-25 16:45 Europe/Warsaw
canonical_name: CloseFlow / LeadFlow
repo: dkknapikdamian-collab/leadflowv1
branch: dev-rollout-freeze
status: OBSIDIAN_PAYLOAD / RUNTIME_PATCH

## Decyzja

Duplicate titles are allowed. Kalendarz nie moze laczyc ani kasowac wpisow po tytule. Tozsamosc wpisu ma isc po local id + Google event id + source user id.

## Wdrozenie R7A

- outbound stampuje source_provider/source_external_id/source_user_id/google_calendar_user_id po syncu Google;
- inbound szuka po google_calendar_event_id i canonical source identity;
- inbound preferuje local task/event nad external_google_event mirror;
- przy kolizji canonical source external outbound moze ukryc imported mirror.

## Manual smoke

1. Utworz dwa zadania z identycznym tytulem.
2. Zsynchronizuj.
3. Oba maja pozostac osobnymi wpisami.
4. Zrobione/Przywroc/Usun na jednym nie moze zmienic drugiego.
5. Refresh/sync nie moze tworzyc task+event mirror dla tego samego Google event id.
