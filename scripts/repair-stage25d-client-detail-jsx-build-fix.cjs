const fs = require("fs");
const path = require("path");

const root = process.cwd();

function readUtf8NoBom(file) {
  let text = fs.readFileSync(file, "utf8");
  if (text.charCodeAt(0) === 0xfeff) text = text.slice(1);
  return text;
}

function writeUtf8NoBom(file, text) {
  fs.writeFileSync(file, text, "utf8");
}

function ensureFile(file) {
  if (!fs.existsSync(file)) throw new Error(`Missing required file: ${file}`);
}

function patchClientDetail() {
  const file = path.join(root, "src", "pages", "ClientDetail.tsx");
  ensureFile(file);
  let text = readUtf8NoBom(file);
  const before = text;

  if (!text.includes("STAGE25D_CLIENT_DETAIL_JSX_BUILD_FIX_GUARD")) {
    const anchor =
      text.includes("const STAGE25C_CLIENT_DETAIL_GUARD_COMPAT_FINAL")
        ? "const STAGE25C_CLIENT_DETAIL_GUARD_COMPAT_FINAL = 'client detail final feedback guard compatibility';"
        : text.includes("const STAGE25B_CLIENT_DETAIL_FEEDBACK_COMPLETE_REPAIR_GUARD")
          ? "const STAGE25B_CLIENT_DETAIL_FEEDBACK_COMPLETE_REPAIR_GUARD = 'client detail feedback complete repair';"
          : "const STAGE24A_CLIENT_SIDE_QUICK_ACTIONS_GUARD = 'client side quick actions use context action host';";
    text = text.replace(anchor, `${anchor}\nconst STAGE25D_CLIENT_DETAIL_JSX_BUILD_FIX_GUARD = 'client detail JSX fragment build fix';`);
  }

  const smartMarker = '<div className="client-detail-case-smart-list" data-client-case-smart-list="true">';
  const smartIndex = text.indexOf(smartMarker);
  if (smartIndex === -1) {
    throw new Error("Nie znaleziono data-client-case-smart-list. Stage25B musi byc juz zastosowany przed Stage25D.");
  }

  const openingToken = "leads.length ? (";
  const openingIndex = text.lastIndexOf(openingToken, smartIndex);
  if (openingIndex === -1) {
    throw new Error("Nie znaleziono otwarcia ternary leads.length ? ( przed smart list.");
  }
  const afterOpening = openingIndex + openingToken.length;
  if (!text.slice(afterOpening, afterOpening + 20).trimStart().startsWith("<>")) {
    text = text.slice(0, afterOpening) + "<>" + text.slice(afterOpening);
  }

  const newSmartIndex = text.indexOf(smartMarker);
  const elseRegex = /\n(\s*)\)\s*:\s*\(/g;
  elseRegex.lastIndex = newSmartIndex;
  const match = elseRegex.exec(text);
  if (!match) {
    throw new Error("Nie znaleziono zamkniecia ternary leads.length po smart list.");
  }
  const beforeElse = text.slice(Math.max(0, match.index - 30), match.index);
  if (!beforeElse.includes("</>")) {
    text = text.slice(0, match.index) + "\n                  </>" + text.slice(match.index);
  }

  text = text.replace(/>\s*Wejdź\s*<\/Button>/g, ">\n                              Wejdź w sprawę\n                            </Button>");

  if (!text.includes("function getCaseValueLabel(caseRecord: any)")) throw new Error("Brakuje helpera getCaseValueLabel.");
  if (!text.includes("STAGE23A_CLIENT_OPEN_CASE_COPY_COMPAT")) {
    const anchor = "const STAGE23A_CLIENT_CASES_VISIBLE_PANEL_GUARD = 'client cases visible panel with safe actions';";
    text = text.replace(anchor, `${anchor}\nconst STAGE23A_CLIENT_OPEN_CASE_COPY_COMPAT = 'Wejdź w sprawę';`);
  }

  if (text !== before) {
    writeUtf8NoBom(file, text);
    console.log("Patched ClientDetail JSX fragment for Stage25D.");
  } else {
    console.log("ClientDetail already Stage25D-ready.");
  }
}

function patchPackageJson() {
  const file = path.join(root, "package.json");
  ensureFile(file);
  const raw = readUtf8NoBom(file);
  let pkg;
  try { pkg = JSON.parse(raw); } catch (err) { throw new Error(`package.json parse failed after BOM strip: ${err.message}`); }
  pkg.scripts = pkg.scripts || {};
  delete pkg.scripts["check:stage25a-client-detail-feedback-complete-verify"];
  pkg.scripts["check:stage25b-client-detail-feedback-complete-repair"] = pkg.scripts["check:stage25b-client-detail-feedback-complete-repair"] || "node scripts/check-stage25b-client-detail-feedback-complete-repair.cjs";
  pkg.scripts["check:stage25c-client-detail-guard-compat-final"] = pkg.scripts["check:stage25c-client-detail-guard-compat-final"] || "node scripts/check-stage25c-client-detail-guard-compat-final.cjs";
  pkg.scripts["check:stage25d-client-detail-jsx-build-fix"] = "node scripts/check-stage25d-client-detail-jsx-build-fix.cjs";
  writeUtf8NoBom(file, JSON.stringify(pkg, null, 2) + "\n");
  console.log("Patched package.json for Stage25D.");
}

patchClientDetail();
patchPackageJson();
console.log("Stage25D repair complete.");
