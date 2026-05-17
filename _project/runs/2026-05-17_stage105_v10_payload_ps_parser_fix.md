# Stage105 V10 - payload PS parser fix

Status: prepared by APPLY script.

Facts:
- V8 failed before gates because the patch tool embedded an unescaped template literal from TaskCreateDialog.
- V10 avoids generated JS string surgery for TaskCreateDialog and copies a canonical payload file instead.
- V10 keeps mass preflight and writes gate logs to _project/stage105_v10_gate_logs/.

Changes:
- Quick task modal uses event-form-vnext source.
- Calendar create/edit modals remain on event-form-vnext source.
- Cases delete visible text action avoids header danger plaque and uses subtle trash source.
- Stage105 guard is literal-check based and included in quiet gate.

Manual check after PASS:
- Global quick action: Zadanie.
- Calendar: add task, add event, edit entry.
- Cases: visible Usun action has no red plaque.