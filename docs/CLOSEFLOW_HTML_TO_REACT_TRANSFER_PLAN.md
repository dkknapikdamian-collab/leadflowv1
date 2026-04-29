# CloseFlow UI 1:1 transfer: HTML → React/TSX/CSS

Repo nie używa statycznego HTML jako UI. UI jest w React + TypeScript (`.tsx`) i CSS/Tailwind. HTML jest bardzo dobry jako wzorzec wizualny, ale zły jako jedyny materiał wdrożeniowy, bo AI developer musi zgadywać, który fragment HTML-a odpowiada któremu komponentowi aplikacji.

## Najlepszy format dla AI developera

Pakiet powinien mieć 4 warstwy:

1. **HTML reference** – wzorzec wizualny 1:1.
2. **CSS contract** – wspólne tokeny, klasy layoutu, karty, listy, hero, przyciski.
3. **TSX preview** – podgląd w aplikacji, uruchamiany przez Vite jako normalna strona Reacta.
4. **Implementation map** – mapa: który ekran HTML odpowiada któremu plikowi w repo.

HTML mówi: „jak ma wyglądać”. TSX + CSS mówi: „jak to zbudować w tej aplikacji”.

## Kolejność wdrożenia

1. Shell: `src/components/Layout.tsx`, `src/components/GlobalQuickActions.tsx`, `src/index.css`, `src/styles/closeflow-vnext-ui-contract.css`
2. Listy: `Leads.tsx`, `Clients.tsx`, `Cases.tsx`, `Tasks.tsx`, `Calendar.tsx`
3. Karty: `LeadDetail.tsx`, `ClientDetail.tsx`, `CaseDetail.tsx`
4. Dziś: `Today.tsx` jako lekki polish, bez rozwalania obecnej logiki
5. Poboczne: `Activity.tsx`, `AiDrafts.tsx`, `NotificationsCenter.tsx`, `Billing.tsx`, `SupportCenter.tsx`, `Settings.tsx`

## Reguła

Nie przenosić HTML-a jako HTML-a do aplikacji. Przenieść układ, hierarchię, spacing, klasy i komponenty do React/TSX. Logika aplikacji zostaje z obecnych plików.
