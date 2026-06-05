const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const SRC = path.join(ROOT, "src");
const ARCHIVE = path.join(ROOT, "_project", "archive", "STAGE200D_REPAIR_ALL_CSS_MALFORMED_IMPORT_COMMENTS");

const forbiddenTargets = [
  "closeflow-viewport-zoom-80-source-truth-stage157.css",
  "closeflow-desktop-density-source-truth.css",
  "eliteflow-sidebar-user-footer-below-nav.css",
  "closeflow-sidebar-full-height-stage188.css",
  "closeflow-sidebar-left-rail-stage189.css",
  "closeflow-sidebar-actual-panel-stage190.css",
  "closeflow-sidebar-real-panel-stage190b.css",
  "closeflow-sidebar-height-only-stage191.css",
  "closeflow-sidebar-fit-height-stage192.css",
  "closeflow-sidebar-layout-contract-stage194.css",
  "closeflow-sidebar-fixed-viewport-stage196.css"
];

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, item.name);
    if (item.isDirectory()) {
      if (["node_modules", "dist", "_project"].includes(item.name)) continue;
      walk(full, out);
    } else if (/\.(css|scss)$/i.test(item.name)) {
      if (/\.bak$|\.removed\.bak$/.test(item.name)) continue;
      out.push(full);
    }
  }
  return out;
}

function cleanComment(text) {
  return String(text || "")
    .replace(/\/\*/g, "")
    .replace(/\*\//g, "")
    .replace(/^\s*\*/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeImportPath(raw) {
  return raw.replace(/\\/g, "/");
}

function importLine(importPath) {
  return `@import '${normalizeImportPath(importPath)}';`;
}

function disabledComment(reason, original) {
  const clean = cleanComment(original);
  return `/* STAGE200D ${reason}: ${clean} */`;
}

const files = walk(SRC);
const changed = [];
const fixes = [];
const remainingBad = [];

fs.mkdirSync(ARCHIVE, { recursive: true });

for (const file of files) {
  const rel = path.relative(ROOT, file).replace(/\\/g, "/");
  const before = fs.readFileSync(file, "utf8");
  const lines = before.split(/\r?\n/);
  const out = [];
  let touched = false;

  for (const line of lines) {
    const original = line;
    const trimmed = line.trim();

    if (!line.includes("@import")) {
      out.push(line);
      continue;
    }

    const m = line.match(/@import\s+(?:url\()?['"]([^'"]+)['"]\)?\s*;?/);
    if (!m) {
      out.push(disabledComment("neutralized malformed import-like line", original));
      fixes.push(`${rel}: neutralized malformed import-like line: ${trimmed}`);
      touched = true;
      continue;
    }

    const importPath = m[1];
    const importStmt = importLine(importPath);
    const prefix = line.slice(0, m.index).trim();
    const suffix = line.slice(m.index + m[0].length).trim();

    const isForbidden = forbiddenTargets.some((target) => importPath.includes(target));
    const isCleanActiveImport =
      /^@import\s+/.test(trimmed) &&
      prefix === "" &&
      (suffix === "" || suffix === ";");

    const isCleanDisabledComment =
      /^\/\*.*@import.*\*\/\s*$/.test(trimmed);

    if (isCleanDisabledComment) {
      out.push(line);
      continue;
    }

    if (isCleanActiveImport) {
      if (isForbidden) {
        out.push(`/* STAGE200D kept forbidden legacy import disabled: ${importStmt} */`);
        fixes.push(`${rel}: disabled active forbidden import ${importPath}`);
        touched = true;
      } else {
        const normalized = importStmt;
        out.push(normalized);
        if (normalized !== line) {
          fixes.push(`${rel}: normalized active import ${importPath}`);
          touched = true;
        }
      }
      continue;
    }

    if (isForbidden) {
      out.push(`/* STAGE200D disabled forbidden legacy import from malformed line: ${importStmt} */`);
      fixes.push(`${rel}: disabled forbidden malformed import ${importPath}`);
      touched = true;
      continue;
    }

    const wrapperText = cleanComment(`${prefix} ${suffix}`);

    if (wrapperText) {
      out.push(`/* STAGE200D repaired malformed import wrapper: ${wrapperText} */`);
    }

    out.push(importStmt);
    fixes.push(`${rel}: repaired malformed import wrapper for ${importPath}`);
    touched = true;
  }

  const after = out.join("\n");

  if (touched && after !== before) {
    const safeName = rel.replace(/[\\/:"*?<>|]+/g, "__");
    fs.writeFileSync(path.join(ARCHIVE, `${safeName}.stage200d.before`), before, "utf8");
    fs.writeFileSync(file, after, "utf8");
    changed.push(rel);
  }
}

// Validate every CSS/SCSS file after repair.
for (const file of files) {
  if (!fs.existsSync(file)) continue;
  const rel = path.relative(ROOT, file).replace(/\\/g, "/");
  const lines = fs.readFileSync(file, "utf8").split(/\r?\n/);

  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (!trimmed.includes("@import")) return;

    const okActive = /^@import\s+['"][^'"]+['"]\s*;\s*$/.test(trimmed);
    const okComment = /^\/\*.*@import.*\*\/\s*$/.test(trimmed);

    if (!okActive && !okComment) {
      remainingBad.push(`${rel}:${idx + 1}: ${line}`);
    }

    if (trimmed.includes("*/ @import") || trimmed.includes("*/@import")) {
      remainingBad.push(`${rel}:${idx + 1}: contains orphan comment close before @import: ${line}`);
    }

    if (/^\*\s+.*@import/.test(trimmed)) {
      remainingBad.push(`${rel}:${idx + 1}: contains orphan star comment before @import: ${line}`);
    }
  });
}

const result = {
  changed,
  fixes,
  remainingBad
};

console.log(JSON.stringify(result, null, 2));

if (remainingBad.length > 0) {
  console.error("STAGE200D failed. Remaining malformed @import lines:");
  for (const bad of remainingBad) console.error("- " + bad);
  process.exit(1);
}
