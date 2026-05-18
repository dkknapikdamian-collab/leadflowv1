# 2026-05-18 - Stage115 CaseDetail runtime crash hotfix

## Status
DO WDROŻENIA / P0.

## Cel etapu
Naprawić runtime crash wejścia w szczegóły sprawy po Stage113/Stage114: `TypeError: p.useWorkspace is not a function` oraz dopisać do pamięci projektu, że Stage113/Stage114 po teście Damiana są częściowe i niezamknięte.

## Scan-first confirmation

- Repo: `dkknapikdamian-collab/leadflowv1`.
- Branch docelowy: `dev-rollout-freeze`.
- Lokalna ścieżka robocza: `C:\Users\malim\Desktop\biznesy_ai\2.closeflow`.
- Źródło prawdy dla kodu: repo aplikacji.
- Źródło prawdy dla statusu operacyjnego: Obsidian `10_PROJEKTY/CloseFlow_Lead_App/`.
- Zdalnie potwierdzony plik problemu: `src/pages/CaseDetail.tsx`.
- Zdalnie potwierdzony release gate: `scripts/closeflow-release-check-quiet.cjs`.
- Ryzyko: lokalny repo może mieć nowsze zmiany niż zdalny branch, dlatego paczka robi backup dotykanych plików przed patchem.

## FAKTY Z KODU / PLIKÓW

- `CaseDetail.tsx` zawiera błędny import `useWorkspace` z `react`.
- `useWorkspace` jest custom hookiem i powinien być importowany z `../hooks/useWorkspace`.
- W górze `CaseDetail.tsx` istnieje bałagan markerowo-komentarzowy wokół importów Stage16O/Stage16M, który zwiększa ryzyko komentowania albo ukrywania importów.
- `scripts/closeflow-release-check-quiet.cjs` ma centralną listę testów release gate i Stage115 powinien dopisać tam guardy regresji.

## DECYZJE DAMIANA

- Nie pushować samodzielnie z ChatGPT.
- Dostarczyć ZIP oraz jedno polecenie PowerShell.
- CaseDetail crash jest P0 i ma iść przed logo, layoutem i kalendarzem.
- Obsidian nie może udawać, że Stage114 przeszedł.

## HIPOTEZY / PROPOZYCJE AI

- Hipoteza techniczna: po bundlowaniu React jest aliasowany jako namespace, więc błędny import/wywołanie wychodzi w runtime jako `p.useWorkspace`.
- Propozycja: naprawić minimalnie import i import-zone, nie mieszać w tym samym etapie Radix warning, logo, kalendarza ani odstępów layoutu.

## ZMIENIONE PLIKI

- `src/pages/CaseDetail.tsx`
- `tests/stage115-case-detail-useworkspace-import-contract.test.cjs`
- `tests/stage115-case-detail-render-runtime-contract.test.cjs`
- `scripts/closeflow-release-check-quiet.cjs`
- `_project/runs/2026-05-18_stage115_case_detail_runtime_crash_hotfix.md`
- `_project/06_GUARDS_AND_TESTS.md`
- `_project/07_NEXT_STEPS.md`
- `_project/08_CHANGELOG_AI.md`
- `_project/12_IMPLEMENTATION_LEDGER.md`
- `_project/14_TEST_HISTORY.md`
- Obsidian: `10_PROJEKTY/CloseFlow_Lead_App/2026-05-18 - CloseFlow Stage113 Stage114 manual test status not closed.md`
- Obsidian: `10_PROJEKTY/CloseFlow_Lead_App/2026-05-18 - CloseFlow Stage115 CaseDetail runtime crash hotfix.md`

## DLACZEGO TE PLIKI

- `CaseDetail.tsx` jest źródłem runtime crasha.
- Testy Stage115 zamykają regresję na poziomie importu i kontraktu route/runtime.
- Quiet release gate musi łapać ten błąd przed Vercel i przed ręcznym testem.
- `_project/` i Obsidian muszą odróżnić faktycznie zamknięte rzeczy od niedomkniętych Stage113/Stage114.

