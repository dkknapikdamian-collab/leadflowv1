---
document_id: CLOSEFLOW_UI_VISUAL_MASTER_SPEC_V1
project_id: closeflow_lead_app
canonical_name: CloseFlow / LeadFlow / CaseFlow
repository: dkknapikdamian-collab/leadflowv1
canonical_product_branch: dev-rollout-freeze
document_purpose: master specification for generating final UI graphics
document_status: DESIGN_MAPPING_V1
visual_direction_status: OWNER_APPROVED_DIRECTION_FOR_GRAPHIC_PROTOTYPING
runtime_implementation_status: NOT_IMPLEMENTED_BY_THIS_DOCUMENT
language: pl-PL
visual_mockup_brand: Forteca
final_market_brand: PENDING_OWNER_DECISION
generated_at: 2026-08-18 Europe/Warsaw
---

# CloseFlow / LeadFlow / CaseFlow — MASTER UI VISUAL SPEC V1

## 0. Po co istnieje ten dokument

Ten plik jest **jednym źródłem mapy ekranów do przyszłego generowania grafik UI**.

Ma pozwolić innemu AI wygenerować, ekran po ekranie, spójny i produkcyjny komplet wizualizacji aplikacji bez:
- wymyślania nowych funkcji,
- gubienia istniejących zakładek,
- upraszczania aplikacji do kilku przykładowych ekranów,
- tworzenia placeholderów typu „tu będą leady”,
- mieszania starego i nowego języka wizualnego,
- wprowadzania drugiego, konkurencyjnego design systemu.

Dokument rozdziela trzy stany:

- `CURRENT` — funkcja/route istnieje w aktualnym repo.
- `TARGET_VISUAL` — sposób, w jaki funkcja ma zostać pokazana na nowych grafikach.
- `CONDITIONAL` — ekran/funkcja istnieje, ale zależy od planu, roli, konfiguracji lub stanu danych.
- `ALIAS` — route techniczny kieruje do innego ekranu; nie tworzyć osobnej grafiki.
- `LEGACY` — route historyczny/dev; nie traktować jako produkcyjnego ekranu.
- `TARGET_EXTENSION` — element zatwierdzonego kierunku UX, który ma być pokazany w projekcie wizualnym, ale przed implementacją trzeba potwierdzić/wykonać jego techniczny etap.

## 1. Najważniejsza decyzja wizualna

### Rekomendacja

Nowe grafiki mają używać kierunku roboczo nazwanego **Forteca Calm Light**:

- jasny,
- lekki,
- nowoczesny,
- profesjonalny,
- funkcjonalny,
- bez ciężkich gradientów i dekoracyjnego „dashboard noise”,
- z bardzo jasną hierarchią,
- ze spójną lewą nawigacją,
- z kartami informacyjnymi tylko tam, gdzie wspierają decyzję,
- z tabelami/listami tam, gdzie trzeba szybko porównać rekordy,
- z detalem encji pokazanym najpierw jako czytelny podgląd, a nie formularz edycji.

### Reguła nadrzędna

> Użytkownik po wejściu w ekran ma w maksymalnie 10 sekund wiedzieć: gdzie jest, co jest ważne i co może zrobić dalej.

### Ważne: nazwa „Forteca”

`Forteca` jest **etykietą makiet i kierunku graficznego**, a nie finalnie zatwierdzoną nazwą rynkową produktu.

Inny AI może używać napisu `Forteca` na grafikach do czasu osobnej decyzji właściciela, ale:
- nie ma traktować tego jako finalnego brandu,
- nie ma zmieniać nazw domenowych/technicznych `CloseFlow / LeadFlow / CaseFlow`,
- logo ma pozostać proste i wymienne.

---

# 2. Źródła technicznej prawdy użyte do mapy

Najważniejsze pliki repo:
- `src/lib/routes.ts` — kanoniczna mapa route'ów.
- `src/App.tsx` — aktywne ekrany i warunki dostępu.
- `src/components/Layout.tsx` — sidebar, grupy menu, mobile navigation, user/access shell.
- `src/pages/TodayStable.tsx`
- `src/pages/Leads.tsx`
- `src/pages/LeadDetail.tsx`
- `src/pages/Clients.tsx`
- `src/pages/ClientDetail.tsx`
- `src/pages/Cases.tsx`
- `src/pages/CaseDetail.tsx`
- `src/pages/SalesFunnel.tsx`
- `src/pages/TasksStable.tsx`
- `src/pages/Calendar.tsx`
- `src/pages/Templates.tsx`
- `src/pages/ResponseTemplates.tsx`
- `src/pages/Activity.tsx`
- `src/pages/AiDrafts.tsx`
- `src/pages/NotificationsCenter.tsx`
- `src/pages/Billing.tsx`
- `src/pages/SupportCenter.tsx`
- `src/pages/Settings.tsx`
- `src/pages/AdminAiSettings.tsx`
- `src/pages/Login.tsx`
- `src/pages/ClientPortal.tsx`
- `docs/ui/CLOSEFLOW_UI_MAP.generated.md`
- `docs/ui/CLOSEFLOW_UI_PREMAP_2026-05-08.md`
- `_project/contracts/LF-UI-SOT-007_TRUE_VISUAL_DESIGN_SYSTEM_RUNTIME_CONSOLIDATION.md`

## Zasada zgodności

Nowa wizualizacja nie może stworzyć drugiego systemu wizualnego. Grafiki są **projektem nowego wyglądu konsumentów istniejącego Visual Source of Truth**, a nie pretekstem do rozrzucenia nowych lokalnych stylów po stronach.

---

# 3. Globalny język wizualny — TARGET_VISUAL

## 3.1. Charakter

Słowa kluczowe:
- calm,
- light,
- precise,
- premium SaaS,
- operational,
- readable,
- trustworthy,
- modern without being futuristic,
- minimal, ale nie pusty.

Nie używać:
- ciężkich ciemnych dashboardów jako domyślnego motywu,
- neonów,
- glassmorphismu jako głównego stylu,
- wielkich gradientów,
- ogromnych ilustracji marketingowych wewnątrz produktu,
- dekoracyjnych wykresów bez decyzji biznesowej,
- nadmiaru ramek,
- 5 różnych stylów przycisków na jednym ekranie.

## 3.2. Paleta robocza dla AI-generowania grafik

To są **wartości do zachowania spójności mockupów**, nie automatyczna decyzja o kodowych tokenach:

- Canvas: `#F7F9FC`
- Surface: `#FFFFFF`
- Surface subtle: `#F8FAFC`
- Border: `#E5EAF2`
- Primary text: `#0F172A`
- Secondary text: `#64748B`
- Muted text: `#94A3B8`
- Primary blue: `#2563EB`
- Primary blue soft: `#EFF6FF`
- Success: `#16A34A`
- Success soft: `#F0FDF4`
- Warning: `#F59E0B`
- Warning soft: `#FFFBEB`
- Danger: `#EF4444`
- Danger soft: `#FEF2F2`
- Purple/info: `#8B5CF6`
- Purple soft: `#F5F3FF`

## 3.3. Typografia

Preferowany charakter:
- Inter / Geist / podobny nowoczesny grotesk.
- Nagłówek strony desktop: 28–32 px, semibold/bold.
- Podtytuł: 13–15 px, regular.
- Nagłówek sekcji: 16–18 px, semibold.
- Tekst bazowy: 13–14 px.
- Meta: 11–12 px.
- Liczby KPI: 24–30 px.
- Label KPI: 10–11 px uppercase lub small caps, ale bez nadmiernego letter-spacing.

### Rozmiary tekstu w ustawieniach

Mają działać logicznie:
- Mały = rzeczywiście najmniejszy.
- Średni = domyślny.
- Duży = rzeczywiście większy.
- Zakaz sytuacji, w której Średni jest największy, a Mały i Duży wyglądają tak samo.

## 3.4. Geometria

