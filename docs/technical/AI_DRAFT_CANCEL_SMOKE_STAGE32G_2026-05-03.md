# AI DRAFT CANCEL SMOKE - Stage 3.2G

## Files

```text
src/server/ai-drafts.ts
src/lib/ai-drafts.ts
src/pages/AiDrafts.tsx
```

## Contract

Cancel/archive/delete is cleanup, not AI generation.

```text
isAiDraftCleanupMutation
WORKSPACE_AI_ACCESS_REQUIRED
archiveAiLeadDraftAsync
action: archive
```

## Backend

`assertWorkspaceAiAllowed()` must not block:

```text
PATCH action=cancel
PATCH action=archive
PATCH status=archived
PATCH status=cancelled
PATCH status=expired
DELETE
```

It must still protect create/confirm/full AI actions.

## UI

`handleArchive()` should perform one archive call and show a clear toast error if cancellation fails.
