# DATA CONTRACT V1

Data contract V1 jest jedynym kontraktem między API i UI dla rekordów task/event/lead/case.

## Canonical Task
- `id`
- `title`
- `status`
- `type`
- `priority`
- `scheduledAt`
- `reminderAt`
- `recurrenceRule`
- `leadId`
- `caseId`
- `clientId`
- `workspaceId`
- `createdAt`
- `updatedAt`

## Canonical Event
- `id`
- `title`
- `status`
- `type`
- `startAt`
- `endAt`
- `reminderAt`
- `recurrenceRule`
- `leadId`
- `caseId`
- `clientId`
- `workspaceId`
- `createdAt`
- `updatedAt`

## Canonical Lead
- `id`
- `name`
- `company`
- `email`
- `phone`
- `source`
- `status`
- `dealValue`
- `priority`
- `isInService`
- `linkedClientId`
- `linkedCaseId`
- `movedToServiceAt`
- `workspaceId`
- `createdAt`
- `updatedAt`

## Canonical Case
- `id`
- `title`
- `clientId`
- `leadId`
- `status`
- `completenessPercent`
- `portalReady`
- `workspaceId`
- `createdAt`
- `updatedAt`

## Rule: one mapping boundary
- Aliasy legacy (`dueAt`, `scheduled_at`, `start_at`, `lead_id`, `case_id`, `client_id`, itp.) są mapowane wyłącznie w normalizerze (`src/lib/work-items/normalize.ts`, funkcje `normalize*V1`).
- Widoki i logika kalendarza/Today/LeadDetail/CaseDetail operują na polach canonical (`scheduledAt`, `startAt`, `leadId`, `caseId`, `clientId`).
- Niedozwolone jest budowanie fallbacków `x || y || z` dla tych samych pól czasu/relacji bezpośrednio w widokach.

## Guard
- `scripts/check-data-contract-v1.cjs` wykrywa legacy pola w `src/pages`.
- `tests/data-contract-normalization.test.cjs` pilnuje obecności canonical kontraktu i mapowania legacy na granicy normalizacji.
