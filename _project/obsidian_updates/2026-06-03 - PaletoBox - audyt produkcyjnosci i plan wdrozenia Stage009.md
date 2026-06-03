# PaletoBox - audyt produkcyjnosci i plan wdrozenia Stage009

Data: 2026-06-03
Repo: `dkknapikdamian-collab/paletobox`
Branch: `main`
Local path: `C:\Users\malim\Desktop\biznesy_ai\paletobox`
Status zapisu: plik w repo do wdrozenia/przeniesienia do Obsidiana

---

## Routing

- nazwa / alias wejsciowy: Paletobox / PaletoBox
- entity_id: `DO_POTWIERDZENIA`
- workspace_id: `DO_POTWIERDZENIA`
- project_id: `paletobox_001` candidate
- idea_id: `DO_POTWIERDZENIA`
- report_id: `PB-AUDIT-2026-06-03` / `DO_POTWIERDZENIA`
- canonical_name: `PaletoBox`
- aliases:
  - Paletobox
  - PaletoBox
  - aplikacja do rezerwacji skrytek
  - wynajem boksow / skrytek
- normalized_aliases:
  - paletobox
  - paleto box
  - rezerwacja skrytek
  - wynajem boksow
- folder Obsidiana: `DO_POTWIERDZENIA`
- mapa glowna / pulpit: `DO_POTWIERDZENIA`
- mapa zaleznosci: `DO_POTWIERDZENIA`
- sciaga plikow: `DO_POTWIERDZENIA`

---

## Teza audytu

PaletoBox nie jest jeszcze produkcyjny.

Aplikacja ma juz sensowny rdzen:

- publiczny katalog,
- wybor lokalizacji / modulu / skrytki,
- wybor terminu,
- pakiet wielu skrytek,
- checkout order,
- Stripe Checkout session,
- Stripe webhook,
- panel admina,
- e-maile,
- szkic dokumentow po platnosci.

Produkcyjnie blokuja ja jednak:

- brak twardego zamkniecia rezerwacji po platnosci,
- ryzyko podwojnej rezerwacji,
- mock fallback w produkcji,
- niedomkniete role admina,
- niepelne dokumenty prawne,
- za slaby verify produkcyjny,
- brak pelnego monitoringu bledow,
- rozjechany status repo / README / `_project/status.md` wzgledem aktualnego etapu.

Poziom przekonania: 8/10.

Uwaga: audyt byl statyczny na podstawie repo. Nie uruchomiono runtime, Vercel, Supabase ani Stripe CLI.

---

## Fakty z repo

### Co jest juz wdrozone

1. Projekt jest realnym Next/Supabase/Stripe projektem, nie tylko prototypem.
2. `package.json` ma `paletobox`, skrypty `dev`, `build`, `start`, `typecheck`, `verify`, zaleznosci od Supabase, Next, React i Stripe.
3. Publiczna strona czyta dane przez `getPublicPaletoBoxData()`.
4. Adapter publiczny umie czytac `locations`, `modules`, `public_reservations` z Supabase.
5. Adapter publiczny ma fallback do mockow.
6. `BoxCard` liczy dostepnosc, pokazuje wolne/zajete i prowadzi do `/reserve`.
7. `/reserve` obsluguje lokalizacje, modul, skrytke, daty i presety `3m`, `1y`, `5y`.
8. Flow rezerwacji pozwala zaznaczyc wiele skrytek jako jeden pakiet.
9. API `/api/checkout-orders` waliduje dane klienta, zgody prawne, zakazane pola typu PESEL, dostepnosc skrytek i tworzy zamowienie.
10. Endpoint Stripe tworzy sesje, zapisuje `stripe_checkout_session_id` i zmienia zamowienie na `payment_pending`.
11. Webhook Stripe oznacza checkout order jako `paid`, odpala potwierdzenie platnosci, powiadomienie operatora i plan dokumentow.
12. `/admin` i `/admin/*` sa chronione przez Supabase Auth proxy.
13. Panel admina ma kokpit checkout orders, dokumenty, historie eventow, przygotowanie dostepu i wysylke instrukcji dostepu.
14. Instrukcja dostepu wymaga akcji operatora i nie jest wysylana slepo po samej platnosci.
15. E-maile obsluguja m.in. potwierdzenie platnosci i instrukcje dostepu.
16. Dokumenty sa zaplanowane, ale PDF binary generation nie jest jeszcze wlaczone.

