# STAGE170 Task Dialog Relation and Field Readability — raport

Data: 2026-05-23  
Projekt: CloseFlow / LeadFlow  
Zakres: UI / TaskCreateDialog / relation picker / field readability

## Cel

Naprawić:
- niewidoczny/za słaby tekst w polach modalnych poza pickerem Stage169,
- za duży modal `Nowe zadanie` z pustym miejscem,
- brak tej samej funkcji powiązania z leadem/klientem/sprawą w globalnym `+ Zadanie`.

## FAKTY

- `GlobalQuickActions.tsx` otwiera globalne `+ Zadanie` przez `TaskCreateDialog`.
- `TaskCreateDialog.tsx` używa `event-form-vnext`.
- Starsze style event-form i Stage164/165 mogą przeciekać na wysokość globalnego zadania.
- `TopicContactPicker` jest wspólnym komponentem powiązania.
- `buildTopicContactOptions`, `findTopicContactOption`, `resolveTopicContactLink` istnieją w `src/lib/topic-contact.ts`.

## DECYZJE DAMIANA

- Tekst w polach ma być widoczny.
- `Nowe zadanie` ma być mniejsze, bez wielkiej pustej przestrzeni.
- W zadaniu ma być opcja powiązania z leadem, klientem albo sprawą.
- Każda poprawka ma mieć guard.
- Lokalnie, bez pusha/deploya.

## HIPOTEZY AI

- Niewidoczny tekst wynika z niedopiętego `-webkit-text-fill-color` oraz dziedziczenia z ciemnego modala.
- Puste miejsce wynika z odziedziczonego fixed/tall height dla `.event-form-vnext`.
- Najbezpieczniej nie przepisywać formularza, tylko dodać picker i finalną warstwę CSS Stage170.

## Pliki

- `src/components/TaskCreateDialog.tsx`
- `src/styles/closeflow-task-dialog-relation-and-field-readability-stage170.css`
- `scripts/apply-stage170-task-dialog-relation-and-field-readability.cjs`
- `scripts/check-stage170-task-dialog-relation-and-field-readability.cjs`
- `docs/ui/CLOSEFLOW_STAGE170_TASK_DIALOG_RELATION_AND_FIELD_READABILITY.md`
- `docs/ui/CLOSEFLOW_STAGE170_RUNTIME_TASK_DIALOG_AUDIT.js`
- `_project/STAGE170_TASK_DIALOG_RELATION_AND_FIELD_READABILITY_REPORT.md`
- `OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/2026-05-23 - CloseFlow Stage170 task dialog relation and field readability.md`

## Testy automatyczne

```powershell
node scripts/check-stage170-task-dialog-relation-and-field-readability.cjs
npm.cmd run build
```

## Testy ręczne

- Globalny pasek → `+ Zadanie`.
- Sprawdzić:
  - tekst w polach i selectach jest widoczny,
  - nie ma wielkiej pustej przestrzeni,
  - jest `Powiąż z leadem, klientem albo sprawą`,
  - wybrane powiązanie zapisuje task z odpowiednim `leadId` / `caseId` / `clientId`.
- Sprawdzić regresję:
  - `+ Wydarzenie`,
  - `+ Lead`.

## Czego nie ruszano

- deploy
- push
- auth
- Supabase schema
- Google Calendar
- Stripe
- AI
