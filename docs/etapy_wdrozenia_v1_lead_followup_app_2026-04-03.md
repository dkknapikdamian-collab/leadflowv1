# Etapy wdrożenia V1 — aplikacja lead follow-up + kalendarz + przypomnienia

**Data:** 2026-04-03  
**Status:** plan wdrożenia dla AI dewelopera  
**Cel dokumentu:** rozbić budowę V1 na konkretne etapy, bez zgadywania, z twardą kontrolą zakresu.

---

# Zasady obowiązujące przez wszystkie etapy

## Zasada 1 — nie wychodź poza V1
Jeżeli coś wychodzi poza zakres V1:
- nie wdrażaj tego samodzielnie,
- opisz to,
- oznacz jako opcję do V2,
- wróć do uzgodnionego zakresu.

## Zasada 2 — nie buduj pełnego CRM-a
Ta aplikacja ma być lekkim systemem follow-upu, zadań i kalendarza, a nie rozbudowanym CRM-em.

## Zasada 3 — telefon jest pełnoprawnym kanałem
Wszystkie główne ekrany i akcje muszą być wygodne na telefonie, nie tylko na desktopie.

## Zasada 4 — najpierw prostota, potem dodatki
Najpierw ma działać rdzeń:
- leady,
- zadania,
- wydarzenia,
- przypomnienia,
- ekran „Dziś”,
- kalendarz.

Dopiero potem dokładamy billing, dopracowanie i PWA.

## Zasada 5 — żadnych dużych integracji w V1
Nie wdrażać teraz:
- Google Calendar sync,
- Google Contacts sync,
- scrapingu leadów,
- rozbudowanych workflow automation,
- zespołów,
- zaawansowanego AI.

---

# ETAP 0 — USTALIĆ JEDNĄ WERSJĘ PRAWDY

**Cel:**  
Zamknąć definicję produktu i zakres V1, żeby dalsze etapy nie rozjechały się funkcjonalnie.

**Pliki do sprawdzenia:**  
- `docs/product/vision.md`  
- `docs/product/scope-v1.md`  
- `docs/product/out-of-scope.md`  
- `docs/product/persona.md`  

**Zmień:**  
1. Zapisz jedną oficjalną definicję produktu: lekka aplikacja do leadów, next action, zadań, wydarzeń, kalendarza i przypomnień.  
2. Zapisz, że produkt nie jest pełnym CRM-em.  
3. Zapisz personę: freelancer / solo usługodawca / mała agencja 1–3 osoby.  
4. Zapisz główny ekran produktu: „Dziś”.  
5. Zapisz listę modułów V1.  
6. Zapisz listę rzeczy, które są zabronione w V1.  
7. Dodaj osobną sekcję: „Jeśli coś wychodzi poza zakres, opisz to i oznacz jako V2”.  

**Nie zmieniaj:**  
- nie dodawaj nowych funkcji,  
- nie rozszerzaj scope o integracje,  
- nie wpisuj do zakresu rzeczy z V2.  

**Po wdrożeniu sprawdź:**  
- czy zespół umie jednym zdaniem powiedzieć, czym jest produkt,  
- czy istnieje jasny dokument scope,  
- czy jest osobne out-of-scope.  

**Kryterium zakończenia:**  
- istnieje zatwierdzony dokument V1,  
- wiadomo, co budujemy i czego nie budujemy.  

---

# ETAP 1 — POSTAWIĆ SZKIELET PROJEKTU

**Cel:**  
Uruchomić stabilną bazę techniczną pod aplikację webową mobile-first.

**Pliki do sprawdzenia:**  
- `apps/web/package.json`  
- `apps/web/next.config.*`  
- `apps/web/app/layout.tsx`  
- `apps/web/app/page.tsx`  
- `apps/web/app/globals.css`  
- `apps/web/middleware.ts`  