---

## Decyzje Damiana / aktywne zasady

- Kazda zmiana produkcyjna musi miec guard albo test regresyjny.
- Pracujemy etapami.
- Preferowany tryb wdrozenia: ZIP lokalny -> polecenie PowerShell -> testy -> osobny push po akceptacji.
- Nie uzywac `git add .`.
- Nie dokladac ladnych ekranow przed domknieciem pieniedzy, rezerwacji, dokumentow, praw i bezpieczenstwa.
- Publiczna aplikacja nie moze pokazywac falszywych danych w produkcji.
- Dostep do boksu nie moze byc wydany automatycznie bez operatora, jezeli fizyczny proces nie jest gotowy.

---

## Najwieksze blokery produkcji - P0

### P0.1 - Wylaczyc mock fallback w produkcji

Obecny problem:

- Publiczny adapter wraca do mockow, gdy Supabase nie jest skonfigurowany, zwroci blad albo ma puste dane.

Ryzyko:

- Klient moze zobaczyc falszywe boksy, falszywe ceny albo falszywa dostepnosc.
- To moze doprowadzic do sprzedazy czegos, czego realnie nie ma.

Wdrozyc:

- `ALLOW_PUBLIC_MOCK_FALLBACK=false` dla produkcji.
- Produkcyjny fail-closed: komunikat „chwilowo niedostepne” zamiast mockow.
- Guard: build/test ma failowac, jezeli produkcyjny env pozwala na mock fallback.
- Osobny tryb demo tylko lokalnie.

Test:

- Ustawic production env bez Supabase / z pustymi danymi.
- Strona nie moze pokazac mockow.
- Ma pokazac bezpieczny stan niedostepnosci.

---

### P0.2 - Atomowe zamkniecie rezerwacji po platnosci

Obecny problem:

- Webhook oznacza `checkout_orders` jako `paid` i odpala artefakty.
- Trzeba potwierdzic/dowiezc twardy krok: po platnosci utworz finalna rezerwacje, zablokuj skrytki, zapisz okres najmu i zaktualizuj dostepnosc atomowo.

Ryzyko:

- Dwoch klientow moze oplacic te sama skrytke na ten sam termin.

Wdrozyc:

- Transakcyjna funkcje Supabase RPC, np. `confirm_paid_checkout_order(order_id, stripe_session_id)`.
- Unikalny/wykluczajacy constraint na `locker_code + date range`.
- Blokade overlapu dat po stronie DB, nie tylko w React.
- Statusy:
  - `checkout_order.paid`,
  - `reservation_created`,
  - `access_prepared`,
  - `access_instruction_sent`,
  - `active`,
  - `finished/cancelled/blocked`.
- Idempotencje webhooka.

Test:

- Dwa checkouty na ta sama skrytke i termin.
- Tylko jeden moze wygrac.
- Drugi musi dostac bezpieczny status konfliktu.

---

### P0.3 - Naprawic naliczanie okresu najmu

Obecny problem:

- API parsuje `rentalPeriod` tekstowo i bierze pierwsza liczbe.
- Dla `1 rok` istnieje ryzyko policzenia 1 miesiaca zamiast 12 miesiecy.

Ryzyko:

- Bledna cena.
- Realna strata pieniedzy.
- Problem prawny i reklamacyjny.

Wdrozyc:

- Nie wysylac tekstowego `rentalPeriod` jako zrodla prawdy.
- Wysylac `rentalMonths: 3 | 12` albo liczyc po stronie serwera z `startDate/endDate`.
- Backend musi blokowac `5 lat` jako manual/operator review.
- Backend musi ignorowac/odrzucac zmanipulowane `amountCents` z frontu.

Test:

- `3m = 3 miesiace`.
- `1y = 12 miesiecy`.
- `5y = blocked/manual`.
- Direct API attack z `amountCents=1` nie przechodzi.

---

### P0.4 - RBAC dla admina

Obecny problem:

- Admin jest chroniony logowaniem, ale trzeba domknac role i uprawnienia.

Ryzyko:

- Kazdy zalogowany uzytkownik Supabase moze potencjalnie wejsc do panelu, jesli nie ma twardej allowlisty/roli.

Wdrozyc:

- Tabela `staff_profiles`.
- Role: `owner`, `manager`, `operator`, `support`.
- Allowlista kont admina.
- RLS i server action guards per rola.
- Uprawnienia do:
  - platnosci,
  - dostepow,
  - umow,
  - zespolu,
  - ustawien.

