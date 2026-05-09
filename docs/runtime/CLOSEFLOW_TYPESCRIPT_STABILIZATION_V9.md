# CloseFlow TypeScript stabilization v9

Status: finalizer after V6/V7 TypeScript audit.

Cel: usunac ostatni blad TS2345 w src/components/entity-actions.tsx bez ruszania konfliktow lead/client i bez resetowania poprzednich poprawek.

Naprawa:
- EntityActionButtonProps uzywa Omit<ButtonProps, tone), zeby ButtonProps nie wnosil ogolnego string tone,
- actionButtonClass dostaje tone zawezony do EntityActionTone,
- pipeline nadal odpala guardy konfliktow, limit Vercel Hobby, TypeScript audit i build.

Akceptacja:
- CLOSEFLOW_TYPESCRIPT_STABILIZATION_V9_CHECK_OK
- TYPESCRIPT_AUDIT_OK
- CLOSEFLOW_RUNTIME_STABILIZATION_TS_FINALIZER_V9_PACKAGE_OK
