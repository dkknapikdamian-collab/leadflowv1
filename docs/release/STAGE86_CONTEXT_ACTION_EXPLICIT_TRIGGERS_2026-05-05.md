# Stage86 - jawne wywołania wspólnych okien z ekranów szczegółów

## Cel

Po Stage85 ekrany szczegółów mają wspólny host dialogów. Stage86 domyka kierunek: najważniejsze widoczne akcje w leadzie, kliencie i sprawie mają jawnie otwierać wspólny dialog, zamiast odpalać lokalne uproszczone formularze.

## Zmieniono

- LeadDetail: przyciski zadania, wydarzenia i notatki wywołują wspólny kontekstowy mechanizm.
- CaseDetail: przyciski dodawania zadania, wydarzenia i notatki wywołują wspólny kontekstowy mechanizm.
- ClientDetail: ekran dostaje ten sam kontrakt wywołania dla kontekstu klienta.
- Dodano guard i test Stage86.

## Nie zmieniać

- Nie ruszać deduplikacji Stage64.
- Nie ruszać Google Calendar OAuth ani billing.
- Nie zmieniać modelu danych poza zapisaniem relacji leadId, caseId albo clientId w tworzonym rekordzie.
- Nie usuwać historii ani rekordów.

## Kryterium zakończenia

Kliknięcia dodania zadania, wydarzenia i notatki z ekranów szczegółów idą do wspólnego, rozbudowanego dialogu. Lokalne uproszczone wywołania nie są używane przez główne przyciski.
