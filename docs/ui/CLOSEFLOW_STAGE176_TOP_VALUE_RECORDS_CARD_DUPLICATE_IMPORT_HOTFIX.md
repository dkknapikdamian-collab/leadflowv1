# CloseFlow Stage176 — TopValueRecordsCard duplicate import hotfix

## Problem

When opening a lead/client-related route, Vite reports:

`Identifier 'OperatorSideCard' has already been declared`

Affected file: `src/components/operator-rail/TopValueRecordsCard.tsx`.

## Root cause

The file imports from its own barrel path and also imports `OperatorSideCard` directly. This redeclares `OperatorSideCard` and creates a self/barrel import smell.

## Fix

Remove the barrel/self import. Keep only:

```ts
import { OperatorSideCard, type OperatorRailDataAttrs } from './OperatorSideCard';
```

## Guard

`node scripts/check-stage176-top-value-records-card-duplicate-import-hotfix.cjs`
