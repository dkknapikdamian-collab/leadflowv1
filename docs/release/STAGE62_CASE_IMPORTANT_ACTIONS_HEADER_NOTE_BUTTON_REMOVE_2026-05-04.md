# STAGE62_CASE_IMPORTANT_ACTIONS_HEADER_NOTE_BUTTON_REMOVE

Cel: usunąć realny górny przycisk `Dodaj notatkę` z nagłówka sekcji `Najważniejsze działania`, który nadal był widoczny po Stage61.

Zakres:
- usuwa każdy button `Dodaj notatkę` z `openCaseNoteDialog`, który nie jest właściwym przyciskiem w panelu tworzenia akcji,
- zostawia dokładnie jeden przycisk notatki w `data-case-create-action="note"`,
- zachowuje Stage59 follow-up po notatce,
- aktualizuje verify chain o Stage62.

Nie zmieniono modelu danych, API ani logiki zapisu notatek.
