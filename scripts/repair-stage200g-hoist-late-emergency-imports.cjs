const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const SRC = path.join(ROOT, "src");
const INDEX = path.join(SRC, "index.css");
const EMERGENCY = path.join(SRC, "styles", "emergency", "emergency-hotfixes.css");
const ARCHIVE = path.join(ROOT, "_project", "archive", "STAGE200G_HOIST_LATE_EMERGENCY_IMPORTS");

const START = "/* STAGE200G_HOISTED_LATE_EMERGENCY_IMPORTS_START */";
const END = "/* STAGE200G_HOISTED_LATE_EMERGENCY_IMPORTS_END */";

fs.mkdirSync(ARCHIVE, { recursive: true });

if (!fs.existsSync(INDEX)) throw new Error("Missing src/index.css");
if (!fs.existsSync(EMERGENCY)) throw new Error("Missing src/styles/emergency/emergency-hotfixes.css");

function readLines(file) {
  return fs.readFileSync(file, "utf8").split(/\r?\n/);
}

function writeLines(file, lines) {
  fs.writeFileSync(file, lines.join("\n").replace(/\n*$/, "\n"), "utf8");
}

function isImportLine(line) {
  return /^\s*@import\s+(?:url\()?['"][^'"]+['"]\)?\s*;\s*$/.test(line.trim());
}

function getImportPath(line) {
  const m = line.match(/@import\s+(?:url\()?['"]([^'"]+)['"]\)?\s*;/);
  return m ? m[1] : null;
}

function importLine(importPath) {
  return `@import '${importPath.replace(/\\/g, "/")}';`;
}

function isForbiddenLegacy(importPath) {
  return [
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
  ].some((target) => importPath.includes(target));
}

function isBlank(line) {
  return line.trim() === "";
}

function stripMarkerBlock(lines) {
  const out = [];
  let skipping = false;
  for (const line of lines) {
    if (line.includes(START)) {
      skipping = true;
      continue;
    }
    if (line.includes(END)) {
      skipping = false;
      continue;
    }
    if (!skipping) out.push(line);
  }
  return out;
}

function resolveImport(fromFile, importPath) {
  const abs = path.resolve(path.dirname(fromFile), importPath);
  let rel = path.relative(path.dirname(INDEX), abs).replace(/\\/g, "/");
  if (!rel.startsWith(".")) rel = "./" + rel;
  return rel;
}

function hoistLateImportsFromFile(file) {
  const before = readLines(file);
  const after = [];
  const hoisted = [];
  let inBlock = false;
  let cssStarted = false;

  for (const line of before) {
    const trim = line.trim();

    if (inBlock) {
      after.push(line);
      if (trim.includes("*/")) inBlock = false;
      continue;
    }

    if (trim.startsWith("/*")) {
      after.push(line);
      if (!trim.includes("*/")) inBlock = true;
      continue;
    }

    if (isBlank(line)) {
      after.push(line);
      continue;
    }

    if (isImportLine(line)) {
      const p = getImportPath(line);
      if (cssStarted) {
        if (isForbiddenLegacy(p)) {
          after.push(`/* STAGE200G kept disabled forbidden late import: ${line.trim()} */`);
        } else {
          hoisted.push(resolveImport(file, p));
          after.push(`/* STAGE200G hoisted late import to src/index.css: ${line.trim()} */`);
        }
      } else {
        after.push(line);
      }
      continue;
    }

    cssStarted = true;
    after.push(line);
  }

  return { before, after, hoisted };
}

