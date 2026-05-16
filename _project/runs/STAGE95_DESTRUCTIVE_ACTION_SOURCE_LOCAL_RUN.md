# STAGE95 destructive action source local run

Generated: 2026-05-16T10:08:02.774Z

## FAKTY Z KODU / PLIKÓW
- Updated src/components/entity-actions.tsx as trash action source of truth.
- Updated /tasks, /cases and /calendar delete/trash actions to use shared EntityTrashButton/trashActionButtonClass/trashActionIconClass.
- Added tests/stage95-destructive-action-visual-source.test.cjs.

## DECYZJE DAMIANA
- Kosz ma być czerwony jako ikona, ale bez czerwonej plamy/tła.
- Routes: /tasks, /cases, /calendar.

## TESTY AUTOMATYCZNE
- node --test tests/stage95-destructive-action-visual-source.test.cjs

## TESTY RĘCZNE
- TEST RĘCZNY DO WYKONANIA: /tasks, /cases, /calendar.

## GIT / ZIP STATUS
- Local ZIP mode. No commit/push.
