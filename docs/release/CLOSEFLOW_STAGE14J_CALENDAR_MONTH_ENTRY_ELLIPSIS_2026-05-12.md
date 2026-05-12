# CloseFlow Stage14J - Calendar month entry ellipsis

## Goal

Fix month calendar entries so every entry inside a month day card stays on one line, does not overflow the day tile, uses ellipsis when truncated, and exposes full text through a native title tooltip.

## Scope

Changed files expected:

- `src/pages/Calendar.tsx`
- one calendar stylesheet, usually `src/styles/Calendar.css` or a new local Stage14J stylesheet
- `package.json`
- `scripts/check-stage14j-calendar-month-entry-ellipsis.cjs`
- `tools/repair-stage14j-calendar-month-entry-ellipsis.cjs`

## Rules

- Do not change calendar data loading.
- Do not change task/event normalization.
- Do not change week view.
- Do not remove the `+ X wiecej` counter.
- Use native `title` tooltip, not a new tooltip dependency.

## Verification

Run:

```powershell
npm.cmd run check:stage14j-calendar-month-entry-ellipsis
npm.cmd run build
```

If present, also run:

```powershell
npm.cmd run check:stage14i-calendar-snake-case-task-dates
npm.cmd run check:stage14h-calendar-week-nearest7-dedupe
npm.cmd run check:closeflow-admin-feedback-2026-05-11-p3
```

## Acceptance

Month view entries are compact and readable:

- one line,
- no wrapping,
- no overflow outside the day card,
- ellipsis on long labels,
- full text on hover via `title`.
