# 07_REPAIR_STAGES_HIDDEN_AUDIT_FINDINGS - CloseFlow / LeadFlow

Data: 2026-06-12 20:23 Europe/Warsaw  
Status: BACKLOG_NAPRAW_DO_WDROZENIA  
Typ: etapy napraw po audycie ukrytych problemow  
Repo: dkknapikdamian-collab/leadflowv1  
Branch: dev-rollout-freeze  
Canonical name: CloseFlow / LeadFlow  
Obsidian folder: 10_PROJEKTY/CloseFlow_Lead_App  
Audit protocol: `_project/04_STAGE_AUDIT_PROTOCOL_CLOSEFLOW.md`

## Cel

Ten plik zapisuje problemy wykryte w audycie 2026-06-12, ktore nie byly jednoznacznie ujęte jako aktywne etapy naprawy ani jako bieżący kierunek rozwoju aplikacji.

Decyzja Damiana z 2026-06-12: na razie skupiamy sie przede wszystkim na aplikacji i widocznych / produktowych rzeczach, a techniczne porzadki robimy pozniej w logicznej kolejnosci.

## Kolejność logiczna

Najpierw zamykamy rzeczy, ktore moga dotknac uzytkownika, produkcji, logowania albo ladowania aplikacji. Dopiero potem robimy dokumentacje, guardy i porzadki runnerow.

## Obowiązkowy audyt przed i po każdym etapie

Każdy etap z tej listy musi używać protokołu `_project/04_STAGE_AUDIT_PROTOCOL_CLOSEFLOW.md`.

Przed etapem developer/operator musi zapisać:

- gdzie w aplikacji Damian zobaczy efekt,
- jakie trasy/ekrany/komponenty są dotykane,
- co już istnieje i czy etap nie jest częściowo wdrożony,
- jakie podobne miejsca trzeba sprawdzić,
- jakie realne problemy znaleziono obok,
- czego świadomie nie ruszamy,
- jaki guard/test będzie dowodem,
- jaki test ręczny ma wykonać Damian.

Po etapie developer/operator musi zapisać:

- czy naprawiono przyczynę, nie tylko objaw,
- czy podobne miejsca zostały sprawdzone,
- co mogło się zepsuć,
- jakie nowe realne problemy wyszły podczas pracy,
- co nie zostało ruszone i dlaczego,
- wynik guardów/testów,
- instrukcję ręcznego sprawdzenia,
- update `_project` i payload Obsidiana.

Nie doszukujemy się problemów na siłę. Szukamy rzeczy realnych: źle podpiętych, niedopiętych, niedokończonych, sprzecznych z kierunkiem aplikacji, ryzykownych albo takich, które mogą wrócić po odświeżeniu/refetchu.

---

## APP / PRODUCT SAFETY FIRST

### STAGE232A_PUBLIC_PREVIEW_ROUTES_PRODUCTION_LOCK

Priorytet: P1  
Typ: app safety / security / production hygiene  
Status: DO_WDROZENIA

Problem:
- Trasy `/ui-preview-vnext` i `/ui-preview-vnext-full` sa dostepne poza normalnym gated app flow.
- Preview zawiera dane wygladajace jak realne kontakty / leady.
- Nawet jesli sa to dane testowe, w produkcji wyglada to jak wyciek albo niezamkniety prototyp.

Zakres:
- Zablokowac preview routes w produkcji.
- Dopuszczalne warianty:
  - tylko `import.meta.env.DEV`, albo
  - admin-only / owner-only, jesli preview ma zostac jako narzedzie wewnetrzne.
- Usunac lub zanonimizowac dane fixture wygladajace jak realne osoby.

Audyt przed etapem:
- Sprawdzic `src/App.tsx`, `src/pages/UiPreviewVNext.tsx`, `src/pages/UiPreviewVNextFull.tsx`.
- Sprawdzic, czy istnieja inne preview/dev/demo routes dostepne publicznie.
- Sprawdzic, czy fixture dane wygladaja jak realne dane osobowe.
- Nie robic refactoru calego routingu.

