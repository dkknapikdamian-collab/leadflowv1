# CloseFlow admin feedback P1 follow-up guard repair - 2026-05-07

This repair is intended to be applied after the follow-up package stopped on:

`[admin-feedback-p1-hotfix] FAIL: admin feedback css import must be last`

Cause:
- the previous guard was written before the semantic follow-up CSS layer existed,
- the follow-up correctly appends `eliteflow-semantic-badges-and-today-sections.css` after the admin feedback CSS,
- therefore the old guard became stale and blocked the continuation.

Fix:
- keep `eliteflow-admin-feedback-p1-hotfix.css` loaded,
- allow `eliteflow-semantic-badges-and-today-sections.css` to be the final CSS import,
- ensure Today no longer contains the exact `waiting za` hybrid copy,
- rerun the P1 hotfix guard, follow-up guard and build before commit.

Manual smoke:
- open `/`,
- verify lower Today sections are collapsed by default,
- click top metric tiles and check the corresponding section opens and scrolls into view,
- check badge colors for `Zaległe`, `Wydarzenie`, `Zadanie`, `Lead`, `Sprawa`, `Klient`, `Notatka`, `Kosz`.
