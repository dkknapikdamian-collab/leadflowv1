# STAGE220A30 - Case finance modal visual source truth

Data: 2026-06-04
Repo: `dkknapikdamian-collab/leadflowv1`
Branch: `dev-rollout-freeze`
Local path: `C:\Users\malim\Desktop\biznesy_ai\2.closeflow`
Tryb: local-only ZIP, bez pushu automatycznego

## Cel

Naprawić wizualne regresje w oknach finansów sprawy:

- przyciski `Koryguj` i `Usuń` w historii wpłat nie mogą nachodzić na siebie,
- okno `Dodaj wpłatę` ma mieć czytelne labelki i tekst,
- okno `Wartość sprawy i prowizja` ma mieć czytelne labelki i tekst,
- okna finansowe w `CaseDetail` mają używać wspólnego czytelnego rytmu jak okna `Dodaj wydarzenie` / `Dodaj notatkę`, zamiast starego ciemnego stylu finansowego.

## FAKTY

- UI finansów sprawy jest w `src/pages/CaseDetail.tsx`.
- Wspólne okno wydarzenia używa klas `event-form-vnext-content` i `closeflow-event-modal-readable`.
- Problem był wizualny: stare klasy finansowe powodowały ciemne tło, słabo widoczne labelki i zbyt ciasne akcje w wierszu historii płatności.

## DECYZJE DAMIANA

- Okna finansowe mają być podpięte do jednego źródła prawdy wizualnej jak okna dodawania wydarzenia/notatki.
- Przyciski w historii wpłat nie mogą na siebie nachodzić.
- Tekst i labelki w oknach finansowych mają być czytelne.

## ZAKRES ZMIAN

- `src/pages/CaseDetail.tsx`
  - dodany marker `STAGE220A30_CASE_FINANCE_MODAL_VISUAL_SOURCE_TRUTH`,
  - dodany import CSS `closeflow-case-finance-modal-stage220a30.css`,
  - klasy modalów historii/korekty/dodawania wpłaty/wartości sprawy/prowizji przepięte na czytelny shell `event-form-vnext-content closeflow-event-modal-readable`,
  - formularze i footery finansowe dostały wspólne klasy źródłowe,
  - poprawiono teksty i labelki w oknie dodawania wpłaty oraz wartości sprawy,
  - akcje w historii wpłat dostały dedykowaną klasę anty-overlap.
- `src/styles/closeflow-case-finance-modal-stage220a30.css`
  - nowy CSS źródłowy dla czytelnych okien finansowych.
- `scripts/check-stage220a30-case-finance-modal-vst.cjs`
  - guard regresji dla klas, tekstów i CSS.

## TESTY AUTOMATYCZNE

Do wykonania lokalnie:

```powershell
node scripts/check-stage220a30-case-finance-modal-vst.cjs
npm run build
```

## TESTY RĘCZNE

1. Otworzyć sprawę z wpłatą.
2. Kliknąć `Koryguj wpłatę`.
3. Sprawdzić, czy w historii przyciski `Koryguj` i `Usuń` nie nachodzą na siebie.
4. Kliknąć `Dodaj wpłatę`.
5. Sprawdzić, czy labelki, pola i opis są czytelne.
6. Kliknąć `Edytuj wartość/prowizję`.
7. Sprawdzić, czy okno `Wartość sprawy i prowizja` jest czytelne i zgodne z rytmem okien wydarzeń/notatek.
8. Sprawdzić mobilnie albo na węższym oknie, czy akcje przechodzą do kolejnego wiersza zamiast nachodzić na siebie.

## CZEGO NIE RUSZANO

- Schemat Supabase.
- Endpointy API.
- Kalkulacja finansów.
- Mechanika korekty jako osobny rekord `refund`.
- Logika usuwania wpłaty dodana w STAGE220A29.

## RYZYKA

- Jeśli lokalny stan nie zawiera jeszcze STAGE220A29, sama naprawa wizualna zadziała, ale przycisk `Usuń` może nie istnieć do czasu wdrożenia STAGE220A29.
- CSS jest celowo mocno zawężony do klas `case-finance-source-modal-stage220a30`, żeby nie przestylować innych modalów.

## NEXT STEP

Po pozytywnym buildzie i ręcznym teście wykonać selektywny commit i push na `dev-rollout-freeze`.
