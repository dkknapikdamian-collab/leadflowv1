# Stage227E4R3 — Lead Detail Runtime Copy Cleanup

- data i godzina: 2026-06-07 Europe/Warsaw
- canonical_name: CloseFlow / LeadFlow
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
- typ wpisu: runtime copy cleanup / LeadDetail simplification / visual source of truth

## Decyzja
LeadDetail ma być szybkim ekranem decyzji sprzedażowej. Runtime nie ma pokazywać zdań-objaśnień typu "Krótko...", "Jest jasny powód..." albo "Najbliższe zadania...". Zostają dane, etykiety i akcje.

## Zakres
- Usunięcie opisowego copy z panelu Kontekst sprzedażowy.
- Usunięcie item hint paragraph z kart kontekstu.
- Usunięcie opisowego copy z Działania leada i Źródło / pierwsza notatka.
- Zachowanie 3 top cards, szybkich akcji i kontekstu sprzedażowego.

## Następny krok
Po PASS i build: selektywny commit/push albo kolejny local-only etap Notes vs Blockers.
