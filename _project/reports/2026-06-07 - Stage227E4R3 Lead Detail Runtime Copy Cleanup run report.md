# Stage227E4R3 Lead Detail Runtime Copy Cleanup run report

Data: 2026-06-07 Europe/Warsaw
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow

## Cel
Usunąć z runtime LeadDetail zdania-objaśnienia, które są notatkami etapu albo copy dla developera, a nie informacją operacyjną dla sprzedawcy.

## Zakres
- Zachowano E2 top cards.
- Zachowano E3 QuickActionsBar.
- Zachowano E4R2 kompaktowy Kontekst sprzedażowy.
- Usunięto z runtime paragrafy wyjaśniające z panelu kontekstu, centrum działań i źródła notatki.
- Zmieniono pill z `Lekki kontekst` na krótkie `Do decyzji`.
- Nie ruszano SQL, Supabase, CaseDetail ani modelu braków.

## Testy
- check/test Stage227E4R3.
- regresja Stage227E4R2.
- regresja Stage227E2/E3.
- npm run build.

## Audyt ryzyk
- Ryzyko utraty pomocnego kontekstu jest niskie, bo usunięto wyłącznie zdania instruktażowe, nie dane ani akcje.
- Ryzyko wizualne: panel może być zbyt suchy, ale to zgodne z decyzją: runtime ma być ekranem decyzji, nie opisowym raportem.
- Kolejny etap powinien rozdzielić notatki od braków/blokad bez budowania nowej tabeli.
