# 2026-06-12 — STAGE231D0F-R10 Funnel icon tone PowerShell StrictMode repair

Status: READY_TO_APPLY

## Why R10 exists

R9 stopped after appending UI Dictionary and project memory because PowerShell StrictMode rejected checking a missing property in `package.json`:

`The property 'check:stage231d0f-r9-funnel-icon-tone-ui-dictionary-guard-repair' cannot be found on this object.`

This is a package/apply-script bug, not a Funnel runtime bug.

## R10 fix

- Replace fragile PowerShell package script property access with `node -e`.
- Refresh R10/R9/R8 guards/tests.
- Run build and `git diff --check`.
- Do not change Funnel runtime.

## Risk audit

Do not push unrelated:
- STAGE231D0E
- visual-stage12-client-detail-vnext.css
- old R4/R5/R6 artifacts not selected by the push script
- mojibake sweep helpers
