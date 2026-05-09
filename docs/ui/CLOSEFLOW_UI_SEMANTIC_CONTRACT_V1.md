# CloseFlow UI Semantic Contract v1

Cel etapu UI-1B: zatwierdzić mapę semantyczną ikon, kafelków i regionów zanim zaczniemy przepinać runtime UI.

Ten etap nadal nie zmienia wyglądu aplikacji dla użytkownika. Jest kontraktem i bramką pod kolejne etapy:

1. `SemanticIcon`,
2. `EntityInfoRow`,
3. `EntityNoteCard / EntityNoteComposer / EntityNoteList`,
4. `EntityDetailShell`,
5. parytet `LeadDetail` i `ClientDetail` na desktop/mobile.

## Zasada główna

Nie naprawiamy pojedynczej strony na oko. Każdy powtarzalny element UI musi dostać rolę semantyczną i jedno źródło prawdy.

## Co kontrakt obejmuje

- role ikon: delete, phone, email, copy, edit, add, note, event, finance, task_status, time, risk_alert i inne,
- kafelki metryk: obecny standard `StatShortcutCard`,
- lokalne implementacje do przepięcia: `InfoRow`, `InfoLine`, `StatCell`, lokalne action buttony,
- regiony widoków szczegółów: header, top tiles, contact, notes, history, relations, right rail,
- reguły guardów: co wolno jeszcze tolerować w czasie migracji, a co ma być blokowane po kolejnych etapach.

## Decyzja

Po tym etapie wolno zacząć tworzyć komponenty wspólne. Nie wolno już dokładać nowych lokalnych wariantów ikon, kafelków, notatek i wierszy kontaktu bez wpisania ich do kontraktu.
