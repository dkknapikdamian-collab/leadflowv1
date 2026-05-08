# Global Style Token Contract

## Prime directive

A shared visual meaning must have one source of truth.

Examples:

- delete/destructive/danger = one style contract.
- metric tile radius/shadow/font/icon = one metric tile contract.
- primary action = one action button contract.
- secondary action = one action button contract.

## Forbidden pattern

Do not scatter these directly across product pages for shared actions:

- `text-red-*`
- `text-rose-*`
- `bg-red-*`
- `bg-rose-*`
- hardcoded hex red values
- local classes named `repair`, `fix`, `hotfix`, `vnext` as permanent style ownership

## Required pattern

Create or use central primitives:

- `src/components/ui/button.tsx` for base button variants.
- product-level action component/helper for entity actions.
- global CSS file for product action tokens, for example `src/styles/closeflow-action-tokens.css`.

## Metric tile source

- Component: `src/components/StatShortcutCard.tsx`
- CSS: `src/styles/closeflow-metric-tiles.css`

## Delete/danger source goal

Future target:

- one `delete` or `destructive` token/variant controls icon color, button color, hover, border, and focus treatment.
