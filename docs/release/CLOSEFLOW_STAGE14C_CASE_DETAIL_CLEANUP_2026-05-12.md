# CloseFlow Stage14C — CaseDetail cleanup

Data: 2026-05-12
Branch: dev-rollout-freeze

## Cel

Wyczyścić `/cases/:id` z paneli wskazanych jako zbędne:

- Roadmapa sprawy,
- dekoracyjny panel pod roadmapą, jeśli występuje jako znany helper panel,
- Portal i źródła,
- powtarzający się mały napis nazwy sprawy/klienta i status nad głównym tytułem.

## Zakres techniczny

Patch dotyczy tylko widoku `src/pages/CaseDetail.tsx`.

Nie usuwa:

- backendu portalu,
- API portalu,
- sprawy,
- zadań,
- wydarzeń,
- historii wpłat,
- statusów sprawy.

## Guard

`scripts/check-stage14c-case-detail-cleanup.cjs` sprawdza, że:

- w CaseDetail nie ma renderu `ActivityRoadmap`,
- nie ma panelu `Roadmapa sprawy`,
- nie ma panelu `Portal i źródła`,
- nie ma breadcrumbu `Sprawy / ...`,
- header nie używa tytułu/statusu więcej niż raz,
- główny tytuł, zadania, wydarzenia i rozliczenia nadal istnieją.

## Test ręczny

1. Wejdź w `/cases/:id`.
2. Sprawdź, że nie ma `Roadmapa sprawy`.
3. Sprawdź, że nie ma `Portal i źródła`.
4. Sprawdź, że header pokazuje nazwę sprawy tylko raz.
5. Sprawdź, że status nie jest zdublowany.
6. Sprawdź, że prawy rail nie zostawia pustej dziury.
