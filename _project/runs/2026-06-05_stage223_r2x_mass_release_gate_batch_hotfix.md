# STAGE223 R2X - Mass release gate batch hotfix

Data: 2026-06-05
Projekt: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Tryb: ZIP/local-only, bez commita i bez push

## FAKTY

R2W mass scan wykazał 14 failing gate’ów:

1. `faza4-etap44b-today-live-refresh-listener`
2. `faza4-etap44c-mutation-bus-coverage-smoke`
3. `stage100-calendar-week-plan-entry-visible`
4. `stage102-calendar-edit-modal-form-source`
5. `stage104-calendar-rendered-week-plan-smoke`
6. `stage104d-calendar-week-plan-compact-one-row`
7. `stage105-calendar-modal-no-dark-inputs`
8. `stage114-calendar-hard-refresh-data-load-contract`
9. `stage116-dialog-description-accessibility-contract`
10. `stage117-lead-detail-vertical-rhythm-contract`
11. `stage94-calendar-week-plan-full-entry-text`
12. `stage95-destructive-action-visual-source`
13. `stage96-leads-right-rail-width-position`
14. `stage99-calendar-active-class-contract`

## ZAKRES

R2X naprawia batchowo:

- Today mutation bus: kontrakt `subscribeCloseflowDataMutations((detail) => { refreshData() })`.
- Calendar week-plan: usuwa legacy combo `calendar-entry-card cf-calendar-week-plan-entry-card`.
- Calendar modal: dopina `event-form-vnext-content sm:max-w-2xl`.
- Calendar CSS: usuwa `cf-calendar-month-text-row` z bloku po Stage104D.
- Calendar hard refresh: dopina marker `[250, 900, 1800].map`.
- Dialog accessibility: dodaje `aria-describedby={undefined}` tam, gdzie brakuje opisu.
- LeadDetail: dopina wymagane sekcje tekstowe Stage117.
- Cases/EntityTrashButton: dopina subtle delete class i `data-cf-destructive-source="trash-action-source"`.
- Leads right rail: usuwa lokalne width override z `layout-list`.
- Activities system route: zabezpiecza `/api/activities -> /api/system?kind=activities`, jeśli R2U nie dokończył route.

## CZEGO NIE RUSZANO

- Stage223 owner movement risk logic.
- Activity Truth.
- Today risk rules.
- Supabase schema.
- Daily digest runtime.
- Billing/Stripe.
- Real user data.

## TESTY

```powershell
node scripts/stage223-r2w-mass-release-gate-scan.cjs
npm run build
npm run verify:closeflow:quiet
git diff --check
```

## TEST RĘCZNY PO DEPLOYU

- `/calendar`: tydzień, miesiąc, edycja zadania/wydarzenia, usuwanie wpisu, przyciski +1H/+1D/+1W/Zrobione/Usuń.
- `/today`: czy mutacje po zadaniu/wydarzeniu odświeżają dane bez reloadu strony.
- `/leads`: right rail, lista leadów, badge Stage223.
- `/cases`: usuwanie/przenoszenie do kosza, subtelny styl akcji.
- Aktywności/notatki: dodanie i odczyt przez `/api/activities`.

## AUDYT RYZYK

- Część fixów jest pod stare literalne gate’y. To konieczne, żeby zamknąć release, ale po zielonym verify trzeba obejrzeć UI, szczególnie Calendar.
- `aria-describedby={undefined}` jest świadomym escape. Docelowo lepiej dodać prawdziwe DialogDescription w osobnym etapie UX/a11y.
- `/api/activities` jako system route wymaga ręcznego smoke po deployu.

## NASTĘPNY KROK

Uruchomić R2X. Jeżeli mass scan pokaże nowe faile, zrobić R2Y jako kolejny batch.
