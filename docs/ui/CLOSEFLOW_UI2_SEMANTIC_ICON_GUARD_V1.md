# CloseFlow UI-2 — SemanticIcon + pierwszy guard

Status: etap architektoniczny, bez masowego refaktoru runtime UI.

## Cel

Od tego etapu standardowe ikony mają mieć jednego właściciela semantycznego.

Nie chodzi jeszcze o pełny refactor widoków. Chodzi o to, żeby od teraz nie dokładać nowych krytycznych ikon ręcznie w `src/pages/*`, jeśli mają rolę standardową.

## Co dodano

- `src/ui-system/icons/SemanticIcon.tsx`
- `docs/ui/CLOSEFLOW_UI_SEMANTIC_ICON_BASELINE.generated.json`
- `scripts/build-closeflow-ui-semantic-icon-baseline-v1.cjs`
- `scripts/check-closeflow-ui-semantic-icon-v1.cjs`

## Role krytyczne UI-2

- `delete`
- `copy`
- `edit`
- `add`
- `risk_alert`
- `task_status`
- `event`
- `case`
- `time`
- `ai`

## Zasada

Istniejące bezpośrednie importy z `lucide-react` są tymczasowo dozwolone jako baseline.

Nowe bezpośrednie importy krytycznych ikon w `src/pages/*` mają zostać zablokowane przez guard i powinny iść przez:

```tsx
<SemanticIcon role="delete" />
```

## Czego nie robi ten etap

- Nie przepina masowo `LeadDetail`.
- Nie przepina masowo `ClientDetail`.
- Nie rusza notatek.
- Nie rusza kontaktów.
- Nie rusza shell layoutu.
- Nie zmienia wyglądu runtime UI.

## Następny etap

UI-3: `EntityInfoRow` dla telefonu, e-maila, osoby, firmy, źródła i danych kontaktowych w `LeadDetail` + `ClientDetail`.