Guard/test:
- Guard blokujacy publiczne preview routes w produkcyjnym `App.tsx`.
- Manual test: wejsc niezalogowanym na `/ui-preview-vnext` i `/ui-preview-vnext-full`; produkcja nie moze pokazac preview.

Audyt po etapie:
- Sprawdzic, czy preview nie jest widoczne niezalogowanemu uzytkownikowi.
- Sprawdzic, czy dev/admin fallback nie wycieka do produkcji.
- Sprawdzic, czy zanonimizowano dane fixture albo czy nie sa renderowane w produkcji.

Done condition:
- Niezalogowany uzytkownik nie widzi preview.
- Preview nie pokazuje danych wygladajacych jak realne kontakty w produkcji.
- Guard przechodzi.

Ryzyko:
- Jesli preview bylo uzywane jako referencja UI przez developera, trzeba zostawic bezpieczny tryb dev/admin, nie kasowac bezmyslnie.

---

### STAGE232B_CHUNK_BOUNDARY_RUNTIME_STABILITY

Priorytet: P1/P2  
Typ: app runtime stability  
Status: DO_WDROZENIA_PO_232A

Problem:
- `LeadDetail` i `ClientDetail` sa importowane statycznie jako obejscie starego problemu lazy/chunk/export.
- To moze maskowac niezamkniety blad eksportow albo chunk loadingu.
- App moze miec wiekszy bundle startowy i ukryte ryzyko powrotu bledu przy kolejnych duzych stronach.

Zakres:
- Zrobic audyt eksportow `src/pages/*`.
- Sprawdzic, czy `LeadDetail` i `ClientDetail` mozna bezpiecznie przywrocic do lazyPage albo czy trzeba utrzymac swiadomy kontrakt statycznego importu.
- Nie robic refactoru routingu bez potrzeby.

Audyt przed etapem:
- Sprawdzic komentarze przy importach statycznych.
- Sprawdzic `lazyPage` i exporty stron.
- Sprawdzic tylko trasy powiazane z tym problemem: lead/client/case i glowne strony lazy.
- Nie ruszac layoutu LeadDetail/ClientDetail.

Guard/test:
- Guard default/named export dla stron ladowanych przez lazyPage.
- Route smoke dla najwazniejszych tras: `/leads`, `/leads/:id`, `/clients`, `/clients/:id`, `/cases`, `/case/:caseId`.
- Build.

Audyt po etapie:
- Sprawdzic, czy aplikacja dalej laduje trasy lead/client/case.
- Sprawdzic, czy nie zwiekszono zakresu statycznych importow.
- Sprawdzic, czy ewentualne obejscie ma zapisany kontrakt i guard.

Done condition:
- Wiadomo, czy statyczne importy sa nadal potrzebne.
- Jesli nie sa potrzebne, zostaja usuniete.
- Jesli sa potrzebne, kontrakt jest zapisany i testowany.

Ryzyko:
- Nie ruszac wizualnego układu LeadDetail/ClientDetail przy tej naprawie.

---

### STAGE232C_AUTH_ENV_FAIL_CLOSED

Priorytet: P2  
Typ: app security / environment correctness  
Status: DO_WDROZENIA_PO_232B

Problem:
- Warstwa auth verify moze maskowac brak anon key przez fallback na service role key.
- To nie musi byc bezposredni exploit, ale jest zlym wzorcem konfiguracyjnym przed produkcja.
- Produkcja powinna fail-fast przy zlym env, a nie cicho dzialac przez mocniejszy klucz.

Zakres:
- Sprawdzic `_supabase-auth.ts` i wszystkie miejsca weryfikacji user tokena.
- W produkcji wymagac anon key dla auth verify.
- Service role fallback dopuscic tylko jawnie i tylko poza produkcja, jesli w ogole zostaje.

Audyt przed etapem:
- Sprawdzic wszystkie helpery auth/env/server request scope.
- Sprawdzic, czy podobny fallback nie wystepuje w innych server helpers.
- Nie zmieniac RLS ani migracji SQL.

