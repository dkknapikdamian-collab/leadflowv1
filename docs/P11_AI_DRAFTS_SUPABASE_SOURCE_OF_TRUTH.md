# P11 — AI Drafts Supabase source of truth

## Cel

Szkice AI mają być realnie zapisywane w Supabase. LocalStorage nie może być produkcyjnym źródłem prawdy.

## Co zmieniono

- `src/lib/ai-drafts.ts` działa Supabase-first.
- `saveAiLeadDraftAsync` czeka na odpowiedź Supabase.
- W produkcji brak Supabase oznacza błąd, a nie fałszywy sukces.
- Sync `saveAiLeadDraft`, `updateAiLeadDraft`, `deleteAiLeadDraft` są tylko dev fallbackiem i w produkcji rzucają błąd.
- LocalStorage jest dostępny tylko w dev/offline fallbacku.
- W produkcji cache localStorage szkiców AI jest czyszczony.
- Po zatwierdzeniu/anulowaniu/delecie lokalny rawText jest czyszczony albo rekord lokalny jest usuwany.
- `TodayAiAssistant.tsx` używa `saveAiLeadDraftAsync` i pokazuje błąd, jeśli Supabase nie zapisze szkicu.
- `AiDrafts.tsx` pokazuje błąd, jeśli nie uda się pobrać szkiców z Supabase.

## Nie zmieniono

- Nie usunięto ekranu Szkice AI.
- Nie zmieniono zatwierdzania finalnych rekordów bez ręcznej decyzji.
- Nie dodano bezpośredniego zapisu finalnych rekordów przez AI.


## P11C finish

- Zaktualizowano guard P10 po przejściu z sync localStorage na `await saveAiLeadDraftAsync`.
- Usunięto możliwy sklejony warunek `latestUsage`.
- Guard P11 sprawdza brak sync `saveAiLeadDraft({ ... })` w asystencie.
