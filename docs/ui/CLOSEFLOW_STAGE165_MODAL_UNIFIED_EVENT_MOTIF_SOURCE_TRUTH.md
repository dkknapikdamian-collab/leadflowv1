# CloseFlow Stage165 — Modal Unified Event Motif Source Truth

## Routing

- canonical_name: CloseFlow / LeadFlow
- repo: `dkknapikdamian-collab/leadflowv1`
- branch: `dev-rollout-freeze`
- local path: `C:\Users\malim\Desktop\biznesy_ai\2.closeflow`
- Obsidian folder: `10_PROJEKTY/CloseFlow_LeadFlow`

## Root finding

The actual shared source is `src/components/ui/dialog.tsx`.

Every operator DialogContent gets:

```tsx
data-closeflow-modal-visual-system="true"
className="cf-modal-surface ..."
```

So Stage165 stops styling Lead, Task and Event separately.

## Decision

Use one final source truth:

```css
[data-closeflow-modal-visual-system="true"].cf-modal-surface
```

Motif:
- event-like dark navy shell,
- white controls,
- compact form density,
- top-anchored,
- work-area centered,
- smaller than current event modal.

## Source truth tokens

```css
--cf165-modal-visual-width: 600px;
--cf165-modal-top-offset: 88px;
--cf165-modal-work-center-shift-x: clamp(72px, 6.25vw, 112px);
--cf165-modal-bg: #0b1220;
```

## Guard rule

Every visual correction has its own guard.
