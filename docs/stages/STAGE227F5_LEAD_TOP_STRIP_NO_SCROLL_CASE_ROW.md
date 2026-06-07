# STAGE227F5 - Lead Top Strip No-Scroll Case Row

Status: local repair prepared.

Goal: LeadDetail shortcut row must not use scroll anchors and must not look like three large cards. It is a compact CaseDetail-style row above the detail shell.

Scope:
- keep F5 runtime from partial F5R3,
- repair F5/F4/F3 guards and tests,
- keep actions/blockers/history counters,
- keep history out of notes stack,
- keep CaseDetail visual source classes.

Not touched: SQL, Supabase, missing item runtime persistence, finance, calendar.
