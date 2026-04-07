# Deployment rollout i środowiska

## Cel

Ten dokument zamraża sposób wdrażania zmian, żeby:
- testerzy nie dostawali każdej zmiany od razu,
- `main` nie był branch em roboczym,
- dało się normalnie testować preview,
- dało się szybko cofnąć produkcję.

To jest dokument operacyjny. Nie zmienia logiki produktu, auth, billingu ani modelu danych.

---

## Twardy model branchy

### 1. `main`
To jest branch stabilny.

Ma służyć wyłącznie do:
- produkcji,
- stałego linku dla testerów,
- wersji zaakceptowanych.

### 2. `dev-rollout-freeze`
To jest branch roboczy do własnych testów i kolejnych zmian.

Na tym branchu można:
- wdrażać kolejne poprawki,
- odpalać preview deploye,
- sprawdzać auth,
- sprawdzać billing,
- sprawdzać store,
- testować regresje,
- poprawiać bugi przed wejściem na `main`.

### 3. Feature branch
Dla większych zmian zalecany model:
- `feature/...`
- `fix/...`
- `chore/...`

Następnie:
- feature/fix/chore -> `dev-rollout-freeze`
- po akceptacji `dev-rollout-freeze` -> `main`

Jeżeli zmiana jest mała, można pracować bezpośrednio na `dev-rollout-freeze`, ale nie na `main`.

---

## Twarde zasady pracy

1. Żadnych bezpośrednich commitów funkcjonalnych na `main`.
2. `main` ma być tylko świadomie aktualizowany po testach.
3. Każda zmiana robocza ma być sprawdzona na preview linku.
4. Testerzy mają korzystać tylko z produkcyjnego linku przypiętego do `main`.
5. Własne testy mają iść tylko przez preview link z branchy roboczych.

---

## Docelowy flow wdrożenia

### Normalny cykl
1. Zmiana powstaje na `dev-rollout-freeze` albo na osobnym feature/fix branchu.
2. Vercel buduje preview deploy dla branchu roboczego.
3. Zmiana jest testowana na preview linku.
4. Dopiero po akceptacji zmiana trafia do `main`.
5. Produkcja i testerzy zmieniają się dopiero po wejściu na `main`.

### Minimalna wersja flow
Jeśli chcesz najprościej:
1. robisz zmianę na `dev-rollout-freeze`,
2. testujesz preview,
3. merge albo świadome przepchnięcie gotowej wersji do `main`,
4. testerzy dalej siedzą tylko na produkcyjnym linku.

---

## Vercel — ustawienia do zrobienia ręcznie

Tego nie ustawia repo automatycznie. To trzeba ustawić w panelu Vercela.

### Ustaw obowiązkowo
- `Production Branch = main`
- preview deploy dla każdego branchu roboczego i PR

### Efekt po ustawieniu
- push na `main` zmienia produkcję,
- push na `dev-rollout-freeze` daje osobny preview,
- testerzy nie dostają zmian z branchy roboczych,
- Ty masz osobny link do sprawdzania zmian.

---

## GitHub — zasady do ustawienia ręcznie

Jeśli chcesz to usztywnić bardziej, ustaw w repo:
- branch protection na `main`,
- brak direct push na `main`,
- merge do `main` tylko po review albo po własnej świadomej akceptacji,
- opcjonalnie wymagany green build przed wejściem na `main`.

Repo samo tego nie wymusi bez ustawień w GitHubie.

---

## Linki i środowiska

### Link dla testerów
Ma być jeden stały link produkcyjny:
- powiązany z `main`
- niezmieniany przy każdej roboczej poprawce

### Link do testów własnych
To ma być preview deploy:
- z `dev-rollout-freeze`
- albo z aktualnego feature/fix brancha

### Prosta zasada nazewnicza
- `main` = link dla testerów
- `dev-rollout-freeze` i inne branche = linki do własnych testów

---

## Rollback

## Co zapisywać
Przed każdym wejściem zmiany na `main` zapisz:
- hash ostatniego stabilnego commita produkcyjnego,
- krótki opis, co weszło,
- link do deploymentu albo PR.

### Minimalny rollback operacyjny
Jeśli produkcja siądzie:
1. znajdź ostatni stabilny commit na `main`,
2. wróć do niego przez revert albo redeploy poprzedniego deploymentu,
3. nie naprawiaj produkcji eksperymentalnie na żywo,
4. poprawka wraca najpierw na branch roboczy i preview.

### Zasada
Najpierw przywracasz działanie produkcji.
Dopiero potem szukasz spokojnie źródła błędu na branchu roboczym.

---

## Jak wskazać, który link jest do czego

### Produkcja
- branch: `main`
- odbiorca: testerzy
- cel: stabilna wersja

### Preview
- branch: `dev-rollout-freeze` albo feature/fix branch
- odbiorca: Ty
- cel: własne testy przed wypchnięciem na `main`

---

## Kryterium zakończenia etapu

Etap uznajemy za domknięty, gdy:
- istnieje osobny branch roboczy,
- istnieje spisana zasada rolloutu,
- wiadomo, że `main` ma być tylko stabilne,
- wiadomo, że preview służy do własnych testów,
- wiadomo, jak cofnąć produkcję.
