# CLOSEFLOW — ADMIN DEBUG TOOLBAR + REVIEW MODE + QA FEEDBACK SUITE
Data: 2026-05-05
Branch docelowy: dev-rollout-freeze
Repo: dkknapikdamian-collab/leadflowv1

## Werdykt
Wdrażamy nie jedną zabawkę, tylko pełny ADMIN DEBUG TOOLBAR w górnym pasku.
W środku na V1 mają wejść:
1. UI Review Mode — klikanie elementów i zapisywanie uwag.
2. Button Matrix Scanner — wykrywanie akcji/przycisków na ekranie.
3. Bug Note Recorder — zapis błędu działania z kontekstem strony.
4. Copy Review Mode — poprawki tekstów UI.
5. Export Center — eksport JSON/Markdown do Downloads.

Wszystko:
- tylko dla isAdmin || isAppOwner,
- domyślnie wyłączone,
- widoczne w globalnym górnym pasku,
- bez backendu w V1,
- bez Supabase tabel w V1,
- bez wpływu na zwykłych użytkowników,
- eksportowane jako pliki do C:\Users\malim\Downloads.

## Główna zasada jakości
To narzędzie ma pozwalać kliknąć dokładnie ten element, który admin chce opisać.
Nie może być sytuacji, że admin klika przycisk A, a eksport zapisuje sąsiedni przycisk B.

Dlatego wdrażamy mechanizm selekcji z potwierdzeniem:
- hover preview,
- selected outline,
- element inspector mini-card,
- wybór targetu z listy kandydatów,
- większy/mniejszy element,
- zamrożenie bounding rect po kliknięciu,
- zapis event.composedPath().

## Dlaczego górny pasek
Layout.tsx ma global-bar i już renderuje GlobalQuickActions oraz ContextActionDialogsHost.
Tam dokładamy AdminDebugToolbar.
Nie dokładamy do sidebaru, bo to nie jest moduł produktu.

## Uprawnienia
Warunek:
const canUseAdminDebugToolbar = Boolean(isAdmin || isAppOwner);

Layout obecnie bierze isAdmin z useWorkspace.
Trzeba dodać isAppOwner do destrukturyzacji.

## Etap A — fundament admin toolbar

### Cel
Dodać widoczny tylko dla admina/app ownera pasek debugujący w globalnym górnym pasku.

### Pliki do dodania
- src/components/admin-tools/AdminDebugToolbar.tsx
- src/components/admin-tools/admin-tools-types.ts
- src/components/admin-tools/admin-tools-storage.ts
- src/styles/admin-tools.css
- scripts/check-admin-debug-toolbar.cjs
- tests/admin-debug-toolbar.test.cjs
- docs/release/STAGE_ADMIN_DEBUG_TOOLBAR_2026-05-05.md

### Pliki do zmiany
- src/components/Layout.tsx
- package.json

### Zmień
1. Import AdminDebugToolbar w Layout.
2. Z useWorkspace pobrać isAppOwner.
3. W global-bar dodać:
   {canUseAdminDebugToolbar ? <AdminDebugToolbar currentSection={currentSection} /> : null}
4. CSS importować centralnie albo w komponencie.
5. Admin toolbar ma przyciski:
   - Review
   - Buttons
   - Bug
   - Copy
   - Export
6. Wszystkie przyciski mają mieć data-admin-tool-ui="true".

### Nie zmieniaj
- Nie ruszać GlobalQuickActions.
- Nie ruszać ContextActionDialogsHost.
- Nie zmieniać normalnych akcji użytkownika.

### Kryterium zakończenia
Admin widzi toolbar, user nie.

## Etap B — storage i eksport lokalny

### Cel
Ujednolicić zapis wszystkich notatek admina.

### Klucze localStorage
- closeflow:admin-tools:active-tool:v1
- closeflow:admin-tools:review-items:v1
- closeflow:admin-tools:bug-items:v1
- closeflow:admin-tools:copy-items:v1
- closeflow:admin-tools:button-snapshots:v1
- closeflow:admin-tools:settings:v1

### Eksport
Pliki pobierane przez przeglądarkę:
- closeflow_admin_feedback_YYYY-MM-DD_HH-mm.json
- closeflow_admin_feedback_YYYY-MM-DD_HH-mm.md

Domyślny folder w Windows:
C:\Users\malim\Downloads

### Pliki do dodania
- src/components/admin-tools/admin-tools-export.ts
- src/components/admin-tools/admin-tools-storage.ts

### Wymagania
1. Eksport JSON zawiera wszystkie typy danych.
2. Eksport MD grupuje uwagi po route i priorytecie.
3. Eksport ma zawierać commit placeholder, route, user agent, viewport, timestamp.
4. Nie wysyłać na backend.

## Etap C — niezawodny wybór elementu

### Cel
Kliknięcie admina ma wybrać właściwy element, nie przypadkowy sibling.

### Pliki do dodania
- src/components/admin-tools/dom-targeting.ts
- src/components/admin-tools/dom-selector.ts
- src/components/admin-tools/dom-candidates.ts

### Algorytm wyboru
Po kliknięciu:
1. Jeżeli target jest w narzędziu admina, ignoruj.
2. Pobierz event.composedPath().
3. Zbuduj listę kandydatów od targetu do main.
4. Nadaj score każdemu elementowi.
5. Najwyższy score = domyślny wybór.
6. Pokaż mini-inspector z 3-6 kandydatami.
7. Admin może zmienić wybór na większy/mniejszy.

### Scoring
+100: button, a[href], input, textarea, select
+90: [role=button], [role=link], [tabindex]
+80: element z data-action, data-context-action, data-nav-path, data-testid
+70: article, section, li, tr
+60: class zawiera card, panel, row, item, action, button, tile, list
+40: ma sensowny tekst
-100: html, body, svg, path
-80: element admin tool
-50: pusty div bez rozmiaru
-50: rect width/height prawie zero

