# Stage26A — feedback after 4ec client/activity/ai-drafts

## Źródło

Admin feedback `closeflow_admin_feedback_2026-05-08_05-51.json` po commicie `4ec89c1f36c506a5fff23bda22a21ab2bb00cb74`.

## Zakres

### ClientDetail

- `obsługa` w karcie sprawy jest ukryte.
- `W realizacji` i `Kompletność 0%` są przeniesione wyżej w karcie sprawy.
- `Usuń` jest zastąpione czerwoną ikoną kosza.
- Sekcja relacji leada `Alfred Panek / Lead powiązany z klientem / Otwórz lead` jest ukryta.

### Activity

- Prawy panel `Szybkie filtry` nie ma czarnego tła.
- Przyciski typu `Dzisiaj 5` mają czytelny ciemny tekst.

### AI Drafts

- Prawy panel `Szybkie filtry` nie ma czarnego tła.

## Weryfikacja

Apply uruchamia:
- guardy Stage21-Stage26A,
- `npm run build`,
- commit,
- push.
