# CLOSEFLOW_CLIENT_EVENT_MODAL_RUNTIME_REPAIR_2026_05_08

## Cel

Naprawa P1 po zgłoszeniu z produkcyjnego UI:

1. `ClientDetail` rzuca `ReferenceError: deleteActivityFromSupabase is not defined` przy usuwaniu notatki.
2. Modal `Zaplanuj wydarzenie` / event create jest nieczytelny: białe teksty na jasnym tle, ciemne pola w jasnym panelu i niewidoczna stopka zapisu.

Ten etap nie zmienia danych, API, Supabase, auth, billing, AI, routingu ani zachowania zapisu. Naprawia brakujący import i warstwę czytelności formularza wydarzenia.

## Zakres

- `src/pages/ClientDetail.tsx`
- `src/components/EventCreateDialog.tsx`
- `src/index.css`
- `src/styles/closeflow-client-event-modal-runtime-repair.css`
- `scripts/check-closeflow-client-event-modal-runtime-repair.cjs`
- `package.json`

## Naprawa runtime

`ClientDetail.tsx` musi importować:

```ts
import { deleteActivityFromSupabase } from '../lib/supabase-fallback';
```

Funkcja istnieje w `src/lib/supabase-fallback.ts`, ale nie była podpięta w `ClientDetail`, przez co kliknięcie usuwania notatki kończyło się ReferenceError.

## Naprawa modala wydarzenia

Modal wydarzenia dostaje finalną warstwę czytelności:

- jasne tło panelu,
- ciemny tekst i labelki,
- jasne inputy/selecty/textarea,
- normalne placeholdery,
- widoczną sticky stopkę,
- widoczny przycisk `Zapisz wydarzenie`,
- mobile stack dla stopki.

Warstwa CSS jest importowana na końcu `src/index.css`, żeby przebić stare późne hotfixy i legacy style.

## Nie zmieniać

- schema danych,
- API `/api/activities`,
- API `/api/events`,
- logika przypisywania klienta/leada/sprawy,
- routing,
- auth,
- billing,
- AI,
- Today.tsx.

## Kryterium zakończenia

- check przechodzi,
- build przechodzi,
- `deleteActivityFromSupabase` jest zdefiniowany w runtime ClientDetail,
- modal wydarzeń jest czytelny i ma widoczny save footer,
- commit i push idą na `dev-rollout-freeze`.

## Weryfikacja

```bash
npm run check:closeflow-client-event-modal-runtime-repair
npm run build
```