- bazowy grid: 8 px,
- promień kart: 14–16 px,
- promień przycisków/inputów: 10–12 px,
- promień badge/chip: 999 px,
- wysokość głównego inputu: 40–44 px,
- wysokość podstawowego buttonu: 40–44 px,
- desktop page gutters: 24–32 px,
- odstęp między głównymi blokami: 20–24 px,
- card padding: 16–20 px.

## 3.5. Cienie

Subtelne:
- karta standardowa: niemal płaska, 1 px border + lekki cień,
- hover: minimalne podniesienie,
- modal: mocniejszy shadow,
- zakaz wielkich rozmytych neonowych cieni.

## 3.6. Ikony

- jedna rodzina ikon,
- linia 1.5–2 px,
- 16–20 px w większości UI,
- ikona statusu ma semantyczny kolor,
- jedna funkcja = jedna semantyczna ikona,
- destrukcyjne akcje zawsze mają ten sam język danger,
- kalendarz przy polu daty: **jedna widoczna, klikalna ikona**, bez równoległej czarnej i pomarańczowej ikony.

---

# 4. Globalny shell

## 4.1. Desktop sidebar

### CURRENT

Aktualny sidebar ma 3 grupy.

#### Start pracy
1. Dziś
2. Leady
3. Klienci
4. Sprawy
5. Lejek

#### Czas i obowiązki
6. Zadania
7. Kalendarz
8. Szablony
9. Odpowiedzi
10. Aktywność

#### System
11. Inbox szkiców — `CONDITIONAL` zależnie od planu
12. Powiadomienia
13. Rozliczenia
14. Zgłoszenia
15. Admin AI — `CONDITIONAL` tylko admin
16. Ustawienia

### TARGET_VISUAL

Sidebar ma pozostać pełny, ale lekki:
- 220–240 px,
- logo/nazwa u góry,
- delikatne podpisy grup,
- aktywna pozycja jako jasnoniebieski pill/row,
- bez ciężkich separatorów,
- ikona + label,
- badge tylko jeśli naprawdę niesie informację,
- dół: access/trial card opcjonalnie + user card + wylogowanie.

### Nie upraszczać do 8 pozycji na finalnej mapie

Wcześniejsze grafiki koncepcyjne pokazywały skrócone menu. Finalny zestaw grafik ma uwzględniać **wszystkie aktualne główne zakładki**.

## 4.2. Mobile navigation

### CURRENT

Dolny pasek mobilny:
1. Dziś
2. Leady
3. Klienci
4. Sprawy
5. Zadania

Pozostałe moduły są dostępne przez mobile menu/drawer.

### TARGET_VISUAL

- bottom nav max 5 pozycji,
- aktywna ikona czytelna,
- label zawsze widoczny,
- pozostałe moduły w panelu „Więcej” / menu bocznym,
- nie ściskać wszystkich 16 pozycji do dolnej belki.

## 4.3. Global top area

Każdy ekran:
- tytuł,
- jednozdaniowy podtytuł,
- prawa strona: 1 primary CTA + max 1–2 secondary,
- globalne akcje nie mogą przepychać nagłówka na kilka linii na desktopie.

## 4.4. Right rail

Prawe panele mają być używane tylko gdy:
- wspierają bieżącą decyzję,
- pokazują status, priorytet, finanse, najbliższe akcje,
- nie duplikują centralnej kolumny.

Nie tworzyć right rail tylko po to, aby „zapełnić” ekran.

---

# 5. Wspólne komponenty do zachowania na wszystkich grafikach

## 5.1. Metric / shortcut card

Struktura:
- small label,
- duża wartość,
- opcjonalny helper,
- semantyczna ikona po prawej,
- klikalność tylko jeśli karta naprawdę filtruje/przenosi.

## 5.2. Search + filter toolbar

Kolejność:
1. search,
2. najważniejsze filtry,
3. „Więcej filtrów” jeśli potrzeba,
4. reset/wyczyść jako link/secondary action.

## 5.3. Record row

Każdy rekord:
- wyraźna tożsamość,
- max 1 główny status,
- meta w drugiej linii,
- akcja otwarcia po prawej,
- overflow menu tylko dla działań drugorzędnych.

## 5.4. Badge taxonomy

- blue = active/info,
- green = done/ready/paid,
- amber = waiting/warning,
- red = blocked/overdue/high risk/error,
- purple = special/AI/meeting/decision,
- gray = neutral/archived/no-data.

Nie używać koloru bez znaczenia.

## 5.5. Detail view

Domyślny ekran szczegółu:
- **podgląd**, nie formularz,
- czytelne informacje,
- status,
- next move,
- historia/notatki,
- quick actions,
- „Edytuj” jako jawny przycisk.

## 5.6. Modal

- jasny,
- jednoznaczny title,
- pola logicznie grupowane,
- footer zawsze: Anuluj + Primary action,
- danger confirm osobno,
- nie zasłaniać całego desktopu bez potrzeby.

## 5.7. Stany

Każdy screen ma mieć wersję:
- loading,
- empty,
- loaded,
- error,
- read-only / blocked by access jeśli dotyczy.

### Loading
Skeleton preferowany ponad ogromny spinner.

### Empty
Nie pisać „brak danych” bez kontekstu.
Dawać:
- co jest puste,
- dlaczego to normalne,
- co użytkownik może zrobić.

### Error
- prosta wiadomość,
- retry,
- bez debugowego stack trace w UI produkcyjnym.

---

# 6. Zestaw spójnych danych demonstracyjnych

Inny AI ma używać tych samych nazw między grafikami.

## Firmy / leady / klienci

| Firma | Główna osoba | Wartość | Status sprzedaży | Ryzyko | Następny krok |
|---|---|---:|---|---|---|
| ACME Sp. z o.o. | Jan Kowalski | 240 000 PLN | Oferta wysłana | Średnie | Prezentacja online |
| Beta Systems Sp. z o.o. | Piotr Wiśniewski | 150 000 PLN | Kwalifikacja | Niskie | Przygotowanie oferty |
| Tech Solutions S.A. | Marta Zielińska | 85 000 PLN | Skontaktowany | Średnie | Follow-up |
| Green Energy Sp. z o.o. | Kamil Zieliński | 320 000 PLN | Oferta wysłana | Niskie | Negocjacje |
| Kowalski i Partnerzy | Anna Kowalska | 45 000 PLN | Nowy | Wysokie | Pierwszy kontakt |
| Inwest Projekt Sp. z o.o. | Michał Stępień | 180 000 PLN | Follow-up | Średnie | Przedstawienie case study |
| Sunrise Media Sp. z o.o. | Tomasz Malec | 35 000 PLN | Nowy | Niskie | Weryfikacja potrzeb |
| Optima Finance Sp. z o.o. | Joanna Król | 210 000 PLN | Oferta wysłana | Średnie | Negocjacje |

## Przykładowe sprawy

| Sprawa | Klient | Kompletność | Stan |
|---|---|---:|---|
| Sprzedaż systemu ERP | ACME | 75% | Czeka na klienta / 2 blokery |
| Wdrożenie platformy HR | Beta Systems | 50% | Czeka na klienta |
| Migracja do chmury | Tech Solutions | 90% | Gotowa do startu |
| System CRM | Green Energy | 30% | Zablokowana |
| Automatyzacja procesów | Inwest Projekt | 60% | Czeka na akceptację |
| BI & Raportowanie | Retail Group | 100% | Gotowa do startu |

## Reguła dat

Na wszystkich grafikach jednego pakietu używać jednej daty „dzisiaj”, np.:
`14 maja 2026`.
Nie mieszać przypadkowo 2025/2026 w jednym pakiecie.

---

# 7. MASTER ROUTE / SCREEN INDEX

## Produkcyjne ekrany

