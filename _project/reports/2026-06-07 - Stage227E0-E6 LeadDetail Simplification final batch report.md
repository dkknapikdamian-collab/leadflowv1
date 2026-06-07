# Stage227E0-E6 — LeadDetail Simplification final batch report

Data: 2026-06-07 Europe/Warsaw
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Tryb: local-only batch, push po E0-E6

## Zakres

- E0: Detail shell width audit — stały gutter, usunięcie rosnących bocznych fos dla Lead/Client/Case.
- E1: Lead header phone visibility — telefon, email, firma, źródło i ostatni kontakt widoczne w headerze; Brak telefonu jawnie.
- E2: Remove sales context block — usunięcie dużego Kontekstu sprzedażowego z runtime.
- E3: Decision cards cleanup — 4 kafelki: Następny krok, Potencjał, Cisza / ryzyko, Blokada.
- E4: Quick actions source of truth — LeadDetail i CaseDetail używają wspólnego QuickActionsBar.
- E5: Work center + blockers source of truth — Działania leada są jedynym centralnym miejscem pracy; prawy rail nie dubluje najbliższych działań.
- E6: Notes vs history separation — notatki pokazują treść notatek, historia aktywności pokazuje log bez powtarzania treści notatek.

## Wyniki

PASS:
- check/test Stage227E6
- check/test Stage227E5
- check/test Stage227E4
- check/test Stage227E3
- check/test Stage227E2
- check/test Stage227E1
- check/test Stage227E0
- legacy shared quick actions regression
- npm run build
- git diff --check bez błędów krytycznych

## Audyt ryzyk

- Wymagany visual check po deployu: szczególnie szerokość detail pages, pustka prawego raila po usunięciu duplikatu oraz czy Historia aktywności nie robi się zbyt długa.
- Nie ruszano SQL, Supabase ani modelu danych.
- Nie budowano nowego modelu braków/blokad.
- Zmieniono tylko runtime/IA/CSS/guardy/testy dla LeadDetail i wspólnych quick actions.

## Następny krok

Po deployu sprawdzić wizualnie LeadDetail, ClientDetail i CaseDetail. Dopiero potem mobile/kontrast.
