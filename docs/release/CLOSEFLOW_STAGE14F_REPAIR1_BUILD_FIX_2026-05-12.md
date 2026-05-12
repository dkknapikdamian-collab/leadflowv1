# CLOSEFLOW STAGE14F REPAIR1 BUILD FIX — 2026-05-12

## Cel

Naprawić uszkodzony commit Stage14F, który po nieudanym guardzie i nieudanym buildzie został zacommitowany.

## Zakres

- Naprawia błąd składni w `src/pages/LeadDetail.tsx`:
  - brakujący apostrof w fallbacku `Brak powiązanej sprawy`.
- Dopina techniczny marker `data-lead-next-action-empty="-"`.
- Zostawia funkcjonalny zakres Stage14F:
  - brak starego copy `Co tu trzeba zrobić teraz`,
  - brak starego copy `Krótki panel decyzyjny...`,
  - pusty stan najbliższej akcji jako `-`,
  - widoczny przycisk `Rozpocznij obsługę`,
  - lokalne CSS override dla prawego raila.

## Nie zmieniamy

- Flow `Rozpocznij obsługę`.
- API.
- Supabase.
- Statusów leada.
- Reguł przejścia lead → sprawa.

## Akceptacja

- `node scripts/check-stage14f-lead-detail-right-rail-cleanup.cjs`
- `npm run build`
- Commit/push tylko po zielonym buildzie.
