# STAGE180 — Support jako Zgłoszenia lokalnie

## Cel etapu
Przebudować zakładkę `/help` z ogólnej „Pomoc” na operacyjne „Zgłoszenia”: problem z aplikacją, sugestia poprawki albo pytanie/pomoc. Formularz ma być widoczny również dla admina/operatora lokalnego, a nie tylko dla zwykłego użytkownika.

## Routing
- canonical_name: CloseFlow / LeadFlow
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
- tryb: lokalny ZIP, bez pushu
- Obsidian folder: DO_POTWIERDZENIA / zgodnie z mapą CloseFlow w vault

## Fakty z kodu
- `/help` i `/support` prowadzą do `SupportCenter`.
- Sidebar miał etykietę `Pomoc`.
- Nagłówek strony `support` miał tytuł `Pomoc`.
- Formularz zgłoszeń był renderowany tylko gdy `!isAdmin`, więc lokalny operator/admin widział głównie status zgłoszeń i pustą listę.

## Decyzje Damiana
- Pracujemy lokalnie.
- Zakładka ma być bardziej „Zgłoszenia” niż ogólna „Pomoc”.
- Musi być możliwość wysłania zgłoszenia do administratora/supportu.
- Typ zgłoszenia ma być jasny: problem z aplikacją, sugestia poprawki, pytanie/pomoc.
- Widok ma pasować do obecnego stylu aplikacji i nie rozjeżdżać jednego źródła prawdy wizualnego.

## Zakres zmian
- `src/pages/SupportCenter.tsx`
  - rozdzielenie typu tworzonego zgłoszenia od filtra listy,
  - formularz widoczny także dla admina/operatora,
  - kategorie: Problem z aplikacją, Sugestia poprawki, Pytanie / pomoc,
  - sekcja „Sugerowane zgłoszenia”,
  - prawy panel z instrukcją dobrego zgłoszenia,
  - lista zgłoszeń domyślnie pokazuje wszystkie typy, a nie tylko aktywną kategorię formularza.
- `src/components/Layout.tsx`
  - etykieta menu: `Zgłoszenia` zamiast `Pomoc`.
- `src/components/CloseFlowPageHeaderV2.tsx`
  - nagłówek: `ZGŁOSZENIA` / `Zgłoszenia`.
- `src/styles/visual-stage17-support-vnext.css`
  - drobne uzupełnienie stylu dla klikanej hero-karty i prawego panelu.
- `scripts/check-stage180-support-requests-page.cjs`
  - guard kontraktu widoku zgłoszeń.

## Czego nie ruszano
- Supabase schema i migracje.
- API support requests.
- RLS i uprawnienia.
- Routing `/help` i `/support` poza copy/etykietą.
- Deployment i push do GitHuba.

## Testy automatyczne
Po aplikacji ZIP-a:

```powershell
node scripts/check-stage180-support-requests-page.cjs
npm run build
```

## Testy ręczne
1. Wejdź lokalnie na `/help`.
2. Sprawdź, czy w sidebarze jest `Zgłoszenia`.
3. Sprawdź, czy nagłówek strony mówi `Zgłoszenia`.
4. Sprawdź, czy formularz jest widoczny na koncie admin/operator.
5. Kliknij każdy typ: Problem z aplikacją, Sugestia poprawki, Pytanie / pomoc.
6. Kliknij gotowe sugestie po prawej i sprawdź, czy uzupełniają temat/opis tylko gdy pola są puste.
7. Wyślij testowe zgłoszenie lokalnie, jeśli środowisko Supabase jest podpięte.
8. Sprawdź, czy lista zgłoszeń pokazuje wszystkie typy domyślnie i czy filtry działają.

## Następny krok
Po potwierdzeniu UI lokalnie: zdecydować, czy zamykamy etap w ZIP batchu, czy dopiero po większej paczce robimy wspólny push.
