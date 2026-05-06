# STAGE19_CONTEXT_ACTION_ROUTE_MAP_EVIDENCE_V1

GeneratedAt: `2026-05-06T11:47:22.827Z`

## Verdict

PASS: every context action has one mapped host, one dialog and one persistence target.

## Route map

| Action | Trigger | Host | Dialog | Save function | Target | Relations |
|---|---|---|---|---|---|---|
| task | data-context-action-kind="task" or legacy text Dodaj zadanie / follow-up | ContextActionDialogsHost | TaskCreateDialog | insertTaskToSupabase | tasks | leadId, caseId, clientId, workspaceId |
| event | data-context-action-kind="event" or legacy text Dodaj wydarzenie / Zaplanuj spotkanie | ContextActionDialogsHost | EventCreateDialog | insertEventToSupabase | events | leadId, caseId, clientId, workspaceId |
| note | data-context-action-kind="note" or legacy text Dodaj notatke / Podyktuj notatke | ContextActionDialogsHost | ContextNoteDialog | insertActivityToSupabase | activities | leadId, caseId, clientId, workspaceId where available |

## Checks

- PASS — context action registry exists — `src/lib/context-action-contract.ts`
- PASS — context action host exists — `src/components/ContextActionDialogs.tsx`
- PASS — task route map: task -> TaskCreateDialog -> tasks
- PASS — event route map: event -> EventCreateDialog -> events
- PASS — note route map: note -> ContextNoteDialog -> activities
- PASS — registry relation keys are explicit
- PASS — host resolves explicit trigger attributes first
- PASS — host keeps text fallback for legacy buttons
- PASS — host exposes one shared event bus
- PASS — host renders one task dialog
- PASS — host renders one event dialog
- PASS — host renders one note dialog
- PASS — task dialog writes task relation context
- PASS — event dialog writes event relation context and scheduledAt
- PASS — note dialog writes activity relation context
- PASS — LeadDetail exists — `src/pages/LeadDetail.tsx`
- PASS — LeadDetail uses openContextQuickAction
- PASS — LeadDetail imports ContextActionKind
- PASS — LeadDetail does not import TaskCreateDialog directly
- PASS — LeadDetail does not import EventCreateDialog directly
- PASS — ClientDetail exists — `src/pages/ClientDetail.tsx`
- PASS — ClientDetail uses openContextQuickAction
- PASS — ClientDetail imports ContextActionKind
- PASS — ClientDetail does not import TaskCreateDialog directly
- PASS — ClientDetail does not import EventCreateDialog directly
- PASS — CaseDetail exists — `src/pages/CaseDetail.tsx`
- PASS — CaseDetail uses openContextQuickAction
- PASS — CaseDetail imports ContextActionKind
- PASS — CaseDetail does not import TaskCreateDialog directly
- PASS — CaseDetail does not import EventCreateDialog directly
- PASS — assistant query remains collapsed, not a physical API function
- PASS — Vercel Hobby function budget remains <= 12 — `12`

## Physical API functions

- `api/activities.ts`
- `api/billing-checkout.ts`
- `api/case-items.ts`
- `api/cases.ts`
- `api/clients.ts`
- `api/daily-digest.ts`
- `api/leads.ts`
- `api/me.ts`
- `api/stripe-webhook.ts`
- `api/support.ts`
- `api/system.ts`
- `api/work-items.ts`

## Rule

A new button for task, event or note must use the same registry, host and persistence route. No parallel local dialog path is allowed.
