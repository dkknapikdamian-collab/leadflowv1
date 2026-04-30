# Stage32 - AI Assistant Query Brain

## Cel

Asystent AI nie może działać jak lista gotowych odpowiedzi. Ten etap dodaje lokalną warstwę rozumienia danych aplikacji przed wywołaniem backendowego asystenta.

## Co zostało dodane

- lokalny preflight `buildStage32LocalQueryBrainAnswer(input)` w `src/lib/ai-assistant.ts`,
- rozpoznawanie pytań analitycznych o zadania,
- obsługa zakresów dat, między innymi `następny miesiąc`, `ten miesiąc`, `jutro`, `pojutrze`, `najbliższe 7 dni`,
- odpowiedź na pytanie typu: `w który dzień mam najwięcej zadań`,
- odpowiedź na pytanie typu: `jakie jest pierwsze zadanie w następnym miesiącu`,
- lista zadań w zakresie dat,
- mapa aplikacji CloseFlow dla pytań typu `co gdzie jest` / `czym jest aplikacja`.

## Zasada bezpieczeństwa

Komendy zapisu nadal nie są obsługiwane przez tę warstwę. Jeżeli użytkownik mówi `zapisz`, `dodaj`, `nowy lead`, `mam leada`, warstwa Stage32 nie przechwytuje pytania i zostawia dotychczasowy przepływ zapisu przez Szkice AI.

## Koszty

Pytania policzone z danych aplikacji mają `costGuard: local_rules`, więc nie zużywają limitu modelu.

## Nie zmienia

- routingu,
- modelu danych,
- Supabase,
- API,
- bezpiecznego trybu zapisu przez Szkice AI,
- UI poza treścią odpowiedzi asystenta.

## Testy

Dodano guard:

```bash
node scripts/check-stage32-ai-assistant-query-brain.cjs
```

Skrypt wdrożeniowy odpala także:

```bash
node scripts/check-polish-mojibake.cjs
npm.cmd run lint
npm.cmd run build
```
