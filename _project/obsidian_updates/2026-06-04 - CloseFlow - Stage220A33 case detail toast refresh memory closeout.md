# CloseFlow / LeadFlow - STAGE220A33 case detail toast refresh memory closeout

Data: 2026-06-04
Typ wpisu: etap wdrozeniowy + stabilizacja UI/refresh + manifest pamieci
Status zapisu: przygotowano w repo; do skopiowania do Obsidiana

## Routing

- nazwa / alias wejściowy: CloseFlow / LeadFlow
- entity_id: DO_POTWIERDZENIA
- workspace_id: DO_POTWIERDZENIA
- project_id: DO_POTWIERDZENIA
- idea_id: nie dotyczy
- report_id: STAGE220A33
- canonical_name: CloseFlow / LeadFlow
- folder Obsidiana: `10_PROJEKTY/CloseFlow_Lead_App/`
- repo: `dkknapikdamian-collab/leadflowv1`
- branch: `dev-rollout-freeze`
- local path: `C:\Users\malim\Desktop\biznesy_ai\2.closeflow`

## FAKTY

- Wspolny Toaster aplikacji znajduje sie w `src/components/ui/sonner.tsx`.
- Stage220A33 podpina globalny CSS `src/styles/closeflow-toast-source-truth-stage220a33.css` przez wspolny Toaster.
- CaseDetail zachowuje odswiezanie po jawnych eventach zapisu operatora, ale etap chroni przed focus/visibility reloadem.
- Dodano guard `tests/stage220a33-case-detail-toast-refresh-and-memory-contract.test.cjs`.

## DECYZJE DAMIANA / DECYZJE ETAPU

- W tym etapie nie dokladamy lejka sprzedazy.
- W tym etapie nie rozbudowujemy finansow CaseDetail.
- Najpierw stabilizujemy komunikaty, refresh i pamiec projektu.
- Lejek sprzedazy ma isc jako osobny nastepny etap po potwierdzeniu stabilnosci.

## HIPOTEZY AI

- Ujednolicenie Sonner/Toaster w jednym miejscu powinno poprawic wszystkie komunikaty bez punktowego poprawiania pojedynczych `toast.error` w kazdej stronie.
- Jesli uzytkownik nadal widzi systemowe komunikaty, prawdopodobnie pochodza z innego komponentu modal/confirm albo z natywnego browser prompt, a nie z Sonnera.

## TESTY

```powershell
cd "C:\Users\malim\Desktop\biznesy_ai\2.closeflow"
git pull origin dev-rollout-freeze
node --test tests/stage220a33-case-detail-toast-refresh-and-memory-contract.test.cjs
npm run build
npm run verify:closeflow:quiet
```

## TEST RĘCZNY

- `/cases/:caseId`
- historia wpłat
- dodanie wpłaty
- dodanie korekty
- usunięcie wpłaty/korekty
- przełączenie karty przeglądarki i powrót
- sprawdzenie stylu komunikatów oraz braku pełnego reloadu po samym focusie

## RYZYKA

- Nie wykonano lokalnego builda w ChatGPT.
- Finalny wyglad toasta trzeba sprawdzic w przegladarce.
- Duza podmiana `App.tsx` zostala celowo odrzucona na rzecz mniejszego patcha w `sonner.tsx`.

## NASTĘPNY KROK

Po potwierdzeniu testu recznego i zielonym `verify:closeflow:quiet`: `STAGE220A34_LEJEK_SPRZEDAZY_PRODUCT_CONTRACT`.
