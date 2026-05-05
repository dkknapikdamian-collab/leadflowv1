# Stage88 - Lead Detail + Admin Feedback hotfix

Data: 2026-05-05  
Branch: dev-rollout-freeze

## Cel

Wdrożyć jedną paczką wszystkie problemy z feedbacku admin-tools:

1. usunąć dwa zbędne teksty pomocnicze z LeadDetail,
2. poprawić czytelność i overflow prawej kolumny / AI wsparcia,
3. oczyścić export admin feedback z mojibake,
4. usunąć `COMMIT_SHA_PLACEHOLDER` z exportu,
5. poprawić wybór targetu w debug-toolu,
6. poprawić Button Matrix, żeby preferował akcje aktualnej strony zamiast lewego menu.

## Zakres

### LeadDetail

Usunięto copy:

- `Dodaj zadanie albo wydarzenie, jeśli lead jest aktywny.`
- `Krótka historia kontaktu i przekazania tematu.`

Dodano marker:

- `STAGE88_LEAD_DETAIL_ADMIN_FEEDBACK_HOTFIX`

### CSS LeadDetail

Dodano marker:

- `STAGE88_LEAD_DETAIL_RIGHT_RAIL_READABILITY`

Zasady:

- prawa kolumna ma własny limit wysokości,
- prawa kolumna może scrollować,
- right-card nie ukrywa tekstu przez `overflow: hidden`,
- tekst w prawej kolumnie jest wymuszony na ciemny kolor,
- taby AI mają czytelne tło i zawijanie tekstu.

### Admin Feedback Export

Dodano marker:

- `ADMIN_FEEDBACK_EXPORT_SANITIZE_STAGE88`

Zasady:

- eksport sanitizuje stare mojibake z localStorage,
- eksport nie może zwrócić `COMMIT_SHA_PLACEHOLDER`,
- fallback to `unknown_local_build`.

### Admin DOM Targeting

Dodano marker:

- `ADMIN_TARGET_PRECISION_STAGE88`

Zasady:

- kliknięcie tekstu preferuje konkretny tekst/leaf,
- duże sekcje dostają karę scoringową,
- Button Matrix najpierw skanuje aktywny ekran,
- sidebar/nav nie dominuje w matrixie.

## Testy

- `check:stage88-lead-admin-feedback-hotfix`
- `test:stage88-lead-admin-feedback-hotfix`
- `verify:admin-tools`
- build

## Test ręczny po deployu

1. Wejdź w kartę leada.
2. Sprawdź, że tekst `Dodaj zadanie albo wydarzenie...` z prawego panelu zniknął.
3. Sprawdź, że tekst `Krótka historia kontaktu...` z historii kontaktu zniknął.
4. Przewiń prawą kolumnę: AI wsparcie ma być czytelne, bez białego tekstu na białym.
5. Kliknij `Bug`, kliknij mały tekst. Narzędzie powinno złapać tekst albo mały element, nie całą sekcję.
6. Kliknij `Buttons`. Matrix powinien pokazywać akcje strony, np. `Rozpocznij obsługę`, `Edytuj`, a nie głównie sidebar.
7. Export JSON nie może zawierać `COMMIT_SHA_PLACEHOLDER` ani krzaków typu `KlikniÄ™to`.
