const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const INDEX = path.join(ROOT, "src", "index.css");
const ARCHIVE = path.join(ROOT, "_project", "archive", "STAGE200E_HARD_REPAIR_INDEX_CSS_IMPORT_LINES");

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

function cleanComment(text) {
  return String(text || "")
    .replace(/\/\*/g, "")
    .replace(/\*\//g, "")
    .replace(/^\s*\*/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizePath(p) {
  return String(p || "").replace(/\\/g, "/");
}

function importLine(importPath) {
  return `@import '${normalizePath(importPath)}';`;
}

function isForbiddenImport(importPath) {
  return forbiddenTargets.some((target) => importPath.includes(target));
}

if (!fs.existsSync(INDEX)) {
  throw new Error("Missing src/index.css");
}

fs.mkdirSync(ARCHIVE, { recursive: true });

const before = fs.readFileSync(INDEX, "utf8");
fs.writeFileSync(
  path.join(ARCHIVE, "index.css.stage200e.before"),
  before,
  "utf8"
);

const lines = before.split(/\r?\n/);
const out = [];
const fixes = [];

for (const line of lines) {
  const trimmed = line.trim();

  if (!trimmed.includes("@import")) {
    out.push(line);
    continue;
  }

  const fullCommentOk = /^\/\*.*@import.*\*\/\s*$/.test(trimmed);
  if (fullCommentOk) {
    out.push(line);
    continue;
  }

  const matches = Array.from(
    line.matchAll(/@import\s+(?:url\()?['"]([^'"]+)['"]\)?\s*;?/g)
  );

  if (matches.length === 0) {
    out.push(`/* STAGE200E neutralized malformed import-like line: ${cleanComment(line)} */`);
    fixes.push(`neutralized malformed import-like line: ${trimmed}`);
    continue;
  }

  const first = matches[0];
  const last = matches[matches.length - 1];
  const prefix = line.slice(0, first.index);
  const suffix = line.slice(last.index + last[0].length);
  const wrapper = cleanComment(`${prefix} ${suffix}`);

  for (let i = 0; i < matches.length; i++) {
    const importPath = normalizePath(matches[i][1]);
    const stmt = importLine(importPath);

    const activeCleanImport =
      matches.length === 1 &&
      prefix.trim() === "" &&
      suffix.trim() === "" &&
      /^@import\s+/.test(trimmed);

    if (activeCleanImport) {
      if (isForbiddenImport(importPath)) {
        out.push(`/* STAGE200E disabled forbidden legacy import: ${stmt} */`);
        fixes.push(`disabled active forbidden import: ${stmt}`);
      } else {
        out.push(stmt);
        if (stmt !== line) {
          fixes.push(`normalized clean import: ${stmt}`);
        }
      }
      continue;
    }

    if (isForbiddenImport(importPath)) {
      out.push(`/* STAGE200E disabled forbidden legacy import from malformed line: ${stmt} */`);
      fixes.push(`disabled forbidden malformed import: ${stmt}`);
      continue;
    }

    if (i === 0 && wrapper) {
      out.push(`/* STAGE200E repaired malformed import wrapper: ${wrapper} */`);
    }

    out.push(stmt);
    fixes.push(`repaired malformed import wrapper: ${stmt}`);
  }
}

const after = out.join("\n");
fs.writeFileSync(INDEX, after, "utf8");

const afterLines = after.split(/\r?\n/);
const bad = [];

for (let i = 0; i < afterLines.length; i++) {
  const line = afterLines[i];
  const trimmed = line.trim();

  if (!trimmed.includes("@import")) continue;

  const okActive = /^@import\s+['"][^'"]+['"]\s*;\s*$/.test(trimmed);
  const okComment = /^\/\*.*@import.*\*\/\s*$/.test(trimmed);

  if (!okActive && !okComment) {
    bad.push(`src/index.css:${i + 1}: ${line}`);
  }

  if (trimmed.includes("*/ @import") || trimmed.includes("*/@import")) {
    bad.push(`src/index.css:${i + 1}: orphan close-comment before @import: ${line}`);
  }

  if (/^\*\s+.*@import/.test(trimmed)) {
    bad.push(`src/index.css:${i + 1}: orphan star before @import: ${line}`);
  }

  if (okActive) {
    for (const target of forbiddenTargets) {
      if (trimmed.includes(target)) {
        bad.push(`src/index.css:${i + 1}: forbidden legacy import still active: ${line}`);
      }
    }
  }
}

const result = {
  file: "src/index.css",
  fixes,
  bad
};

console.log(JSON.stringify(result, null, 2));

if (bad.length > 0) {
  process.exit(1);
}