Guard/test:
- Test env contract: production auth verify nie uzywa service role jako cichego fallbacku.
- Test braku `SUPABASE_ANON_KEY` w produkcji powinien konczyc sie czytelnym bledem konfiguracyjnym.

Audyt po etapie:
- Sprawdzic, czy brak anon key w produkcji nie jest maskowany.
- Sprawdzic, czy lokal/dev nadal ma czytelna sciezke uruchomienia.
- Sprawdzic, czy nie wycieto potrzebnego server-only service role usage poza auth verify.

Done condition:
- Brak cichego service-role fallback w produkcji.
- Blad env jest czytelny.

Ryzyko:
- Nie zmieniac RLS, grantow ani polityk Supabase w tym etapie bez osobnej decyzji.

---

## TECHNICAL / DOC HYGIENE AFTER APP CORE

### STAGE232D_DOCS_ENCODING_SWEEP

Priorytet: P2  
Typ: docs / project hygiene  
Status: DO_WDROZENIA_PO_APP_CORE

Problem:
- README i `.env.example` maja uszkodzone polskie znaki / mojibake.
- W README sa tez uszkodzone bloki kodu lub znaki kontrolne.
- To psuje onboarding, prace Codexa/developera i wiarygodnosc repo.

Zakres:
- Naprawic README.
- Naprawic `.env.example`.
- Sprawdzic aktywne docs i `_project` tylko w aktywnych sekcjach, bez masowego przepisywania historii.
- Nie zmieniac runtime UI ani logiki aplikacji.

Audyt przed etapem:
- Sprawdzic aktywne dokumenty wejściowe, nie cala historie.
- Zidentyfikowac znaki kontrolne i mojibake.
- Nie przepisywac run reportow i archiwalnych etapow bez powodu.

Guard/test:
- Guard aktywnych dokumentow: README, `.env.example`, wybrane aktywne docs, aktywne project-memory pliki.
- Guard ma lapac mojibake i kontrolne znaki w blokach kodu.

Audyt po etapie:
- Sprawdzic, czy README i `.env.example` sa czytelne.
- Sprawdzic, czy guard nie blokuje rozwoju na starych archiwach.
- Sprawdzic, czy nie zmieniono znaczenia instrukcji przy poprawianiu kodowania.

Done condition:
- README i `.env.example` sa czytelne UTF-8.
- Guard docs encoding przechodzi.

Ryzyko:
- Nie przepisywac starej historii etapow na sile, bo mozna narobic konfliktow. Naprawiac najpierw aktywne wejscia i instrukcje.

---

### STAGE232E_POLISH_MOJIBAKE_GUARD_SCOPE

Priorytet: P2/P3  
Typ: guard quality / regression prevention  
Status: DO_WDROZENIA_PO_232D

Problem:
- Obecny guard polskich znakow skanuje za wasko.
- Moze przechodzic mimo krzakow w README, `.env.example`, docs albo `_project`.
- To daje falszywe poczucie bezpieczenstwa.

Zakres:
- Rozdzielic runtime guard od docs guard.
- Utrzymac szybki runtime guard dla `src/pages`, `src/components`, `src/lib`.
- Dodac osobny docs/project-memory guard dla aktywnych plikow.

Audyt przed etapem:
- Sprawdzic obecny zakres skryptu `check-polish-mojibake`.
- Sprawdzic, ktore aktywne dokumenty powinny wejsc do nowego guardu.
- Nie rozszerzac guardu na cala historyczna lawine run reportow.

Guard/test:
- `check:polish-runtime` albo obecny odpowiednik.
- `check:polish-active-docs` dla aktywnych docs i wejsc project-memory.
- Test, ze guard wykrywa typowe sekwencje mojibake.

Audyt po etapie:
- Sprawdzic, czy runtime guard nadal jest szybki.
- Sprawdzic, czy docs guard lapie realne krzaki.
- Sprawdzic, czy release gate nie zostal przypadkowo zablokowany przez stare archiwum.

