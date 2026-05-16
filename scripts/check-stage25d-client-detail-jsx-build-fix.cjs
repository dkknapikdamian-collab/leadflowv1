const fs = require("fs");
const path = require("path");

const root = process.cwd();
function read(file) {
  let text = fs.readFileSync(path.join(root, file), "utf8");
  if (text.charCodeAt(0) === 0xfeff) text = text.slice(1);
  return text;
}
function assert(condition, message) { if (!condition) throw new Error(message); }
function assertIncludes(file, needle, label) {
  const text = read(file);
  assert(text.includes(needle), `Brakuje wymaganego fragmentu: ${label || needle}`);
}

const clientDetailText = read("src/pages/ClientDetail.tsx");
assert(clientDetailText.includes("STAGE25D_CLIENT_DETAIL_JSX_BUILD_FIX_GUARD"), "Brakuje guard Stage25D");
assert(clientDetailText.includes('data-client-case-smart-list="true"'), "Brakuje smart listy spraw");
assert(clientDetailText.includes('data-client-case-smart-card="true"'), "Brakuje smart karty sprawy");
assert(clientDetailText.includes("function getCaseValueLabel(caseRecord: any)"), "Brakuje helpera wartosci sprawy");
assert(clientDetailText.includes("Wejd\u017A w spraw\u0119"), "Brakuje copy Wejd\u017A w spraw\u0119");
assert(clientDetailText.includes("STAGE23A_CLIENT_OPEN_CASE_COPY_COMPAT"), "Brakuje kompatybilno\u015Bci Stage23A");
assert(clientDetailText.includes("leads.length ? (<>"), "Smart list musi byc opakowana fragmentem w ternary leads.length");
assert(clientDetailText.includes("</>\n                  ) : ("), "Brakuje zamkniecia fragmentu przed else ternary leads.length");
assertIncludes("package.json", "check:stage25d-client-detail-jsx-build-fix", "npm script Stage25D");
assertIncludes("src/styles/visual-stage12-client-detail-vnext.css", "stage25b client detail feedback complete repair", "CSS Stage25B dalej obecny");
console.log("OK stage25d client detail jsx build fix");
