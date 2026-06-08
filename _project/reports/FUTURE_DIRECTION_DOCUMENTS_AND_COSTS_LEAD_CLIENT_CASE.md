# FUTURE DIRECTION — Documents / Costs for Lead, Client and Case

Data: 2026-06-06 18:20 Europe/Warsaw
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Status: FUTURE DIRECTION / NIE WDRAŻAĆ TERAZ BEZ OSOBNEGO ETAPU

## Co zostało zweryfikowane

W repo istnieje już kierunek rozwoju aplikacji jako owner control system, a nie tani CRM. To jest zapisane w decyzjach po deep research CRM. fileciteturn157file0L13-L25

W changelogu są też świeższe bloki rozwoju wokół ruchu właściciela, lead/client operational badges, owner movement risk system i późniejszych etapów LeadDetail. To pokazuje, że aplikacja rozwija się w stronę kontroli ruchu sprzedażowego, nie tylko kart danych. fileciteturn156file0L36-L43 fileciteturn156file0L76-L100 fileciteturn156file0L171-L188

Nie znaleziono w kodzie osobnego, kompletnego modułu dokumentów ani kosztów jako wspólnego bytu dla lead / client / case. W aktualnym LeadDetail są szybkie akcje, work center, blokady i finanse/płatności, ale nie ma jeszcze pełnego modelu dokumentów ani kosztów transakcyjnych jako osobnej warstwy decyzyjnej. fileciteturn134file0L124-L145 fileciteturn137file0L69-L180

## Cel przyszłego kierunku

1. Dodać możliwość dołączania dokumentów do:
   - leadów,
   - klientów,
   - spraw.

2. Dodać koszty transakcji, czyli nie tylko potencjalną wartość / przychód, ale też:
   - koszty obsługi,
   - prowizje,
   - wydatki operacyjne,
   - ewentualne koszty dokumentów, usług i podwykonawców.

## Dlaczego to jest ważne

Dziś aplikacja patrzy głównie na ruch i potencjał. Kolejny poziom wartości to pokazanie nie tylko „ile można zarobić”, ale też „ile to kosztuje” i „jakie dokumenty blokują albo domykają temat”.

## Proponowana kolejność przyszłych etapów

### 1. Documents V1

- szybkie dodawanie dokumentu do leada / klienta / sprawy,
- nazwa pliku + typ + opcjonalna notatka,
- widoczna lista dokumentów w detail view,
- bez rozbudowanego DMS na start.

### 2. Costs / transaction expenses V1

- koszt jako osobny wpis finansowy obok potencjału,
- rozbicie na przychód / koszt / marża,
- widok w LeadDetail, ClientDetail i CaseDetail,
- bez księgowości i bez pełnego ERP.

### 3. Decision view upgrade

- lead / klient / sprawa mają pokazywać:
  - potencjał,
  - koszt,
  - marżę,
  - dokumenty brakujące / dodane,
  - blokery.

## Czego nie robić teraz

- Nie robić ciężkiego systemu dokumentów.
- Nie robić pełnego repozytorium plików bez potrzeby.
- Nie mieszać dokumentów z notatkami.
- Nie robić kosztów bez jasnego modelu, czy to koszt leadu, klienta czy sprawy.
- Nie rozszerzać tego bez osobnego etapu i guardów.

## Status

To jest zapis kierunku przyszłego. Nie zmienia runtime aplikacji.
