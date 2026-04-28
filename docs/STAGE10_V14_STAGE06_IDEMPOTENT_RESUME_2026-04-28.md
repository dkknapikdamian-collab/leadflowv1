# Stage 10 / V14 — idempotentny Stage 06 po częściowym wdrożeniu

Cel: naprawić sytuację, w której Stage 06 zdążył zmienić frontend, ale zatrzymał się na serwerowym `src/server/ai-assistant.ts`.

Zmiany:
- Stage 06 nie wymaga już dokładnego starego fragmentu `AssistantResponse`.
- Typ `costGuard` jest dokładany przez analizę bloku typu, nie przez kruchy `replaceOnce`.
- Pytania o szkice AI są obsługiwane lokalnie na danych aplikacji.
- Odpowiedzi regułowe nie powinny zużywać limitu AI.
- Zachowana jest zasada: AI czyta lub tworzy szkic, ale nie zapisuje finalnego rekordu bez zatwierdzenia.
