# FAZA 0 — Etap 0.2 — Mapa domen / deploymentów / publicznych źródeł

## Cel

Rozdzielić aktualną aplikację CloseFlow / LeadFlow od landingów, domen marketingowych, starych preview i obcych/archiwalnych źródeł.

Bez tej mapy audytor może sprawdzać publiczny landing albo stary adres i błędnie uznać, że audytuje aktualny produkt.

## Jedno źródło prawdy dla aplikacji

| Obszar | Aktualny status | Źródło prawdy |
|---|---|---|
| Repo aplikacji | aktualne | `github.com/dkknapikdamian-collab/leadflowv1` |
| Branch roboczy/release | aktualny | `dev-rollout-freeze` |
| Domyślny lokalny katalog | aktualny lokalnie | `C:\Users\malim\Desktop\biznesy_ai\2.closeflow` |
| Build | aktualny | `npm run build` |
| Release evidence | aktualny | `npm run audit:release-evidence` |
| Preview/release URL | do potwierdzenia przy każdym release | wynik `RELEASE_PREVIEW_URL`, `APP_URL` albo Vercel preview |

## Publiczne domeny i źródła

| Źródło publiczne | Typ | Czy audytować jako aplikację? | Decyzja |
|---|---|---:|---|
| `leadflow-appv1.vercel.app` | prawdopodobny aktualny deployment aplikacji | tak, jeśli zgadza się z evidence gate | Audytować tylko po potwierdzeniu commita i brancha w `RELEASE_CANDIDATE_EVIDENCE_2026-05-02.md`. |
| `closeflow.studio` | landing / domena marketingowa albo starsze źródło | nie, dopóki nie jest wskazana w release evidence | Nie traktować jako aktualnej aplikacji bez jawnego wpisu w evidence gate. |
| `getcloseflow.com` | landing / domena marketingowa albo starsze źródło | nie, dopóki nie jest wskazana w release evidence | Nie traktować jako aktualnej aplikacji bez jawnego wpisu w evidence gate. |
| lokalny `localhost` / Vite | środowisko developerskie | tylko do testów lokalnych | Nie używać jako dowodu gotowości publicznej bez deploymentu. |

## Reguła audytu

Audytor ma prawo oceniać tylko źródło wskazane w:

1. `docs/release/RELEASE_CANDIDATE_EVIDENCE_2026-05-02.md`
2. aktualnym branchu `dev-rollout-freeze`
3. aktualnym commicie z evidence gate
4. preview URL wpisanym w evidence gate

Jeżeli URL nie zgadza się z evidence gate, wynik audytu jest nieważny dla release.

## Co jest aplikacją

Aplikacją jest repo `leadflowv1` na branchu `dev-rollout-freeze`, zbudowane przez `npm run build` i wdrożone na URL wskazany w release evidence.

## Co jest landingiem

Landingiem jest publiczna strona marketingowa, która może opisywać produkt, cennik, waitlistę, demo albo zapowiedzi. Landing nie jest dowodem, że funkcje są aktywne w aplikacji.

## Co jest stare / archiwalne / niepewne

Każdy URL, który nie jest wpisany w aktualny release evidence, traktujemy jako niepewny. Może być stary, archiwalny, marketingowy albo połączony z inną wersją.

## Kryterium zakończenia Etapu 0.2

Etap jest zakończony, gdy:

- repo zawiera ten dokument,
- `package.json` zawiera `audit:release-evidence`,
- audytor ma jasną instrukcję, który URL sprawdzać,
- publiczne domeny nie są mieszane z aktualną aplikacją bez dowodu w evidence gate.
