# PLAN-BASED UI VISIBILITY - Stage 3.2D

## Contract

This stage implements the first route/UI part of:

```text
docs/technical/PLAN_VISIBILITY_CONTRACT_STAGE32B_2026-05-03.md
```

## Implemented UI surfaces

| Surface | Rule |
|---|---|
| Sidebar `Szkice AI` | visible only for `lightDrafts` or `fullAi` |
| Global full AI assistant | visible only for `fullAi` |
| Global quick capture | visible only for `lightDrafts`, `lightParser`, or `fullAi` |
| Global AI drafts link | visible only for `lightDrafts` or `fullAi` |
| `/ai-drafts` direct route | blocked with upgrade message if plan has no `lightDrafts/fullAi` |

## Source markers

```text
canUseAiDraftsByPlan
canUseFullAiAssistantByPlan
canUseQuickAiCaptureByPlan
quickAiVisibleByPlan
data-plan-route-blocker="ai-drafts"
data-plan-visibility-stage32d
```

## Do not regress

```text
Do not show locked AI button in GlobalQuickActions normal flow.
Do not show /ai-drafts menu item for Free.
Do not allow /ai-drafts functional UI for Free.
Do not treat Pro as full AI.
```
