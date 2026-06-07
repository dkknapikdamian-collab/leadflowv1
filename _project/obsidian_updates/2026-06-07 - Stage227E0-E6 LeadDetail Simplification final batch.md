# Stage227E0-E6 — LeadDetail Simplification + Shell Width Audit

Data: 2026-06-07 Europe/Warsaw
Projekt: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Typ wpisu: batch wdrożeniowy + decyzja IA + testy

## Decyzja

LeadDetail ma być ekranem decyzji sprzedażowej, nie opisowym formularzem.

## Wdrożono

1. Shell / fosa / szerokość okienek:
   - wspólny kontrakt szerokości dla LeadDetail, ClientDetail, CaseDetail,
   - stały gutter,
   - ograniczenie rosnących bocznych fos.

2. Telefon i dane leada:
   - telefon widoczny w headerze,
   - Kopiuj przy telefonie,
   - Brak telefonu jako jawny stan,
   - email, firma, źródło i ostatni kontakt w compact header data.

3. Kontekst sprzedażowy:
   - usunięty duży blok z runtime,
   - bez zastępowania go ścianą tekstu.

4. Kafelki decyzyjne:
   - Następny krok,
   - Potencjał,
   - Cisza / ryzyko,
   - Blokada.

5. Quick actions:
   - LeadDetail i CaseDetail używają wspólnego QuickActionsBar,
   - jeden source of truth dla stylu i tonów akcji.

6. Work center:
   - Działania leada są centralnym miejscem pracy,
   - Najbliższe działania / Braki i blokady / Wszystkie aktywne,
   - prawy rail nie dubluje listy działań.

7. Notatki vs historia:
   - notatki pokazują treść notatek,
   - historia aktywności pokazuje log zdarzeń,
   - historia nie powtarza treści notatek.

## Testy

PASS:
- E0-E6 guardy i testy,
- regresja shared quick actions,
- npm run build,
- git diff --check bez błędów krytycznych.

## Ryzyka po etapie

- Visual check po deployu obowiązkowy.
- Sprawdzić, czy prawy rail nie jest zbyt pusty.
- Sprawdzić, czy Historia aktywności nie tworzy drugiej ściany tekstu.
- Sprawdzić Lead/Client/Case na różnych szerokościach ekranu.

## Czego nie ruszano

- SQL,
- Supabase,
- model danych,
- pełny model braków/blokad,
- mobile/kontrast jako osobny przyszły etap.