| ID | Route | Ekran | Status | Sidebar |
|---|---|---|---|---|
| S01 | `/` | Dziś | CURRENT_CANONICAL | Dziś |
| S01A | `/today` | Dziś | ALIAS | — |
| S02 | `/leads` | Leady | CURRENT_CANONICAL | Leady |
| S03 | `/leads/:leadId` | Szczegół leada | CURRENT_CANONICAL | child |
| S04 | `/clients` | Klienci | CURRENT_CANONICAL | Klienci |
| S05 | `/clients/:clientId` | Szczegół klienta | CURRENT_CANONICAL | child |
| S06 | `/cases` | Sprawy | CURRENT_CANONICAL | Sprawy |
| S07 | `/cases/:caseId` | Szczegół sprawy | CURRENT_CANONICAL | child |
| S07A | `/case/:caseId` | Szczegół sprawy | ALIAS | — |
| S08 | `/funnel` | Lejek | CURRENT_CANONICAL | Lejek |
| S09 | `/tasks` | Zadania | CURRENT_CANONICAL | Zadania |
| S10 | `/calendar` | Kalendarz | CURRENT_CANONICAL | Kalendarz |
| S11 | `/templates` | Szablony | CURRENT_CANONICAL | Szablony |
| S11A | `/case-templates` | Szablony | ALIAS | — |
| S12 | `/response-templates` | Odpowiedzi | CURRENT_CANONICAL | Odpowiedzi |
| S13 | `/activity` | Aktywność | CURRENT_CANONICAL | Aktywność |
| S14 | `/ai-drafts` | Inbox szkiców | CONDITIONAL_PLAN | Inbox szkiców |
| S15 | `/notifications` | Powiadomienia | CURRENT_CANONICAL | Powiadomienia |
| S16 | `/billing` | Rozliczenia | CURRENT_CANONICAL | Rozliczenia |
| S17 | `/help` | Zgłoszenia | CURRENT_CANONICAL | Zgłoszenia |
| S17A | `/support` | Zgłoszenia | ALIAS | — |
| S18 | `/settings` | Ustawienia | CURRENT_CANONICAL | Ustawienia |
| S19 | `/settings/ai` | Admin AI | CONDITIONAL_ADMIN | Admin AI |
| S20 | `/portal/:caseId/:token` | Portal klienta | CURRENT_PUBLIC | brak |
| S21 | `/login` | Logowanie / Rejestracja | CURRENT_PUBLIC | brak |
| S21A | `/start` | Logowanie / Rejestracja | ALIAS | brak |
| S22 | `/privacy` | Polityka prywatności | CURRENT_PUBLIC | brak |
| S23 | `/terms` | Regulamin | CURRENT_PUBLIC | brak |

## Nie generować jako finalne produkcyjne grafiki

- `/dashboard` — LEGACY.
- `/dev/funnel` — LEGACY/DEV.
- `/ui-preview-vnext` — LEGACY/DEV.
- `/ui-preview-vnext-full` — LEGACY/DEV.

---

# 8. S01 — DZIŚ

**Route:** `/`
**Rola:** główne centrum dowodzenia operatora.
**Cel:** pokazać, co wymaga ruchu bez szukania po innych zakładkach.

## CURRENT

Konfigurowalne sekcje:
- `no_action`
- `risk`
- `waiting`
- `leads`
- `tasks`
- `events`
- `upcoming`
- `drafts`

Obsługuje:
- leady,
- zadania,
- wydarzenia,
- sprawy,
- klientów,
- szkice AI,
- akcje wykonania/edycji/usunięcia/odłożenia zgodnie z polityką.

## TARGET_VISUAL desktop

### Header
- `Dziś`
- subtitle: `Twoje centrum dowodzenia na dziś. Skup się na tym, co najważniejsze.`
- secondary: `Dostosuj widok`
- primary split action: `Dodaj`

### Górne KPI
1. Leady do ruchu dziś
2. Zadania na dziś
3. Sprawy czekające na klienta
4. Zablokowane sprawy
5. Gotowe do startu

### Główne sekcje
1. **Do ruchu dziś**
   - lead/firma,
   - powód,
   - priorytet,
   - termin,
   - action.
2. **Zaległe**
3. **Czekają na odpowiedź**
4. **Bez kolejnego kroku**
5. **Gotowe do startu**
6. **Przegląd tygodnia**
7. **Szybkie akcje**

### Mapowanie do CURRENT
- `Do ruchu dziś` = leady/risk/action-required.
- `Czekają na odpowiedź` = waiting.
- `Bez kolejnego kroku` = no_action.
- `Zaległe` = overdue tasks/events + overdue lead next move.
- `Przegląd tygodnia` = upcoming.
- `Inbox szkiców` może być małą sekcją tylko jeśli feature aktywny.

### Dostosuj widok
Modal / popover:
- checkboxy sekcji,
- reorder może być późniejszym UX; nie udawać drag&drop jeśli nie istnieje,
- akcje `Przywróć domyślne`, `Zapisz`.

## Mobile
- KPI w poziomym scrollu 2-up / 1-up,
- najważniejsze: Do ruchu dziś → Zaległe → Czekają → Bez kroku,
- Przegląd tygodnia jako kompaktowy accordion,
- Szybkie akcje jako bottom-sheet.

## Grafiki do wygenerowania
- `01_today_desktop_loaded.png`
- `01_today_mobile_loaded.png`
- `01_today_customize_view.png`
- `01_today_empty.png`

---

# 9. S02 — LEADY

**Route:** `/leads`
**Cel:** zarządzać etapem sprzedażowym, next stepem, ryzykiem i odzyskiwaniem kontaktów.

## CURRENT filtry / subwidoki

Quick filter:
- Wszystkie
- Aktywne
- Zagrożone
- Historia
- Do odzyskania

Dodatkowo:
- Kosz / archived,
- sortowanie po wartości,
- Contact Cadence Grid,
- brak kontaktu,
- brak następnej akcji,
- cisza 7/14+,
- duplicate conflict handling.

## TARGET_VISUAL

### Header
- `Leady`
- subtitle: `Zarządzaj procesem sprzedaży i domykaj kolejne kroki.`
- `Import CSV`
- primary `Dodaj leada`

### KPI
1. Wszystkie
2. Aktywne
3. Wartość
4. Zagrożone
5. opcjonalny kompaktowy chip `Do odzyskania` zamiast piątej wielkiej karty

### Search + filters
- search: nazwa / telefon / e-mail / firma / sprawa,
- Status,
- Źródło,
- Ryzyko,
- Kontakt / cisza,
- `Więcej filtrów`,
- reset.

### Main table/list
Kolumny:
- Firma / Lead
- Status
- Wartość
- Ryzyko
- Następny krok
- Ostatni kontakt
- Powiązana sprawa
- action menu

`Opiekun` pokazywać tylko jeśli faktycznie używany w aktywnym modelu workspace.

### Row badges
- Brak kontaktu
- Brak następnego kroku
- Cisza 7+
- Cisza 14+
- Do odzyskania

## Subview: Do odzyskania
- osobny filtered state,
- priorytet: krytyczne → wysokie → reszta,
- czytelne „dlaczego”,
- CTA `Ustaw kolejny krok`.

## Subview: Historia
- wygrane/przegrane/przeniesione do obsługi,
- nie mieszać z aktywnym pipeline.

## Subview: Kosz
- zarchiwizowane,
- restore,
- hard delete tylko jeśli przewiduje workflow.

## Modal: Dodaj leada
Na pierwszym planie:
- nazwa,
- źródło,
- wartość/potencjał,
- status,
- ostatni kontakt.

Dane dodatkowe:
- e-mail,
- telefon,
- firma,
- summary,
- notes.

### TARGET_EXTENSION zgodny z kierunkiem UX
Po utworzeniu leada dać szybkie:
- `Dodaj zadanie`
- `Ustaw kolejny krok`
bez ponownego szukania leada.

## Grafiki
- `02_leads_desktop_active.png`
- `02_leads_desktop_at_risk.png`
- `02_leads_desktop_rescue.png`
- `02_leads_mobile.png`
- `02_leads_create_modal.png`
- `02_leads_duplicate_conflict.png`
- `02_leads_trash.png`

---

# 10. S03 — SZCZEGÓŁ LEADA

**Route:** `/leads/:leadId`
**Cel:** prowadzić jednego leada bez walki z formularzem.

## Reguła UX

**Najpierw czytelny podgląd. Edycja dopiero po kliknięciu `Edytuj`.**

Nie otwierać strony jako ściany pól formularza.

