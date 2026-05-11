# CLOSEFLOW CASES ENTITYICON TRUTH FIX — 2026-05-11

## Problem

Production route /cases failed with:

```text
ReferenceError: EntityIcon is not defined
```

## Evidence from repo patch

- Cases path: `src/pages/Cases.tsx`
- EntityIcon used in Cases: `yes`
- EntityIcon import source after repair: `../components/ui-system/EntityIcon`
- React import after repair: `import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';`
- Router import after repair: `import { Link, useSearchParams } from 'react-router-dom';`
- Lucide import after repair: `import { ExternalLink, FileText, Loader2, Plus, Search, Trash2 } from 'lucide-react';`

## Guard

The guard `scripts/check-closeflow-cases-loader2-import.cjs` now checks the full Cases import contract, including EntityIcon.

## Required verification

- `npm run check:closeflow-cases-loader2-import`
- `npm run verify:closeflow:quiet`
- manual production route check: `/cases`