function normalizeIndex(indexLines, hoistedImports) {
  let lines = stripMarkerBlock(indexLines);

  const lateIndexImports = [];
  const cleaned = [];
  let inBlock = false;
  let cssStarted = false;

  for (const line of lines) {
    const trim = line.trim();

    if (inBlock) {
      cleaned.push(line);
      if (trim.includes("*/")) inBlock = false;
      continue;
    }

    if (trim.startsWith("/*")) {
      cleaned.push(line);
      if (!trim.includes("*/")) inBlock = true;
      continue;
    }

    if (isBlank(line)) {
      cleaned.push(line);
      continue;
    }

    if (isImportLine(line)) {
      const p = getImportPath(line);
      if (cssStarted) {
        if (isForbiddenLegacy(p)) {
          cleaned.push(`/* STAGE200G kept disabled forbidden late index import: ${line.trim()} */`);
        } else {
          lateIndexImports.push(p);
          cleaned.push(`/* STAGE200G hoisted late index import: ${line.trim()} */`);
        }
      } else {
        cleaned.push(line);
      }
      continue;
    }

    cssStarted = true;
    cleaned.push(line);
  }

  lines = cleaned;

  const emergencyLineIndex = lines.findIndex((line) =>
    line.includes("@import './styles/emergency/emergency-hotfixes.css';") ||
    line.includes('@import "./styles/emergency/emergency-hotfixes.css";')
  );

  if (emergencyLineIndex < 0) {
    throw new Error("Cannot find emergency-hotfixes import in src/index.css");
  }

  const all = [...hoistedImports, ...lateIndexImports]
    .map((p) => p.replace(/\\/g, "/"));

  const unique = [];
  const seen = new Set();

  for (const p of all) {
    if (isForbiddenLegacy(p)) continue;
    const stmt = importLine(p);
    if (seen.has(stmt)) continue;
    if (lines.some((line) => line.trim() === stmt)) continue;
    seen.add(stmt);
    unique.push(stmt);
  }

  if (!unique.length) return lines;

  const block = [
    "",
    START,
    "/* These imports used to live after CSS declarations in emergency/index CSS.",
    "   Tailwind requires active @import rules before normal declarations.",
    "   Keep this block immediately after the emergency hub import. */",
    ...unique,
    END,
    ""
  ];

  return [
    ...lines.slice(0, emergencyLineIndex + 1),
    ...block,
    ...lines.slice(emergencyLineIndex + 1)
  ];
}

function validateNoLateImports(files) {
  const bad = [];

  for (const file of files) {
    const rel = path.relative(ROOT, file).replace(/\\/g, "/");
    const lines = readLines(file);

    let inBlock = false;
    let cssStarted = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trim = line.trim();

      if (inBlock) {
        if (trim.includes("*/")) inBlock = false;
        continue;
      }

      if (trim.startsWith("/*")) {
        if (!trim.includes("*/")) inBlock = true;
        continue;
      }

      if (isBlank(line)) continue;

      if (isImportLine(line)) {
        if (cssStarted) {
          bad.push(`${rel}:${i + 1}: late active @import after declarations: ${trim}`);
        }
        continue;
      }

      cssStarted = true;
    }
  }

  return bad;
}

fs.writeFileSync(path.join(ARCHIVE, "index.css.stage200g.before"), fs.readFileSync(INDEX, "utf8"), "utf8");
fs.writeFileSync(path.join(ARCHIVE, "emergency-hotfixes.css.stage200g.before"), fs.readFileSync(EMERGENCY, "utf8"), "utf8");

const emergency = hoistLateImportsFromFile(EMERGENCY);
writeLines(EMERGENCY, emergency.after);

const indexBefore = readLines(INDEX);
const indexAfter = normalizeIndex(indexBefore, emergency.hoisted);
writeLines(INDEX, indexAfter);

const cssFiles = [];
function walk(dir) {
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, item.name);
    if (item.isDirectory()) {
      if (["node_modules", "dist", "_project"].includes(item.name)) continue;
      walk(full);
    } else if (/\.(css|scss)$/i.test(item.name) && !/\.bak$|\.removed\.bak$/.test(item.name)) {
      cssFiles.push(full);
    }
  }
}
walk(SRC);

const bad = validateNoLateImports(cssFiles);

const result = {
  hoistedFromEmergency: emergency.hoisted,
  bad
};

console.log(JSON.stringify(result, null, 2));

if (bad.length) {
  console.error("STAGE200G failed. Late imports remain:");
  for (const b of bad) console.error("- " + b);
  process.exit(1);
}
