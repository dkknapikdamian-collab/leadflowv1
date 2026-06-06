# STAGE226R10B_LEAD_CLIENT_CONFLICT_SINGLE_DIALOG — report

## Teza

Stage226R10 był blisko, ale aktualny Leads.tsx miał dwa dialogi konfliktu leadów spięte z tym samym stanem oraz pozwalał w flow tworzenia leada przywrócić klienta. To zostawiało ryzyko, że dodawanie leada wygląda jak tworzenie/przywracanie klienta.

## Zmiana

- zostaje jeden EntityConflictDialog w flow leada;
- kandydaci typu client w tym flow mają canRestore=false;
- restoreConflictCandidate dla client pokazuje komunikat i nie wykonuje updateClientInSupabase;
- dodano guard i test regresyjny;
- dopisano stage do project memory i Obsidian update.

## Audyt ryzyk

- Ryzyko danych historycznych: istniejący klient o tych samych danych nadal będzie widoczny w /clients. To nie jest nowy rekord. Manual smoke ma liczyć klientów przed i po.
- Ryzyko UX: użytkownik może chcieć przywrócić starego klienta z poziomu leada. Teraz ma go otworzyć świadomie przez Pokaż. To jest poprawne, bo klient nie może powstać/przywrócić się przez zwykłe dodanie leada.
- Ryzyko regresji: zachowano możliwość przywracania ukrytego leada i explicit start_service conversion.
- Ryzyko testów: guard jest tekstowy, więc łapie kontrakt kodu, ale prawdziwe potwierdzenie wymaga manual smoke na produkcyjnych danych.