Test:

- User bez roli nie wejdzie do `/admin`.
- User bez roli nie wykona server action.
- Operator nie moze zmieniac team/settings.

---

### P0.5 - Produkcyjny verify

Obecny problem:

- `npm run verify` jest za slaby wzgledem obecnego zakresu aplikacji.

Wdrozyc `npm run verify:production`:

- env validation,
- no mock fallback in production,
- checkout pricing,
- Stripe session,
- webhook idempotency,
- paid order -> reservation lock,
- email outbox,
- admin access prepared,
- RBAC,
- mojibake guard,
- RLS/GRANT guard.

---

### P0.6 - Dokumenty prawne

Obecny problem:

- Dokumenty sa zaplanowane, ale nie ma pelnego produkcyjnego generatora PDF i prawnego finalu.

Wdrozyc:

- Regulamin uslugi.
- Umowe najmu/przechowania - do decyzji prawnej.
- Polityke prywatnosci.
- Klauzule RODO.
- Wersjonowanie dokumentow.
- Snapshot zaakceptowanych warunkow.
- PDF dla klienta.
- Kopie w storage.
- Akceptacje prawnika przed realnym uruchomieniem sprzedazy.

---

## Wazne braki - P1

1. Strona sukcesu i anulowania platnosci.
2. Pelny lifecycle rezerwacji po platnosci.
3. Realny proces przygotowania i wydania dostepu.
4. Produkcyjna konfiguracja Resend i retry failed maili.
5. Faktury / eksport ksiegowy.
6. Zwroty, anulacje, reklamacje.
7. Zakazane rzeczy i odpowiedzialnosc w regulaminie.
8. Monitoring i alarmy.
9. Ukrycie/dowiezienie fikcyjnych modulow w adminie.
10. Aktualizacja README i `_project/status.md`.

---

## Minimalny zakres aplikacji tego typu

Aplikacja PaletoBox powinna miec minimum:

- publiczna strone z realna dostepnoscia,
- wybor lokalizacji, modulu, konkretnej skrytki i terminu,
- cene liczona po stronie serwera,
- platnosc,
- blokade skrytki po platnosci,
- umowe/regulamin/polityke prywatnosci,
- e-mail z potwierdzeniem platnosci,
- osobny e-mail z instrukcja dostepu po akcji operatora,
- panel admina z rolami,
- historie dzialan,
- rezerwacje i statusy,
- obsluge zwrotow/anulacji,
- monitoring bledow,
- brak mockow w produkcji,
- guardy na platnosci, dostepnosc, RLS, maile i dokumenty.

---

## Najkrotszy test produkcyjnosci

1. Utworz jedna lokalizacje, jeden modul, dwie skrytki.
2. Zrob rezerwacje na 3 miesiace.
3. Zrob rezerwacje na 1 rok i sprawdz, czy cena = 12 miesiecy, nie 1 miesiac.
4. W dwoch oknach sprobuj oplacic ta sama skrytke na ten sam termin.
5. Stripe webhook ma oznaczyc tylko jedno zamowienie jako skutecznie zarezerwowane.
6. Admin ma zobaczyc paid order.
7. Operator ma oznaczyc dostep jako przygotowany.
8. Dopiero wtedy klient dostaje instrukcje.
9. E-mail i dokument maja byc zapisane w systemie.
10. Publiczna strona ma pokazac skrytke jako niedostepna w tym terminie.

Jesli ktorykolwiek punkt peka, aplikacja nie jest produkcyjna.

---

## Kolejnosc wdrozenia etap po etapie

### Stage009A - mapa prawdy i status repo

Cel:

- Naprawic status projektu, README, `_project/status.md`, current stage, next step i liste wdrozonych etapow.
- Dodac `verify:production` jako kontrakt, nawet jesli czesc checkow bedzie narazie failowac z jasnym komunikatem.

Zakres:

- README.
- `_project/status.md`.
- `_project/04_DECISIONS.md`, jesli istnieje.
- `_project/07_NEXT_STEPS.md`, jesli istnieje.
- Nowy raport run.
- Guard zgodnosci stage ledger.

Czego nie ruszac:

- Stripe runtime.
- Supabase schema.
- Public UI.
- Admin UI poza linkiem do statusu, jesli bedzie potrzebny.

