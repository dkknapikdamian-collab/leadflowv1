# STAGE219-R10 — CaseDetail composed header card

## FAKTY
- Projekt: CloseFlow / LeadFlow
- Repo: `dkknapikdamian-collab/leadflowv1`
- Branch: `dev-rollout-freeze`
- Lokalnie: `C:\Users\malim\Desktop\biznesy_ai\2.closeflow`
- Zakres: tylko górny kafelek widoku sprawy.

## DECYZJE DAMIANA
- Robić kafelek po kafelku.
- Górny kafelek CaseDetail ma zostać schłodzony i zwarty.
- Nazwa klienta ma być w górnej belce, obok pauza/myślnik i nazwa sprawy.
- Kafelek ma jasno pokazywać, w czym jesteśmy.

## ZMIANY
- Dodano złożony tytuł `klient — sprawa`.
- Usunięto duplikację klienta z nazwy sprawy, jeśli tytuł już zaczynał się od nazwy klienta.
- Header jest niższy, jednoliniowy i mniej pusty.

## TESTY
- `node scripts/check-stage219r10-case-header-composed-card.cjs`
- `npm run build`
- `git diff --check`

## NASTĘPNY KROK
Po screenie z deploya ocenić górny kafelek, potem przejść do następnego kafelka.
