# A29H - missing A27 guard script hotfix

## Cel

Kontynuować niedokończone A29F/A29G bez rollbacku.

## Problem

A29G przeszło:

- `check:a29f-vercel-deploy-hotfix`,
- `check:a29-supabase-runtime-shell`,
- `check:a28-digest-notifications-pwa`.

Zatrzymało się na:

```text
npm error Missing script: "check:a27g-response-template-encoding"
```

Plik guarda istnieje w repo, ale brakowało aliasu w `package.json`.

## Zmiana

Dodano brakujące skrypty npm dla A27:

- `check:a27b-response-templates-supabase`,
- `check:a27c-response-templates-sql-fix`,
- `check:a27g-response-template-encoding`.

## Nie zmieniono

- Nie cofnięto A26/A27/A28/A29.
- Nie przywrócono osobnych stubów API Vercel.
- Nie zmieniono UI.
- Nie zmieniono Supabase schema.

## Kryterium

A29F/A29G/A29H przechodzą razem i commitują aktualny HEAD z wszystkimi etapami.
