# AI READ VS DRAFT INTENT STAGE51

## Source of truth

```text
src/lib/assistant-intents.ts
```

## Exports

```text
AI_ASSISTANT_INTENTS
READ_ONLY_INTENTS
WRITE_DRAFT_INTENTS
UNKNOWN_INTENT
classifyAssistantIntent
isWriteDraftIntent
isReadOnlyIntent
shouldCreateDraftForIntent
STAGE51_INTENT_FIXTURES
```

## Hard rule

No AI path may create a final business record directly.

```text
mayCreateFinalRecord: false
```

## Read-only intents

```text
read
search
answer
unknown
```

Read-only means:

```text
mayCreateDraft: false
requiresExplicitUserConfirmation: false
```

## Draft intents

```text
create_draft_lead
create_draft_task
create_draft_event
create_draft_note
```

Draft intent means:

```text
mayCreateDraft: true
requiresExplicitUserConfirmation: true
mayCreateFinalRecord: false
```

## Next implementation target

```text
FAZA 5 - Etap 5.2 - Backendowy guard: tylko szkice, final write po approve
```

The next package should wire this contract into assistant/draft creation endpoints, not only UI.