## CURRENT funkcje

- status,
- kontakt,
- ostatni ruch,
- dni bez ruchu,
- najbliższa akcja,
- risk reason,
- notatki,
- activity/history,
- quick actions,
- task/event,
- missing items / Braki i blokady,
- płatność,
- start lead → case,
- `Rozpocznij obsługę`,
- `Otwórz sprawę`,
- migrated lead = historia sprzedaży, case = operacja.

## TARGET_VISUAL

### Header
- Back: `Leady`
- Nazwa + firma
- status sprzedaży
- wartość
- primary action zależny od stanu:
  - `Ustaw kolejny krok`
  - albo `Rozpocznij obsługę`
  - albo `Otwórz sprawę`
- secondary `Edytuj`
- overflow `...`

### Decision cards
1. Następny krok
2. Ostatni kontakt / dni ciszy
3. Ryzyko
4. Braki / blokady

### Lewa kolumna
- Dane kontaktowe
- Dane sprzedażowe
- Historia aktywności skrócona

### Środek
- Notatki
- Działania leada / open work
- nadchodzące ruchy

### Prawa kolumna
- Quick actions:
  - Zadzwoń
  - E-mail
  - Notatka
  - Zadanie
  - Spotkanie / wydarzenie
  - Brak
- Start realizacji / powiązana sprawa
- opcjonalnie finanse tylko jeśli istnieje relacja.

## Braki / blokady
Top card = summary.
`Dodaj brak` otwiera quick modal.
`Zobacz wszystkie braki` otwiera manager dialog.

## Prompt po wykonaniu kroku
Jeśli aktywny lead po zamknięciu działania nie ma next step:
- `Ustaw kolejny krok`
- `Przypomnij jutro`
- `Zostaw bez kroku`

To ma być lekkie, nie blokujące.

## Grafiki
- `03_lead_detail_active.png`
- `03_lead_detail_at_risk.png`
- `03_lead_detail_moved_to_case.png`
- `03_lead_detail_edit.png`
- `03_lead_detail_missing_manager.png`
- `03_lead_detail_next_step_prompt.png`
- `03_lead_detail_mobile.png`

---

# 11. S04 — KLIENCI

**Route:** `/clients`
**Cel:** widok relacji po sprzedaży; klient nie jest kopią leada.

## CURRENT subwidoki
- Wszystkie
- Bez sprawy
- Wymaga kontaktu
- Aktywna prowizja
- Archiwalne
- Contact Cadence Grid

## TARGET_VISUAL

### Header
- `Klienci`
- subtitle: `Relacje, aktywne sprawy i najbliższe ruchy.`
- primary `Dodaj klienta`

### KPI
- Wszyscy / aktywni
- Aktywne sprawy
- Wymaga kontaktu
- Aktywna prowizja / wartość relacji
- Archiwalni jako chip/filter

### Main list
Każdy klient:
- imię/nazwa + firma,
- kontakt,
- liczba aktywnych spraw,
- aktywna prowizja,
- lifetime earned,
- ostatni kontakt,
- najbliższa akcja,
- badges braku kontaktu/braku sprawy.

### Modal: nowy klient
- name,
- company,
- email,
- phone,
- last contact,
- notes,
- checkbox `Utwórz od razu sprawę`,
- nazwa sprawy.

## Grafiki
- `04_clients_desktop.png`
- `04_clients_needs_contact.png`
- `04_clients_archived.png`
- `04_clients_create_modal.png`
- `04_clients_mobile.png`

---

# 12. S05 — SZCZEGÓŁ KLIENTA

**Route:** `/clients/:clientId`
**Cel:** centrum relacji; praca operacyjna odbywa się głównie w sprawach.

## CURRENT
- relation command center,
- Ścieżka klienta,
- Następny ruch,
- Historia pozyskania / lead źródłowy,
- Sprawy aktywne,
- Sprawy zamknięte,
- Przywróć sprawę,
- Zadania klienta,
- Wydarzenia klienta,
- Aktywność klienta,
- Braki i blokady,
- finance summary,
- `+ Nowa sprawa dla klienta`.

## TARGET_VISUAL

### Header
- Klient + firma
- primary `Nowa sprawa`
- secondary `Edytuj`
- overflow

### Decision cards
1. Aktywne sprawy
2. Następny ruch
3. Finanse / prowizja
4. Braki / blokady

### Główne sekcje
- Dane klienta
- Ścieżka klienta
- Sprawy aktywne
- Ostatnie ruchy
- Historia pozyskania
- Sprawy zamknięte

### Right rail
- najbliższe działania,
- finance mini summary,
- quick actions: notatka/zadanie/wydarzenie/brak.

## Grafiki
- `05_client_detail_desktop.png`
- `05_client_detail_no_case.png`
- `05_client_detail_closed_cases.png`
- `05_client_detail_mobile.png`

---

# 13. S06 — SPRAWY

**Route:** `/cases`
**Cel:** operacyjny etap po sprzedaży — kompletność, blokady, realizacja i gotowość do startu.

## TARGET_VISUAL

### Header
- `Sprawy`
- subtitle: `Zarządzaj realizacją i kompletnością materiałów.`
- primary `Dodaj sprawę`

### KPI
1. Wszystkie
2. Czekają
3. Zablokowane
4. Gotowe do startu

### Search + filters
- wyszukaj sprawę lub klienta,
- status,
- blocker,
- klient,
- więcej filtrów,
- wyczyść.

### Main table
- Nazwa sprawy
- Klient
- Kompletność
- Checklista
- Czeka na klienta
- Blokery
- Gotowa do startu
- Ostatni ruch
- menu

### Row
- progress bar,
- licznik checklisty,
- powód oczekiwania,
- liczba blokerów,
- owner/ostatni ruch jako meta.

## Grafiki
- `06_cases_desktop.png`
- `06_cases_blocked.png`
- `06_cases_ready.png`
- `06_cases_mobile.png`
- `06_case_create_modal.png`

---

# 14. S07 — SZCZEGÓŁ SPRAWY

**Route:** `/cases/:caseId`

## CURRENT exact sub-tabs

1. `Obsługa`
2. `Checklisty`
3. `Historia`

Nie dodawać czwartej głównej zakładki bez osobnej decyzji.

## Header
- back `Sprawy`
- nazwa sprawy
- klient
- status operacyjny
- status gotowości / blocker
- action:
  - `Portal klienta`
  - `Edytuj`
  - overflow
- możliwość zamknięcia/przywrócenia jako action drugorzędna/destrukcyjna.

## Top decision strip
- Kompletność
- Braki / blokady
- Następny ruch
- Czeka na klienta / od ilu dni
- opcjonalnie finanse jako right rail zamiast piątej karty.

## 14.1. Podzakładka OBSŁUGA

### Cel
Codzienna praca.

Sekcje:
- Notatki
- Zadania
- Wydarzenia
- Braki / blokady
- Ostatnie ruchy

Quick actions:
- Dodaj notatkę
- Dodaj zadanie
- Dodaj wydarzenie
- Dodaj brak
- Wyślij przypomnienie
- Otwórz/skopiuj portal klienta

## 14.2. Podzakładka CHECKLISTY

- progress summary,
- wymagane vs opcjonalne,
- lista pozycji,
- typ:
  - plik,
  - tekst/odpowiedź,
  - decyzja,
  - akceptacja,
  - dostęp / inny zgodnie z source,
- status,
- deadline,
- requested from,
- actions verify/reject/accept,
- add item.

### State rows
- Brak
- Wysłano prośbę
- Dosłane / uploaded
- Do weryfikacji
- Do poprawy
- Zaakceptowane
- Nie dotyczy

## 14.3. Podzakładka HISTORIA

Timeline:
- status changes,
- notes,
- task/event changes,
- portal activity,
- client upload,
- decision,
- payments/finance events,
- close/reopen.

Bez technicznego JSON jako defaultowego widoku.

## Right rail: finanse
- wartość sprawy,
- prowizja,
- zapłacono,
- pozostało,
- płatności,
- koszty,
- historia płatności,
- korekta,
- dodaj płatność.

