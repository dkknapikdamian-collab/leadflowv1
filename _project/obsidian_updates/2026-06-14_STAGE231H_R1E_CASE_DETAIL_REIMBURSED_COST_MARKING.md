# Obsidian payload - STAGE231H_R1E_CASE_DETAIL_REIMBURSED_COST_MARKING

Data: 2026-06-14 12:20 Europe/Warsaw
Projekt: CloseFlow / LeadFlow
Folder Obsidian: 10_PROJEKTY/CloseFlow_Lead_App
Status: DO_WDROZENIA_PO_CASEDETAIL_CLOSEOUT
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze

## 02_AKTUALNY_STAN

Zgłoszono brak funkcji oznaczenia kosztu sprawy jako zwrócony / częściowo zwrócony. Aplikacja pokazuje `Koszty zwrócone`, ale użytkownik nie ma jasnej akcji dla konkretnego kosztu.

## 04_KIERUNEK_DO_WDROZENIA

Dodać etap `STAGE231H_R1E_CASE_DETAIL_REIMBURSED_COST_MARKING`. Akcja ma być lekka i osadzona przy istniejącym koszcie, bez tworzenia nowego dużego menu.

Preferowany UX:
- akcja przy wierszu kosztu,
- opcjonalna mała akcja przy metryce kosztów, jeśli są koszty do zwrotu,
- wykorzystanie istniejącego modalu korekty kosztu z wariantem zwrotu pełnego albo częściowego.

## 08_HISTORIA_ZMIAN

Dodano decyzję etapu naprawczego dotyczącego oznaczania zwrotu kosztów w CaseDetail.

## 09_TESTY_DO_WYKONANIA_I_WYNIKI

Test ręczny przyszłego etapu:
1. Dodaj koszt do sprawy.
2. Oznacz częściowy zwrot.
3. Odśwież stronę.
4. Sprawdź, że kwota zwrócona zostaje.
5. Oznacz pełny zwrot.
6. Odśwież stronę.
7. Sprawdź, że koszt nie zwiększa już `Kosztów do zwrotu`, a zwiększa `Koszty zwrócone`.
8. Sprawdź `Razem do pobrania`.

## 11_RYZYKA_BUGI_I_DLUG_TECHNICZNY

Ryzyka:
- metryka `Koszty zwrócone` może być display-only bez jasnej akcji,
- można pomylić koszt poniesiony z kosztem zwróconym,
- częściowy zwrot musi być obsłużony osobno od pełnego zwrotu,
- samo ustawienie statusu bez kwoty zwrotu może zepsuć summary.

## 15_SQL_LEDGER_AND_TESTED_SQL

SQL nie ruszany. Przed wdrożeniem etapu sprawdzić, czy istnieją kolumny `reimbursed_amount` i `reimbursed_at`. Jeśli ich brakuje, przygotować osobny SQL z guardem.