**Zmień:**  
1. Postaw projekt w Next.js + TypeScript.  
2. Włącz App Router.  
3. Przygotuj strukturę katalogów pod auth, dashboard, leads, calendar, billing, settings.  
4. Ustaw layout mobile-first.  
5. Przygotuj bazowy shell aplikacji pod telefon i desktop.  
6. Dodaj routing publiczny i prywatny.  
7. Przygotuj fundament pod PWA, ale bez rozbudowanych funkcji.  

**Nie zmieniaj:**  
- nie buduj jeszcze realnych modułów biznesowych,  
- nie dokładniaj designu ponad potrzebę,  
- nie dodawaj bibliotek, które nie są potrzebne do MVP.  

**Po wdrożeniu sprawdź:**  
- czy projekt uruchamia się lokalnie,  
- czy routing działa,  
- czy layout nie rozsypuje się na telefonie,  
- czy są wyraźnie rozdzielone strefy publiczna i prywatna.  

**Kryterium zakończenia:**  
- jest działający szkielet aplikacji,  
- można wejść na ekran publiczny i prywatny,  
- projekt jest gotowy na kolejne etapy.  

---

# ETAP 2 — LOGOWANIE, SESJA I WORKSPACE

**Cel:**  
Dodać bezpieczne logowanie i prywatny dostęp do danych użytkownika.

**Pliki do sprawdzenia:**  
- `apps/web/lib/auth/**`  
- `apps/web/lib/supabase/**`  
- `apps/web/app/(auth)/**`  
- `apps/web/app/(dashboard)/**`  
- `packages/db/migrations/**`  

**Zmień:**  
1. Podłącz auth.  
2. Wdróż Google login jako główną metodę logowania.  
3. Dodaj flow rejestracji, logowania i wylogowania.  
4. Dodaj ochronę prywatnych tras.  
5. Dodaj tabele / model `profiles` i `workspaces`.  
6. Po utworzeniu konta twórz automatycznie jeden workspace użytkownika.  
7. Upewnij się, że użytkownik bez sesji nie wejdzie do prywatnej części aplikacji.  

**Nie zmieniaj:**  
- nie dodawaj zespołów i ról,  
- nie buduj wielo-workspace,  
- nie dodawaj już teraz zewnętrznych integracji Google poza logowaniem.  

**Po wdrożeniu sprawdź:**  
- czy użytkownik może się zalogować,  
- czy po odświeżeniu sesja działa poprawnie,  
- czy bez logowania nie da się wejść do dashboardu,  
- czy każdy użytkownik ma własny workspace.  

**Kryterium zakończenia:**  
- auth działa,  
- prywatne trasy są chronione,  
- dane można bezpiecznie wiązać z użytkownikiem i workspace.  

---

# ETAP 3 — MODEL DANYCH I BEZPIECZEŃSTWO

**Cel:**  
Ustawić wszystkie główne tabele i zasady dostępu do danych.

**Pliki do sprawdzenia:**  
- `packages/db/migrations/**`  
- `packages/db/types/**`  
- `docs/architecture/data-model.md`  

**Zmień:**  
1. Dodaj tabele: `profiles`, `workspaces`, `leads`, `lead_notes`, `lead_activities`, `tasks`, `calendar_events`, `notifications`, `subscriptions`.  
2. Dodaj pola operacyjne zgodne z zakresem V1.  
3. Dodaj indeksy dla pól typu `workspace_id`, `lead_id`, `due_at`, `next_action_at`.  
4. Ustaw logikę, że dane są powiązane z `workspace_id`.  
5. Włącz reguły bezpieczeństwa tak, żeby użytkownik widział tylko swoje dane.  
6. Zapisz model danych w dokumentacji.  

**Nie zmieniaj:**  
- nie dodawaj tabel pod V2, jeśli nie są potrzebne do V1,  
- nie buduj teraz złożonych modeli billing usage,  
- nie dodawaj integracji z zewnętrznymi API.  

**Po wdrożeniu sprawdź:**  
- czy użytkownik nie ma dostępu do cudzych rekordów,  
- czy każdy rekord ma poprawne powiązanie z workspace,  
- czy model wspiera wszystkie ustalone ekrany V1.  

