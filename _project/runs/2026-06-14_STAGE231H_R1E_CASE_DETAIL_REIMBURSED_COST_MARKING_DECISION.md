# 2026-06-14 12:20 Europe/Warsaw - STAGE231H_R1E_CASE_DETAIL_REIMBURSED_COST_MARKING

Status: DO_DOPISANIA_DO_CENTRALNEGO_PLIKU_ETAPOW / DO_WDROZENIA_PO_CASEDETAIL_CLOSEOUT
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Canonical name: CloseFlow / LeadFlow
Obsidian folder: 10_PROJEKTY/CloseFlow_Lead_App

## Decyzja Damiana

W CaseDetail aplikacja pokazuje metrykę `Koszty zwrócone`, ale użytkownik nie ma jasnej i lekkiej akcji do oznaczenia konkretnego kosztu jako zwrócony albo częściowo zwrócony.

To ma zostać zapisane jako osobny etap naprawczy i dopisane do centralnego pliku `_project/04_ETAPY_ROZWOJU_APLIKACJI.md`, bo wszystkie etapy mają być w jednym miejscu.

## Fakt z modelu kosztów

Model kosztów ma statusy `partially_reimbursed` i `reimbursed` oraz pola zwrotu kosztu: `reimbursedAmount` / `reimbursed_amount` i `reimbursedAt` / `reimbursed_at`. Summary liczy `costsReimbursedAmount` i `costsToReimburseAmount`.

## Kierunek UX

Nie dodawać nowego dużego menu. Akcja ma być lekka:

- przy wierszu kosztu w istniejącej historii / modalce korekt,
- opcjonalnie jako mała akcja przy metryce kosztów, gdy są koszty do zwrotu,
- w istniejącym modalu korekty kosztu jako wariant `Oznacz jako zwrócone` albo `Częściowy zwrot`.

## Zakres przyszłego etapu

Nazwa etapu: `STAGE231H_R1E_CASE_DETAIL_REIMBURSED_COST_MARKING`.

Cel: dodać lekką akcję oznaczania kosztu jako zwrócony / częściowo zwrócony.

Wymagania:

- zmapować wszystkie miejsca, gdzie pokazują się koszty i zwroty kosztów,
- przy konkretnym koszcie dodać akcję zwrotu,
- zapisywać status, kwotę zwróconą i datę zwrotu,
- po zapisie odświeżać summary kosztów i `Razem do pobrania`,
- po hard refresh wynik ma zostać,
- nie ruszać SQL bez potwierdzenia braku kolumn,
- dodać guard i test ręczny.

## Ryzyka

- nie pomylić kosztu poniesionego z kosztem zwróconym,
- nie aktualizować samego statusu bez kwoty zwrotu,
- obsłużyć częściowy zwrot, nie tylko pełny,
- nie dokładać kolejnego ciężkiego panelu w UI.

## Następny krok

Dopisać etap do `_project/04_ETAPY_ROZWOJU_APLIKACJI.md` przy najbliższym bezpiecznym update centralnego pliku. Priorytet: po domknięciu CaseDetail R1C2 i R1D, chyba że Damian zmieni kolejność.
