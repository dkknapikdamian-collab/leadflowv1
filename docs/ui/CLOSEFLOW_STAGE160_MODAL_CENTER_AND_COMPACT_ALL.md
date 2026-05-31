# CloseFlow Stage160 — Modal Center and Compact All

## Problem

After Stage159 all modal subwindows still need correction:
- some are shifted left,
- some are too large,
- some text is clipped,
- all subwindows should be smaller and centered.

## Important finding

There are two different modal placement contexts:

1. Dialog inside Stage157 zoomed app:
   - must be centered using logical viewport coordinates:
   - `50vw * --cf157-page-zoom-inverse`

2. Dialog portaled outside root:
   - must be centered normally:
   - `50vw / 50vh`

Stage159 used one rule for both, so it could not work consistently.

## Source truth

Stage160 is the modal/subwindow source truth:
- visual width,
- logical width,
- center position,
- max height,
- compact form controls.

## Guard rule

Every visual correction must have its own guard.
