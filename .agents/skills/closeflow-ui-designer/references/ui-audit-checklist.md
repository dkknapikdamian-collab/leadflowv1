# UI Audit Checklist

Before editing:

- Run `npm run audit:closeflow-ui-map`.
- Run `npm run audit:closeflow-style-map`.
- Read the generated docs in `docs/ui`.
- Identify the current source of truth.
- Identify local duplicates and overrides.
- Decide whether this is component, token, layout, or page composition work.

After editing:

- Run relevant check scripts.
- Run build.
- List changed files.
- State the new source of truth.
- State how to change the style globally next time.
