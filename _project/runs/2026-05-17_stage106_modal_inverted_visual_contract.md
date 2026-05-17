# Stage106 - modal inverted visual contract

Status: prepared by package.

Decision:
- Stage105 was technically green but product visual check failed.
- Quick task, calendar create task, calendar create event and calendar edit entry must use one inverted visual contract.
- Contract: dark modal shell/cards, white fields, dark field text, blue focus, integrated dark footer.

Facts:
- Previous screenshots showed mixed light body, dark inputs and green focus.
- Cause: skin/global input rules can override event-form-vnext fields unless Stage106 uses higher skin-scoped selectors.

Automatic gates:
- Stage102 modal source guard
- Stage105 modal no dark inputs guard
- Stage106 inverted visual contract guard
- Stage95 destructive action guard
- Stage98B mojibake guard
- npm run build
- npm run verify:closeflow:quiet

Manual test after PASS:
- Global quick action Zadanie.
- Calendar add task.
- Calendar add event.
- Calendar edit entry.
- Cases visible delete action.
