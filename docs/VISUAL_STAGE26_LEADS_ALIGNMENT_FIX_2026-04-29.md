# Visual Stage26 — Leady visual alignment fix

## Cel

Poprawka po porownaniu screenshotu aplikacji z HTML.

Problem po Stage25:
- zakladka Leady jest juz stabilna technicznie,
- ale zawartosc nadal jest za waska i przesunieta za bardzo do srodka,
- prawy panel ma artefakty/czarne rogi i slaby kontrast,
- naglowek strony nie ma lokalnego przycisku AI jak we wzorcu HTML,
- lista i prawy rail nie maja szerokosci zgodnej z HTML.

## Zakres

Zmieniamy tylko UI zakladki Leady:
- szerokosc glownego widoku,
- layout listy i prawego panelu,
- kontrast prawego panelu,
- lokalny przycisk `Zapytaj AI`,
- drobne wyrownanie kart i metryk.

## Nie zmieniamy

- API,
- Supabase,
- auth,
- billing,
- dane,
- routing,
- handlery tworzenia leada,
- kosz,
- restore,
- search,
- modale.

## Weryfikacja

- `node scripts/check-visual-stage26-leads-alignment.cjs`
- `node scripts/check-polish-mojibake.cjs`
- `npm.cmd run build`

## Kryterium zakonczenia

Leady maja byc blizej HTML:
- content nie jest waska wyspa na srodku,
- metryki, search, lista i prawy panel pracuja w jednym szerokim layoucie,
- prawy panel jest bialy/czytelny bez czarnych rogow,
- przycisk AI jest w page head obok kosza i dodawania leada.