## Portal client action
- wygeneruj link,
- skopiuj link,
- revoke/regenerate,
- status portalu.

## Grafiki
- `07_case_detail_service.png`
- `07_case_detail_checklists.png`
- `07_case_detail_history.png`
- `07_case_detail_finance_modal.png`
- `07_case_detail_portal_link_modal.png`
- `07_case_detail_mobile.png`

---

# 15. S08 — LEJEK

**Route:** `/funnel`

## CURRENT model

To nie jest ciężki Kanban CRM.

Owner filters:
- Wszystkie rekordy
- Do ruchu teraz
- Bez następnego kroku
- Cisza 7+
- Wysokie ryzyko
- Pieniądze

Dodatkowo dynamiczny filtr etapu sprzedaży.

## TARGET_VISUAL

### Header
- `Lejek`
- subtitle: `Zobacz, gdzie sprzedaż wymaga decyzji i kolejnego ruchu.`

### KPI / decision tiles
- Do ruchu teraz
- Bez następnego kroku
- Cisza 7+
- Wysokie ryzyko
- Pieniądze

### Stage strip
- Nowy
- Skontaktowany
- Kwalifikacja
- Oferta wysłana
- Follow-up
- Wygrany
- Przegrany

### Main content
**Decyzyjna lista**, nie przeładowany drag&drop:
- firma,
- etap,
- ryzyko,
- dni ciszy,
- next move,
- wartość,
- CTA otwarcia.

### Sort
risk → brak kroku → cisza → wartość.

## Grafiki
- `08_funnel_default.png`
- `08_funnel_no_next_move.png`
- `08_funnel_high_risk.png`
- `08_funnel_mobile.png`

---

# 16. S09 — ZADANIA

**Route:** `/tasks`

## CURRENT scopes
- active
- today
- overdue
- done
- high
- unlinked

## CURRENT groups
- Zaległe
- Dziś
- Nadchodzące
- Bez terminu
- Zrobione

## TARGET_VISUAL tabs
1. Wszystkie aktywne
2. Dziś
3. Ten tydzień — `TARGET_EXTENSION`
4. Zaległe
5. Zrobione
6. Bez daty / Bez terminu

`Bez daty` i `Bez terminu` oznaczają ten sam logiczny bucket; w UI wybrać jedną nazwę, preferowane `Bez terminu`.

## Main table
- Zadanie
- Priorytet
- Termin
- Związane z
- Status
- actions

Nie pokazywać „Przypisany do” jeśli produkt pozostaje solo; może być `CONDITIONAL_TEAMS`.

## Right rail
- Priorytety
- Bez terminu
- Szybkie dodanie

## Create/edit modal
- title
- type
- relation lead/case/client
- date optional
- time optional
- priority
- status
- reminder
- recurrence

### Reguła daty
Zadanie może być bez daty.
Takie zadanie:
- jest widoczne w Tasks,
- nie jest pokazywane w Calendar,
- może później dostać termin.

### Next-step prompt
Po oznaczeniu powiązanego zadania jako done:
- jeśli lead/case wymaga dalszego ruchu, pokaż prompt.

## Grafiki
- `09_tasks_active.png`
- `09_tasks_this_week.png`
- `09_tasks_no_due.png`
- `09_tasks_overdue.png`
- `09_task_create_modal.png`
- `09_task_next_step_prompt.png`
- `09_tasks_mobile.png`

---

# 17. S10 — KALENDARZ

**Route:** `/calendar`

## CURRENT
- widok Tydzień
- widok Miesiąc
- density: compact/default/large
- task/event/lead-derived entries,
- create/edit,
- recurrence,
- reminder,
- conflict detection,
- Google Calendar inbound sync,
- completed entries pozostają widoczne, ale oznaczone.

## TARGET_VISUAL

### Header
- `Kalendarz`
- subtitle
- secondary: ustawienia / sync
- primary: `Dodaj`

### Left rail desktop
- mini miesiąc,
- `Nadchodzące`,
- opcjonalnie legenda.

### Main
- tabs `Tydzień`, `Miesiąc`
- `Dzień` może zostać pokazany tylko jako `TARGET_EXTENSION`, nie CURRENT.
- Dziś
- poprzedni/następny okres
- filtr.

### Week
Kolumny muszą jawnie pokazywać:
- Pon.
- Wt.
- Śr.
- Czw.
- Pt.
- Sob.
- Niedz.

Na mobile przy dodawaniu/edycji dnia tygodnia też ma być widoczny obok daty, np.:
`Pon, 18.08`.

### Month
- wpisy krótkie,
- bez nakładania tekstów,
- wybrany dzień pokazuje pełną listę poniżej/obok.

## Create/edit event
- Tytuł
- Typ
- Data
- Start
- Koniec
- Powiązanie
- Opis
- Status
- Cykliczność
- Przypomnienie

## Cykliczność

CURRENT korzysta z recurrence config.

TARGET_VISUAL:
- Brak
- Codziennie
- Co tydzień
- Co miesiąc
- Niestandardowo

Niestandardowo:
- wybór dni tygodnia,
- np. Pon, Wt, Czw,
- godzina,
- opcjonalny koniec / liczba powtórzeń.

Nie używać opcji typu „Piątek” jako zastępnika niestandardowej reguły.

## Przypomnienie

TARGET_VISUAL:
- Brak
- 10 min przed
- 30 min przed
- 1 h przed
- 1 dzień wcześniej
- Niestandardowo
- Cały dzień / utrzymuj alert do wykonania — jeśli wspierane przez typ elementu.

Lista reminderów powinna być logiczna względem terminu i recurrence:
- nie pokazywać absurdalnego „za tydzień” dla zadania na jutro jako domyślnej propozycji.

## Ikona daty
Jedna widoczna ikona kalendarza = klik otwiera picker.

## Grafiki
- `10_calendar_week.png`
- `10_calendar_month.png`
- `10_calendar_mobile_agenda.png`
- `10_calendar_create_modal.png`
- `10_calendar_custom_recurrence.png`
- `10_calendar_custom_reminder.png`

---

# 18. S11 — SZABLONY

**Route:** `/templates`

## Cel
Szablony checklist spraw.

## CURRENT metrics
- Szablony
- Pozycje
- Obowiązkowe
- Akceptacje

## Main
- search,
- list/card templates,
- name,
- item count,
- required count,
- preview items,
- actions:
  - Edytuj
  - Duplikuj
  - Usuń/archiwizuj.

## Modal: nowy/edycja
- Nazwa
- Pozycje checklisty
Dla pozycji:
- tytuł
- opis
- typ
- obowiązkowe
- kolejność

## Grafiki
- `11_templates_list.png`
- `11_template_editor.png`
- `11_templates_empty.png`
- `11_templates_mobile.png`

---

# 19. S12 — ODPOWIEDZI

**Route:** `/response-templates`

## Cel
Gotowe teksty odpowiedzi; osobne od checklist.

## CURRENT
Metrics:
- Szablony
- Kategorie
- Tagi
- Zmienne

Main:
- search,
- lista po lewej,
- sticky preview po prawej.

Actions:
- Kopiuj
- Edytuj
- Archiwizuj

Fields:
- Nazwa
- Kategoria
- Tagi
- Treść
- Zmienne

## TARGET_VISUAL
Zachować split-view:
- 40–45% lista,
- 55–60% podgląd,
- na mobile lista → detail.

## Grafiki
- `12_response_templates.png`
- `12_response_template_editor.png`
- `12_response_templates_mobile.png`

---

# 20. S13 — AKTYWNOŚĆ

**Route:** `/activity`

## CURRENT metrics
- Wszystkie
- Dzisiaj
- Leady
- Sprawy
- Zadania
- Wymaga uwagi

## CURRENT filters
- główny filter pill,
- Źródło,
- Typ,
- Relacja,
- Search.

## Row
- entity icon,
- status/severity,
- title,
- meta,
- relation,
- time,
- open,
- techniczne payload details — domyślnie schowane.

