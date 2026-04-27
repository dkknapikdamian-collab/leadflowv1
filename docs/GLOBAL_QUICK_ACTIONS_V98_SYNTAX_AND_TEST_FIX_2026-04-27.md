# CloseFlow v98 - hotfix skĹ‚adni globalnych szybkich akcji

Naprawia bĹ‚Ä…d po v97:

- bĹ‚Ä™dne `onClick={() = aria-label=...}` w `src/components/GlobalQuickActions.tsx`,
- brakujÄ…ce atrybuty `role="toolbar"`, `aria-label` i `data-global-quick-actions-contract`,
- niepoprawne regexy w testach `.cjs`, gdzie Ĺ›cieĹĽka z `/` byĹ‚a traktowana jako flagi regexa.

Zakres:

- `src/components/GlobalQuickActions.tsx`
- `tests/global-quick-actions-no-duplicates.test.cjs`
- `tests/global-quick-actions-toolbar-a11y.test.cjs`

Po wdroĹĽeniu uruchomiÄ‡:

```powershell
node tests/global-quick-actions-no-duplicates.test.cjs
node tests/global-quick-actions-toolbar-a11y.test.cjs
npm.cmd run lint
npm.cmd run verify:closeflow:quiet
```