# Stage115B guard regex hotfix

## Status
HOTFIX ZIP/PUSH PACKAGE PREPARED.

## FAKTY Z LOGU DAMIANA
- Stage115B code and Obsidian note were committed and pushed.
- `npm run build` passed.
- `tests/stage115-lead-notes-visible-source-contract.test.cjs` failed before assertions with `SyntaxError: Invalid regular expression: missing /`.
- The previous apply script continued to build and commit after a failed native `node --test`, which means the gate was not hard enough.

## FAKTY Z KODU
- Pushed test used regex patterns with missing escaped backslashes and an unescaped slash in `/>`.
- Root cause: guard file, not production LeadDetail render path.

## ZMIANA
- Replaced the brittle regex scan with a safer source contract check:
  - `includes()` for exact JSX/source markers,
  - minimal regex only for `const ... = useMemo` declarations,
  - contact-card source slice from `<EntityContactCard` to `/>`, without invalid regex.

## TESTY AUTOMATYCZNE
Expected after apply:
- `node --test tests/stage115-lead-contact-card-client-parity.test.cjs`
- `node --test tests/stage115-lead-notes-visible-source-contract.test.cjs`
- `npm run build`

## PROCES / GATE
This hotfix apply script checks native command exit codes explicitly and must stop before commit if a guard or build fails.

## TEST RĘCZNY
Not required for this hotfix, because it only fixes the guard syntax. Stage115B visual/manual QA remains unchanged.

## OBSIDIAN
Prepared note: `2026-05-18 - CloseFlow Stage115B guard regex hotfix.md`.

## NEXT
After this hotfix passes, Stage115B can be considered technically gated. Manual UI check is still needed before moving to overdue/finance.
