# STAGE231E2_R7_TRIAL_ACCESS_BOOTSTRAP_REPAIR_FIX2 â€” Obsidian payload

- data i godzina: 2026-06-13 Europe/Warsaw
- canonical_name: CloseFlow / LeadFlow
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- typ wpisu: bugfix / trial access bootstrap / sidebar access status
- status: przygotowane w ZIP FIX2, push only after PASS
- problem: manualny screen pokazaĹ‚ `PLAN Trial` + `DOSTÄP Trial wygasĹ‚`; pierwszy R7 apply zatrzymaĹ‚ siÄ™ na kruchym anchorze.
- decyzja: Ĺ›wieĹĽy/profile/identity trial bootstrap moĹĽe zostaÄ‡ naprawiony automatycznie; historical/explicit fallback nie jest reanimowany po cichu.
- testy: R7 guard, R5/R4/R2/R3 guard chain, build, git diff --check, rÄ™czny test nowego konta.
- ryzyka: stare workspace z trial_expired nadal wymagajÄ… decyzji/SQL/admin action.
- czego nie ruszano: SQL, Google Calendar runtime, Stripe, AI runtime, Stage231D.
- nastÄ™pny krok: po PASS i push rÄ™czny test nowego konta.