## TARGET_VISUAL
- grupować timeline: Dzisiaj / Wczoraj / data,
- nie pokazywać technical JSON bez rozwinięcia,
- right rail: ważne wydarzenia / ostatnie istotne zmiany.

## Grafiki
- `13_activity_timeline.png`
- `13_activity_attention.png`
- `13_activity_technical_expanded.png`
- `13_activity_mobile.png`

---

# 21. S14 — INBOX SZKICÓW

**Route:** `/ai-drafts`
**Status:** CONDITIONAL_PLAN

## Filters
- Wszystkie
- Do sprawdzenia
- Leady
- Zadania
- Wydarzenia
- Notatki
- Błędy
- Zatwierdzone
- Anulowane

## Typy wynikowe
- Lead
- Zadanie
- Wydarzenie
- Notatka

## TARGET_VISUAL
Desktop split:
- lewa: inbox szkiców,
- prawa: preview + form zatwierdzenia.

Każdy szkic:
- typ,
- źródło,
- status,
- raw preview,
- missing data,
- relation,
- created at.

Actions:
- Zatwierdź
- Edytuj
- Anuluj
- Usuń jeśli polityka pozwala.

### Zasada AI
AI przygotowuje szkic.
Zapis do danych biznesowych następuje dopiero po zatwierdzeniu.

## Grafiki
- `14_ai_drafts_inbox.png`
- `14_ai_draft_review.png`
- `14_ai_drafts_errors.png`
- `14_ai_drafts_mobile.png`

---

# 22. S15 — POWIADOMIENIA

**Route:** `/notifications`

## CURRENT exact filters
1. Wszystkie
2. Do reakcji
3. Zaległe
4. Dzisiaj
5. Nadchodzące
6. Odłożone
7. Przeczytane
8. Systemowe

## Rodzaje
- task
- event
- lead
- ai draft
- system

## Statusy
- do reakcji
- zaległe
- odłożone
- przeczytane
- wysłane
- błąd

## Actions
- Snooze
- Snooze custom
- Oznacz jako przeczytane
- Przywróć
- Otwórz powiązany rekord
- Oznacz wszystkie jako przeczytane
- ustawienia browser notifications.

## TARGET_VISUAL
- notification list,
- pill filters,
- badge count,
- right rail: kanały / status permission tylko jeśli potrzebne,
- severity musi być jednoznaczna.

## Grafiki
- `15_notifications_action.png`
- `15_notifications_snoozed.png`
- `15_notifications_system.png`
- `15_notifications_mobile.png`
- `15_notification_snooze_menu.png`

---

# 23. S16 — ROZLICZENIA

**Route:** `/billing`

## Ważna korekta względem wcześniejszej grafiki koncepcyjnej

Aktualny ekran nie jest pełnym modułem fakturowania.
Nie generować produkcyjnej funkcji `Nowa faktura`, jeżeli nie wynika z osobnego wdrożenia.

## CURRENT exact tabs
1. Plan / access
2. Settlements / rozliczenia

## 23.1. Podzakładka PLAN I DOSTĘP

- status access:
  - trial active,
  - trial ending,
  - trial expired,
  - paid active,
  - payment failed,
  - canceled.
- current plan
- trial end / next billing
- billing period
- plan cards
- feature matrix
- Stripe checkout
- cancel subscription
- resume
- refresh status.

### TARGET_VISUAL
- duża status card,
- current plan,
- trial/next payment,
- CTA zależne od stanu,
- plan comparison niżej,
- „dane zostają” przy blokadzie, bez czerwonej ściany.

## 23.2. Podzakładka ROZLICZENIA

- payment/settlement rows,
- status filters,
- relation to client/lead/case,
- kwota,
- data,
- status,
- linked object.

## Grafiki
- `16_billing_plan_trial.png`
- `16_billing_plan_paid.png`
- `16_billing_payment_failed.png`
- `16_billing_settlements.png`
- `16_billing_mobile.png`

---

# 24. S17 — ZGŁOSZENIA

**Route:** `/help`

## Rodzaje zgłoszeń
- Problem z aplikacją
- Sugestia poprawki
- Pytanie / pomoc

## Status filters
- Wszystkie
- Nowe
- W trakcie
- Odpowiedziano
- Zamknięte

## Layout
Desktop split:
- lewa: lista zgłoszeń + filtry/search,
- prawa/środek: wybrany ticket + thread/reply,
- compose może być panel/modal.

## Form
- rodzaj
- temat
- opis
- wysyłka.

Admin:
- może widzieć więcej zgłoszeń,
- reply,
- zmiana statusu.

## Grafiki
- `17_support_list.png`
- `17_support_ticket_detail.png`
- `17_support_new_ticket.png`
- `17_support_admin.png`
- `17_support_mobile.png`

---

# 25. S18 — USTAWIENIA

**Route:** `/settings`

## CURRENT techniczne taby
- Konto
- Powiadomienia
- Integracje
- Aplikacja
- Bezpieczeństwo
- Dane (`CONDITIONAL/HIDDEN` obecnie)

## TARGET_VISUAL — bardziej czytelny język subnav

Inny AI ma wygenerować ten bardziej użytkowy podział, ale zachować mapowanie do obecnej logiki:

1. **Konto**
2. **Obszar roboczy**
3. **Przypomnienia**
4. **Wygląd**
5. **Dostęp i rozliczenia**
6. **Integracje**
7. **Dane** — tylko gdy funkcja będzie wystawiona

### Mapowanie
- Konto → current account + część security.
- Obszar roboczy → workspace profile/company.
- Przypomnienia → current notifications/reminders.
- Wygląd → current app visual preferences.
- Dostęp i rozliczenia → access summary + link billing.
- Integracje → current integrations.
- Dane → current data, obecnie hidden.

## 25.1. Konto

- imię i nazwisko,
- e-mail,
- provider logowania,
- verified,
- ostatnie logowanie jeśli wspierane,
- zmień e-mail,
- hasło:
  - jeśli email/password: zmiana,
  - jeśli Google-only: jasno opisać brak lokalnego hasła i dostępne działanie,
- wyloguj wszystkie sesje.

## 25.2. Obszar roboczy

- nazwa workspace / firmy,
- timezone,
- language,
- currency jeśli istnieje,
- członkowie/role tylko jeśli product stage je wystawia.

## 25.3. Przypomnienia

- live notifications,
- browser notifications,
- permission status,
- default reminder,
- default snooze,
- digest tylko jeśli aktywny w produkcie,
- owner risk thresholds jeśli powinny być user-facing.

## 25.4. Wygląd

- Theme
- Font size:
  - Mały
  - Średni
  - Duży
- PWA / instalacja
- konflikty planowania / preferences.

## 25.5. Dostęp i rozliczenia

- plan,
- access status,
- trial/billing,
- CTA `Przejdź do rozliczeń`.

## 25.6. Integracje

### Google Calendar
States:
- plan disabled,
- not configured platform,
- disconnected,
- connecting,
- connected,
- sync enabled,
- sync error.

Controls:
- Połącz
- Synchronizuj
- Rozłącz
- reminder preference.

## 25.7. Bezpieczeństwo — logicznie jako część Konto/Dostęp
- email change,
- password reset/setup,
- sign out everywhere.

## 25.8. Dane
`CONDITIONAL/HIDDEN`
- export,
- delete account/workspace,
- import,
- privacy lifecycle.
Nie pokazywać jako gotowe, jeśli backend/flow nie jest zaakceptowany.

## Grafiki
- `18_settings_account.png`
- `18_settings_workspace.png`
- `18_settings_reminders.png`
- `18_settings_appearance.png`
- `18_settings_access.png`
- `18_settings_integrations_disconnected.png`
- `18_settings_integrations_connected.png`
- `18_settings_security_mobile.png`

---

# 26. S19 — ADMIN AI

**Route:** `/settings/ai`
**Status:** admin only.

## Screen
- Stan warstwy AI
- AI enabled/configured
- Quick Capture
- main provider
- draft TTL

Provider cards:
- Parser regułowy
- Gemini
- Cloudflare AI

Każdy:
- configured
- available
- model
- required env names (bez sekretów).

