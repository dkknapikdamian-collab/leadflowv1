# Stage 03 — AI Draft approval to final records — 2026-04-27

Cel: Szkic AI nie jest końcem procesu. Użytkownik może ręcznie sprawdzić pola i dopiero wtedy utworzyć finalny rekord.

Wdrożone:

- helper `src/lib/ai-draft-approval.ts`,
- panel zatwierdzania w `src/pages/AiDrafts.tsx`,
- wybór typu finalnego rekordu: lead / zadanie / wydarzenie / notatka,
- tworzenie finalnych rekordów przez istniejące helpery Supabase,
- oznaczanie szkicu jako `converted` dopiero po udanym zapisie,
- activity log `ai_draft_converted`,
- test kontraktowy `tests/ai-draft-approval-stage03.test.cjs`.

Zasada bezpieczeństwa:

- AI nie tworzy finalnego rekordu samo.
- Finalny zapis wymaga kliknięcia użytkownika w `Utwórz rekord`.
- Szkic pozostaje szkicem, dopóki zapis finalnego rekordu nie zakończy się powodzeniem.

Co testować ręcznie:

1. Wejdź w `Szkice AI`.
2. Otwórz szkic statusem `Do sprawdzenia`.
3. Kliknij `Przejrzyj i zatwierdź`.
4. Zmień typ rekordu na `Lead`, `Zadanie`, `Wydarzenie`, `Notatka`.
5. Uzupełnij pola.
6. Kliknij `Utwórz rekord`.
7. Sprawdź, czy rekord powstał w odpowiedniej zakładce.
8. Sprawdź, czy szkic przeszedł do `Zatwierdzone`.