## TESTY AUTOMATYCZNE

Do uruchomienia przez APPLY:

```powershell
node --test tests/stage115-case-detail-useworkspace-import-contract.test.cjs
node --test tests/stage115-case-detail-render-runtime-contract.test.cjs
npm run build
npm run verify:closeflow:quiet
```

## GUARDY

- Guard failuje, jeśli `CaseDetail.tsx` importuje `useWorkspace` z `react`.
- Guard wymaga aktywnego importu `useWorkspace` z `../hooks/useWorkspace`.
- Guard failuje, jeśli import-like text zostanie ukryty w block comment w strefie importów CaseDetail.
- Guard wymaga obecności default export route component.
- Guard sprawdza, że quiet release gate zawiera testy Stage115.

## TESTY RĘCZNE

Status: TEST RĘCZNY DO WYKONANIA PRZEZ DAMIANA PO WDROŻENIU.

Damian sprawdza:

1. Wejść w listę spraw.
2. Otworzyć dowolną sprawę.
3. Odświeżyć `/case/...`.
4. Odświeżyć `/cases/...`, jeśli route istnieje.
5. Konsola bez:
   - `p.useWorkspace is not a function`,
   - `APP_ROUTE_RENDER_FAILED`,
   - `ReferenceError`.
6. Ekran sprawy pokazuje dane, nie biały/pusty crash.

## POTWIERDZENIA DAMIANA - test po wdrożeniu Stage113/Stage114

### Status
PARTIAL / NIEZAMKNIĘTE.

### Stage113 - logo
1. Sidebar desktop: NIEZAMKNIĘTE.
2. Mobile/top/drawer: DO POPRAWY.
3. Kolejne miejsce występowania logo: DO POPRAWY.
4. Login: BRAK LOGA.

### Stage114 - Calendar P0 batch
1. Mojibake / teksty: DO POPRAWY.
2. Wpisy po refreshu: NIEPOPRAWIONE.
3. `+1D` / `+1W`: NIEPOPRAWIONE.
4. Modal edycji: NIEPOPRAWIONE.
5. Month grid / selected day ogólnie: OK.

### Nowe błędy zgłoszone
- `/case/:id` crashuje: `TypeError: p.useWorkspace is not a function`.
- Konsola pokazuje `APP_ROUTE_RENDER_FAILED`.
- Konsola pokazuje Radix warning: `Missing Description or aria-describedby`.
- Kartoteka leada ma duży pusty odstęp między sekcjami.
- W kliencie nie powinno być widoku leadów.

## BRAKI I RYZYKA

- Stage115 nie naprawia logo, kalendarza, Radix warningów, dużego odstępu w leadzie ani widoku leadów w kliencie.
- Jeżeli `npm run verify:closeflow:quiet` wyłoży się na znanym długu Stage114, należy wkleić log i zdecydować, czy robimy osobny batch P0/P1.
- Jeżeli lokalny `CaseDetail.tsx` różni się mocno od zdalnego, patcher może przerwać pracę zamiast zgadywać.

## WPŁYW NA OBSIDIANA

- Dodana osobna notatka statusowa Stage113/Stage114, żeby dashboard nie pudrował partiala.
- Dodana osobna notatka Stage115 z P0 hotfixem.

## WPŁYW NA KIERUNEK ROZWOJU

- Priorytet po Stage115: najpierw odzyskać stabilność ekranów krytycznych, dopiero potem wrócić do UI/logo/kalendarza.

## NASTĘPNY KROK

Po udanym pushu Stage115 Damian robi test ręczny CaseDetail. Jeśli przejdzie, następny etap: Radix warning + klient nie pokazuje leadów + lead detail spacing jako osobny batch P1.

## GIT / ZIP STATUS

- Tryb: ZIP + lokalny PowerShell.
- Push wykonuje Damian lokalnie przez `-DoPush`.
- ChatGPT nie wykonał pusha.
