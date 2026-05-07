# CloseFlow Today section click repair - 2026-05-07

## Problem

The previous follow-up had two UI issues in Today:

- top metric tiles did not reliably open the lower matching section,
- clicking lower section headers could make only part of the lower cards stay visible, because old section filtering still used `expandedSection`.

## Cause

1. `normalizeSemanticLabel()` had a bad whitespace regex and could remove the letter `s` instead of normalizing spaces. That broke mapping from a metric tile label to a Today section key.
2. `sectionVisible()` still hid sections through `expandedSection`, while the new desired behavior is: all lower section cards remain visible, but collapsed by default.
3. The delegated metric click handler was also firing for lower section headers. Those headers already have their own `aria-expanded` collapse handler, so one click could open and close the same section in one gesture.

## Fix

- Fix semantic text normalization.
- Keep all enabled Today sections visible.
- Let top metric tiles open the matching section.
- Let lower section headers only toggle their own collapsed state.
- Add guard: `scripts/check-today-section-click-repair.cjs`.

## Verification

```powershell
node scripts/check-admin-feedback-p1-hotfix.cjs
node scripts/check-admin-feedback-p1-followup.cjs
node scripts/check-today-section-click-repair.cjs
npm run build
```
