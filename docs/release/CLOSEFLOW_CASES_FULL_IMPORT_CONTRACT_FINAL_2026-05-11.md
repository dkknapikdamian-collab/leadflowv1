# CloseFlow Cases full import contract final — 2026-05-11

## Cel

Domknięcie rzeczywistej przyczyny serii runtime crashy na /cases:

- brakujące ikony Lucide,
- pomieszane importy React / React Router / Lucide,
- brakujące importy date-fns,
- brakujące EntityIcon.

## Wymuszony kontrakt importów w src/pages/Cases.tsx

```ts
import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AlertTriangle, CheckCircle2, ChevronRight, Clock, ExternalLink, FileText, Loader2, Plus, Search, Trash2, X } from 'lucide-react';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import { EntityIcon } from '../components/ui-system/EntityIcon';
```

## Guard

`scripts/check-closeflow-cases-loader2-import.cjs` sprawdza teraz pełny kontrakt importów, w tym:

- dokładnie jeden import z react,
- dokładnie jeden import z react-router-dom,
- dokładnie jeden import z lucide-react,
- format z date-fns,
- pl z date-fns/locale,
- EntityIcon z właściwego modułu,
- brak hooków Reacta w react-router-dom i lucide-react,
- brak Link w lucide-react.
