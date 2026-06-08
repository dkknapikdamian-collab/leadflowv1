# Stage228R13 R2 - Missing item status guard repair

- date: 2026-06-08 20:55 Europe/Warsaw
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- mode: LOCAL_ONLY_UNTIL_C5

## Problem

Stage228R13 runtime patch applied locally, but guard failed:

```
STAGE228R13_MISSING_ITEM_STATUS_RESOLVE_FAIL: LeadDetail missing resolve missing token: eventType: 'missing_item_resolved'
```

## Przyczyna

Guard szukal doslownego pola `eventType: 'missing_item_resolved'` w LeadDetail.
LeadDetail zapisuje activity przez helper:

```ts
addActivity('missing_item_resolved', ...)
```

To jest poprawny runtime pattern dla LeadDetail, wiec guard byl za sztywny.

## Naprawa

- Rewrite `scripts/check-stage228r13-missing-item-status-resolve.cjs`.
- LeadDetail guard akceptuje:
  - `addActivity('missing_item_resolved'`
  - albo doslowne `eventType: 'missing_item_resolved'`
- CaseDetail guard uzywa realnego tokena `.filter((item) => item.status !== 'accepted')`.
- Package script/prebuild zostaja utrzymane.

## Testy

- node scripts/check-stage228r11-shared-missing-item-flow.cjs
- node scripts/check-stage228r12-context-action-blocker-host.cjs
- node scripts/check-stage228r13-missing-item-status-resolve.cjs
- npm run build
- git diff --check

## Audyt ryzyk

- Guard-only repair.
- No SQL/RLS/finance/layout change.
- Stage remains local-only until C5 batch.
