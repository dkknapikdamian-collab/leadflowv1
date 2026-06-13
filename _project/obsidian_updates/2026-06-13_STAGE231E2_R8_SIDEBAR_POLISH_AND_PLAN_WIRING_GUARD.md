# STAGE231E2_R8_SIDEBAR_POLISH_AND_PLAN_WIRING_GUARD â€” Obsidian payload

- data i godzina: 2026-06-13 Europe/Warsaw
- canonical_name: CloseFlow / LeadFlow
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- typ wpisu: UI copy encoding fix + plan wiring guard
- status: ZIP FIX3, push only after PASS
- problem: sidebar po R7 pokazuje mojibake; wczeĹ›niejszy R8 FIX2 nie utworzyĹ‚ guarda przez bĹ‚Ä…d skĹ‚adni temp JS.
- zmiany: Layout safe labels; R8 guard for sidebar Polish labels and complete plan model wiring; matrix confirmation.
- testy: R8 guard, R7/R5 plan guard chain, build, git diff --check.
- ryzyka: no SQL, Stripe or Google Calendar runtime changes.
- czego nie ruszano: stare Stage231D, Google Calendar R2, billing runtime, database.
- nastÄ™pny krok: po PASS i push odĹ›wieĹĽyÄ‡ aplikacjÄ™ i sprawdziÄ‡ sidebar.