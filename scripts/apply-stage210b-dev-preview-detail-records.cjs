const fs = require("fs");
const path = require("path");

const root = process.cwd();
const file = path.join(root, "src", "lib", "supabase-fallback.ts");
const archiveDir = path.join(root, "_project", "archive", "STAGE210B_REPAIR_DEV_PREVIEW_DETAIL_RECORDS");

fs.mkdirSync(archiveDir, { recursive: true });

if (!fs.existsSync(file)) {
  throw new Error("Missing src/lib/supabase-fallback.ts");
}

let src = fs.readFileSync(file, "utf8");
fs.writeFileSync(path.join(archiveDir, "supabase-fallback.ts.stage210b.before"), src, "utf8");

function ensureHelper(source) {
  if (source.includes("function getDevPreviewRowById")) return source;

  const helper = `
function getDevPreviewRowById(entity: 'clients' | 'leads' | 'cases', id: string) {
  if (!isDevPreviewDataEnabled()) return null;
  const data = getDevPreviewData() as Record<string, Record<string, unknown>[]>;
  const rows = Array.isArray(data[entity]) ? data[entity] : [];
  return rows.find((row) => String((row as any)?.id || '') === String(id)) ?? null;
}

`;

  const anchor = "export type CloseflowDataMutationDetail = {";
  if (!source.includes(anchor)) {
    throw new Error("Cannot insert getDevPreviewRowById helper, anchor not found.");
  }

  return source.replace(anchor, helper + anchor);
}

function findFunctionEnd(source, openBraceIndex) {
  let depth = 0;
  let mode = null;
  let escape = false;

  for (let i = openBraceIndex; i < source.length; i++) {
    const c = source[i];
    const n = source[i + 1];

    if (mode === "line") {
      if (c === "\n") mode = null;
      continue;
    }

    if (mode === "block") {
      if (c === "*" && n === "/") {
        i++;
        mode = null;
      }
      continue;
    }

    if (mode === "single" || mode === "double" || mode === "template") {
      if (escape) {
        escape = false;
        continue;
      }
      if (c === "\\") {
        escape = true;
        continue;
      }
      if (mode === "single" && c === "'") {
        mode = null;
        continue;
      }
      if (mode === "double" && c === '"') {
        mode = null;
        continue;
      }
      if (mode === "template" && c === "`") {
        mode = null;
        continue;
      }
      continue;
    }

    if (c === "/" && n === "/") {
      i++;
      mode = "line";
      continue;
    }

    if (c === "/" && n === "*") {
      i++;
      mode = "block";
      continue;
    }

    if (c === "'") {
      mode = "single";
      continue;
    }

    if (c === '"') {
      mode = "double";
      continue;
    }

    if (c === "`") {
      mode = "template";
      continue;
    }

    if (c === "{") depth++;
    if (c === "}") {
      depth--;
      if (depth === 0) return i + 1;
    }
  }

  throw new Error("Cannot find function end.");
}

function replaceExportedAsyncFunction(source, name, replacement) {
  const marker = `export async function ${name}(`;
  const start = source.indexOf(marker);
  if (start < 0) {
    throw new Error(`Cannot find function: ${name}`);
  }

  const openBrace = source.indexOf("{", start);
  if (openBrace < 0) {
    throw new Error(`Cannot find function body: ${name}`);
  }

  const end = findFunctionEnd(source, openBrace);
  return source.slice(0, start) + replacement.trimEnd() + source.slice(end);
}

src = ensureHelper(src);

src = replaceExportedAsyncFunction(src, "fetchClientByIdFromSupabase", `
export async function fetchClientByIdFromSupabase(id: string) {
  const devRow = getDevPreviewRowById('clients', id);
  if (devRow) return normalizeClientContract(devRow);
  if (isDevPreviewDataEnabled()) throw new Error(\`DEV_PREVIEW_CLIENT_NOT_FOUND:\${id}\`);
  return callApi<Record<string, unknown>>(\`/api/clients?id=\${encodeURIComponent(id)}\`).then((row) => normalizeClientContract(row));
}
`);

src = replaceExportedAsyncFunction(src, "fetchLeadByIdFromSupabase", `
export async function fetchLeadByIdFromSupabase(id: string) {
  const devRow = getDevPreviewRowById('leads', id);
  if (devRow) return normalizeLeadContract(devRow);
  if (isDevPreviewDataEnabled()) throw new Error(\`DEV_PREVIEW_LEAD_NOT_FOUND:\${id}\`);
  return callApi<Record<string, unknown>>(\`/api/leads?id=\${encodeURIComponent(id)}\`).then((row) => normalizeLeadContract(row));
}
`);

src = replaceExportedAsyncFunction(src, "fetchCaseByIdFromSupabase", `
export async function fetchCaseByIdFromSupabase(id: string) {
  const devRow = getDevPreviewRowById('cases', id);
  if (devRow) return normalizeCaseContract(devRow);
  if (isDevPreviewDataEnabled()) throw new Error(\`DEV_PREVIEW_CASE_NOT_FOUND:\${id}\`);
  return callApi<Record<string, unknown>>(\`/api/cases?id=\${encodeURIComponent(id)}\`).then((row) => normalizeCaseContract(row));
}
`);

const checks = [
  "function getDevPreviewRowById",
  "getDevPreviewRowById('clients', id)",
  "getDevPreviewRowById('leads', id)",
  "getDevPreviewRowById('cases', id)",
  "DEV_PREVIEW_CLIENT_NOT_FOUND",
  "DEV_PREVIEW_LEAD_NOT_FOUND",
  "DEV_PREVIEW_CASE_NOT_FOUND"
];

for (const needle of checks) {
  if (!src.includes(needle)) {
    throw new Error(`Missing Stage210B contract: ${needle}`);
  }
}

fs.writeFileSync(file, src, "utf8");

console.log(JSON.stringify({
  ok: true,
  patched: [
    "fetchClientByIdFromSupabase",
    "fetchLeadByIdFromSupabase",
    "fetchCaseByIdFromSupabase"
  ],
  helper: "getDevPreviewRowById",
  mode: "local-only, no git add, no commit, no push"
}, null, 2));
