# Visual Stage 01 — Shell i sidebar

**Repo:** `dkknapikdamian-collab/leadflowv1`  
**Gałąź:** `dev-rollout-freeze`  
**Zakres:** globalny shell, sidebar, globalny pasek akcji, mobile top, mobile nav  
**Źródło wyglądu:** `closeflow_full_app_modern_5s_ui_concept.html`  
**Zasada:** zmiana wyłącznie warstwy wizualnej i rozmieszczenia elementów shell. Bez zmiany logiki biznesowej, API, Supabase, auth, billing i działania ekranów.

---

## 1. Tabela mapowania przed wdrożeniem

| Funkcja obecna w repo | Gdzie jest teraz | Gdzie będzie w HTML UI | Czy zachowana | Uwagi |
|---|---|---|---|---|
| Główny layout aplikacji | `src/components/Layout.tsx`, root `min-h-screen bg-slate-50 md:flex` | `.app` jako grid: ciemny sidebar + `.main` | Tak | Zmieniona tylko skorupa wizualna. Ekrany wewnętrzne zostają jako `children`. |
| Sidebar desktop | `aside hidden md:flex md:w-64 bg-white border-r...` | `.sidebar` ciemny, sticky, 286 px, gradient | Tak | Routing i linki pozostają. |
| Logo / brand CloseFlow | Góra starego sidebaru, ikona `CheckCircle2` i tekst | `.brand`, `.brand-logo`, `.brand-title` | Tak | Logo pokazane jako `CF`, bez zmiany nazwy aplikacji. |
| Link do Dziś | `navItems`: `/` | Grupa `Start pracy`, przycisk `.nav-btn` | Tak | Aktywność linku liczona z obecnego `location.pathname`. |
| Link do Leadów | `navItems`: `/leads` | Grupa `Start pracy`, przycisk `.nav-btn` | Tak | Detail `/leads/:leadId` nadal podświetla Leady. |
| Link do Klientów | `navItems`: `/clients` | Grupa `Start pracy`, przycisk `.nav-btn` | Tak | Detail `/clients/:clientId` nadal podświetla Klienci. |
| Link do Spraw | `navItems`: `/cases` | Grupa `Start pracy`, przycisk `.nav-btn` | Tak | Obsłużone `/cases/:caseId` i legacy `/case/:caseId`. |
| Link do Zadań | `navItems`: `/tasks` | Grupa `Czas i obowiązki`, przycisk `.nav-btn` | Tak | Bez zmiany ekranu Tasks. |
| Link do Kalendarza | `navItems`: `/calendar` | Grupa `Czas i obowiązki`, przycisk `.nav-btn` | Tak | Bez zmiany ekranu Calendar. |
| Link do Aktywności | `navItems`: `/activity` | Grupa `Czas i obowiązki`, przycisk `.nav-btn` | Tak | Bez zmiany activity engine. |
| Link do Szkiców AI | `navItems`: `/ai-drafts` | Grupa `System`, przycisk `.nav-btn` + globalny przycisk w `.global-actions` | Tak | Nie zmienia flow szkiców. |
| Link do Powiadomień | `navItems`: `/notifications` | Grupa `System`, przycisk `.nav-btn` | Tak | Nie zmienia silnika powiadomień. |
| Link do Rozliczeń | `navItems`: `/billing` | Grupa `System`, przycisk `.nav-btn` | Tak | Nie zmienia billing/access. |
| Link do Pomocy | `navItems`: `/help` | Grupa `System`, przycisk `.nav-btn` | Tak | Nie zmienia SupportCenter. |
| Link do AI admin | Warunkowo w `navItems`, gdy `isAdmin` | Grupa `System`, przycisk `.nav-btn` z badge `AI` | Tak | Nadal widoczne tylko dla admina. |
| Link do Ustawień | `navItems`: `/settings` | Grupa `System`, przycisk `.nav-btn` | Tak | Nie zmienia settings. |
| Aktywny link w menu | `location.pathname === item.path` | `isNavItemActive()` + `.nav-btn.active` | Tak | Naprawione podświetlenie tras szczegółowych bez zmiany routingu. |
| Trial card | Dół starego sidebaru, tylko `trial_active` | `.sidebar-footer` → `.trial-card` | Tak | Używa realnego `workspace.trialEndsAt`, bez statycznego triala z HTML. |
| Link `Aktywuj plan` | W trial card do `/billing` | `.trial-link` w `.trial-card` | Tak | Zachowany link do realnego Billing. |
| Karta użytkownika | Dół starego sidebaru | `.user-card`, `.user-avatar` | Tak | Dalej używa `auth.currentUser`. |
| Wylogowanie | Dół starego sidebaru, `auth.signOut()` | `.sidebar-logout` | Tak | Nie zmienia auth. |
| Mobile header | `md:hidden fixed top-0...` | `.mobile-top` | Tak | Nadal otwiera menu mobilne. |
| Mobile drawer menu | `mobileMenuOpen` panel prawy | `.mobile-drawer`, `.mobile-drawer-panel` | Tak | Zawiera wszystkie grupy menu. |
| Mobile bottom nav | `grid-cols-4`, pierwsze 4 elementy z `navItems` | `.mobile-nav`, 5 zakładek: Dziś, Leady, Klienci, Sprawy, Zadania | Tak | Zgodne z wymaganiem mobile. Pozostałe ekrany są w menu mobilnym i desktopowym sidebarze. |
| Access warning po trialu | W `main`, czerwony pasek `bg-rose-600` | `.access-warning` karta ostrzegawcza | Tak | Nadal widoczny tylko gdy `workspace && !hasAccess`. |
| Globalny pasek akcji | `GlobalQuickActions` sticky toolbar wewnątrz `main` | `.global-bar` w shell + `.global-actions` jako toolbar | Tak | Przyciski działają po staremu, zmienia się opakowanie i styl. |
| Globalny tytuł kontekstu | Brak osobnej warstwy | `.global-title` z aktualną sekcją | Tak | Wyłącznie informacyjne, bez logiki biznesowej. |
| Asystent AI | `GlobalQuickActions` → `GlobalAiAssistant` | Pierwszy element `.global-actions` | Tak | Korzysta z istniejącego `GlobalAiAssistant`. |
| Szybki szkic | `GlobalQuickActions` → `QuickAiCapture` | Drugi element `.global-actions` | Tak | Modal i parser zostają bez zmian. |
| Szkice AI globalnie | `Button asChild` do `/ai-drafts` | `.btn.soft-blue` w `.global-actions` | Tak | Realny link, nie atrapa. |
| + Lead globalnie | Link do `/leads`, zapis `rememberGlobalQuickAction('lead')` | `.btn.primary` w `.global-actions` | Tak | Obecny mechanizm sesyjny zostaje. |
| + Zadanie globalnie | Link do `/tasks`, zapis `rememberGlobalQuickAction('task')` | `.btn` w `.global-actions` | Tak | Obecny mechanizm sesyjny zostaje. |
| + Wydarzenie globalnie | Link do `/calendar`, zapis `rememberGlobalQuickAction('event')` | `.btn` w `.global-actions` | Tak | Obecny mechanizm sesyjny zostaje. |
| Formularze globalne | Nie ma osobnego formularza w shell. Triggery kierują do istniejących ekranów/modali | Bez zmian, tylko nowe przyciski w `.global-actions` | Tak | Nie dodano nowych formularzy. |
| Modale globalne | `QuickAiCapture` otwiera Dialog, AI używa obecnego asystenta | Bez zmian, triggery osadzone w `.global-actions` | Tak | Nie ruszano treści modalów. |
| Filtry globalne | Brak filtrów w shell | Brak w Stage 01 | Tak | Filtry ekranów zostają nietknięte. |
| Formularz logowania | `src/App.tsx` route `/login` | Poza zakresem Stage 01 | Tak | Nie ruszano auth. |
| Routing ekranów | `src/App.tsx` routes | Bez zmian | Tak | Stage 01 nie zmienia routingu. |
| Mobile responsive poniżej 760px | Obecny mobile header + bottom nav | `.mobile-top`, `.mobile-nav`, sidebar ukryty | Tak | Dodany styl systemowy, bez zmiany danych. |