**Kryterium zakończenia:**  
- baza jest kompletna dla V1,  
- dane są odseparowane,  
- fundament jest gotowy pod CRUD i dashboard.  

---

# ETAP 4 — MODUŁ LEADÓW

**Cel:**  
Dostarczyć pełne podstawowe zarządzanie leadami.

**Pliki do sprawdzenia:**  
- `apps/web/app/(dashboard)/leads/**`  
- `apps/web/app/api/leads/**`  
- `apps/web/components/leads/**`  
- `apps/web/services/leads/**`  

**Zmień:**  
1. Zaimplementuj CRUD leadów.  
2. Dodaj pola podstawowe leadu.  
3. Dodaj pole `source` jako obowiązkowe.  
4. Dodaj statusy leadów zgodne z ustaleniami.  
5. Dodaj `next action` oraz termin `next action`.  
6. Dodaj priorytet.  
7. Dodaj notatki do leadu.  
8. Dodaj prostą listę leadów z wyszukiwarką i filtrami.  
9. Dodaj szczegóły leada.  
10. Dodaj oznaczenie leadu jako wygrany / stracony.  

**Nie zmieniaj:**  
- nie rozbudowuj pipeline o dużo etapów,  
- nie dodawaj scoringu AI,  
- nie buduj jeszcze zaawansowanej analityki.  

**Po wdrożeniu sprawdź:**  
- czy można szybko dodać lead,  
- czy statusy działają,  
- czy źródło jest zapisane,  
- czy szczegóły leada są czytelne,  
- czy użytkownik może znaleźć lead przez listę i filtry.  

**Kryterium zakończenia:**  
- użytkownik może realnie prowadzić leady w aplikacji,  
- moduł leadów działa bez braków krytycznych.  

---

# ETAP 5 — HISTORIA LEADA I AKCJE PRZY LEADZIE

**Cel:**  
Pokazać użytkownikowi pełen kontekst działań przy jednym leadzie.

**Pliki do sprawdzenia:**  
- `apps/web/components/leads/lead-timeline/**`  
- `apps/web/services/leads/**`  
- `packages/db/migrations/**`  

**Zmień:**  
1. Dodaj historię działań przy leadzie.  
2. Zapisuj dodanie leada.  
3. Zapisuj zmianę statusu.  
4. Zapisuj dodanie notatki.  
5. Zapisuj utworzenie zadania.  
6. Zapisuj utworzenie wydarzenia.  
7. Zapisuj wygranie / utratę leada.  
8. Pokaż wszystko jako prostą oś czasu.  

**Nie zmieniaj:**  
- nie rób ciężkiego audit loga,  
- nie dodawaj tu złożonej analityki.  

**Po wdrożeniu sprawdź:**  
- czy historia pokazuje realny przebieg działań,  
- czy użytkownik rozumie, co się działo z leadem,  
- czy nic nie ginie między modułami.  

**Kryterium zakończenia:**  
- każdy lead ma czytelną historię działań.  

---

# ETAP 6 — ZADANIA I NEXT ACTION

**Cel:**  
Dodać system zadań, który jest sercem codziennego użycia produktu.

**Pliki do sprawdzenia:**  
- `apps/web/app/(dashboard)/tasks/**`  
- `apps/web/app/api/tasks/**`  
- `apps/web/components/tasks/**`  
- `apps/web/services/tasks/**`  

**Zmień:**  
1. Dodaj CRUD zadań.  
2. Dodaj typy zadań zgodne z ustaleniami.  
3. Dodaj powiązanie zadania z leadem lub brak powiązania.  
4. Dodaj termin zadania.  
5. Dodaj godzinę opcjonalną.  
6. Dodaj priorytet.  
7. Dodaj statusy zadania.  
8. Dodaj oznaczanie jako zrobione.  
9. Dodaj odkładanie zadania na później.  
10. Dodaj logikę `next action` przy leadzie.  

**Nie zmieniaj:**  
- nie buduj jeszcze workflow automation,  
- nie buduj sekwencji follow-up,  
- nie dodawaj team assignment.  

