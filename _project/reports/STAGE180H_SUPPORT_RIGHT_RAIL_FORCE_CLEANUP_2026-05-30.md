# STAGE180H_SUPPORT_RIGHT_RAIL_FORCE_CLEANUP_2026-05-30

## Cel

Wymusić realne usunięcie prawego raila z widoku `/help` po nieudanym Stage180G.

## Kontekst

Stage180G zatrzymał się na guardzie: `support-right-rail should be removed from rendered JSX`.
Użytkownik zgłosił w admin feedback na `/help`, że do skasowania są:
- opis pod `Wszystkie zgłoszenia`,
- karta `Sugerowane zgłoszenia`,
- karta `Pomoc operacyjna`.

## Zakres

- `src/pages/SupportCenter.tsx`
  - usuwa całe `<aside className="support-right-rail">...</aside>`,
  - usuwa opis listy zgłoszeń,
  - dodaje marker Stage180H.
- `src/styles/visual-stage17-support-vnext.css`
  - wymusza jedną kolumnę `.support-shell`.
- `scripts/check-stage180h-support-right-rail-force-cleanup.cjs`
  - pilnuje, że rail i wskazane teksty nie wrócą.

## Czego nie ruszano

- Supabase,
- API zgłoszeń,
- RLS,
- deployment,
- push,
- logika zapisywania zgłoszeń.

## Testy

- `node scripts/check-stage180h-support-right-rail-force-cleanup.cjs`
- `npm run build`
- ręcznie: `/help`, restart dev servera, Ctrl+F5.

## Następny krok

Po zastosowaniu ZIP-a sprawdzić wizualnie, czy `/help` ma formularz i listę na pełnej szerokości bez prawego panelu.
