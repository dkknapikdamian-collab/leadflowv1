# STAGE231J2_QUICK_DRAFT_RAW_NOTE_AND_AI_DRAFT_PIPELINE_SPLIT

Date: 2026-06-14 20:05 Europe/Warsaw
Status: ACCEPTED_TO_STAGE_QUEUE / DO_WDROZENIA_AFTER_ACTIVE_DETAIL_CLOSEOUT
Project: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Obsidian folder: 10_PROJEKTY/CloseFlow_Lead_App

## Decision from Damian

Damian clarified that there must not be one confusing draft action.

There are two different product concepts:

1. Quick draft / szybki szkic
2. AI draft / szkic AI

These must be separated in UI, access rules, backend contract and tests.

## Product contract

### 1. Quick draft / szybki szkic

Quick draft is a simple note-like raw capture.

Expected behavior:

- user writes or dictates a quick note,
- note is saved as a raw draft / note without AI generation,
- it should not require the `fullAi` feature gate,
- it should not fail with `WORKSPACE_AI_ACCESS_REQUIRED`,
- it should be available as a lightweight capture function,
- it can be later reviewed or converted, but the first save is not AI.

Example:

```txt
Dzwonił do mnie Piotrek. Zapisz, że mam się jutro z nim skontaktować w sprawie umowy.
```

As quick draft this is stored as raw note/draft capture.

### 2. AI draft / szkic AI

AI draft is a separate function.

Expected behavior:

- user gives raw text, pasted text or dictated text,
- AI parses it,
- AI proposes classification and actions,
- output goes to confirmation inbox / drafts to approve,
- after approval the system can create/update:
  - lead,
  - client,
  - case,
  - task,
  - event,
  - note,
  - follow-up,
  - missing item / blocker.

AI draft requires AI feature access and must never silently create final records without user approval.

## Why this stage exists

Current error reported by Damian:

```txt
Nie udało się zapisać szkicu AI w Supabase: WORKSPACE_AI_ACCESS_REQUIRED
```

The issue is not only technical. The product flow is unclear: quick raw capture and AI processing were mixed. The app should not expose two confusing buttons that look similar but go through different access gates without clear meaning.

## Relation to existing roadmap

This stage refines existing `STAGE-A36-DRAFTS-REBUILD`.

Current central roadmap already contains:

- one draft inbox,
- manual draft,
- pasted text,
- dictation,
- parser,
- AI,
- confirm-first approval.

This run report adds the missing distinction:

- quick draft = raw note/draft capture, no AI gate,
- AI draft = AI parser/classifier, `fullAi` gate and confirm-first.

## Required central stage file insert

At the next safe update of `_project/04_ETAPY_ROZWOJU_APLIKACJI.md`, add this stage under or near `STAGE-A36-DRAFTS-REBUILD`:

```md
### STAGE231J2_QUICK_DRAFT_RAW_NOTE_AND_AI_DRAFT_PIPELINE_SPLIT

Status: DO_WDROZENIA_PRZY_STAGE_A36_ALBO_TUZ_PRZED_AI_DRAFTS

Cel:
Rozdzielic dwa produkty, ktore nie moga byc mylone:
1. Szybki szkic = zwykla notatka / raw capture / dyktowana notatka, zapisywana bez AI gate.
2. Szkic AI = osobna funkcja AI parsera, klasyfikacji i propozycji akcji do zatwierdzenia.

Kontrakt szybki szkic:
- jeden prosty przycisk,
- zapis raw text / dyktowanej notatki,
- brak `WORKSPACE_AI_ACCESS_REQUIRED`,
- nie wymaga `fullAi`,
- hard refresh zostawia szkic,
- moze potem trafic do kolejki do przejrzenia.

Kontrakt szkic AI:
- osobny przycisk / jasno nazwany flow,
- wymaga AI access,
- AI rozpoznaje czy z tekstu powstaje lead, task, event, note, follow-up, case item albo blocker,
- wynik idzie do zatwierdzenia,
- brak automatycznego finalnego zapisu bez akceptacji.

Przyklad wejscia:
`Dzwonil do mnie Piotrek. Zapisz, ze mam sie jutro z nim skontaktowac w sprawie umowy.`

AI draft powinien zaproponowac np. task/follow-up na jutro powiazany z kontaktem Piotrek/sprawa umowy, ale finalny rekord powstaje dopiero po zatwierdzeniu.

Guard/test:
- szybki szkic nie moze przechodzic przez `assertWorkspaceAiAllowed/fullAi`,
- AI draft nie moze byc ukryty pod zwyklym szybkim szkicem,
- UI nie moze miec dwoch mylacych przyciskow o podobnym znaczeniu,
- surowy blad `WORKSPACE_AI_ACCESS_REQUIRED` nie moze byc pokazywany uzytkownikowi.
```

## Developer instructions for implementation stage

Before implementation:

- scan `AGENTS.md`, `_project/04_ETAPY_ROZWOJU_APLIKACJI.md`, `_project/04_KIERUNEK_ROZWOJU_APLIKACJI.md`, `_project/06_GUARDS_AND_TESTS.md`, `_project/13_TEST_HISTORY.md`, AI draft routes/components and current Supabase helpers,
- verify current schema for raw drafts/notes and AI drafts,
- do not invent SQL if existing table can hold raw draft capture,
- if SQL is needed, provide a separate SQL file and SQL guard.

Implementation direction:

1. Map current buttons and paths related to quick draft / AI draft.
2. Decide canonical storage for quick raw draft.
3. Ensure quick raw draft can be saved without `fullAi`.
4. Keep AI parser/generation behind AI access.
5. Rename UI so user understands the difference.
6. Add guard and tests.
7. Update `_project` and Obsidian payload.

## Suggested order

Current planned order after detail closeout:

1. `STAGE231H_R1D2_CASE_DETAIL_NOTE_DICTATION_RESTORE_RUNTIME`
2. `STAGE231H_R1E_CASE_DETAIL_REIMBURSED_COST_MARKING`
3. `STAGE231J2_QUICK_DRAFT_RAW_NOTE_AND_AI_DRAFT_PIPELINE_SPLIT`
4. `STAGE231F_R2_GOOGLE_CALENDAR_MULTI_USER_OWNERSHIP_AND_SYNC_CLOSEOUT`
5. later: broader `STAGE-A36-DRAFTS-REBUILD`

If AI drafts become the active priority, `STAGE231J2` can be moved directly before broader `STAGE-A36-DRAFTS-REBUILD`.

## Risk audit

- Quick draft incorrectly gated by AI access creates false errors and blocks basic note capture.
- AI draft without clear gate can create paid-feature confusion.
- One ambiguous button creates user confusion and repeated support errors.
- AI must not create final records without confirm-first approval.
- Need avoid another scattered set of draft buttons across Today/LeadDetail/ClientDetail/CaseDetail.

## Status

Saved as accepted stage decision. Runtime not changed in this entry.
