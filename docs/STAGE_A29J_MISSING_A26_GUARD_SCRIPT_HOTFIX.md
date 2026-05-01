# A29J - missing A26 guard script hotfix

## Cel

Domknąć niedokończony pakiet A29F/A29G/A29H/A29I bez cofania zmian.

## Problem

Po przejściu A29F, A29, A28 i A27G skrypt zatrzymał się na:

```text
npm error Missing script: "check:a26-activities-ai-drafts-supabase"
```

Plik guarda A26 istnieje:

```text
scripts/check-a26-activities-ai-drafts-supabase.cjs
```

Brakowało tylko aliasu w `package.json`.

## Zmiana

Dodano brakujący skrypt:

```json
"check:a26-activities-ai-drafts-supabase": "node scripts/check-a26-activities-ai-drafts-supabase.cjs"
```

## Nie zmieniono

- Nie cofnięto A26/A27/A28/A29.
- Nie przywrócono osobnych stubów API Vercel.
- Nie przywrócono Firebase jako docelowego runtime auth.
- Nie zmieniono UI.
- Nie zmieniono Supabase schema.

## Kryterium

Aktualny `HEAD` z wszystkimi etapami przechodzi checki, build i pushuje jeden commit naprawczy.