Security card:
- backend-only keys,
- ordinary user doesn't see config,
- AI creates draft, no direct write without approval.

## Non-admin state
Simple access denied card.

## Grafiki
- `19_admin_ai_configured.png`
- `19_admin_ai_missing_config.png`
- `19_admin_ai_denied.png`

---

# 27. S20 — PORTAL KLIENTA

**Route:** `/portal/:caseId/:token`
**Public, bez operator sidebar.**

## Cel
Klient ma wykonać 2–5 prostych rzeczy i wyjść.

## TARGET_VISUAL

### Header
- brand minimal,
- nazwa sprawy,
- krótka instrukcja,
- progress:
  - X/Y gotowe
  - completeness %

### Main sections
Preferowany podział:
1. `Potrzebujemy od Ciebie`
2. `Czeka na weryfikację`
3. `Gotowe`

### Item card
- tytuł,
- opis,
- Required badge,
- status,
- opcjonalny deadline,
- action.

Typy:
- Plik → `Wgraj plik`
- Tekst → `Odpowiedz`
- Decyzja → `Akceptuj` / `Odrzuć` lub wybór opcji

### Current security
- zabronione wpisywanie haseł/secrets,
- file max 10 MB,
- dozwolone kontrolowane typy plików,
- portal session/token.

## Portal modal: upload
- file picker/dropzone,
- filename/size,
- komentarz opcjonalny,
- Wyślij.

## Invalid token
- `Portal niedostępny`
- jasny powód,
- brak operator data.

## Grafiki
- `20_portal_client_default.png`
- `20_portal_client_pending_review.png`
- `20_portal_client_complete.png`
- `20_portal_upload_modal.png`
- `20_portal_text_response_modal.png`
- `20_portal_invalid_link.png`
- `20_portal_mobile.png`

---

# 28. S21 — LOGOWANIE / REJESTRACJA

**Route:** `/login`

## CURRENT sub-tabs
- Logowanie
- Rejestracja

## Login
- e-mail,
- hasło,
- `Zapomniałeś hasła?`
- `Zaloguj się`
- divider
- `Kontynuuj przez Google`

## Rejestracja
- imię i nazwisko,
- e-mail,
- hasło,
- `Utwórz konto`
- Google register option.

### TARGET_VISUAL owner notes
- usunąć techniczny/noisy tekst:
  `Wejdź przez Google albo e-mail i hasło. Dostęp zależy od statusu konta w bazie.`
- `Załóż konto / Rejestracja` ma być bardziej widoczne niż zwykły martwy link.
- ekran lekki, wiarygodny, bez wielkiego marketingowego landing page wokół formularza.

## Reset password
- osobny state/karta:
  - e-mail,
  - Wyślij link,
  - Wróć do logowania.

## Google webview blocked
- amber alert,
- `Otwórz w Chrome albo Safari`
- `Kopiuj link`.

## Grafiki
- `21_auth_login.png`
- `21_auth_register.png`
- `21_auth_reset.png`
- `21_auth_google_webview_blocked.png`
- `21_auth_mobile.png`

---

# 29. S22 / S23 — LEGAL

## `/privacy`
Produkcja:
- policy content,
- TOC jeśli długie,
- wersja/data,
- powrót do aplikacji.

## `/terms`
- Terms,
- TOC,
- data wejścia w życie.

## Visual
Nie robić „marketing page”.
Czytelny dokument prawny, max 760–900 px content width.

## Grafiki
- `22_privacy.png`
- `23_terms.png`

---

# 30. GLOBALNE OVERLAYS / MODALE DO ZMAPOWANIA

To są osobne grafiki/stany, choć nie są route'ami.

## O01 — Global Quick Actions
- Dodaj lead
- Dodaj klienta
- Dodaj sprawę
- Dodaj zadanie
- Dodaj wydarzenie
- szybki szkic jeśli feature aktywny

## O02 — Create/Edit Lead
patrz S02.

## O03 — Create/Edit Client
patrz S04.

## O04 — Create/Edit Case
- client,
- title,
- template,
- starter state.

## O05 — Task Create/Edit
patrz S09.

## O06 — Event Create/Edit
patrz S10.

## O07 — Note
- treść,
- relation,
- save.

## O08 — Brak / Blokada
- type,
- title,
- description,
- blocks progress,
- relation,
- deadline optional.

## O09 — Missing Items Manager
- active,
- blocker toggle,
- resolve,
- edit,
- delete.

## O10 — Next Step Prompt
- tomorrow,
- custom,
- leave without step.

## O11 — Duplicate Conflict
- found candidates,
- open existing,
- cancel,
- explicit `Dodaj mimo to`.

## O12 — Confirm Destructive
- clear title,
- impact,
- Cancel,
- destructive CTA.

## O13 — Case portal token
- generate,
- copy,
- revoke/regenerate.

## O14 — Payment
- add payment,
- history,
- correction,
- delete confirm.

## O15 — Template editor
patrz S11.

## O16 — Response template editor
patrz S12.

## O17 — Notification snooze
- 1h,
- jutro,
- custom.

## O18 — PWA install prompt
- compact,
- dismiss,
- install.

## O19 — Trial/access
- sidebar status card,
- expired read-only state,
- CTA to billing.

## O20 — Toasts
- success,
- warning,
- error,
- info.
Nie zasłaniać top controls.

---

# 31. REGUŁY PRZEPŁYWU LEAD → KLIENT → SPRAWA W GRAFIKACH

Aby makiety nie wyglądały jak trzy niezależne aplikacje:

## Lead
Sprzedaż:
- źródło,
- status,
- wartość,
- next step,
- last touch,
- risk.

## Won
Lead nie znika.
Na Lead Detail:
- `Rozpocznij obsługę`.

## Client
Jest relacją/osobą/firmą, nie „kolejnym statusem leada”.

## Case
Przejmuje operacyjne życie po sprzedaży:
- checklisty,
- braki,
- materiały,
- decyzje,
- aktywności,
- finanse,
- portal.

## Today
Agreguje oba światy:
- przed sprzedażą: lead movement,
- po sprzedaży: case blockers / ready state.

---

# 32. DODATKOWE ZASADY UX WYMAGANE W PRZYSZŁYCH GRAFIKACH

## 32.1. Podgląd encji przed edycją
Lead/task/note/case:
- kliknięcie rekordu ma najpierw pokazać czytelny widok,
- `Edytuj` osobno,
- nie rzucać usera od razu w form.

## 32.2. Zadanie/notatka bez daty
- dozwolone,
- widoczne w odpowiedniej liście,
- niewidoczne w kalendarzu do czasu przypisania daty.

## 32.3. Szybki task z leada
Na lead detail / lead row:
- `Dodaj zadanie`
- relation lead ustawiona automatycznie.

## 32.4. Weekday visibility
Na mobile i desktop:
- przy dacie widoczny dzień tygodnia.

## 32.5. Reminder logic
Opcje mają mieć sens względem terminu/recurrence.

## 32.6. Recurrence
Niestandardowe dni tygodnia + godzina.

## 32.7. Jedna calendar icon
Brak podwójnych ikon.

## 32.8. Forms progressive disclosure
Najważniejsze pola wyżej.
Reszta pod `Więcej opcji`.

---

# 33. FORMAT GENEROWANIA GRAFIK PRZEZ INNE AI

## Desktop

Preferowane:
- 1600 × 900 lub 1672 × 941,
- 16:9,
- pełny app shell,
- PNG lub WebP,
- bez przezroczystości,
- tekst w języku polskim.

## Mobile
- 390 × 844,
- ewentualnie 430 × 932 jako drugi wariant,
- bez sztucznego skalowania desktopu.

## Retina / implementation reference
Jeśli grafiki mają być potem używane jako dokładny reference:
- generować 2×,
- zachować jeden logiczny pixel grid.

---

# 34. NAZEWNICTWO ASSETÓW

Format:

`<NN>_<screen>_<variant>_<viewport>_v1.png`

