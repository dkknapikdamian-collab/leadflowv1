# FAZA 1 — Etap 1.1 — Prawda produktu w UI/copy/legal

## Cel

Aplikacja nie może obiecywać funkcji, które nie są aktywne, skonfigurowane albo sprawdzone. Ten etap ustawia jednoznaczny język dla UI, copy i dokumentów release.

## Statusy prawdy produktu

Każda funkcja opisywana w UI lub dokumentacji musi mieć jeden z poniższych statusów:

| Status | Znaczenie | Jak pisać w UI |
|---|---|---|
| `active` | Działa w aktualnym buildzie i można ją sprawdzić ręcznie. | Dostępne / Aktywne |
| `requires_config` | Kod istnieje, ale funkcja wymaga env, providera albo konfiguracji. | Wymaga konfiguracji |
| `beta` | Funkcja działa częściowo albo jest świadomie ograniczona. | Beta / Szkic do sprawdzenia |
| `coming_soon` | Nie traktować jako gotowe. | W przygotowaniu |
| `disabled_by_plan` | Funkcja nie jest dostępna w danym planie albo nie wolno jej obiecywać. | Niedostępne w tym planie |
| `internal_only` | Widoczne tylko adminowi/operatorowi, nie użytkownikowi końcowemu. | Tylko admin / wewnętrzne |

## Decyzje dla obecnego release

| Obszar | Status | Prawdziwy komunikat | Zakazany komunikat |
|---|---|---|---|
| Lead → klient → sprawa | `active` | Aktywny workflow sprzedażowo-operacyjny. | Pełna automatyzacja obsługi bez testu manualnego |
| Stripe / BLIK | `requires_config` | Płatności wymagają konfiguracji Stripe i webhooka w środowisku produkcyjnym. | Subskrypcje gotowe produkcyjnie bez env i webhooka |
| Poranny digest | `requires_config` | Digest wymaga konfiguracji mail providera i adresu nadawcy. | Wysłaliśmy e-mail, jeśli API/provider tego nie potwierdził |
| Google Calendar | `coming_soon` | Integracja Google Calendar jest w przygotowaniu i wymaga OAuth. | Google Calendar connected / sync active |
| AI | `beta` | AI przygotowuje szkic albo odpowiedź na podstawie danych aplikacji. Zapis wymaga potwierdzenia użytkownika. | AI saved / AI automatycznie zapisało rekord |
| PWA | `active` | To aplikacja webowa możliwa do dodania do ekranu głównego. | Natywna aplikacja App Store / Google Play |
| Security / SOC | `disabled_by_plan` | Nie składamy publicznych claimów bez dowodu. | SOC 2 certified / SOC2 certified |
| Admin AI | `internal_only` | Diagnostyka AI jest tylko dla admina. | Widoczne dla każdego użytkownika |

## Zmienione elementy UI/copy

- Billing: Pro/AI nie mówią już, że Google Calendar jest gotowym syncem. Pokazują przygotowanie / wymóg OAuth.
- Billing: AI opisane jako Beta i szkice do ręcznego zatwierdzenia.
- Billing: digest i raporty mailowe opisane jako wymagające konfiguracji, a nie bezwarunkowo dostępne.
- Settings: digest e-mail opisany jako wymagający mail providera i konfiguracji, nie jako pewna wysyłka.
- Admin AI: utrzymany język, że AI przygotowuje szkic, a zapis następuje dopiero po potwierdzeniu.

## Kryterium zakończenia

Etap 1.1 jest zakończony, gdy:

- istnieje `src/lib/product-truth.ts`,
- istnieje ten dokument,
- `Billing.tsx`, `Settings.tsx` i `AdminAiSettings.tsx` nie składają fałszywych obietnic dla AI, Stripe, digestu i Google Calendar,
- jest lekki guard `check:faza1-etap11-ui-copy-legal-truth`,
- build przechodzi.

## Co przechodzi do Etapu 1.2

Etap 1.2 ma dodać mocniejsze guardy:

- `scripts/check-ui-truth-claims.cjs`,
- `scripts/check-public-security-claims.cjs`,
- `scripts/check-integration-status-copy.cjs`,
- `npm run check:ui-truth`.

Etap 1.1 nie ma jeszcze łapać każdego możliwego tekstu w repo. Ma ustawić prawdę produktu i poprawić najbardziej ryzykowne claimy w UI.
