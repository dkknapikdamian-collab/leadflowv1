# Stage228N â€” font + soft tone source truth

Date: 2026-06-07 21:55 Europe/Warsaw

## Scope

Local-only patch for CloseFlow right-rail/filter cards.

## Source of truth

- Task filter visual style is the source for row/tile geometry, soft backgrounds, border intensity and font tokens.
- Font tokens are centralized in `FONT_SOURCE_TRUTH_STAGE228N`.
- Color tokens are centralized in `SOFT_TONE_SOURCE_TRUTH_STAGE228N`.

## Fixed problem

Previous Stage228I/J/K/L/M patches applied colors too broadly or to the wrong leaf nodes. Top value cards inherited green operator rail tones and nested chip backgrounds.

Stage228N applies tone to text rows only, resets nested backgrounds, and forces the same neutral text color family used by task filters.

## Guard

`npm run check:stage228n-font-soft-tone-source-truth`
