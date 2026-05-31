# CloseFlow Stage163 — cf-modal Main Center Tall Compact

## Decision

After Stage162 the modal is still too left and too wide. The user wants:
- more centered in the app work area,
- narrower rather than wider,
- event modal taller because fields do not fit,
- same source truth for every modal/subwindow on `.cf-modal-surface`.

## Source truth

```css
--cf163-modal-visual-width: 560px;
--cf163-modal-main-center-shift-x: clamp(72px, 6.5vw, 118px);
--cf163-modal-center-y-vh: 55vh;
--cf163-event-visual-height: 84vh;
```

## Why shift X

The modal should not be centered in the full viewport including sidebar. It should be visually centered in the work area, so Stage163 shifts the center to the right by a controlled source-truth variable.

## Guard rule

Every visual correction has its own guard.
