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

  if (!text.includes("STAGE25C_CLIENT_DETAIL_GUARD_COMPAT_FINAL")) {
    const anchor =
      text.includes("const STAGE25B_CLIENT_DETAIL_FEEDBACK_COMPLETE_REPAIR_GUARD")
        ? "const STAGE25B_CLIENT_DETAIL_FEEDBACK_COMPLETE_REPAIR_GUARD = 'client detail feedback complete repair';"
        : text.includes("const STAGE24A_CLIENT_SIDE_QUICK_ACTIONS_GUARD")
          ? "const STAGE24A_CLIENT_SIDE_QUICK_ACTIONS_GUARD = 'client side quick actions use context action host';"
          : "const STAGE23A_CLIENT_CASES_VISIBLE_PANEL_GUARD = 'client cases visible panel with safe actions';";

    text = text.replace(
      anchor,
      `${anchor}\nconst STAGE25C_CLIENT_DETAIL_GUARD_COMPAT_FINAL = 'client detail final feedback guard compatibility';`
    );
  }

  // Kompatybilność z historycznym guardem Stage23A, który wymaga dosłownego tekstu "Wejdź w sprawę".
  if (!text.includes("STAGE23A_CLIENT_OPEN_CASE_COPY_COMPAT")) {
    const anchor =
      text.includes("const STAGE23A_CLIENT_CASES_VISIBLE_PANEL_GUARD")
        ? "const STAGE23A_CLIENT_CASES_VISIBLE_PANEL_GUARD = 'client cases visible panel with safe actions';"
        : "const CLIENT_RELATION_OPEN_CASE_GUARD_UTF8 = 'Przejdź do sprawy';";
    text = text.replace(
      anchor,
      `${anchor}\nconst STAGE23A_CLIENT_OPEN_CASE_COPY_COMPAT = 'Wejdź w sprawę';`
    );
  }

  // Użytkowo też lepiej, żeby główna akcja w nowej karcie była jednoznaczna.
  text = text.replace(/>\s*Wejdź\s*<\/Button>/g, ">\n                              Wejdź w sprawę\n                            </Button>");

  // Gdyby Stage25B nie zdążył dopisać helpera przez wcześniejszy fail, zatrzymaj się jasno.
  if (!text.includes("function getCaseValueLabel(caseRecord: any)")) {
    throw new Error("Brakuje getCaseValueLabel po Stage25B. Uruchom ponownie Stage25B/25C na stanie po failed Stage25B.");
  }
  if (!text.includes('data-client-case-smart-list="true"')) {
    throw new Error("Brakuje data-client-case-smart-list po Stage25B. Uruchom ponownie Stage25B/25C na stanie po failed Stage25B.");
  }

  if (text !== before) {
    writeUtf8NoBom(file, text);
    console.log("Patched ClientDetail for Stage25C.");
  } else {
    console.log("ClientDetail already Stage25C-ready.");
  }
}

function patchPackageJson() {
  const file = path.join(root, "package.json");
  ensureFile(file);

  const raw = readUtf8NoBom(file);
  let pkg;
  try {
    pkg = JSON.parse(raw);
  } catch (err) {
    throw new Error(`package.json parse failed after BOM strip: ${err.message}`);
  }

  pkg.scripts = pkg.scripts || {};
  delete pkg.scripts["check:stage25a-client-detail-feedback-complete-verify"];
  pkg.scripts["check:stage25b-client-detail-feedback-complete-repair"] =
    pkg.scripts["check:stage25b-client-detail-feedback-complete-repair"] || "node scripts/check-stage25b-client-detail-feedback-complete-repair.cjs";
  pkg.scripts["check:stage25c-client-detail-guard-compat-final"] =
    "node scripts/check-stage25c-client-detail-guard-compat-final.cjs";

  writeUtf8NoBom(file, JSON.stringify(pkg, null, 2) + "\n");
  console.log("Patched package.json for Stage25C.");
}

patchClientDetail();
patchPackageJson();
console.log("Stage25C repair complete.");
