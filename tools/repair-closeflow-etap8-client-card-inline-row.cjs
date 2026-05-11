#!/usr/bin/env node
/* CLOSEFLOW_ETAP8_CLIENT_CARD_INLINE_ROW repair */
const fs = require("fs");
const path = require("path");

const root = process.cwd();

function file(rel) {
  return path.join(root, rel);
}

function read(rel) {
  const abs = file(rel);
  if (!fs.existsSync(abs)) {
    throw new Error(`Missing required file: ${rel}`);
  }
  return fs.readFileSync(abs, "utf8");
}

function write(rel, content) {
  fs.writeFileSync(file(rel), content, "utf8");
}

function addClassValue(classes, cls) {
  const parts = classes.split(/\s+/).filter(Boolean);
  if (!parts.includes(cls)) parts.push(cls);
  return parts.join(" ");
}

function addClassToStaticClassNames(src, predicate, cls) {
  return src.replace(/className=(["'`])([^"'`]*?)\1/g, (match, quote, classes) => {
    if (!predicate(classes)) return match;
    return `className=${quote}${addClassValue(classes, cls)}${quote}`;
  });
}

function ensurePackageScript() {
  const rel = "package.json";
  const pkg = JSON.parse(read(rel));
  pkg.scripts = pkg.scripts || {};
  pkg.scripts["check:etap8-client-card-inline-row"] = "node scripts/check-closeflow-etap8-client-card-inline-row.cjs";
  write(rel, `${JSON.stringify(pkg, null, 2)}\n`);
}

function ensureCss() {
  const rel = "src/styles/clients-next-action-layout.css";
  let css = read(rel);

  const block = `
/* CLOSEFLOW_ETAP8_CLIENT_CARD_INLINE_ROW */
.main-clients-html .client-row.cf-client-row-inline {
  display: grid;
  grid-template-columns:
    minmax(2.25rem, auto)
    minmax(280px, 1.5fr)
    minmax(120px, 0.45fr)
    minmax(260px, 0.95fr)
    auto;
  align-items: center;
  gap: 0.875rem;
}

.main-clients-html .cf-client-main-cell {
  min-width: 0;
}

.main-clients-html .cf-client-next-action-inline {
  min-width: 0;
  align-self: stretch;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.main-clients-html .cf-client-row-actions {
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.5rem;
  white-space: nowrap;
}

@media (max-width: 1200px) {
  .main-clients-html .client-row.cf-client-row-inline {
    grid-template-columns:
      minmax(2.25rem, auto)
      minmax(240px, 1fr)
      minmax(220px, 0.9fr);
  }

  .main-clients-html .cf-client-cases-cell,
  .main-clients-html .cf-client-row-actions {
    grid-column: 2 / -1;
  }
}

@media (max-width: 760px) {
  .main-clients-html .client-row.cf-client-row-inline {
    grid-template-columns: auto minmax(0, 1fr);
    align-items: start;
  }

  .main-clients-html .cf-client-next-action-inline,
  .main-clients-html .cf-client-cases-cell,
  .main-clients-html .cf-client-row-actions {
    grid-column: 2 / -1;
  }

  .main-clients-html .cf-client-row-actions {
    justify-content: flex-start;
    flex-wrap: wrap;
  }
}
`.trim();

  const marker = "/* CLOSEFLOW_ETAP8_CLIENT_CARD_INLINE_ROW */";
  if (css.includes(marker)) {
    const start = css.indexOf(marker);
    const nextMarker = css.indexOf("\n/* CLOSEFLOW_", start + marker.length);
    if (nextMarker >= 0) {
      css = `${css.slice(0, start).trimEnd()}\n\n${block}\n\n${css.slice(nextMarker + 1).trimStart()}`;
    } else {
      css = `${css.slice(0, start).trimEnd()}\n\n${block}\n`;
    }
  } else {
    css = `${css.trimEnd()}\n\n${block}\n`;
  }
  write(rel, css);
}

function ensureClientsMarkup() {
  const rel = "src/pages/Clients.tsx";
  let src = read(rel);

  if (!src.includes('data-client-card-wide-layout="true"')) {
    throw new Error('Clients.tsx does not contain data-client-card-wide-layout="true". Stop: wrong file state.');
  }

  src = addClassToStaticClassNames(
    src,
    (classes) => /\bclient-row\b/.test(classes) && /\brow\b/.test(classes),
    "cf-client-row-inline"
  );

  src = addClassToStaticClassNames(
    src,
    (classes) => /\blead-main-cell\b/.test(classes),
    "cf-client-main-cell"
  );

  src = addClassToStaticClassNames(
    src,
    (classes) => /\blead-value-cell\b/.test(classes) || /\bclient-cases-cell\b/.test(classes) || /\bclient-case-cell\b/.test(classes),
    "cf-client-cases-cell"
  );

  src = addClassToStaticClassNames(
    src,
    (classes) => /\bcf-client-next-action-panel\b/.test(classes) || /\bclient-card-next-action-block\b/.test(classes),
    "cf-client-next-action-inline"
  );

  src = addClassToStaticClassNames(
    src,
    (classes) => (
      /\bcf-client-row-actions\b/.test(classes) ||
      /\bclient-row-actions\b/.test(classes) ||
      /\bclient-card-actions\b/.test(classes) ||
      /\blead-row-actions\b/.test(classes) ||
      /\blead-card-actions\b/.test(classes) ||
      /\bcard-actions\b/.test(classes)
    ),
    "cf-client-row-actions"
  );

  if (!src.includes("cf-client-row-actions")) {
    // Conservative fallback: add the class to likely inline action containers inside Clients page.
    // This avoids touching global components while still handling common utility-only action wrappers.
    let changed = false;
    src = src.replace(/className=(["'`])([^"'`]*(?:inline-flex|flex)[^"'`]*items-center[^"'`]*(?:justify-end|justify-start|gap-[0-9.]+)[^"'`]*)\1/g, (match, quote, classes, offset) => {
      const before = src.slice(Math.max(0, offset - 1400), offset);
      const after = src.slice(offset, Math.min(src.length, offset + 1400));
      const localClientContext = before.includes("data-client-card-wide-layout") || before.includes("client-row") || after.includes("Otwórz") || after.includes("openClient") || after.includes("client.id");
      const looksLikeActions = after.includes("<button") || after.includes("<Button") || after.includes("onClick");
      if (!localClientContext || !looksLikeActions) return match;
      changed = true;
      return `className=${quote}${addClassValue(classes, "cf-client-row-actions")}${quote}`;
    });
    if (!changed && !src.includes("cf-client-row-actions")) {
      throw new Error(
        "Could not detect row action buttons container in Clients.tsx. Add cf-client-row-actions manually to the container with client card buttons, then rerun checks."
      );
    }
  }

  for (const token of ["cf-client-row-inline", "cf-client-main-cell", "cf-client-cases-cell", "cf-client-next-action-inline", "cf-client-row-actions"]) {
    if (!src.includes(token)) {
      throw new Error(`Clients.tsx patch did not create required token: ${token}`);
    }
  }

  write(rel, src);
}

function main() {
  ensurePackageScript();
  ensureCss();
  ensureClientsMarkup();
  console.log("✔ Applied CLOSEFLOW_ETAP8_CLIENT_CARD_INLINE_ROW patch.");
}

main();
