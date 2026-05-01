# A13 — Szablony UI + testy krytycznych regresji

## Cel

Ten etap robi dwie rzeczy naraz, zgodnie ze zgłoszeniem:

1. Ujednolica styl zakładki `Szablony` z resztą aplikacji.
2. Dodaje testy i skrypt walidacyjny dla najważniejszych ścieżek ryzyka z A13.

## Zmienione pliki

- `src/pages/Templates.tsx`
- `src/pages/ResponseTemplates.tsx`
- `scripts/check-a13-critical-regressions.cjs`
- `tests/a13-critical-regressions.test.cjs`
- `package.json` przez skrypt wdrożeniowy

## Zakres UI

### `src/pages/Templates.tsx`

Poprawiono:

- rozsypane polskie znaki,
- styl nagłówka,
- statystyki górne,
- kafle listy,
- puste stany,
- modal dodawania/edycji,
- komunikaty trybu podglądu,
- spójność klas `app-surface-strong`, `app-shadow`, `app-primary-chip`.

### `src/pages/ResponseTemplates.tsx`

Poprawiono:

- układ do stylu pozostałych zakładek,
- górne statystyki,
- wyszukiwarkę,
- listę szablonów,
- panel podglądu,
- kopiowanie treści,
- modal edycji,
- separację od checklist spraw.

## Zakres A13

Dodano walidacje dla:

- auth:
  - brak tokenu,
  - token Supabase,
  - workspace scope,
- access:
  - trial active / ending / expired,
  - paid active,
  - free limit,
- data contract:
  - lead,
  - task,
  - event,
  - case,
  - client,
  - activity,
  - AI draft,
- portal:
  - token,
  - portal session,
  - caseId,
  - scoped bundle,
- AI drafts:
  - draft/pending,
  - converted/confirmed,
  - archived/cancelled,
  - cleanup `rawText`,
- Firestore:
  - brak nowych ścieżek zapisu typu `addDoc`, `setDoc`, `updateDoc`, `deleteDoc`, `writeBatch`, `.collection(`,
- Gemini:
  - brak `GEMINI_API_KEY` i pochodnych sekretów w client bundle,
- UI:
  - brak mojibake w `Templates.tsx` i `ResponseTemplates.tsx`,
  - obecność markerów stylu A13.

## Nie zmieniono

- routingu,
- logiki billing/access,
- logiki Supabase,
- modelu danych,
- automatycznej wysyłki maili,
- Playwrighta,
- ciężkich testów e2e.

## Weryfikacja

Po aplikacji paczki uruchamiane są:

```powershell
npm.cmd run lint
npm.cmd run build
npm.cmd test
```

Dodatkowo `npm.cmd run lint` dostaje nowy guard:

```powershell
node scripts/check-a13-critical-regressions.cjs
```

## Kryterium zakończenia

- Zakładki szablonów wyglądają spójniej z resztą aplikacji.
- A13 ma automatyczne guardy na najważniejsze regresje.
- Build i testy przechodzą lokalnie przed ewentualnym pushem.
