# LeadFlow / CloseFlow — kierunek rozwoju produktu

Status: AKTYWNE
Data aktualizacji: 2026-06-07 23:35 Europe/Warsaw
Repo: dkknapikdamian-collab/leadflowv1
Cel pliku: widoczny na starcie, centralny kierunek rozwoju aplikacji po rozmowie o inspiracjach Chatwoot / FreeScout / PostHog / AI.

## Teza główna

LeadFlow nie ma być ciężkim CRM-em ani systemem do dzielenia leadów w dużej firmie.

LeadFlow ma być prostą aplikacją dla osób i małych zespołów, które mają leady i muszą ich nie gubić:

- właściciel lokalnej usługi,
- agent / handlowiec,
- osoba obsługująca zapytania,
- mała firma z 1–2 osobami przy leadach,
- branże: nieruchomości, remonty, architektura, HVAC, storage, lokalne usługi, B2B usługi, e-commerce/usługi z formularzami.

Kierunek produktu:

> Lead Inbox + pilnowanie follow-upów + proste notatki/zadania/wydarzenia + alerty właściciela + później AI drafty i product analytics.

## Decyzje właściciela z 2026-06-07

### 1. Kanały i zapis wszystkiego do LeadFlow

Docelowo tak: kanały mają wpadać do LeadFlow i zapisywać się jako lead, aktywność albo wydarzenie przy leadzie/kliencie/sprawie.

Ale nie robimy od razu integracji ze wszystkimi kanałami.

Kolejność logiczna:

1. ręczne dodanie leada,
2. formularz / webhook z landing page,
3. e-mail / prosty intake mailowy,
4. potem dopiero Gmail/WhatsApp/Facebook/SMS, jeśli będzie realny popyt.

Zasada: każdy nowy kontakt ma mieć źródło, datę, status, ostatnią aktywność i następny krok.

### 2. Statusy już istnieją — nie budować ich od nowa

Właściciel wskazał, że statusy już są.

Nie robić etapu typu „dodaj statusy” bez wcześniejszego skanu kodu.

Kierunek rozwoju statusów:

- uporządkować znaczenie istniejących statusów,
- powiązać status z ostatnią aktywnością,
- dodać alerty przy statusach ryzykownych,
- nie mnożyć statusów bez potrzeby.

Przykładowe alerty:

- lead bez reakcji > 24h,
- follow-up po terminie,
- gorący lead bez następnego kroku,
- klient/sprawa bez aktywności przez X dni,
- zadanie przypisane pracownikowi bez wykonania.

### 3. Notatki już istnieją — rozwinąć, nie duplikować

Właściciel wskazał, że notatki do spraw, leadów i klientów już są.

Nie robić od nowa modułu notatek.

Kierunek:

- notatki mają być spójne między leadem, klientem i sprawą,
- szybkie dodanie notatki z każdego widoku,
- notatka może tworzyć zadanie/wydarzenie/follow-up,
- notatka może być przypisana do konkretnej osoby w pakiecie zespołowym,
- w przyszłości notatki mogą być podsumowywane przez AI.

### 4. Widoki istnieją, brakuje alertów

Właściciel wskazał, że część widoków już jest.

Kierunek nie jest „zbudować kolejny widok”, tylko:

- dodać alerty i reguły ryzyka,
- pokazać, co wymaga reakcji,
- pokazać, kto ma coś zrobić,
- pokazać, co gnije.

Najbardziej wartościowy moduł następny produktowo:

> Alerty follow-up / lead risk / zadanie po terminie.

### 5. Pakiet dla firmy / dwóch osób — kierunek rozwoju, nie ciężki CRM

Właściciel nie chce na start celować w ciężki system firmowy ani dzielenie leadów jak w dużym CRM.

Kierunek rozwoju:

- pakiet dla 2 osób jako prosty wariant cenowy,
- każde konto ma swoje leady domyślnie,
- brak domyślnego wspólnego worka leadów,
- opcjonalne udostępnienie konkretnego leada innej osobie,
- możliwość przypisania notatki, wydarzenia albo zadania innej osobie,
- zadanie dla pracownika/innej osoby ma przypomnienie i status wykonania,
- właściciel widzi zaległości, ale aplikacja nie staje się ciężkim CRM-em.

Najmocniejsza funkcja zespołowa według właściciela:

> Dodanie notatki, wydarzenia albo zadania dla pracownika/innej osoby w grupie, żeby nie zapomniała.

To zapisać jako istotny kierunek.

### 6. Dzielenie się leadami — ostrożnie

