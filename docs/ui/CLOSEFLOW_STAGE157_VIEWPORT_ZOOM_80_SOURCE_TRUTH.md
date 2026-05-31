# CloseFlow Stage157 — Viewport Zoom 80 Source Truth

## Decision

The target is not "smaller cards only". The target is: the app at browser 100% should look like the same app at browser 80%.

The previous approaches failed because:
- Stage153 used zoom but compensated from a fixed canvas, not the viewport.
- Stage154/155 scaled route/wrapper content, so left/right anchoring stopped behaving like real browser zoom.
- Stage156 reduced real density but did not recreate the actual 80% visual result.

## Correct model

Browser zoom changes the logical CSS viewport.

At 80% zoom:
- visual viewport stays the same,
- CSS layout viewport behaves as if it were wider,
- every app element becomes smaller,
- left/right anchoring still works.

Stage157 mimics that with viewport-compensated page zoom:

```css
--cf157-page-zoom: 0.80;
--cf157-page-zoom-inverse: 1.25;
--cf157-layout-width: calc(100vw * var(--cf157-page-zoom-inverse));
zoom: var(--cf157-page-zoom);
```

## Source truth

Stage157 is the visual scale source truth.

Tune only:
```css
--cf157-page-zoom
--cf157-page-zoom-inverse
```

Recommended:
- 0.82 / 1.2195121951
- 0.80 / 1.25
- 0.78 / 1.2820512821

## Guard rule

Every visual correction must have its own guard.
