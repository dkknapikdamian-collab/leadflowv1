# CloseFlow - Stage03A1 UI Developer Copy Guard

**Date:** 2026-05-03  
**Branch:** `dev-rollout-freeze`  
**Scope:** user-facing UI copy cleanup guard, no product logic changes.

## Goal

This is a paid UI readiness rule.

Paid users should not see internal implementation explanations, build-stage language, technical trade-offs, or developer notes in the app UI.

This stage adds a guard for **developer copy** in likely visible UI text.

## Important correction in v4

The guard must not scan raw code identifiers as if they were visible product text.

Allowed in code:

```text
data-stage...
className...
fallbackTitle
guardCaseDetailWriteAccess
supabase-fallback import path
comments for tests and compatibility
```

Blocked only when likely visible to the user:

```text
Układ osi czasu jest szybszy niż ciężka siatka.
MVP
na tym etapie
technicznie łatwiejsze
Stage03
```

## Copy removed in this stage

The user-facing sentence below is removed from every scanned UI source file:

```text
Układ osi czasu jest szybszy niż ciężka siatka.
```

Replacement where a sentence is still useful:

```text
Oś czasu pokazuje ostatnie działania w czytelnej kolejności.
```

## Allowed UI copy

The UI should say one of three things:

1. what the section is,
2. what the user should do,
3. why it matters operationally.

Examples:

```text
Oś czasu
Najbliższe działania
Ten lead nie ma zaplanowanej akcji
Klient czeka na odpowiedź
Dodaj zadanie
Otwórz sprawę
```

## Guard

New guard:

```text
npm.cmd run check:ui-developer-copy-paid-readiness
```

The guard scans likely visible quoted strings and JSX text in:

```text
src/pages
src/components
src/lib/options.ts
```

It intentionally ignores technical attributes, imports, comments and code identifiers.

## Rule for future stages

Whenever a stage touches UI or copy, remove developer copy opportunistically.

Do not ship user-facing text that explains why we built the UI in a specific way.
The app should feel like a finished product, not a build log.
