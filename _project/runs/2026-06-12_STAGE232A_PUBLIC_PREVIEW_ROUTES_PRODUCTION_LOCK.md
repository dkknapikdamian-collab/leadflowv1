# 2026-06-12_STAGE232A_PUBLIC_PREVIEW_ROUTES_PRODUCTION_LOCK

- data i godzina: 2026-06-12 21:15 Europe/Warsaw
- stage: STAGE232A_PUBLIC_PREVIEW_ROUTES_PRODUCTION_LOCK
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- canonical_name: CloseFlow / LeadFlow
- Obsidian folder: 10_PROJEKTY/CloseFlow_Lead_App
- operator: ChatGPT / GitHub connector

## FAKTY Z KODU / PLIKOW

- `src/App.tsx` mial publiczne trasy:
  - `/ui-preview-vnext` -> bezposrednio renderowalo `<UiPreviewVNext />`
  - `/ui-preview-vnext-full` -> bezposrednio renderowalo `<UiPreviewVNextFull />`
- `src/pages/UiPreviewVNext.tsx` zawiera fixture dane wygladajace jak realne kontakty, m.in. imiona/nazwiska, telefon i e-mail.
- `_project/07_REPAIR_STAGES_HIDDEN_AUDIT_FINDINGS.md` oznacza STAGE232A jako P1 / app safety / production hygiene / DO_WDROZENIA.

## DECYZJE DAMIANA

- Wdrazac jako pierwszy etap: STAGE232A_PUBLIC_PREVIEW_ROUTES_PRODUCTION_LOCK.
- Nie ruszac STAGE232B-F.
- Nie ruszac SQL, Supabase RLS, auth env fallback, lazy/chunk, docs encoding, guard scope ani runner cleanup.
- Preview moze zostac jako bezpieczne narzedzie dev/admin/owner-only, nie usuwac bezmyslnie.

## HIPOTEZY / PROPOZYCJE AI

- Minimalny i najbezpieczniejszy wariant dla tego etapu to dev-only gate przez `import.meta.env.DEV`, bo nie wymaga tworzenia nowej logiki ról/admina.
- Poniewaz produkcja nie renderuje preview po tej zmianie, fixture dane nie sa publicznie widoczne w produkcyjnym routingu.

## DO POTWIERDZENIA

- Formalne `entity_id`, `workspace_id`, `project_id` dla CloseFlow w Obsidianie pozostaja DO_POTWIERDZENIA w tym etapie.
- Obsidian lokalny nie byl dostepny przez connector: OBSIDIAN_LOCAL_UNAVAILABLE.
- Build i pelny verify wymagaja lokalnego uruchomienia w repo `C:\Users\malim\Desktop\biznesy_ai\2.closeflow`.

## AUDYT PRZED ETAPEM

- stage: STAGE232A_PUBLIC_PREVIEW_ROUTES_PRODUCTION_LOCK
- gdzie Damian zobaczy efekt:
  - incognito / niezalogowany uzytkownik wchodzi na `/ui-preview-vnext`
  - incognito / niezalogowany uzytkownik wchodzi na `/ui-preview-vnext-full`
  - produkcja nie pokazuje preview, tylko redirect do `/login`
- trasy/ekrany:
  - `/ui-preview-vnext`
  - `/ui-preview-vnext-full`
- pliki dotykane:
  - `src/App.tsx`
  - `scripts/check-stage232a-public-preview-routes.cjs`
  - `_project/runs/2026-06-12_STAGE232A_PUBLIC_PREVIEW_ROUTES_PRODUCTION_LOCK.md`
- sprawdzenie, czy etap juz istnieje:
  - `src/App.tsx` mial publiczne route elementy bez `isLoggedIn`, bez admin gate i bez `import.meta.env.DEV`.
  - dedykowany guard STAGE232A nie istnial.
- podobne miejsca sprawdzone:
  - `/dev/funnel` juz ma `import.meta.env.DEV` gate.
  - fetch/search connector nie potwierdzil innych publicznych preview/demo routes; pelny lokalny grep nadal zalecany przy lokalnym smoke.
- realne problemy obok:
  - brak nowych problemow poza aktywnym zakresem STAGE232A.
  - fixture dane wygladajace jak realne kontakty sa czescia zakresu STAGE232A, nie osobnym wpisem do rejestru.
- czego nie ruszano:
  - SQL
  - Supabase RLS
  - auth runtime poza minimalnym route gate preview
  - CaseDetail, LeadDetail, ClientDetail layout
  - Visual Tile System
  - STAGE232B-F
  - duzy refactor App.tsx