---

## 2. Audyt obecnego shell

### Akcje
- Wejście w zakładki: Dziś, Leady, Klienci, Zadania, Kalendarz, Sprawy, Aktywność, Szkice AI, Powiadomienia, Rozliczenia, Pomoc, Ustawienia.
- Wejście w AI admin tylko dla admina.
- Wylogowanie przez `auth.signOut()`.
- Przejście do Billing z trial card.
- Globalne akcje: AI, Szybki szkic, Szkice AI, Lead, Zadanie, Wydarzenie.
- Mobile menu: otwarcie i zamknięcie.
- Mobile bottom nav: szybkie przejście do głównych zakładek.

### Formularze
- Shell nie zawiera własnych formularzy.
- `QuickAiCapture` zawiera istniejący modal/formularz szybkiego szkicu, ale nie został zmieniony.

### Modale
- Mobile menu jest warstwą shell.
- AI i szybki szkic używają istniejących komponentów, bez zmiany logiki.

### Filtry
- Shell nie ma filtrów.
- Filtry ekranów pozostają w swoich ekranach.

### Dane i liczniki
- Trial card używa `workspace.trialEndsAt` i `workspace.subscriptionStatus`.
- Access warning używa `workspace` i `hasAccess`.
- User card używa `auth.currentUser`.

