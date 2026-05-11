# CLOSEFLOW_FB5_TOAST_DANGER_SOURCE

## Cel
FB-5 domyka dwa problemy z feedbacku administracyjnego:

1. Toast Google Calendar nie może zasłaniać głównych akcji.
2. Kosz notatki klienta nie może wyglądać jak primary CTA.

## Decyzja
Toast w aplikacji ma używać `top-center`, z zachowaniem `richColors` i `closeButton`.

Kosz w `ClientDetail` ma korzystać z jednego źródła prawdy dla akcji destrukcyjnych:

```ts
actionIconClass('danger', 'client-detail-icon-button client-detail-note-delete-action')
```

## Zakres
- `src/App.tsx`
- `src/pages/ClientDetail.tsx`
- `src/styles/closeflow-action-tokens.css`
- `src/components/entity-actions.tsx`
- `scripts/check-closeflow-fb5-toast-danger-source.cjs`
- `scripts/check-closeflow-fb5-heavy-ui-guards.cjs`

## Nie zmieniamy
- Nie usuwamy toastów.
- Nie usuwamy ostrzeżeń Google Calendar.
- Nie ruszamy logiki usuwania.
- Nie zmieniamy danych ani endpointów.

## Kryterium zakończenia
- Toastery są `top-center`.
- Kosz klienta używa globalnego danger action.
- Brak primary/default CTA przy `Trash2`.
- `tsc` i `build` przechodzą.
