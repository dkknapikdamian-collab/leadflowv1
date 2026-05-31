# CloseFlow Stage162 — cf-modal-surface Lower Smaller Source Truth

## Decision

Stage161 is better, but the modal still needs to be lower and slightly smaller.

Stage162 keeps the concrete runtime target:

```css
.cf-modal-surface[role="dialog"]
```

and adds one source of truth for all modal/subwindow surfaces:

```css
--cf162-modal-visual-width: 620px;
--cf162-modal-visual-max-height: 76vh;
--cf162-modal-center-y-vh: 56vh;
```

## Why

Stage161 fixed the actual element and made it visible/centerable. Stage162 tunes the product-level visual target:
lower, smaller, consistent across every subwindow.

## Guard rule

Every visual correction has its own guard.