Testy:

- `npm run typecheck`
- `npm run build`
- nowy guard statusu / ledgeru

Status: pierwszy etap do wdrozenia.

---

### Stage009B - no mock fallback in production

Cel:

- W produkcji nie wolno pokazywac mockow.

Zakres:

- `src/lib/paletobox-public-data.ts`
- env validation
- guard produkcyjny
- bezpieczny publiczny fallback UI

Testy:

- production env + Supabase missing => no mock data
- local/demo env => mock fallback dozwolony

---

### Stage009C - pricing i rental period hardening

Cel:

- Naprawic i uszczelnic naliczanie ceny i okresu najmu.

Zakres:

- `src/app/api/checkout-orders/route.ts`
- frontend payload rezerwacji
- guardy pricingowe

Testy:

- 3 miesiace
- 1 rok = 12 miesiecy
- 5 lat = blocked/manual
- direct API attack z zanizona cena

---

### Stage009D - paid order -> real reservation lock

Cel:

- Po platnosci atomowo stworzyc finalna rezerwacje i zablokowac skrytki.

Zakres:

- Supabase migration
- RPC
- webhook Stripe
- public availability
- admin checkout orders

Testy:

- race condition double checkout
- idempotent webhook
- paid without reservation alert

---

### Stage009E - RBAC admina

Cel:

- Role i uprawnienia dla panelu admina.

Zakres:

- `staff_profiles`
- proxy/admin guards
- server action guards
- panel team/settings

Testy:

- no role blocked
- operator limited
- owner full access

---

### Stage009F - legal/documents v1

Cel:

- Produkcyjny pakiet prawny i dokumenty.

Zakres:

- regulamin
- polityka prywatnosci
- umowa
- snapshot zgody
- PDF/storage

Testy:

- kazde zamowienie ma wersje dokumentow
- PDF zapisany
- e-mail ma link/zalacznik wedlug decyzji

---

### Stage009G - observability

Cel:

- Nie zgubic bledow w platnosciach, mailach, dokumentach i dostepach.

Zakres:

- alerty
- admin risk queue
- failed webhook/email/docs
- paid order without reservation
- paid order without access prepared after X godzin

---

## Rekomendacja operacyjna

Najlepszy nastepny etap:

1. Stage009A - porzadek statusu repo i mapa prawdy.
2. Stage009B - no mock fallback in production.
3. Stage009C - pricing/rental period hardening.

Dopiero potem Stage009D, czyli najciezszy i najwazniejszy etap: atomowa rezerwacja po platnosci.

Nie warto teraz dodawac kolejnych zakladek ani ladnych widokow. Najpierw trzeba zamknac ryzyko pieniedzy, dostepnosci, praw i bezpieczenstwa.

---

## Zapis do Obsidiana

- nazwa / alias wejsciowy: Paletobox / PaletoBox
- entity_id: `DO_POTWIERDZENIA`
- workspace_id: `DO_POTWIERDZENIA`
- project_id: `paletobox_001` candidate
- idea_id: `DO_POTWIERDZENIA`
- report_id: `PB-AUDIT-2026-06-03` / `DO_POTWIERDZENIA`
- canonical_name: `PaletoBox`
- folder Obsidiana: `DO_POTWIERDZENIA`
- mapa glowna / pulpit: `DO_POTWIERDZENIA`
- mapa zaleznosci: `DO_POTWIERDZENIA`
- sciaga plikow: `DO_POTWIERDZENIA`
- typ wpisu: raport AI / audyt produkcyjnosci / ryzyka / next step / plan wdrozenia
- docelowa sciezka w Obsidianie: `DO_POTWIERDZENIA/2026-06-03 - PaletoBox - audyt produkcyjnosci i plan wdrozenia Stage009.md`
- status zapisu: przygotowano w repo jako `_project/obsidian_updates/2026-06-03 - PaletoBox - audyt produkcyjnosci i plan wdrozenia Stage009.md`
- repo: `dkknapikdamian-collab/paletobox`
- branch: `main`
- local path: `C:\Users\malim\Desktop\biznesy_ai\paletobox`
- testy: audyt statyczny; runtime nie uruchamiany
- czego nie ruszano: kod aplikacji, baza, env, produkcja
- nastepny krok: wdrozyc Stage009A w trybie paczka ZIP -> PowerShell -> testy -> osobny push po akceptacji
