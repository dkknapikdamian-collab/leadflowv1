# Stage115 - LeadDetail contact card client parity local only

## Scan-first confirmation

- Repo: dkknapikdamian-collab/leadflowv1.
- Branch: dev-rollout-freeze.
- Metoda skanu: GitHub connector + aktywna mapa procesu z paczki źródłowej.
- Przeczytane pliki repo: `src/pages/LeadDetail.tsx`, `src/pages/ClientDetail.tsx`, `src/styles/visual-stage14-lead-detail-vnext.css`, `src/styles/visual-stage12-client-detail-vnext.css`, `package.json`.
- Aktywna ścieżka LeadDetail: lokalny `InfoLine` + `lead-detail-contact-grid` w sekcji "Dane kontaktowe".
- Aktywna ścieżka ClientDetail: lokalny `InfoRow` w lewym profilu klienta, klasy `client-detail-contact-list`, `client-detail-info-row`, `client-detail-icon-button`.
- Konflikt: LeadDetail miał osobną wyspę UI, a Damian wymaga 1:1 jak klient.

## FAKTY Z KODU / PLIKÓW

- LeadDetail miał własny komponent `InfoLine` i własne klasy kontaktowe.
- ClientDetail miał własny `InfoRow` z copy button dla telefonu/e-maila.
- LeadDetail shell miał tylko main + right rail, bez lewego profilu jak klient.

## DECYZJE DAMIANA

- Dane kontaktowe leada mają wyglądać 1:1 jak klient po lewej stronie.
- Zakres obecnej paczki: Stage115 / 3.1.

## ZMIENIONE PLIKI

- `src/components/entity-contact-card.tsx` - nowy wspólny komponent kontaktowy.
- `src/styles/entity-contact-card.css` - wspólny styl karty kontaktowej.
- `src/pages/LeadDetail.tsx` - LeadDetail używa `EntityContactCard` w lewym railu.
- `src/pages/ClientDetail.tsx` - ClientDetail używa `EntityContactInfoList`.
- `src/styles/visual-stage14-lead-detail-vnext.css` - LeadDetail shell dostaje lewy rail.
- `tests/stage115-lead-contact-card-client-parity.test.cjs` - guard regresji.
- `_project/*` - changelog, ledger, test history, guards, next steps.

## TESTY AUTOMATYCZNE

- `node --test tests/stage115-lead-contact-card-client-parity.test.cjs`
- `npm run build`

## TEST RĘCZNY

- Status: TEST RĘCZNY DO WYKONANIA.
- Wejść w /leads/:id.
- Sprawdzić, czy karta kontaktowa jest po lewej i wygląda jak karta klienta: telefon, e-mail, firma, ostatni kontakt, ikony, copy button.
- Sprawdzić copy button telefonu i e-maila.

## BRAKI I RYZYKA

- Nie naprawiono w tej paczce notatek, overdue ani finansów leada. To muszą być osobne podetapy Stage115, bo mają inną przyczynę i inne testy.
- Jeśli lokalny LeadDetail różni się od zdalnego branch `dev-rollout-freeze`, APPLY script zatrzyma się na brakującym anchorze zamiast nadpisywać plik po omacku.

## WPŁYW NA OBSIDIANA

- Do ZIP-a dodano notatkę Obsidian: `2026-05-18 - CloseFlow Stage115 LeadDetail contact card client parity.md`.

## GIT / ZIP STATUS

- Tryb: local ZIP.
- Push tylko po uruchomieniu APPLY z parametrem `-DoPush`.