- guard/test plan:
  - dodac guard blokujacy publiczne preview routes w produkcyjnym routingu
  - lokalnie uruchomic `node scripts/check-stage232a-public-preview-routes.cjs`
  - lokalnie uruchomic `npm run build`
  - lokalnie uruchomic `npm run verify:closeflow:quiet`, jezeli nie jest czerwony przez stare niezalezne rzeczy
  - lokalnie uruchomic `git diff --check`

## ZNALEZIONE PROBLEMY

- sprawdzono centralny rejestr: TAK
- wpisy powiazane z ruszanym modulem: brak wpisow na start w rejestrze
- nowe problemy znalezione: brak nowych poza aktywnym zakresem STAGE232A
- ID nowych wpisow w `_project/04_ZNALEZIONE_PROBLEMY_DO_ANALIZY.md`: brak
- problemy nie ruszone i dlaczego: STAGE232B-F nie ruszane zgodnie z zakazem zakresu
- czy wymagaja decyzji Damiana: nie dla STAGE232A; kolejne decyzje dopiero dla STAGE232B

## TESTY AUTOMATYCZNE

- GitHub static verification po commicie:
  - potwierdzono, ze `src/App.tsx` ma `const isDevelopmentPreviewEnabled = import.meta.env.DEV;`
  - potwierdzono, ze `/ui-preview-vnext` renderuje preview tylko gdy `isDevelopmentPreviewEnabled`, inaczej redirect do `/login` z `replace`
  - potwierdzono, ze `/ui-preview-vnext-full` renderuje preview tylko gdy `isDevelopmentPreviewEnabled`, inaczej redirect do `/login` z `replace`
- Lokalny runtime/build: NIEURUCHOMIONE w tym srodowisku, bo connector nie ma lokalnego repo/node_modules.

## GUARDY

Dodano:

- `scripts/check-stage232a-public-preview-routes.cjs`

Guard sprawdza klase bledu:

- preview routes musza byc ograniczone przez `import.meta.env.DEV`,
- preview routes nie moga bezposrednio renderowac komponentow preview publicznie,
- jesli preview ma dane wygladajace jak realne kontakty, obie trasy musza pozostac dev-only,
- w `App.tsx` maja istniec dokladnie dwie preview routes objete kontraktem STAGE232A.

## TESTY RECZNE

BRAK POTWIERDZONEGO TESTU RECZNEGO.

Test dla Damiana:

1. Otworz produkcje albo lokalny build produkcyjny niezalogowany/incognito.
2. Wejdz na `/ui-preview-vnext`.
3. Oczekiwane: brak preview; redirect do `/login`.
4. Wejdz na `/ui-preview-vnext-full`.
5. Oczekiwane: brak preview; redirect do `/login`.
6. Lokalny dev `npm run dev` moze nadal pokazac preview, bo gate jest `import.meta.env.DEV`.

## AUDYT PO ETAPIE

- co zmieniono:
  - `src/App.tsx`: dodano `isDevelopmentPreviewEnabled = import.meta.env.DEV` i przepieto obie preview routes na dev-only gate z fallbackiem do `/login`.
  - dodano guard STAGE232A.
  - dodano run report.
- czy przyczyna zostala naprawiona, czy tylko objaw ukryty:
  - przyczyna publicznej ekspozycji preview zostala naprawiona na poziomie routingu produkcyjnego.
  - fixture danych nie zanonimizowano, bo nie sa juz publicznie renderowane w produkcji; zostaja jako dev-only referencja UI.
- czy preview nie jest publiczne w produkcji:
  - kontrakt kodu: produkcja `import.meta.env.DEV === false`, wiec preview routes redirectuja do `/login`.
- czy dev/admin fallback nie wycieka do produkcji:
  - gate opiera sie tylko na `import.meta.env.DEV`; nie tworzono nowej pol-auth logiki.
- czy fixture dane wygladajace jak realne kontakty nie sa publicznie widoczne:
  - w produkcyjnym routingu nie sa renderowane.
- podobne miejsca sprawdzone:
  - `/dev/funnel` uzywa podobnego dev gate.
- nowe problemy znalezione:
  - brak nowych.
- problemy swiadomie nie ruszone:
  - STAGE232B-F.
  - anonimizacja fixture w plikach preview nie byla wykonana, bo dev-only gate spelnia warunek bez niszczenia referencji UI.
