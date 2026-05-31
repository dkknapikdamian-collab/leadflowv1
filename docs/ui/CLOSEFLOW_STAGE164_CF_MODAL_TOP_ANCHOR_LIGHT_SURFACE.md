# CloseFlow Stage164 — cf-modal Top Anchor Light Surface

## Decision

After Stage163 horizontal center is acceptable. Remaining issues:
- modal is still cut vertically,
- event modal needs safe vertical space,
- task modal has black background.

Stage164 stops vertical centering and uses top anchoring.

## Source truth

```css
--cf164-modal-top-offset: 86px;
--cf164-modal-bottom-safe: 54px;
--cf164-modal-bg: #ffffff;
```

## Why top anchoring

Centering tall modals with `translateY(-50%)` can push header/content outside the viewport. Top anchoring guarantees a visible header and lets the modal body scroll safely inside the modal.

## Guard rule

Every visual correction has its own guard.
