# STAGE228B R13 — Canonical imports repair local report

## Scope
Repair production failure after Stage228B where `AlertTriangle` was used but import handling corrupted the top imports of `LeadDetail.tsx`.

## Risk audit
- Risk: brittle regex guards can report false positives across import declarations.
- Fix: declaration-level parser guards for import source validation.
- Risk: replacing imports can remove required symbols.
- Mitigation: explicit canonical list and build/verify gates.
