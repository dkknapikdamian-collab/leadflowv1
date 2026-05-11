# CLOSEFLOW CASES IMPORT SPLIT FIX â€” 2026-05-11

## Problem

After the previous Loader2 runtime fix, `src/pages/Cases.tsx` had mixed import sources:

- lucide icons were imported from `react`,
- `useMemo` and `useRef` were imported from `react-router-dom`.

This broke production build with:

```text
"useRef" is not exported by "react-router-dom"
```

## Fix

Normalize `src/pages/Cases.tsx` imports:

```ts
import { useEffect, useMemo, useRef, type FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ExternalLink, FileText, Loader2, Plus, Search, Trash2 } from 'lucide-react';
```

## Guard

`scripts/check-closeflow-cases-loader2-import.cjs` now checks the full import contract, not only Loader2 presence.

## Manual check after deploy

1. Open `/cases`.
2. Refresh the route.
3. Confirm no `Loader2 is not defined` runtime error.
4. Confirm no app route render failure.
