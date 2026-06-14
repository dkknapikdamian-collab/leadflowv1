# Obsidian payload - STAGE231J_AI_DRAFT_SINGLE_BUTTON_AND_ACCESS_GATE_REPAIR

Data: 2026-06-14 HH:mm Europe/Warsaw
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Folder Obsidian: 10_PROJEKTY/CloseFlow_Lead_App

## 02_AKTUALNY_STAN

Wykryto problem UX/backend w module szkiców AI. Użytkownik widzi działający przycisk typu "Zrób szkic", ale zapis szkicu AI do Supabase kończy się błędem `WORKSPACE_AI_ACCESS_REQUIRED`. Oznacza to rozjazd dwóch ścieżek: szybki szkic/raw capture i pełny AI draft wymagający `fullAi` gate.

## 04_KIERUNEK_DO_WDROZENIA

Dodać etap:

```txt
STAGE231J_AI_DRAFT_SINGLE_BUTTON_AND_ACCESS_GATE_REPAIR
```

Cel: jeden jasny przycisk/flow dla szkicu. Jeżeli to zwykły szybki szkic, nie wymaga pełnego AI. Jeżeli to generacja AI, UI jasno pokazuje wymagany plan/funkcję. Nie wolno pokazywać dwóch podobnych przycisków prowadzących do różnych backendów bez wyjaśnienia.

## 08_HISTORIA_ZMIAN

2026-06-14: Zapisano decyzję o przyszłym etapie naprawy AI Drafts. Zidentyfikowano różnicę między szybkim szkicem a zapisem AI draft do Supabase przez `assertWorkspaceAiAllowed`.

## 09_TESTY_DO_WYKONANIA_I_WYNIKI

Testy do wykonania po wdrożeniu:

1. Kliknąć jedyny kanoniczny przycisk szkicu.
2. Jeżeli to raw capture, szkic zapisuje się bez `WORKSPACE_AI_ACCESS_REQUIRED`.
3. Jeżeli to generacja AI, użytkownik widzi jasny komunikat planu, nie raw error.
4. Po refresh szkic jest w `/ai-drafts`.
5. Zatwierdzenie szkicu jako lead/task/event/note działa bez utraty treści.
6. Guard blokuje dwa mylące przyciski.

## 11_RYZYKA_BUGI_I_DLUG_TECHNICZNY

Ryzyka:

- mylące dwa przyciski dla podobnej funkcji;
- raw backend error pokazany użytkownikowi;
- szybki szkic blokowany przez feature `fullAi`, mimo że nie generuje AI;
- rozjazd między lokalnym/dev fallback i produkcyjnym Supabase flow;
- możliwa niespójność planów/trial/fullAi.

## 15_SQL_LEDGER_AND_TESTED_SQL

SQL nie ruszany. Na ten moment problem wygląda jak access-gate/UX/backend routing, nie jako potwierdzona migracja SQL.