### Dane elementu
Zapisujemy:
- tag
- text
- ariaLabel
- title
- role
- id
- className
- dataAttributes
- selectorHint
- candidateIndex
- candidateCount
- composedPathSummary
- rect
- scroll
- viewport
- route
- screen

### Ochrona przed pomyłką
Dialog pokazuje:
"Wybrano: button 'Dodaj zadanie'"
oraz:
- Zaznacz mniejszy
- Zaznacz większy
- Wybierz z listy

Jeśli admin kliknął ikonę, a system wybrał button, pokazuje:
"Kliknięto ikonę, wybrano nadrzędny przycisk."

## Etap D — UI Review Mode

### Cel
Zbierać uwagi wizualne/pozycyjne/działania.

### Tryby
- OFF
- Collect
- Browse

### Collect
Klik elementu:
- preventDefault
- stopPropagation
- nie wykonuje normalnej akcji
- otwiera formularz uwagi

### Browse
- overlay widoczny
- kliknięcia przechodzą normalnie

### Dialog
Pola:
- komentarz wymagany
- typ: wygląd, pozycja, tekst, działanie, błąd, mobile, performance, inne
- priorytet: P0, P1, P2, P3
- obecne zachowanie
- oczekiwane zachowanie
- status: todo

### Szybkie skróty
Komentarze preset:
- Przenieść wyżej
- Przenieść niżej
- Zmniejszyć
- Powiększyć
- Zły tekst
- Zły przycisk / złe działanie
- Ukryć
- Dodać wyraźniejszy CTA
- Za dużo chaosu
- Nie działa po kliknięciu

## Etap E — Button Matrix Scanner

### Cel
Automatycznie wykrywać wszystkie przyciski i akcje na aktualnym ekranie.

### Co wykrywa
- button
- a[href]
- [role=button]
- [data-nav-path]
- [data-context-action]
- input[type=button/submit]
- elementy z onClick jeśli da się po klasie/roli wyłapać
- menu itemy

### Panel
Lista:
- tekst
- typ elementu
- route
- selectorHint
- visible / hidden
- disabled / enabled
- rect
- status QA: unchecked / ok / bug / move / rename / remove

### Działanie
Admin może przy każdym:
- OK
- Nie działa
- Przenieść
- Zły tekst
- Usuń
- Dodać uwagę

### Wartość
To jest narzędzie do Twojego wymagania "sprawdź każdy przycisk".
Nie musimy ręcznie pamiętać, co jest na ekranie. Scanner robi spis.

## Etap F — Bug Note Recorder

### Cel
Szybko zapisać błąd działania.

### Przycisk
Bug

### Formularz
- co zrobiłem
- co się stało
- co miało się stać
- priorytet
- związany element opcjonalnie
- ostatnia trasa
- timestamp
- user agent
- viewport

### V1 bez logów API
Na V1 nie przechwytujemy jeszcze requestów, żeby nie ryzykować danych.
Można zapisać tylko manualną notatkę.

### V2
Dopiero później dodać bezpieczny ring buffer:
- endpoint
- method
- status
- duration
- bez payloadów

## Etap G — Copy Review Mode

### Cel
Kliknąć tekst i zaproponować zmianę copy.

### Klik
Klik tekstu/labela/buttona:
- zapisuje stary tekst
- wpisujesz nowy tekst
- komentarz powodu

### Dane
- oldText
- proposedText
- route
- element
- priority
- reason

### Eksport
Markdown ma sekcję:
"Zmiany tekstów do wdrożenia"

## Etap H — Export Center

### Cel
Jedno miejsce do pobierania całego feedbacku.

### Eksport JSON
Pełne dane techniczne.

### Eksport Markdown
Czytelne dla ChatGPT/Codex.

### Sekcje Markdown
1. Blokery P0
2. Uwagi UI
3. Button Matrix
4. Bug Notes
5. Copy Changes
6. Dane techniczne
7. Sugestia pakietów wdrożeniowych

## Etap I — testy i guardy

### Guardy
- check:admin-debug-toolbar
- check:admin-review-mode
- check:admin-button-matrix
- check:admin-feedback-export

### Testy
- user non-admin nie widzi toolbaru
- admin widzi toolbar
- Review collect blokuje klik
- Review browse nie blokuje klik
- klik ikony wybiera button
- większy/mniejszy element działa
- eksport JSON ma poprawny element
- eksport MD ma komentarz
- button scanner wykrywa buttony
- copy mode zapisuje oldText/proposedText
- bug recorder zapisuje notatkę

## Etap J — dokumentacja dla użytkownika-admina

### Krótka instrukcja
1. Kliknij Review.
2. Wybierz Zbieraj uwagi.
3. Kliknij element.
4. Wpisz komentarz.
5. Zapisz.
6. Przejdź dalej w trybie Browse albo wyłącz Review.
7. Kliknij Export.
8. Wrzuć JSON/MD do ChatGPT.

## Czego NIE robić
- Nie robić screenshotów automatycznych w V1.
- Nie dodawać backendu.
- Nie dodawać Supabase tabel.
- Nie pokazywać zwykłym userom.
- Nie pozwalać temu zmieniać UI bez kodu.
- Nie robić drag/drop edytora.
- Nie przechwytywać payloadów API.
- Nie zapisywać tokenów, maili, danych wrażliwych poza tym, co admin świadomie eksportuje.

## Najlepsza kolejność wdrożenia
1. Toolbar + admin gate.
2. Storage + export.
3. DOM targeting.
4. Review Mode.
5. Button Matrix.
6. Bug Recorder.
7. Copy Review.
8. Guardy/testy.
9. Dokumentacja.