**Po wdrożeniu sprawdź:**  
- czy można dodać task powiązany z leadem,  
- czy można dodać task niezależny,  
- czy statusy działają,  
- czy odkładanie działa poprawnie.  

**Kryterium zakończenia:**  
- użytkownik może zarządzać zadaniami i next action bez potrzeby innych narzędzi.  

---

# ETAP 7 — PRZYPOMNIENIA JEDNORAZOWE I CYKLICZNE

**Cel:**  
Sprawić, żeby system realnie pilnował użytkownika.

**Pliki do sprawdzenia:**  
- `apps/web/services/reminders/**`  
- `apps/web/components/tasks/**`  
- `apps/web/components/calendar/**`  
- `packages/db/migrations/**`  

**Zmień:**  
1. Dodaj jednorazowe przypomnienia.  
2. Dodaj przypomnienia cykliczne: codziennie, co 2 dni, co tydzień, co miesiąc, wybrany dzień tygodnia.  
3. Dodaj warunek zakończenia przypominania.  
4. Dodaj przechowywanie informacji o kolejnym przypomnieniu.  
5. Dodaj logikę, że cykliczna rzecz po zamknięciu generuje kolejny termin lub przesuwa termin zgodnie z regułą.  
6. Dodaj prosty mechanizm snooze.  

**Nie zmieniaj:**  
- nie dodawaj bardzo złożonych reguł kalendarzowych,  
- nie buduj jeszcze pushy i integracji kalendarzowych,  
- nie buduj wielopoziomowych sekwencji automatycznych.  

**Po wdrożeniu sprawdź:**  
- czy jednorazowe przypomnienie działa,  
- czy cykliczne przypomnienie odtwarza się poprawnie,  
- czy snooze działa,  
- czy zaległości powstają poprawnie.  

**Kryterium zakończenia:**  
- system potrafi pilnować użytkownika dla najważniejszych przypadków użycia.  

---

# ETAP 8 — WYDARZENIA I KALENDARZ

**Cel:**  
Dodać prosty, użyteczny kalendarz bez przerostu formy.

**Pliki do sprawdzenia:**  
- `apps/web/app/(dashboard)/calendar/**`  
- `apps/web/app/api/calendar/**`  
- `apps/web/components/calendar/**`  
- `apps/web/services/calendar/**`  

**Zmień:**  
1. Dodaj CRUD wydarzeń.  
2. Dodaj typy wydarzeń zgodne z ustaleniami.  
3. Dodaj powiązanie wydarzenia z leadem opcjonalnie.  
4. Zbuduj mini kalendarz miesięczny z oznaczeniem dni, w których coś istnieje.  
5. Dodaj kliknięcie w dzień i listę rzeczy na dany dzień.  
6. Dodaj główny widok tygodniowy z dniami tygodnia i rozmieszczeniem rzeczy po godzinach.  
7. Dodaj edycję, usuwanie i oznaczanie jako zrobione z poziomu widoków kalendarza.  
8. Dodaj lekkie rozróżnienie typów wpisów.  

**Nie zmieniaj:**  
- nie buduj pełnego kalendarza jak Google,  
- nie dodawaj drag & drop,  
- nie dodawaj zapraszania uczestników,  
- nie buduj integracji z Google Calendar.  

**Po wdrożeniu sprawdź:**  
- czy mini miesiąc pokazuje dni z wpisami,  
- czy klik w dzień działa,  
- czy widok tygodniowy jest czytelny,  
- czy wydarzenie da się edytować i usunąć.  

**Kryterium zakończenia:**  
- użytkownik może planować tydzień i kontrolować dzień bez chaosu.  

---

# ETAP 9 — EKRAN „DZIŚ”

**Cel:**  
Zbudować główny ekran, który pokazuje wartość produktu w 5 sekund.

**Pliki do sprawdzenia:**  
- `apps/web/app/(dashboard)/today/**`  
- `apps/web/components/today/**`  
- `apps/web/services/dashboard/**`  

