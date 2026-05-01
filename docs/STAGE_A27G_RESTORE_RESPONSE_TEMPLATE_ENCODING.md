# Stage A27G - restore response template encoding with regex patch

## Cel

Naprawia A27F, gdzie patch Node szukał dokładnego `FolderKanban,\n`, a lokalny plik mógł mieć inne końce linii.

## Zmiana

A27G:

- przywraca `src/components/Layout.tsx` i `src/pages/ResponseTemplates.tsx` z czystego commita `f33ff590c4f64253f027f95ed9fe6f24fab477d0`,
- używa regexów odpornych na CRLF/LF,
- przywraca menu `Odpowiedzi`,
- przywraca ikonę `MessageSquareText`,
- ustawia archiwizację szablonu w UI zamiast twardego usuwania,
- czyści osierocone pliki po nieudanych A27D/A27E/A27F.

## Guardy

Skrypt odpala:

```text
node scripts/check-a27c-response-templates-sql-fix.cjs
node scripts/check-a27g-response-template-encoding.cjs
npm.cmd run check:polish-mojibake
npm.cmd run test:critical
npm.cmd run build
```

Commit i push idą dopiero po zielonych testach.
