# STAGE232I4_R16Z_R5_R7_POLISH_MOJIBAKE_AUDIT_SCOPE_FINAL

Date/time: 2026-06-21 Europe/Warsaw
Project: CloseFlow / LeadFlow
Branch: dev-rollout-freeze

Scope:
- Continue R16Z_R5 close after verify reached polish-mojibake-audit.
- Polish mojibake audit no longer scans local .stage232i4 backup directories, .claude, 2.closeflow_bisect, or huge text-like files.
- Preserve non-blocking mojibake marker behavior for normal repo text files.
- Keep R16Z_R5/R2/R3/R4/R5/R6 changes.

Reason:
- verify:closeflow:quiet reached tests/polish-mojibake-audit.test.cjs and failed with ERR_STRING_TOO_LONG while reading huge local artifacts.
- This is guard scope cleanup, not product logic.

Not touched:
- SQL / RLS
- finance
- Calendar
- billing
- Owner Control runtime
- CaseDetail runtime

Manual smoke still required before push:
- Client: add missing item, manager does not auto-open on quick add, tile updates, Blokuje/UzupeĹ‚nij/UsuĹ„ work, F5 stable.
- Lead: shared manager opens, title visible, Blokuje/UzupeĹ‚nij/UsuĹ„ work, F5 stable.