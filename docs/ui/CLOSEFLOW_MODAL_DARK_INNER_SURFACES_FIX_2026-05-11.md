# CloseFlow — modal dark shell inner surfaces fix — 2026-05-11

## Cel

Dopiąć brakujące elementy po wdrożeniu ciemnej skórki modali.

Po testach ręcznych wyszło, że główny `DialogContent` jest już podpięty do jednego źródła prawdy, ale część wewnętrznych paneli nadal zostaje biała albo szara, bo korzysta z lokalnych klas typu:

- `bg-white`
- `bg-slate-50`
- `bg-amber-50`
- `rounded-2xl border`
- `rounded-3xl border`
- lokalne listy/pickery kontaktów

Ten pakiet naprawia to w jednym miejscu: `src/styles/closeflow-modal-visual-system.css`.

## Zakres

Zmieniamy tylko skórkę modali.

Nie zmieniamy:

- logiki formularzy,
- akcji przycisków,
- endpointów,
- zapisu danych,
- routingu,
- komponentu `DialogContent`,
- przepływów biznesowych.

## Co konkretnie poprawia CSS

1. Wewnętrzne sekcje formularzy nie są już białe.
2. Panele `Podstawowe dane`, `Dane podstawowe`, `Dane sprawy`, `Od do`, `Cykliczność wydarzenia` dostają ciemne tło.
3. Listy wyboru klienta / kontaktu w modalu sprawy nie zostają białymi wyspami.
4. Callouty typu żółty alert nie są kremową plamą, tylko ciemnym alertem z amber borderem.
5. Inputy i textarea zostają ciemne, z jasnym tekstem i zielonym focusem.
6. Nagłówki dostają minimalny bezpieczny odstęp, żeby tytuł nie wyglądał na ucięty przy brzegu.

## Pliki

- `src/styles/closeflow-modal-visual-system.css`
- `scripts/check-closeflow-modal-dark-inner-surfaces.cjs`
- `docs/ui/CLOSEFLOW_MODAL_DARK_INNER_SURFACES_FIX_2026-05-11.md`

## Test ręczny po wdrożeniu

Sprawdzić modale:

- Zaplanuj wydarzenie
- Nowe zadanie
- Nowy lead
- Szybki szkic
- Nowy klient
- Nowa sprawa
- Nowy szablon sprawy
- Nowy szablon odpowiedzi

Kryterium:

- brak dużych białych wysp wewnątrz formularzy,
- wszystkie modale są wizualnie tym samym systemem,
- przyciski nadal wykonują te same akcje,
- inputy są czytelne,
- title nie dotyka agresywnie krawędzi.
