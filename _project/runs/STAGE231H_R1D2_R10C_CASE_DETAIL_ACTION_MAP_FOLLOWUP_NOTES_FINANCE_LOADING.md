# STAGE231H_R1D2_R10C_CASE_DETAIL_ACTION_MAP_FOLLOWUP_NOTES_FINANCE_LOADING

Data: 2026-06-14 23:45 Europe/Warsaw
Status: DO_APPLY
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze

## Audyt przed etapem

R10 padł na zbyt kruchym anchorze `follow-up activity note preview`. R10C ma naprawić klasę problemu bez dalszego łatania po jednym anchorze:

- follow-up po notatce nie może wyglądać jak zwykłe zadanie,
- quick action `Notatka` musi dopinać zapisany rekord lokalnie do notatek,
- loading CaseDetail nie może renderować panelu finansowego,
- notatki mają być opisane jako notatki,
- duplikaty follow-upów po notatce z testów manualnych mają być deduplikowane semantycznie w UI.

## Zmieniane pliki

- `src/pages/CaseDetail.tsx`
- `src/components/ContextNoteDialog.tsx`
- `_project/*`
- `scripts/check-stage231h-r1d2-r10c-case-detail-action-map-followup-notes-finance-loading.cjs`
- `tests/stage231h-r1d2-r10c-case-detail-action-map-followup-notes-finance-loading.test.cjs`

## Testy

- `node scripts/check-stage231h-r1d2-r10c-case-detail-action-map-followup-notes-finance-loading.cjs`
- `node --test tests/stage231h-r1d2-r10c-case-detail-action-map-followup-notes-finance-loading.test.cjs`
- `npm run build`
- `git diff --check`

## Audyt po etapie

Do uzupełnienia po apply/push i teście ręcznym.
