# 2026-06-25_STAGE232G_R6_GOOGLE_DELETE_TOMBSTONE_AND_REMOTE_DELETE

Data/czas: 2026-06-25 14:10 Europe/Warsaw
canonical_name: CloseFlow / LeadFlow
repo: dkknapikdamian-collab/leadflowv1
branch: dev-rollout-freeze
status: OBSIDIAN_PAYLOAD / RUNTIME_PATCH

## Problem

Usuniety wpis Google-linked wraca do kalendarza CloseFlow, bo Google inbound sync widzi aktywny Google event i patchuje lokalny soft-deleted rekord z powrotem do aktywnego stanu.

## Wdrozenie R6A

Zakres:
- `src/server/google-calendar-inbound.ts`,
- tombstone guard `isLocalDeletedGoogleCalendarWorkItemStage232GR6`,
- action `skipped_local_deleted`,
- guard/test R6.

Kontrakt:
- local deleted/tombstoned Google-linked row nie moze byc reaktywowany przez inbound sync;
- aktywne nieusuniete Google eventy dalej moga aktualizowac istniejace rekordy;
- R6A nie usuwa jeszcze remote Google eventu.

## Testy wymagane

- node scripts/check-stage232g-r6-google-delete-tombstone-and-remote-delete.cjs
- node --test tests/stage232g-r6-google-delete-tombstone-and-remote-delete.test.cjs
- node scripts/check-cf-runtime-00-source-truth.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

## Manual smoke

1. Utworz wpis w CloseFlow i zsynchronizuj do Google.
2. Usun wpis w CloseFlow.
3. Refresh kalendarza.
4. Wpis nie moze wrocic.
5. Kliknij Synchronizuj teraz.
6. Wpis nadal nie moze wrocic.

## Ryzyko

R6A zatrzymuje odtwarzanie lokalnie usunietego wpisu, ale nie usuwa jeszcze remote eventu z Google Calendar. Remote delete/wybor UX zostaje jako R6B.