### Powiązania z API/Supabase
- Brak nowych zapytań w shell.
- `useWorkspace()` pozostaje źródłem stanu access/trial.
- `GlobalAiAssistant` zachowuje istniejące pobieranie kontekstu aplikacji.

---

## 3. Audyt HTML

### Sekcja HTML odpowiadająca etapowi
- `.app`
- `.sidebar`
- `.brand`
- `.nav-scroll`
- `.nav-group`
- `.nav-caption`
- `.nav-btn`
- `.nav-ico`
- `.nav-badge`
- `.sidebar-footer`
- `.trial-card`
- `.user-card`
- `.main`
- `.global-bar`
- `.global-title`
- `.global-actions`
- `.mobile-top`
- `.mobile-nav`

### Elementy HTML, których nie podłączono jako nowej logiki
- Statyczne badge/liczniki w menu z HTML nie zostały wprowadzone, bo aplikacja nie ma globalnych liczników menu w shell.
- Statyczny stan triala z HTML nie został skopiowany, bo billing/trial musi używać realnego `workspace`.
- Ewentualne demo-linki do kart szczegółowych z HTML nie zostały dodane do produkcyjnego menu, bo routing szczegółów działa przez klik w rekord.

### Funkcje aplikacji, których HTML nie pokazywał dokładnie
- `AI admin` widoczny tylko dla admina został przeniesiony do grupy `System`.
- Access warning po wygaśnięciu triala został przeniesiony do `.access-warning` pod globalnym paskiem.
- Wylogowanie zostało zachowane w footerze sidebaru i w mobile drawer.

---

## 4. Mapa przepięcia