**Zmień:**  
1. Zbuduj ekran „Dziś”.  
2. Pokaż leady wymagające akcji dziś.  
3. Pokaż zadania na dziś.  
4. Pokaż wydarzenia na dziś.  
5. Pokaż zaległe rzeczy.  
6. Pokaż skrót rzeczy na jutro.  
7. Dodaj szybkie akcje: oznacz jako zrobione, odłóż, edytuj, dodaj nową rzecz.  
8. Uporządkuj widok tak, żeby użytkownik od razu wiedział, co ma robić.  

**Nie zmieniaj:**  
- nie zamieniaj tego w dashboard raportowy,  
- nie dodawaj wykresów,  
- nie dokładniaj zbędnych statystyk.  

**Po wdrożeniu sprawdź:**  
- czy po wejściu do aplikacji wiadomo, co zrobić dziś,  
- czy zaległe rzeczy są czytelne,  
- czy widok dobrze działa na telefonie.  

**Kryterium zakończenia:**  
- ekran „Dziś” realnie prowadzi użytkownika przez dzień.  

---

# ETAP 10 — IMPORT CSV I SZYBKIE DODAWANIE

**Cel:**  
Zmniejszyć tarcie wejścia do produktu i przyspieszyć codzienne użycie.

**Pliki do sprawdzenia:**  
- `apps/web/components/import/**`  
- `apps/web/app/api/import/**`  
- `apps/web/components/global-create/**`  

**Zmień:**  
1. Dodaj prosty import CSV leadów.  
2. Dodaj walidację pól importu.  
3. Dodaj globalny przycisk szybkiego dodawania.  
4. Umożliw szybkie dodanie: leada, zadania, wydarzenia.  
5. Zadbaj, żeby formularze były szybkie i krótkie.  

**Nie zmieniaj:**  
- nie buduj importów z zewnętrznych CRM-ów,  
- nie dodawaj rozbudowanego mapowania pól, jeśli nie jest potrzebne do V1.  

**Po wdrożeniu sprawdź:**  
- czy import CSV działa dla podstawowych danych,  
- czy szybkie dodawanie działa z każdego ważnego miejsca.  

**Kryterium zakończenia:**  
- użytkownik może szybko wejść do systemu z własnymi leadami i szybko pracować na co dzień.  

---

# ETAP 11 — BILLING I SUBSKRYPCJA

**Cel:**  
Uruchomić płatny model bez ręcznej obsługi.

**Pliki do sprawdzenia:**  
- `apps/web/app/(dashboard)/billing/**`  
- `apps/web/app/api/billing/**`  
- `apps/web/services/billing/**`  
- `packages/db/migrations/**`  

**Zmień:**  
1. Dodaj jeden plan subskrypcyjny.  
2. Dodaj status subskrypcji.  
3. Dodaj trial, jeśli jest przewidziany.  
4. Dodaj ekran billingowy.  
5. Dodaj logikę wygasania dostępu.  
6. Dodaj możliwość wznowienia.  
7. Dodaj zapis statusu subskrypcji w bazie.  

**Nie zmieniaj:**  
- nie dodawaj wielu planów,  
- nie wdrażaj usage billing,  
- nie buduj seat-based pricing.  

**Po wdrożeniu sprawdź:**  
- czy aktywny użytkownik ma dostęp,  
- czy po wygaśnięciu dostęp jest ograniczony poprawnie,  
- czy dane nie znikają po wygaśnięciu,  
- czy możliwe jest wznowienie.  

**Kryterium zakończenia:**  
- użytkownik może korzystać z produktu jako płatnej usługi subskrypcyjnej.  

---

# ETAP 12 — USTAWIENIA I PREFERENCJE

**Cel:**  
Dodać prostą kontrolę nad kontem, workspace i przypomnieniami.

**Pliki do sprawdzenia:**  
- `apps/web/app/(dashboard)/settings/**`  
- `apps/web/components/settings/**`  
- `apps/web/services/settings/**`  

**Zmień:**  
1. Dodaj ustawienia użytkownika.  
2. Dodaj ustawienia przypomnień.  
3. Dodaj ustawienia workspace.  
4. Dodaj strefę czasową.  
5. Dodaj preferencje domyślnego przypominania i snooze.  