Done condition:
- Guard nie udaje, ze cale repo jest czyste, jesli skanuje tylko runtime.
- Aktywne docs maja osobny check.

Ryzyko:
- Nie skanowac calej starej lawiny historycznych run reportow, bo zablokuje to development na archiwalnych krzakach.

---

### STAGE232F_GUARD_RUNNER_CROSS_PLATFORM_CLEANUP

Priorytet: P3  
Typ: developer tooling / CI hygiene  
Status: DO_WDROZENIA_PO_232E

Problem:
- `package.json` ma bardzo dlugi guard/lint chain z Windows-specific `npm.cmd`.
- To moze byc problemem w Linux/CI/Vercel i myli kolejnych developerow.
- Repo ma juz osobne `verify:closeflow` / `verify:closeflow:quiet`, wiec trzeba uporzadkowac release gate.

Zakres:
- Nie przepisywac wszystkich guardow naraz.
- Ustalic jeden glowny release gate.
- Przepisac runner na cross-platform Node, jesli `npm.cmd` jest w aktywnym skrypcie wymaganym poza lokalnym Windowsem.

Audyt przed etapem:
- Sprawdzic `package.json`, scripts, aktualne run reporty i uzywane komendy.
- Ustalic, ktory gate jest faktycznie produkcyjny.
- Nie wycinac guardow bez mapy zaleznosci.

Guard/test:
- Test odpalenia glownego release gate na Windows i w Linux shell/CI, jesli dostepne.
- `npm run verify:closeflow:quiet` jako glowny kandydat release gate.

Audyt po etapie:
- Sprawdzic, czy developer wie, ktory guard jest glowny.
- Sprawdzic, czy Windows i Linux nie maja sprzecznych sciezek.
- Sprawdzic, czy nie wycieto starych guardow odpowiedzialnych za regresje.

Done condition:
- Brak Windows-only komend w skryptach, ktore maja dzialac w CI/Linux.
- Developer wie, ktory guard jest glowny przed commitem/pushem.

Ryzyko:
- Nie wycinac istniejacych guardow bez mapy zaleznosci, bo release gate moze przestac lapac stare regresje.

---

## Kolejność wdrożenia rekomendowana

1. `STAGE232A_PUBLIC_PREVIEW_ROUTES_PRODUCTION_LOCK`
2. `STAGE232B_CHUNK_BOUNDARY_RUNTIME_STABILITY`
3. `STAGE232C_AUTH_ENV_FAIL_CLOSED`
4. `STAGE232D_DOCS_ENCODING_SWEEP`
5. `STAGE232E_POLISH_MOJIBAKE_GUARD_SCOPE`
6. `STAGE232F_GUARD_RUNNER_CROSS_PLATFORM_CLEANUP`

## Czego nie robic teraz

- Nie mieszac tych etapow z migracja kafelkow UI.
- Nie ruszac SQL/Supabase RLS w etapach 232A/232B/232D/232E/232F.
- Nie robic wielkiego refactoru `App.tsx` przy okazji public preview cleanup.
- Nie przepisywac calego `_project/07_NEXT_STEPS.md` tylko po to, zeby usunac stare mojibake.
- Nie blokowac rozwoju aplikacji na porzadkach docs/runner, jesli 232A-232C sa zamkniete.

## Obsidian update payload

Docelowy wpis do Obsidiana:

- data i godzina: 2026-06-12 20:23 Europe/Warsaw
- typ wpisu: backlog napraw po audycie ukrytych problemow
- project: CloseFlow / LeadFlow
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- docelowy plik: `07_SCIAGA_PLIKOW` i `11_RYZYKA_BUGI_I_DLUG_TECHNICZNY` oraz link z `04_KIERUNEK_DO_WDROZENIA`
- decyzja: najpierw app/product safety, potem technical/doc hygiene
- etapy: STAGE232A-F
- status: zapisane w repo `_project/07_REPAIR_STAGES_HIDDEN_AUDIT_FINDINGS.md`; Obsidian lokalny DO_SYNCHRONIZACJI
