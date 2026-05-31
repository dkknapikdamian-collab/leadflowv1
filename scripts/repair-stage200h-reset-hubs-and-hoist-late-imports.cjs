const fs = require("fs");
const path = require("path");
const cp = require("child_process");

const ROOT = process.cwd();
const SRC = path.join(ROOT, "src");
const INDEX = path.join(SRC, "index.css");
const TEMP = path.join(SRC, "styles", "temporary", "temporary-overrides.css");
const EMERGENCY = path.join(SRC, "styles", "emergency", "emergency-hotfixes.css");
const ARCHIVE = path.join(ROOT, "_project", "archive", "STAGE200H_RESET_HUBS_AND_HOIST_LATE_IMPORTS");

const START = "/* STAGE200H_HOISTED_LATE_EMERGENCY_IMPORTS_START */";
const END = "/* STAGE200H_HOISTED_LATE_EMERGENCY_IMPORTS_END */";

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

fs.mkdirSync(ARCHIVE, { recursive: true });

function gitShow(repoPath) {
  return cp.execFileSync("git", ["show", `HEAD:${repoPath}`], {
    cwd: ROOT,
    encoding: "utf8"
  });
}

function archiveFile(file, name) {
  if (fs.existsSync(file)) {
    fs.writeFileSync(path.join(ARCHIVE, name), fs.readFileSync(file, "utf8"), "utf8");
  }
}

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

function isBlank(line) {
  return line.trim() === "";
}

function isForbidden(importPath) {
  return forbiddenTargets.some((target) => importPath.includes(target));
}

function toIndexImportPath(fromFile, importPath) {
  const abs = path.resolve(path.dirname(fromFile), importPath);
  let rel = path.relative(path.dirname(INDEX), abs).replace(/\\/g, "/");
  if (!rel.startsWith(".")) rel = "./" + rel;
  return rel;
}

function importStmt(importPath) {
  return `@import '${importPath.replace(/\\/g, "/")}';`;
}

function stripExistingStageBlock(lines) {
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

function firstDeclarationAwareHoist(file) {
  const lines = readLines(file);
  const out = [];
  const hoisted = [];
  let inComment = false;
  let cssStarted = false;

  for (const line of lines) {
    const trim = line.trim();

    if (inComment) {
      out.push(line);
      if (trim.includes("*/")) inComment = false;
      continue;
    }

    if (trim.startsWith("/*")) {
      out.push(line);
      if (!trim.includes("*/")) inComment = true;
      continue;
    }

    if (isBlank(line)) {
      out.push(line);
      continue;
    }

    if (isImportLine(line)) {
      const p = getImportPath(line);

      if (cssStarted) {
        if (isForbidden(p)) {
          out.push(`/* STAGE200H disabled forbidden late import: ${line.trim()} */`);
        } else {
          const indexPath = toIndexImportPath(file, p);
          hoisted.push(indexPath);
          out.push(`/* STAGE200H hoisted late import to src/index.css: ${line.trim()} */`);
        }
      } else {
        out.push(line);
      }

      continue;
    }

    cssStarted = true;
    out.push(line);
  }

  return { out, hoisted };
}

function insertHoistedIntoIndex(hoisted) {
  let lines = stripExistingStageBlock(readLines(INDEX));

  const emergencyIndex = lines.findIndex((line) =>
    line.includes("@import './styles/emergency/emergency-hotfixes.css';") ||
    line.includes('@import "./styles/emergency/emergency-hotfixes.css";')
  );

  if (emergencyIndex < 0) {
    throw new Error("Missing emergency-hotfixes import in src/index.css");
  }

  const unique = [];
  const seen = new Set();

  for (const p of hoisted) {
    if (isForbidden(p)) continue;

    const stmt = importStmt(p);
    if (seen.has(stmt)) continue;
    if (lines.some((line) => line.trim() === stmt)) continue;

    seen.add(stmt);
    unique.push(stmt);
  }

  if (!unique.length) {
    writeLines(INDEX, lines);
    return;
  }

  const block = [
    "",
    START,
    "/* Late imports hoisted out of emergency-hotfixes.css.",
    "   Tailwind requires active @import rules before normal CSS declarations.",
    "   Keep after emergency hub to preserve cascade intent. */",
    ...unique,
    END,
    ""
  ];

  lines = [
    ...lines.slice(0, emergencyIndex + 1),
    ...block,
    ...lines.slice(emergencyIndex + 1)
  ];

  writeLines(INDEX, lines);
}

function disableTempFitContentImport() {
  let txt = fs.readFileSync(TEMP, "utf8");
  const oldLine = "@import '../eliteflow-sidebar-user-footer-below-nav.css';";
  const newLine = "/* STAGE200H disabled old fit-content sidebar import: @import '../eliteflow-sidebar-user-footer-below-nav.css'; */";

  txt = txt.replace(oldLine, newLine);
  fs.writeFileSync(TEMP, txt, "utf8");
}

function validateCssImports(files) {
  const bad = [];

  for (const file of files) {
    if (!fs.existsSync(file)) continue;

    const rel = path.relative(ROOT, file).replace(/\\/g, "/");
    const lines = readLines(file);
    let inComment = false;
    let cssStarted = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trim = line.trim();

      if (inComment) {
        if (trim.includes("*/")) inComment = false;
        continue;
      }

      if (trim.startsWith("/*")) {
        if (!trim.includes("*/")) inComment = true;
        continue;
      }

      if (isBlank(line)) continue;

      if (trim.includes("@import")) {
        const ok = isImportLine(line) || /^\/\*.*@import.*\*\/\s*$/.test(trim);

        if (!ok) {
          bad.push(`${rel}:${i + 1}: malformed @import/comment: ${line}`);
        }

        if (isImportLine(line) && cssStarted) {
          bad.push(`${rel}:${i + 1}: late active @import after CSS declarations: ${line}`);
        }

        if (trim.includes("*/ @import") || trim.includes("*/@import") || /^\*\s+.*@import/.test(trim)) {
          bad.push(`${rel}:${i + 1}: orphan comment marker near @import: ${line}`);
        }

        continue;
      }

      cssStarted = true;
    }
  }

  return bad;
}

// Archive current broken local files.
archiveFile(INDEX, "index.css.stage200h.before");
archiveFile(TEMP, "temporary-overrides.css.stage200h.before");
archiveFile(EMERGENCY, "emergency-hotfixes.css.stage200h.before");

// Reset hubs from HEAD to remove regex damage.
fs.writeFileSync(INDEX, gitShow("src/index.css").replace(/\n*$/, "\n"), "utf8");
fs.writeFileSync(TEMP, gitShow("src/styles/temporary/temporary-overrides.css").replace(/\n*$/, "\n"), "utf8");
fs.writeFileSync(EMERGENCY, gitShow("src/styles/emergency/emergency-hotfixes.css").replace(/\n*$/, "\n"), "utf8");

// Apply intended cleanup only.
disableTempFitContentImport();

const emergencyResult = firstDeclarationAwareHoist(EMERGENCY);
writeLines(EMERGENCY, emergencyResult.out);
insertHoistedIntoIndex(emergencyResult.hoisted);

const cssFiles = [INDEX, TEMP, EMERGENCY];
const bad = validateCssImports(cssFiles);

const result = {
  resetFromHead: [
    "src/index.css",
    "src/styles/temporary/temporary-overrides.css",
    "src/styles/emergency/emergency-hotfixes.css"
  ],
  disabledFitContentImport: true,
  hoistedFromEmergencyToIndex: emergencyResult.hoisted,
  bad
};

console.log(JSON.stringify(result, null, 2));

if (bad.length) {
  process.exit(1);
}