- guard/test dowodzacy:
  - `scripts/check-stage232a-public-preview-routes.cjs` dodany; wymaga lokalnego uruchomienia.
- manual test dla Damiana:
  - wejsc incognito na `/ui-preview-vnext` i `/ui-preview-vnext-full`; oczekiwany redirect do `/login`.
- wplyw na Obsidian/_project:
  - run report zapisany w `_project/runs/`.
  - Obsidian payload ponizej, bo Obsidian lokalny niedostepny.
- nastepny najlepszy krok:
  - lokalnie odpalic guard/build i dopiero po PASS uznac etap za zamkniety technicznie.

## BRAKI I RYZYKA

- Build nie zostal uruchomiony przez connector; lokalny build jest wymagany.
- `verify:closeflow:quiet` nie zostal uruchomiony przez connector; lokalny wynik wymagany.
- `git diff --check` nie zostal uruchomiony przez connector; lokalny wynik wymagany.
- Mozliwe ryzyko: jeżeli produkcja ma niestandardowo ustawione `import.meta.env.DEV`, nalezy to wychwycic buildem produkcyjnym. Standard Vite ustawia `DEV=false` w produkcji.
- Nie zmieniano fixture danych w preview, wiec dev mode nadal je pokazuje. To jest celowe, bo preview zostaje referencja UI.

## WPLYW NA OBSIDIANA

OBSIDIAN_LOCAL_UNAVAILABLE.

Payload do Obsidiana:

- data i godzina: 2026-06-12 21:15 Europe/Warsaw
- nazwa / alias wejściowy: STAGE232A_PUBLIC_PREVIEW_ROUTES_PRODUCTION_LOCK
- entity_id: DO_POTWIERDZENIA
- workspace_id: DO_POTWIERDZENIA
- project_id: CloseFlow / LeadFlow — DO_POTWIERDZENIA formalne ID
- idea_id: nie dotyczy
- report_id: 2026-06-12_STAGE232A_PUBLIC_PREVIEW_ROUTES_PRODUCTION_LOCK
- canonical_name: CloseFlow / LeadFlow
- folder Obsidiana: 10_PROJEKTY/CloseFlow_Lead_App
- mapa główna / pulpit: DO_POTWIERDZENIA
- mapa zależności: DO_POTWIERDZENIA
- ściąga plików: DO_POTWIERDZENIA
- typ wpisu: wdrozenie etapu / routing production lock / guard
- docelowa ścieżka: 04_KIERUNEK_DO_WDROZENIA, 09_TESTY_DO_WYKONANIA_I_WYNIKI, 11_RYZYKA_BUGI_I_DLUG_TECHNICZNY, 08_HISTORIA_ZMIAN
- status zapisu: zapisane w repo `_project/runs`; Obsidian lokalny DO_SYNCHRONIZACJI
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
- testy: guard dodany; lokalne uruchomienie wymagane
- audyt ryzyk po etapie: public preview gated produkcyjnie; glowne ryzyko to brak lokalnego builda w connectorze
- czego nie ruszano: SQL, Supabase, auth env fallback, STAGE232B-F, UI layouty
- następny krok: lokalnie uruchomic guard/build/diff-check; po PASS przejsc do STAGE232B_CHUNK_BOUNDARY_RUNTIME_STABILITY

## WPLYW NA KIERUNEK ROZWOJU

- STAGE232A zostal wdrozony kodowo w minimalnym wariancie dev-only gate.
- Kolejny etap pozostaje: STAGE232B_CHUNK_BOUNDARY_RUNTIME_STABILITY.

## NASTEPNY KROK

Uruchomic lokalnie:

```powershell
cd "C:\Users\malim\Desktop\biznesy_ai\2.closeflow"
$ErrorActionPreference = "Stop"

git status --short
node scripts/check-stage232a-public-preview-routes.cjs
npm run build
npm run verify:closeflow:quiet
git diff --check
git status --short
```

## GIT / ZIP STATUS

- App commit: `8d1ba69a041eb57ee059d7830a41e7d9b03b8035`
- Guard commit: `6e092570fbbd51234f7bb143be79accca9ed5c92`
- Run report commit: zapisany osobnym commitem po utworzeniu tego pliku
- ZIP: nie tworzono
- Push: zmiany zapisane bezposrednio na branchu `dev-rollout-freeze` przez GitHub connector na wyrazne polecenie `wdrazaj`
- Closure: KODOWO WDROZONE, TECHNICZNE ZAMKNIECIE WYMAGA LOKALNEGO PASS GUARD/BUILD/DIFF-CHECK
