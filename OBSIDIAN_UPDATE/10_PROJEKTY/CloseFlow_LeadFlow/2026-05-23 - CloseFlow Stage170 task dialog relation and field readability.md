# CloseFlow Stage170 — Task Dialog Relation and Field Readability

Data: 2026-05-23  
Status: przygotowano ZIP lokalny  
Typ: UI / TaskCreateDialog / relation picker / field readability

## FAKTY

- Po Stage169 czytelność pickera została poprawiona, ale zwykłe pola/selecty w `Nowe zadanie` dalej są słabe albo niewidoczne.
- Globalne `+ Zadanie` używa `TaskCreateDialog`.
- `TaskCreateDialog` nie miał pełnej opcji powiązania tak jak wydarzenie.
- `TopicContactPicker` jest wspólnym komponentem powiązania.

## DECYZJE DAMIANA

- Poprawić widoczność tekstu we wszystkich polach modalnych.
- Zmniejszyć `Nowe zadanie`, bo ma dużo niewykorzystanego miejsca.
- Dodać do zadania opcję powiązania z leadem/klientem/sprawą.
- Każda poprawka ma mieć guard.
- Bez pusha/deploya przed akceptacją.

## HIPOTEZY AI

- Trzeba dodać finalną warstwę CSS dla `input/select/textarea` z `-webkit-text-fill-color`.
- Trzeba zresetować odziedziczoną wysokość `event-form-vnext`.
- Najwłaściwsze źródło funkcji powiązania to `TopicContactPicker`.

## TESTY

```powershell
node scripts/check-stage170-task-dialog-relation-and-field-readability.cjs
npm.cmd run build
```

## NASTĘPNY KROK

Sprawdzić globalne `+ Zadanie`, potem `+ Wydarzenie` i `+ Lead` pod regresję.
