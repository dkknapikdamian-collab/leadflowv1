const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const filePath = path.join(ROOT, "src", "lib", "supabase-fallback.ts");
const archiveDir = path.join(ROOT, "_project", "archive", "STAGE210B_REPAIR_DEV_PREVIEW_DETAIL_RECORDS");

fs.mkdirSync(archiveDir, { recursive: true });

if (!fs.existsSync(filePath)) {
  throw new Error("Missing src/lib/supabase-fallback.ts");
}

let txt = fs.readFileSync(filePath, "utf8");
fs.writeFileSync(path.join(archiveDir, "supabase-fallback.ts.stage210b.before"), txt, "utf8");

const helper = `function getDevPreviewRowById(entity: 'clients' | 'leads' | 'cases', id: string) {
  if (!isDevPreviewDataEnabled()) return null;
  const data = getDevPreviewData() as Record<string, Record<string, unknown>[]>;
  const rows = Array.isArray(data[entity]) ? data[entity] : [];
  return rows.find((row) => String((row as any)?.id || '') === String(id)) ?? null;
}

`;

if (!txt.includes("function getDevPreviewRowById")) {
  const anchor = "export type CloseflowDataMutationDetail = {";
  if (!txt.includes(anchor)) {
    throw new Error("Cannot insert helper. Missing CloseflowDataMutationDetail anchor.");
  }
  txt = txt.replace(anchor, helper + anchor);
}

function replaceExportedFunction(source, functionName, replacement) {
  const startToken = `export async function ${functionName}`;
  const start = source.indexOf(startToken);

  if (start < 0) {
    throw new Error(`Missing function: ${functionName}`);
  }

  const openBrace = source.indexOf("{", start);
  if (openBrace < 0) {
    throw new Error(`Missing opening brace for: ${functionName}`);
  }

  let depth = 0;
  let inString = null;
  let escaped = false;
  let inLineComment = false;
  let inBlockComment = false;

  for (let i = openBrace; i < source.length; i += 1) {
    const ch = source[i];
    const next = source[i + 1];

    if (inLineComment) {
      if (ch === "\n") inLineComment = false;
      continue;
    }

    if (inBlockComment) {
      if (ch === "*" && next === "/") {
        inBlockComment = false;
        i += 1;
      }
      continue;
    }

    if (inString) {
      if (escaped) {
        escaped = false;
        continue;
      }
      if (ch === "\\") {
        escaped = true;
        continue;
      }
      if (ch === inString) {
        inString = null;
      }
      continue;
    }

    if (ch === "/" && next === "/") {
      inLineComment = true;
      i += 1;
      continue;
    }

    if (ch === "/" && next === "*") {
      inBlockComment = true;
      i += 1;
      continue;
    }

    if (ch === "'" || ch === '"' || ch === "`") {
      inString = ch;
      continue;
    }

    if (ch === "{") depth += 1;

    if (ch === "}") {
      depth -= 1;
      if (depth === 0) {
        let end = i + 1;

        while (end < source.length && /[\s;]/.test(source[end])) {
          end += 1;
          if (source[end - 1] === "\n") break;
        }

        return source.slice(0, start) + replacement.trimEnd() + "\n" + source.slice(end);
      }
    }
  }

  throw new Error(`Could not find function end for: ${functionName}`);
}

const clientReplacement = `export async function fetchClientByIdFromSupabase(id: string) {
  const devRow = getDevPreviewRowById('clients', id);
  if (devRow) return normalizeClientContract(devRow);
  if (isDevPreviewDataEnabled()) throw new Error(\`DEV_PREVIEW_CLIENT_NOT_FOUND:\${id}\`);
  return callApi<Record<string, unknown>>(\`/api/clients?id=\${encodeURIComponent(id)}\`).then((row) => normalizeClientContract(row));
}
`;

const leadReplacement = `export async function fetchLeadByIdFromSupabase(id: string) {
  const devRow = getDevPreviewRowById('leads', id);
  if (devRow) return normalizeLeadContract(devRow);
  if (isDevPreviewDataEnabled()) throw new Error(\`DEV_PREVIEW_LEAD_NOT_FOUND:\${id}\`);
  return callApi<Record<string, unknown>>(\`/api/leads?id=\${encodeURIComponent(id)}\`).then((row) => normalizeLeadContract(row));
}
`;

const caseReplacement = `export async function fetchCaseByIdFromSupabase(id: string) {
  const devRow = getDevPreviewRowById('cases', id);
  if (devRow) return normalizeCaseContract(devRow);
  if (isDevPreviewDataEnabled()) throw new Error(\`DEV_PREVIEW_CASE_NOT_FOUND:\${id}\`);
  return callApi<Record<string, unknown>>(\`/api/cases?id=\${encodeURIComponent(id)}\`).then((row) => normalizeCaseContract(row));
}
`;

txt = replaceExportedFunction(txt, "fetchClientByIdFromSupabase", clientReplacement);
txt = replaceExportedFunction(txt, "fetchLeadByIdFromSupabase", leadReplacement);
txt = replaceExportedFunction(txt, "fetchCaseByIdFromSupabase", caseReplacement);

const required = [
  "function getDevPreviewRowById",
  "DEV_PREVIEW_CLIENT_NOT_FOUND",
  "DEV_PREVIEW_LEAD_NOT_FOUND",
  "DEV_PREVIEW_CASE_NOT_FOUND",
  "getDevPreviewRowById('clients', id)",
  "getDevPreviewRowById('leads', id)",
  "getDevPreviewRowById('cases', id)",
];

const missing = required.filter((needle) => !txt.includes(needle));

if (missing.length) {
  throw new Error("Missing required Stage210B markers: " + missing.join(", "));
}

fs.writeFileSync(filePath, txt, "utf8");

console.log(JSON.stringify({
  ok: true,
  changed: ["src/lib/supabase-fallback.ts"],
  replaced: [
    "fetchClientByIdFromSupabase",
    "fetchLeadByIdFromSupabase",
    "fetchCaseByIdFromSupabase"
  ],
  mode: "local-only-no-git-add-no-commit-no-push"
}, null, 2));
