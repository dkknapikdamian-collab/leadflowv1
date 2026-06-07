# Stage227F2R1 — Client/Case Header Stretch + Lead Copy Fix run report

Data: 2026-06-07 Europe/Warsaw
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze

## Zakres

- LeadDetail: poprawka układu Telefon/Kopiuj, żeby przycisk nie ucinał etykiety i wartości.
- ClientDetail: header i shell na pełną szerokość wspólnego detail canvas.
- CaseDetail: header, top grid i shell na pełną szerokość wspólnego detail canvas.

## Audyt ryzyk

- Zmiana CSS może wymagać wizualnej korekty po deployu, jeśli prawa kolumna w ClientDetail/CaseDetail jest za szeroka albo za wąska.
- Nie ruszano modelu danych, więc ryzyko backendowe jest niskie.
- Najważniejszy test ręczny: LeadDetail telefon/Kopiuj, ClientDetail kartoteka, CaseDetail kartoteka, scroll bez bocznych fos.

## Wynik oczekiwany

Stage227F2R1 guard/test PASS, regresje F2/F1/E0 PASS, build PASS.