**Nie zmieniaj:**  
- nie buduj tu rozbudowanego centrum administracyjnego,  
- nie dodawaj jeszcze ustawień zespołowych.  

**Po wdrożeniu sprawdź:**  
- czy użytkownik może zmienić swoje podstawowe ustawienia,  
- czy przypomnienia szanują strefę czasową,  
- czy workspace pokazuje status planu.  

**Kryterium zakończenia:**  
- ustawienia są kompletne dla V1 i wystarczają użytkownikowi do normalnej pracy.  

---

# ETAP 13 — PWA I DOPRACOWANIE WERSJI MOBILNEJ

**Cel:**  
Domknąć wygodę działania na telefonie i przygotować aplikację do dodania na ekran główny.

**Pliki do sprawdzenia:**  
- `apps/web/app/manifest.ts`  
- `apps/web/public/**`  
- `apps/web/components/layout/**`  
- `apps/web/styles/**`  

**Zmień:**  
1. Dodaj manifest PWA.  
2. Dodaj ikonę i podstawowe metadane.  
3. Dopracuj najważniejsze widoki na telefonie.  
4. Upewnij się, że na telefonie łatwo dodać leada, zadanie i wydarzenie.  
5. Upewnij się, że ekran „Dziś” i kalendarz są wygodne mobilnie.  

**Nie zmieniaj:**  
- nie buduj natywnej aplikacji,  
- nie dodawaj teraz rozbudowanych pushy.  

**Po wdrożeniu sprawdź:**  
- czy aplikacja jest używalna na telefonie,  
- czy da się ją dodać do ekranu głównego,  
- czy najczęstsze akcje wykonuje się wygodnie jedną ręką.  

**Kryterium zakończenia:**  
- aplikacja działa dobrze na komputerze i telefonie,  
- PWA jest gotowe do użycia.  

---

# ETAP 14 — TESTY KOŃCOWE I DOMKNIĘCIE V1

**Cel:**  
Sprawdzić, czy cały produkt dowozi to, co ma dowieźć.

**Pliki do sprawdzenia:**  
- cały projekt  
- `docs/product/acceptance-v1.md`  

**Zmień:**  
1. Sprawdź pełny flow użytkownika od rejestracji do pracy codziennej.  
2. Sprawdź flow: dodanie leada → ustawienie next action → dodanie zadania → przypomnienie → widok „Dziś” → kalendarz.  
3. Sprawdź flow subskrypcji.  
4. Sprawdź działanie na telefonie i komputerze.  
5. Sprawdź edge case’y: rzeczy zaległe, rzeczy bez godziny, cykliczne przypomnienia, snooze, usunięcie wydarzenia.  
6. Spisz listę rzeczy spoza zakresu, które pojawiły się w trakcie prac, i oznacz je jako kandydaci do V2.  

**Nie zmieniaj:**  
- nie zaczynaj teraz nowych modułów,  
- nie dorzucaj funkcji „na szybko”, które nie były ustalone.  

**Po wdrożeniu sprawdź:**  
- czy użytkownik może realnie pracować cały dzień tylko w tej aplikacji,  
- czy nic krytycznego nie jest pominięte,  
- czy V1 nadal jest lekkie,  
- czy nie wjechały rzeczy z V2.  

**Kryterium zakończenia:**  
- V1 jest gotowe do wewnętrznego testu lub pierwszych użytkowników,  
- zakres V1 jest domknięty,  
- lista rzeczy do V2 jest spisana osobno.  

---

# Ostatnia zasada dla AI dewelopera

Jeżeli w trakcie któregoś etapu pojawi się propozycja czegoś lepszego, większego albo bardziej rozbudowanego, to AI deweloper ma:
1. zatrzymać rozszerzanie scope,  
2. opisać tę rzecz osobno,  
3. napisać wprost: „to wychodzi poza V1”,  
4. zaproponować to jako opcję do V2,  
5. kontynuować prace w ramach V1.  

**Nie wolno samodzielnie pompować zakresu V1.**
