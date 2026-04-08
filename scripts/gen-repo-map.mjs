import { execSync } from "node:child_process"
import fs from "node:fs"
import path from "node:path"

function run(cmd) {
  return execSync(cmd, { stdio: ["ignore", "pipe", "ignore"] }).toString("utf8").trim()
}

function safeReadText(relPath) {
  try {
    // Read only the start of the file; for the map we only need a hint.
    const abs = path.resolve(process.cwd(), relPath)
    const buf = fs.readFileSync(abs)
    // Cap to ~8KB so we don't accidentally process giant files.
    return buf.subarray(0, 8_192).toString("utf8")
  } catch {
    return ""
  }
}

function firstNonEmptyLines(text, limit = 6) {
  return text
    .split(/\r?\n/g)
    .map((line) => line.trimEnd())
    .filter((line) => line.trim().length > 0)
    .slice(0, limit)
}

function titleFromMd(text) {
  const lines = firstNonEmptyLines(text, 12)
  const heading = lines.find((l) => l.startsWith("#"))
  return heading ? heading.replace(/^#+\s*/, "").trim() : null
}

function describeNextPage(relPath) {
  const normalized = relPath.replaceAll("\\", "/")
  // app/<segment>/page.tsx -> "/<segment>"
  const m = normalized.match(/^app\/(.+)\/page\.(t|j)sx?$/)
  if (!m) return null
  const route = "/" + m[1].replaceAll("/page", "")
  return `Next.js page route: \`${route}\`.`
}

function describeNextRouteHandler(relPath) {
  const normalized = relPath.replaceAll("\\", "/")
  const m = normalized.match(/^app\/api\/(.+)\/route\.(t|j)s$/)
  if (!m) return null
  const route = "/api/" + m[1]
  return `Next.js route handler: \`${route}\`.`
}

function describeFile(relPath, text) {
  const ext = path.extname(relPath).toLowerCase()
  const normalized = relPath.replaceAll("\\", "/")

  if (normalized === "app/layout.tsx") return "Next.js root layout (global wrapper, metadata import, globals.css)."
  if (normalized === "app/globals.css") return "Global CSS: tokens + Visual System Lock + component styles + responsive rules."
  if (normalized === "app/providers.tsx") return "App-level client providers (global state/session/theme wiring)."
  if (normalized === "middleware.ts") return "Next.js middleware / request gatekeeping (auth/access routing)."
  if (normalized === "app/manifest.ts") return "PWA manifest definition."
  if (normalized === "next.config.ts") return "Next.js configuration."
  if (normalized === "tsconfig.json") return "TypeScript config (app build)."
  if (normalized === "tsconfig.tests.json") return "TypeScript config (tests build)."
  if (normalized === "package.json") return "Project scripts + deps (Next/React/TS) for ClientPilot."

  const nextPage = describeNextPage(relPath)
  if (nextPage) return nextPage
  const nextRoute = describeNextRouteHandler(relPath)
  if (nextRoute) return nextRoute

  if (normalized.startsWith("components/layout/")) return "Layout component (shared shells/headers for operator UI)."
  if (normalized.startsWith("components/ui/")) return "UI primitive / helper (view states, labels, small utilities)."
  if (normalized.startsWith("components/")) return "React UI component (operator UI / portal UI composition)."

  if (normalized.startsWith("lib/auth/")) return "Auth library (session, cookies, rate limits, policy)."
  if (normalized.startsWith("lib/repository/")) return "Repository layer (domain model + query/mutation + online storage)."
  if (normalized.startsWith("lib/supabase/")) return "Supabase integration (client/admin/server helpers)."
  if (normalized.startsWith("lib/security/")) return "Security primitives (rate limiting, portal token safety)."
  if (normalized.startsWith("lib/storage/")) return "Storage primitives (upload policy, signed access)."
  if (normalized.startsWith("lib/mail/")) return "Email templates/planning (account status + workflow notifications)."
  if (normalized.startsWith("lib/")) return "Core library (types, utils, store, snapshot, domain logic)."

  if (normalized.startsWith("supabase/")) return "SQL migration / schema for Supabase (tables, RLS, triggers)."
  if (normalized.startsWith("tests/")) return "Node test (domain/repository/auth/access regression)."
  if (normalized.startsWith("public/")) return "Static public asset (icons, PWA assets)."
  if (normalized.startsWith("docs/")) {
    const mdTitle = ext === ".md" ? titleFromMd(text) : null
    return mdTitle ? `Docs: ${mdTitle}.` : "Docs / project notes."
  }
  if (normalized === "README.md") return "Top-level README (project entry, product summary)."
  if (normalized === "agent.md") return "Agent rules + product source-of-truth + workflow constraints."

  if (ext === ".md") {
    const t = titleFromMd(text)
    return t ? `Docs: ${t}.` : "Markdown doc."
  }
  if (ext === ".sql") return "SQL migration / DDL."
  if (ext === ".css") return "CSS styles."
  if (ext === ".ts" || ext === ".tsx" || ext === ".js" || ext === ".mjs") {
    // Heuristic: extract the first export or function name for a hint.
    const lines = firstNonEmptyLines(text, 12).join("\n")
    const m1 = lines.match(/export\s+function\s+([A-Za-z0-9_]+)/)
    if (m1) return `Module exporting \`${m1[1]}\` (see file for details).`
    const m2 = lines.match(/export\s+default\s+function\s+([A-Za-z0-9_]+)/)
    if (m2) return `Module default export \`${m2[1]}\` (see file for details).`
    return "Source module."
  }

  return "File."
}

function folderPurpose(dir) {
  const d = dir.replaceAll("\\", "/")
  if (d === ".") return "Repo root (entry configs + docs)."
  if (d === "app") return "Next.js App Router: pages, layouts, and API routes."
  if (d.startsWith("app/api")) return "Next.js server routes (API endpoints)."
  if (d === "components") return "React components for operator UI + client portal."
  if (d === "components/layout") return "Shared layout shells/headers used across operator pages."
  if (d === "components/ui") return "UI primitives (view states, badges helpers, small utilities)."
  if (d === "lib") return "Core product logic (types, store, snapshot, domain rules)."
  if (d === "lib/repository") return "Repository/domain layer: workspace-scoped data model and dashboards."
  if (d === "lib/auth") return "Auth/session/cookies + access enforcement utilities."
  if (d === "lib/supabase") return "Supabase clients/admin/server helpers."
  if (d === "lib/security") return "Security helpers (rate limit, token safety)."
  if (d === "lib/storage") return "Upload policy + signed access helpers."
  if (d === "lib/mail") return "Email templates + notification payloads."
  if (d === "public") return "Public static assets (icons, manifest assets)."
  if (d === "scripts") return "Dev/automation scripts (launch, tooling)."
  if (d === "supabase") return "SQL migrations/schema for Supabase (tables, RLS, triggers)."
  if (d === "tests") return "Regression tests covering auth/access/workflow/repository."
  if (d === "docs") return "Product + implementation docs (scope, env, rollout, rules)."
  return "Folder."
}

function main() {
  const repoRoot = run("git rev-parse --show-toplevel")
  const branch = run("git branch --show-current")
  const head = run("git log -1 --oneline")
  // Disable path quoting so non-ASCII filenames are printed as real UTF-8.
  const files = run("git -c core.quotepath=false ls-files")
    .split(/\r?\n/g)
    .map((s) => s.trim())
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b))

  const grouped = new Map()
  for (const f of files) {
    const dir = path.dirname(f) === "." ? "." : path.dirname(f)
    if (!grouped.has(dir)) grouped.set(dir, [])
    grouped.get(dir).push(f)
  }

  const dirs = [...grouped.keys()].sort((a, b) => a.localeCompare(b))

  const lines = []
  lines.push("# REPO_MAP (ClientPilot)")
  lines.push("")
  lines.push("Ta mapa jest generowana automatycznie na bazie `git ls-files` (czyli tylko pliki w repo).")
  lines.push("")
  lines.push(`- Repo root: \`${repoRoot}\``)
  lines.push(`- Branch: \`${branch}\``)
  lines.push(`- HEAD: \`${head}\``)
  lines.push(`- Generated: \`${new Date().toISOString()}\``)
  lines.push("")
  lines.push("## Jak używać")
  lines.push("")
  lines.push("- Zanim cokolwiek zmienisz: znajdź odpowiedni folder/plik w tej mapie.")
  lines.push("- Zmieniaj tylko pliki, które są potrzebne do celu zmiany (unikamy skanowania całego repo).")
  lines.push("- Jeśli musisz coś znaleźć: ogranicz `rg` do 1-3 katalogów lub konkretnych plików z mapy.")
  lines.push("")
  lines.push("## Foldery (cel/purpose)")
  lines.push("")
  for (const d of dirs) {
    lines.push(`- \`${d}\`: ${folderPurpose(d)}`)
  }
  lines.push("")
  lines.push("## Indeks plików (każdy plik w repo)")
  lines.push("")

  for (const d of dirs) {
    lines.push(`### ${d}`)
    lines.push("")
    for (const f of grouped.get(d)) {
      const text = safeReadText(f)
      const desc = describeFile(f, text)
      lines.push(`- \`${f}\` - ${desc}`)
    }
    lines.push("")
  }

  const outPath = path.resolve(process.cwd(), "docs", "REPO_MAP.md")
  fs.mkdirSync(path.dirname(outPath), { recursive: true })
  // Add UTF-8 BOM so Windows tools (like older PowerShell Get-Content defaults) display Polish correctly.
  fs.writeFileSync(outPath, "\uFEFF" + lines.join("\n") + "\n", "utf8")
}

main()
