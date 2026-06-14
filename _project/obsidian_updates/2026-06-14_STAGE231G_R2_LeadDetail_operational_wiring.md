# STAGE231G R2 - LeadDetail operational wiring

Data: 2026-06-14 10:05 Europe/Warsaw
Project: CloseFlow / LeadFlow
Folder Obsidiana: 10_PROJEKTY/CloseFlow_Lead_App
Status: payload do przeniesienia do centralnych plików 02/04/08/09/11

## Wpis

Naprawa R2 domyka kartę leada operacyjnie:
- Potencjał ma CTA Ustaw/Edytuj potencjał.
- Panel Finanse leada ma CTA Edytuj potencjał.
- Formularz dodawania leada ma jawne pole Potencjał / wartość.
- Następny krok, Cisza / ryzyko i Blokada mają akcje zamiast samego displayu.
- Wiersze działań rozdzielają content/status/actions i nie powinny się zlewać.

## Test ręczny

1. Dodaj nowego leada z potencjałem 12000.
2. Otwórz kartę leada.
3. Sprawdź potencjał w kafelku i panelu finansów.
4. Edytuj potencjał z kafelka i panelu.
5. Dodaj zadanie, wydarzenie i brak.
6. Sprawdź layout i akcje Jutro/Zrobione/Rozwiąż brak/Usuń.
7. Hard refresh: dane zostają.

## Ryzyka

- Edycja potencjału przez istniejący dialog Edytuj leada może pozwolić zmienić też inne dane. Świadomie przyjęte, bo nie tworzy drugiego źródła zapisu.
- Nie ruszano płatności jako potencjału: potencjał = dealValue, płatności = payments.
