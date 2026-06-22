# 04_CHATGPT_VS_CODEX_READ_SCOPE_POLICY_SYNC_2026_06_22

Data: 2026-06-22 Europe/Warsaw
Status: ACTIVE_POLICY_SYNC
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Canonical name: CloseFlow / LeadFlow

## Decyzja Damiana

Zakres czytania rozdzielamy na dwa tryby.

## 1. ChatGPT / czat audytowy Damiana

ChatGPT w rozmowie z Damianem moze czytac szeroko repo, _project i Obsidian, kiedy Damian prosi o:

- audyt,
- weryfikacje etapu,
- sprawdzenie kolejki,
- szukanie driftu,
- porownanie repo i Obsidiana,
- cleanup,
- mapowanie zaleznosci,
- szukanie duplikatow,
- sprawdzenie, czy etap juz istnieje,
- broad scan.

Cel: czat ma sprawdzic stan faktyczny i nie zgadywac. Szeroki odczyt w czacie jest dozwolony, jezeli zadanie tego wymaga.

## 2. Cloud Codex / AI developer / agent wykonawczy

Cloud Codex, AI developer i inni agenci wykonawczy nie maja czytac wszystkiego automatycznie.

Maja zaczynac od:

1. AGENTS.md,
2. _project/00_AI_START_SPIS_TRESCI.md,
3. wlasciwego routera / TOC,
4. centralnych plikow Obsidiana wymaganych dla etapu,
5. konkretnych plikow runtime, guardow i testow wskazanych przez etap.

Moga rozszerzyc skan tylko wtedy, gdy etap, blad albo guard tego wymaga. W raporcie musza wpisac, co przeczytali, czego celowo nie przeczytali i dlaczego.

## 3. Wazna roznica

To, ze czat Damiana moze wykonac szeroki audyt, nie znaczy, ze wykonawca ma automatycznie skanowac cale repo albo grzebac poza zakresem etapu.

To, ze Codex ma ograniczac tokeny, nie znaczy, ze czat Damiana ma zgadywac przy audycie.

## 4. Do zastosowania od razu

Przy etapach typu STAGE232G_R0 Calendar audit:

- czat moze czytac szeroko, bo celem jest wykrycie driftu, starych logik i rozjazdow,
- wykonawca/Codex ma czytac selektywnie: router, pliki kalendarza, guardy i wskazane centralne pliki,
- jezeli R0 wymaga szerszego skanu, wykonawca ma to uzasadnic w raporcie.

## 5. Zakres tej zmiany

Docs/policy only.

Nie ruszano:

- runtime,
- SQL/RLS,
- finanse,
- Braki/Blokady,
- Owner Control,
- Calendar runtime,
- Google Calendar integracji.
