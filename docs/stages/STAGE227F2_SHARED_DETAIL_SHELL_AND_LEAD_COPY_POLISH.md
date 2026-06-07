# Stage227F2 — Shared Detail Shell and Lead Copy Polish

Data: 2026-06-07 Europe/Warsaw
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Tryb: local-only, bez pushu

## Cel

Naprawić dwa problemy wizualne bez ruszania logiki:
- LeadDetail: przycisk Kopiuj w headerze nie może ucinać etykiety Telefon/E-mail.
- ClientDetail i CaseDetail: wspólny kontrakt szerokości, guttera i shelli detail pages.

## Zakres

- CSS LeadDetail: stabilny grid dla header meta rows z przyciskiem Kopiuj.
- CSS shared canvas: ciaśniejszy stały gutter i pełniejszy shell dla ClientDetail/CaseDetail.
- Guard/test Stage227F2.

## Czego nie ruszano

- SQL
- Supabase
- logika danych
- akcje case/lead/client
- finanse
- kalendarz
- notatki/historia

## Testy

- npm run check:stage227f2-shared-detail-shell-and-lead-copy-polish
- npm run test:stage227f2-shared-detail-shell-and-lead-copy-polish
- regresje F1/E0
- npm run build
- git diff --check
