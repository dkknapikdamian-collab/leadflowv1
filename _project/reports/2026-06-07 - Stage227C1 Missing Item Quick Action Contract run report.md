# Stage227C1 — Missing Item Quick Action Contract run report

Data: 2026-06-07 Europe/Warsaw
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Tryb: local-only

## Zakres

- Dodano kontrakt Stage227C1 dla akcji Brak.
- Dodano lekki moduł kontraktu typów.
- Dodano guard i test.
- Nie dodano runtime modala.
- Nie dodano SQL.
- Nie dodano nowej tabeli.

## Wynik oczekiwany

PASS:
- check:stage227c1-missing-item-quick-action-contract
- test:stage227c1-missing-item-quick-action-contract
- npm run build
- git diff --check

## Audyt ryzyk

- Nie wolno rozdmuchać Brak w osobny moduł przed walidacją.
- Następny etap runtime musi uważać, żeby notatka nie udawała braku.
- Case powinien iść przez istniejące case_items, jeśli dostępne.
- Lead/Client powinny iść przez istniejące task/activity jako missing_item/blocker.