Przykłady:
- `01_today_loaded_desktop_v1.png`
- `01_today_loaded_mobile_v1.png`
- `07_case_detail_checklists_desktop_v1.png`
- `18_settings_integrations_connected_desktop_v1.png`

Nie używać nazw:
- final-final2,
- new-ui,
- test3,
- poprawione,
- latest.

---

# 35. MINIMALNY KOMPLET GRAFIK PRODUKCYJNYCH

## P0 — konieczne
1. Dziś desktop + mobile
2. Leady desktop + mobile
3. Lead detail desktop + mobile
4. Klienci desktop
5. Client detail desktop
6. Sprawy desktop + mobile
7. Case detail: Obsługa
8. Case detail: Checklisty
9. Case detail: Historia
10. Zadania desktop + mobile
11. Kalendarz tydzień desktop + mobile
12. Kalendarz miesiąc
13. Ustawienia Konto
14. Ustawienia Przypomnienia
15. Ustawienia Integracje
16. Rozliczenia Plan
17. Portal klienta desktop + mobile
18. Logowanie
19. Rejestracja

## P1 — pełny system
20. Lejek
21. Szablony
22. Odpowiedzi
23. Aktywność
24. Inbox szkiców
25. Powiadomienia
26. Rozliczenia / settlements
27. Zgłoszenia
28. Admin AI
29. Legal privacy
30. Legal terms
31. wszystkie kluczowe modale z sekcji O01–O20.

---

# 36. PROMPT CONTRACT DLA AI GENERUJĄCEGO OBRAZY

Każdy prompt ma zawierać:

## A. Stały prefix

> Create a production-ready UI screen for the Polish SaaS application shown in the approved CloseFlow/Forteca Calm Light visual direction. Use a calm, light, premium operational SaaS aesthetic: white surfaces, very light gray canvas, subtle blue primary accents, soft rounded cards, thin borders, restrained shadows, precise sans-serif typography, excellent readability, realistic production data, and no placeholder copy. Preserve the exact navigation, screen purpose, sections, states, and Polish labels from CLOSEFLOW_UI_VISUAL_MASTER_SPEC_V1. Do not invent new modules or features.

## B. Screen block
AI ma dostać dokładnie sekcję jednego `Sxx`.

## C. Data block
Dostać tylko rekordy potrzebne do ekranu, ale z master dataset.

## D. Rendering rules
- no Lorem Ipsum,
- no fake „placeholder” text,
- no random English labels,
- no garbled Polish diacritics,
- no invented menu items,
- no duplicated icons,
- no UI control without a clear purpose,
- no fake chart if app does not have that metric.

## E. Consistency reference
Przy generowaniu kolejnych ekranów przekazywać:
- Dziś jako anchor,
- ostatnią zatwierdzoną grafikę tego samego modułu,
- ten plik jako source.

---

# 37. CHECKLISTA REVIEW KAŻDEJ WYGENEROWANEJ GRAFIKI

Przed akceptacją grafiki sprawdzić:

- [ ] Czy route/screen jest zgodny z master mapą?
- [ ] Czy sidebar pokazuje właściwe elementy i aktywną zakładkę?
- [ ] Czy nie zniknęła żadna ważna funkcja?
- [ ] Czy nie dodano funkcji nieistniejącej?
- [ ] Czy wszystkie napisy są po polsku?
- [ ] Czy nie ma placeholderów?
- [ ] Czy dane demonstracyjne są spójne z innymi grafikami?
- [ ] Czy primary CTA jest oczywiste?
- [ ] Czy ekran można zrozumieć w 10 sekund?
- [ ] Czy statusy mają spójne kolory?
- [ ] Czy ta sama akcja wygląda tak samo jak na innych ekranach?
- [ ] Czy detail view jest podglądem, a nie automatycznym edit form?
- [ ] Czy mobile pokazuje dzień tygodnia przy terminach?
- [ ] Czy element bez daty nie pojawił się w kalendarzu?
- [ ] Czy ikona kalendarza nie jest zdublowana?
- [ ] Czy nie zrobiono „ładnego wykresu” bez istniejącej funkcji?
- [ ] Czy brand `Forteca` jest traktowany jako mockup label, a nie finalna decyzja rynkowa?
- [ ] Czy grafika nie tworzy nowej, konkurencyjnej nawigacji?
- [ ] Czy wynik jest produkcyjnym UI, a nie wireframe?

---

# 38. RYZYKA, KTÓRE INNY AI MA ŚWIADOMIE OMIJAĆ

## Ryzyko 1 — zbyt uproszczony sidebar
Poprzednie koncepcje pokazywały tylko podstawowe 8 pozycji.
Finalne grafiki mają uwzględnić pełną mapę aktualnej aplikacji.

## Ryzyko 2 — wymyślone fakturowanie
Wcześniejsza koncepcja Rozliczeń zawierała faktury.
Aktualny route Billing jest przede wszystkim planem/access + settlements.
Nie traktować pełnego invoicingu jako istniejącej funkcji.

## Ryzyko 3 — wymyślony Kanban
Lejek jest obecnie decyzyjną listą, nie ciężkim drag&drop pipeline.

## Ryzyko 4 — brand lock
Forteca = kierunek mockupów, nie finalnie zatwierdzona nazwa.

## Ryzyko 5 — design system v2
Nie tworzyć nowego systemu tokenów obok istniejącego visual SOT.
Grafiki mają określić wygląd docelowy, a późniejszy etap techniczny ma go przeprowadzić przez istniejących właścicieli wizualnych.

## Ryzyko 6 — mieszanie CURRENT z TARGET_EXTENSION
Jeżeli element oznaczono `TARGET_EXTENSION`, grafika może go pokazać jako kierunek, ale implementujący AI musi dostać osobny etap techniczny przed zmianą runtime.

---

# 39. KOLEJNOŚĆ GENEROWANIA GRAFIK

Najpierw generować ekran bazowy i ustalić spójność:

1. Dziś
2. Leady
3. Lead Detail
4. Zadania
5. Kalendarz
6. Klienci
7. Client Detail
8. Sprawy
9. Case Detail — Obsługa
10. Case Detail — Checklisty
11. Case Detail — Historia
12. Lejek
13. Szablony
14. Odpowiedzi
15. Aktywność
16. Powiadomienia
17. Inbox szkiców
18. Rozliczenia
19. Ustawienia
20. Zgłoszenia
21. Portal klienta
22. Auth
23. Admin AI
24. Modale
25. Mobile pass dla wszystkich P0.

Po każdej partii 3–5 grafik zrobić consistency review przed kolejną partią.

---

# 40. DECYZJA KOŃCOWA TEGO DOKUMENTU

Ten plik jest **mapą do generowania grafik**, nie kontraktem implementacji kodu.

Nie wolno na jego podstawie automatycznie:
- przepisać runtime,
- zmienić route'ów,
- usunąć aktualnych funkcji,
- zmienić billing,
- zmienić dane,
- zmienić auth,
- zmienić model biznesowy,
- wdrożyć nowego brandu.

Po zaakceptowaniu kompletu grafik powinien powstać osobny, bounded etap techniczny:
1. porównanie grafika ↔ current runtime,
2. delta map per route,
3. mapowanie każdego concern do istniejącego Visual Source of Truth,
4. kolejność migracji komponentów,
5. desktop/mobile/browser proof,
6. dopiero wtedy implementacja.

---

# 41. SHORT HANDOFF DLA KOLEJNEGO AI

Jeżeli kolejny AI ma wygenerować grafiki, daj mu:
1. ten plik,
2. zatwierdzoną grafikę `Dziś` jako anchor,
3. polecenie:
   - wygeneruj tylko wskazany `Sxx`,
   - nie zmieniaj innych ekranów,
   - zachowaj 100% nawigacji i copy contract,
   - nie dodawaj funkcji spoza `CURRENT`/jawnie wskazanego `TARGET_EXTENSION`,
   - pokaż finalny produkcyjny UI, nie wireframe.

Jeżeli kolejny AI ma implementować grafiki:
- nie wystarczy ten plik;
- musi zacząć od aktualnego repo, jego visual SOT i osobnego zaakceptowanego stage contractu.
