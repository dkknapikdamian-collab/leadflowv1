# STAGE231J_AI_DRAFT_SINGLE_BUTTON_AND_ACCESS_GATE_REPAIR

Data: 2026-06-14 HH:mm Europe/Warsaw
Status: DO_WDROZENIA_PO_BIEZACYM_UI_CLOSEOUT
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze

## Problem zgłoszony przez Damiana

Przy próbie zapisu szkicu AI pojawia się błąd:

```txt
WORKSPACE_AI_ACCESS_REQUIRED
```

Jednocześnie użytkownik widzi, że przycisk typu "Zrób szkic" działa. To oznacza, że aplikacja ma dwie różne ścieżki UX dla podobnego celu: jedna tworzy/wyświetla szkic albo działa w trybie prostszym, a druga próbuje zapisać rekord AI draft w Supabase przez pełny AI gate.

## Wstępny audyt z kodu

- Strona `/ai-drafts` istnieje jako `src/pages/AiDrafts.tsx`.
- Szybki zapis szkicu używa `handleSaveQuickCaptureDraft` i `saveAiLeadDraftAsync`.
- `saveAiLeadDraftAsync` wywołuje `createAiDraftInSupabase` przez `/api/system?kind=ai-drafts`.
- Backend `src/server/ai-drafts.ts` przy POST wykonuje `assertWorkspaceWriteAccess`, a następnie dla zwykłego zapisu szkicu `assertWorkspaceAiAllowed`.
- `assertWorkspaceAiAllowed` sprawdza feature `fullAi` i w razie braku rzuca `WORKSPACE_AI_ACCESS_REQUIRED`.

## Decyzja produktowa

Nie powinno być dwóch mylących przycisków dla użytkownika.

Docelowo ma być jeden jasny entry point:

```txt
Zrób / zapisz szkic
```

Po kliknięciu użytkownik ma dostać jeden spójny efekt:

1. jeśli funkcja ma być zwykłym szybkim szkicem bez AI, zapis nie może wpadać w `fullAi` gate;
2. jeśli funkcja wymaga AI, przycisk ma jasno mówić, że wymaga planu AI;
3. UI nie może pokazywać jednocześnie działającego "Zrób szkic" i osobnego zapisu, który kończy się `WORKSPACE_AI_ACCESS_REQUIRED`.

## Zakres przyszłej naprawy

1. Zmapować wszystkie przyciski i entry pointy szkiców:
   - `/ai-drafts` szybki zapis,
   - przyciski "Zrób szkic" w Today/LeadDetail/ClientDetail/CaseDetail, jeżeli istnieją,
   - zatwierdzanie szkicu jako lead/task/event/note.
2. Ustalić jeden kanoniczny flow.
3. Rozdzielić w backendzie:
   - szybki szkic/raw capture = write access + limit activeDrafts, bez `fullAi`,
   - właściwa generacja AI = `fullAi` gate.
4. Poprawić copy błędu: `WORKSPACE_AI_ACCESS_REQUIRED` nie może być surowym komunikatem dla użytkownika.
5. Dodać guard/test blokujący dwa mylące przyciski i raw error w UI.
6. Zaktualizować centralny plik etapów `_project/04_ETAPY_ROZWOJU_APLIKACJI.md` przy najbliższym bezpiecznym update.

## Guard/test wymagany

- `scripts/check-stage231j-ai-draft-single-button-access-gate.cjs`
- `tests/stage231j-ai-draft-single-button-access-gate.test.cjs`

Guard ma sprawdzić:

- szybki szkic nie wymaga `assertWorkspaceAiAllowed`, jeżeli nie uruchamia realnej generacji AI;
- raw error `WORKSPACE_AI_ACCESS_REQUIRED` nie jest pokazywany użytkownikowi bez tłumaczenia;
- nie ma dwóch równoległych przycisków robiących podobny szkic różnymi ścieżkami;
- `/ai-drafts` ma jeden kanoniczny flow zapisu/utworzenia szkicu.

## Kolejność

Etap do rozważenia po aktualnych etapach UI/CaseDetail:

1. R1D2 dyktowanie notatki w CaseDetail,
2. R1E oznaczanie kosztu jako zwrócony,
3. STAGE231J AI Draft single-button/access-gate repair,
4. STAGE231F_R2 Google Calendar multi-user audit/fix.

Jeżeli błąd blokuje bieżącą pracę użytkownika, STAGE231J można przesunąć przed R1E/Google Calendar.
