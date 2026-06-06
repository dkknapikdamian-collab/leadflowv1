# STAGE227B — Sales Funnel Decision List UX Rewrite — Obsidian update

Data i godzina: 2026-06-06 15:45 Europe/Warsaw
Repo: `dkknapikdamian-collab/leadflowv1`
Branch: `dev-rollout-freeze`
Local path: `C:\Users\malim\Desktop\biznesy_ai\2.closeflow`
Folder Obsidiana: `10_PROJEKTY/CloseFlow_Lead_App`

## Decyzja

Stage227A działał technicznie, ale ręczny test UX pokazał, że szeroki kanban jest za gęsty i nieczytelny.

Stage227B zmienia `/funnel` z klasycznego kanbana na czytelny panel decyzyjny właściciela:

- góra: filtry decyzji,
- środek: etapy jako pasek filtrów,
- dół: jedna szeroka lista rekordów,
- prawa kolumna: priorytet teraz.

## Zakres

- `src/pages/SalesFunnel.tsx` — przebudowa UI.
- `scripts/check-stage227b-sales-funnel-decision-list.cjs` — nowy guard UX.
- `tests/stage227b-sales-funnel-decision-list.test.cjs` — statyczny test kontraktu.
- `package.json` — rejestracja skryptów.
- `scripts/closeflow-release-check-quiet.cjs` — dopięcie Stage227B do quiet release gate.

## Testy

Planowane/uruchamiane lokalnie:

- `npm run check:stage227a-sales-funnel-movement-view`
- `npm run test:stage227a-sales-funnel-movement-view`
- `npm run check:stage227b-sales-funnel-decision-list`
- `npm run test:stage227b-sales-funnel-decision-list`
- `npm run build`
- `npm run verify:closeflow:quiet`
- `git diff --check`

## Audyt ryzyk

- Ryzyko: lista może być czytelniejsza, ale mniej przypominać klasyczny CRM dla użytkownika oczekującego przeciągania kart.
- Decyzja: to jest akceptowalne, bo CloseFlow ma być systemem kontroli ruchu, nie tanim klonem CRM.
- Ryzyko: Stage227B zostawia globalny `/funnel`, ale nie dodaje jeszcze mini-modułów w LeadDetail/ClientDetail/CaseDetail.
- Następny etap: dopiero po akceptacji globalnego modelu dodać mini-sekcje ruchu w detail views.