Właściciel nie czuje dzielenia się leadami, szczególnie w kontekście agenta nieruchomości.

Decyzja:

- nie robić wspólnego poola leadów jako domyślnego modelu,
- rozważyć tylko opcję „udostępnij tego jednego leada” albo „przypisz zadanie przy leadzie”,
- właściciel leada pozostaje widoczny,
- każde udostępnienie powinno mieć ślad w historii.

### 7. Grupa docelowa

Nie celować w ciężkie CRM-y dla dużych firm.

LeadFlow ma być prostą aplikacją dla każdego, kto ma leady.

Priorytet:

- solo użytkownik,
- pakiet 2 konta w niższej cenie,
- później mały zespół.

Nie zaczynać od rozbudowanej organizacji, ról, uprawnień i rozdziału działów, jeśli nie jest to wymagane przez pierwszych użytkowników.

### 8. PostHog / product analytics — późniejszy etap 1:1

Właściciel uznał product analytics za przydatne.

Kierunek:

- później podpiąć analitykę użycia aplikacji,
- mierzyć realne użycie widoków, notatek, follow-upów, zadań, alertów,
- mierzyć miejsca, gdzie użytkownik się gubi,
- session replay / event tracking dopiero po stabilizacji core UI.

Nie robić tego przed pilnymi etapami UI/core, ale zapisać jako ważny etap rozwojowy.

## Inspiracje z repo open source — jak używać

### Chatwoot

Użyć jako inspiracji dla Lead Inbox:

- jeden strumień kontaktów,
- źródła kontaktu,
- status rozmowy/leada,
- przypisanie osoby,
- notatki wewnętrzne,
- alerty i raporty.

Nie kopiować całego helpdesku i nie robić omnichannel od razu.

### FreeScout

Użyć jako inspiracji dla prostoty:

- shared mailbox logic,
- internal notes,
- collision/ownership awareness,
- przenoszenie/scalanie wątków,
- proste przypisanie odpowiedzialności.

Nie robić ciężkiego helpdesku.

### PostHog

Użyć później jako etap techniczny:

- product analytics,
- session replay,
- feature flags,
- error tracking,
- AI observability, jeśli AI drafty wejdą do produkcji.

## AI pod LeadFlow — kierunek ostrożny

AI ma pomagać, nie zastępować właściciela.

Dobre funkcje AI:

- podsumowanie leada,
- klasyfikacja gorący / średni / zimny,
- draft odpowiedzi,
- propozycja następnego kroku,
- wykrycie ryzyka: lead bez reakcji / brak follow-upu / brak zadania,
- podsumowanie tygodnia dla właściciela.

Zakaz na start:

- automatyczna wysyłka bez akceptacji,
- AI jako autonomiczny sprzedawca,
- obietnica, że AI samo ogarnie wszystkie leady,
- duży agent przed stabilnym core.

Wzorzec:

> AI draft + owner approve.

## Najlepszy następny kierunek produktowy

1. Uporządkować obecne leady/statusy/notatki bez dublowania istniejących modułów.
2. Dodać reguły alertów: lead bez reakcji, follow-up po terminie, zadanie po terminie.
3. Dodać prostą funkcję przypisania zadania/notatki/wydarzenia innej osobie w pakiecie 2 kont.
4. Dopiero później podpinać kanały zewnętrzne i PostHog.
5. AI dopinać jako drafty, podsumowania i alerty, nie jako pełny autonomiczny agent.

## Ryzyka

- Jeśli zrobimy pełny CRM, produkt straci prostotę.
- Jeśli zaczniemy od wielu integracji kanałów, ugrzęźniemy technicznie.
- Jeśli zrobimy domyślne dzielenie leadów, produkt może odstraszyć osoby, które nie chcą pokazywać leadów innym.
- Jeśli dodamy AI bez guardów, powstaną błędne rekomendacje i brak zaufania.
- Jeśli dodamy analytics za wcześnie, rozproszymy się przed domknięciem core UX.

## Warunek zmiany kierunku

Zmienić kierunek dopiero, gdy pierwsi użytkownicy pokażą, że:

- bardziej potrzebują pełnego CRM niż pilnowania leadów,
- pracują głównie zespołowo na wspólnym poolu leadów,
- chcą integracji z kanałami bardziej niż prostych alertów i follow-upów,
- AI drafty są mniej ważne niż automatyczna wysyłka.

Na teraz najlepszy kierunek pozostaje:

> prosta apka dla leadów + alerty + follow-up + pakiet 2 konta + opcjonalne zadania/notatki/wydarzenia dla drugiej osoby + później AI i product analytics.