| Stary element | Nowe miejsce |
|---|---|
| Stary biały sidebar | `.sidebar` ciemny, sticky, z grupami menu |
| Lista `navItems` bez grup | `navGroups`: Start pracy / Czas i obowiązki / System |
| Stary brand z ikoną | `.brand` + `.brand-logo` + `.brand-title` |
| Trial box | `.sidebar-footer` → `.trial-card` |
| Karta użytkownika | `.sidebar-footer` → `.user-card` |
| Wyloguj | `.sidebar-logout` |
| Mobile topbar | `.mobile-top` |
| Mobile drawer | `.mobile-drawer` |
| Bottom nav 4 elementy | `.mobile-nav` 5 elementów: Dziś, Leady, Klienci, Sprawy, Zadania |
| `GlobalQuickActions` sticky | `.global-bar` w Layout + `.global-actions` w komponencie |
| Szkice AI link | `.global-actions` → `.btn.soft-blue` |
| Lead action | `.global-actions` → `.btn.primary` |
| Task/Event actions | `.global-actions` → `.btn` |

---

## 5. Pliki zmienione

- `src/components/Layout.tsx`
- `src/components/GlobalQuickActions.tsx`
- `src/styles/visual-stage01-shell.css`
- `src/index.css` — dodany import `./styles/visual-stage01-shell.css`
- `scripts/check-visual-stage01-shell.cjs`
- `package.json` — dodany check w `lint` oraz skrypt `check:visual-stage01-shell`
- `docs/VISUAL_STAGE_01_SHELL_SIDEBAR_2026-04-28.md`

---

## 6. Guard/test

Dodany guard:

```bash
npm.cmd run check:visual-stage01-shell
```

Sprawdza:
- marker etapu w `Layout.tsx`,
- klasy `.app`, `.sidebar`, `.global-bar`, `.mobile-top`, `.mobile-nav`,
- grupy menu,
- wszystkie główne linki,
- obecność `GlobalAiAssistant`, `QuickAiCapture` i bridge `rememberGlobalQuickAction`,
- import CSS stage01 w `src/index.css`,
- brak mojibake w plikach etapu.

---

## 7. Ręczna ścieżka testowa

1. Uruchom aplikację lokalnie.
2. Wejdź na `/` i sprawdź, czy shell ma ciemny sidebar.
3. Kliknij kolejno menu: Dziś, Leady, Klienci, Sprawy, Zadania, Kalendarz, Aktywność, Szkice AI, Powiadomienia, Rozliczenia, Pomoc, Ustawienia.
4. Sprawdź, czy aktywny link jest podświetlony.
5. Kliknij globalnie: AI, Szybki szkic, Szkice AI, Lead, Zadanie, Wydarzenie.
6. Zmniejsz szerokość ekranu poniżej 760px.
7. Sprawdź mobile-top, mobile drawer i dolną nawigację.
8. Sprawdź, czy ekrany wewnętrzne nadal renderują swoje stare treści.

---

## 8. Nie wdrożono 1:1

- Nie wdrożono statycznych liczników/badge z HTML w menu — powód: aplikacja nie ma teraz globalnego źródła takich liczników w shell. Rekomendacja: dodać dopiero w osobnym etapie, jeśli będą liczone z realnych danych.
- Nie wdrożono linków do kart szczegółowych jako pozycji w sidebarze — powód: produkcyjny routing kart szczegółowych działa przez listy, a użytkownik wymagał nie pokazywać ich jako osobnych pozycji produkcyjnych.

---

## 9. Funkcje istniejące w aplikacji niewidoczne w HTML

- `AI admin` — przeniesiono do: grupa `System`, widoczne tylko dla admina.
- `Access warning` po wygaśnięciu triala — przeniesiono do: `.access-warning` pod globalnym paskiem.
- `Wyloguj się` — przeniesiono do: `.sidebar-footer` i `mobile-drawer-footer`.

---

## 10. Kryterium zakończenia

Stage 01 jest zakończony, jeśli:
- aplikacja startuje,
- `npm.cmd run check:visual-stage01-shell` przechodzi,
- `npm.cmd run check:polish` przechodzi,
- `npm.cmd run build` przechodzi,
- linki menu działają,
- globalne akcje uruchamiają istniejące flow,
- mobile nie rozbija layoutu.
