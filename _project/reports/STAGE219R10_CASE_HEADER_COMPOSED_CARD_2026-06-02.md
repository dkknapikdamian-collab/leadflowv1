# STAGE219-R10 — CaseDetail composed header card

## Cel
Naprawić wyłącznie górny kafelek widoku sprawy, bez dalszego mieszania w notatki, finanse, Supabase albo szybkie akcje.

## Decyzja Damiana
- Pracujemy kafelek po kafelku.
- Górny kafelek ma być schłodzony i czytelny.
- Nazwa klienta ma być w górnej belce.
- Obok ma być pauza/myślnik i nazwa sprawy.
- Całość ma być w jednym wierszu, żeby od razu było jasne, w czym jesteśmy.

## Zakres
- `src/pages/CaseDetail.tsx`
  - dodanie helperów `getCaseHeaderClientLabel` i `getCaseHeaderCaseLabel`,
  - zamiana prostego `h1` na złożony tytuł: klient — sprawa,
  - automatyczne usunięcie duplikacji klienta z tytułu, jeśli `title` zaczyna się od `clientName`.
- `src/styles/closeflow-detail-view-source-truth-stage219.css`
  - kompaktowy header,
  - jeden wiersz,
  - ellipsis,
  - ukrycie breadcrumb/status/meta w tym kafelku,
  - mniejszy cień i mniejsza wysokość.

## Testy
- `node scripts/check-stage219r10-case-header-composed-card.cjs`
- `npm run build`
- `git diff --check`

## Czego nie ruszano
- Supabase
- SQL
- API
- notatki
- finanse
- event refresh
- szybkie akcje

## Następny krok
Po deployu ocenić wyłącznie górny kafelek. Jeśli jest OK, przejść do kafelka „Co robimy teraz?”.
