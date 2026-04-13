#!/usr/bin/env node

import { access, readFile } from "node:fs/promises"
import path from "node:path"
import process from "node:process"

const repoRoot = process.cwd()

const checks = []

async function fileExists(relativePath) {
  try {
    await access(path.join(repoRoot, relativePath))
    return true
  } catch {
    return false
  }
}

async function fileContains(relativePath, fragments) {
  const absolutePath = path.join(repoRoot, relativePath)
  const content = await readFile(absolutePath, "utf8")
  return fragments.every((fragment) => content.includes(fragment))
}

async function registerCheck(label, executor) {
  try {
    const passed = await executor()
    checks.push({ label, passed, error: null })
  } catch (error) {
    checks.push({
      label,
      passed: false,
      error: error instanceof Error ? error.message : String(error),
    })
  }
}

await registerCheck("route /operator istnieje", async () => fileExists("app/operator/page.tsx"))

await registerCheck("dashboard-shell ma link /operator w głównej nawigacji", async () =>
  fileContains("components/dashboard-shell.tsx", [
    '{ href: "/operator", label: "Operator"',
  ]),
)

await registerCheck("dashboard-shell ma /operator w mobilnej nawigacji", async () =>
  fileContains("components/dashboard-shell.tsx", [
    'const MOBILE_PRIMARY_NAV',
    '{ href: "/operator", label: "Operator"',
  ]),
)

await registerCheck("widok Operator Center istnieje", async () =>
  fileContains("components/operator-center-page-view.tsx", [
    'export function OperatorCenterPageView()',
    'buildLeadOwnerSummary',
    'buildCaseOwnerSummary',
  ]),
)

await registerCheck("test owner-view-summary istnieje", async () => fileExists("tests/owner-view-summary.test.ts"))

await registerCheck("test owner-view-summary sprawdza oba summary", async () =>
  fileContains("tests/owner-view-summary.test.ts", [
    'buildCaseOwnerSummary',
    'buildLeadOwnerSummary',
    'assert.equal(summary.total, 3)',
    'assert.equal(summary.total, 4)',
  ]),
)

await registerCheck("tracker wdrożeń istnieje", async () => fileExists("docs/WDROZENIA_TRACKER_2026-04-13.md"))

const passedCount = checks.filter((check) => check.passed).length
const failedChecks = checks.filter((check) => !check.passed)

console.log("R0 BRANCH CHECK")
console.log("===============")

for (const check of checks) {
  const prefix = check.passed ? "PASS" : "FAIL"
  console.log(`${prefix}  ${check.label}`)
  if (check.error) {
    console.log(`      ${check.error}`)
  }
}

console.log("")
console.log(`Wynik: ${passedCount}/${checks.length} PASS`)

if (failedChecks.length > 0) {
  process.exitCode = 1
} else {
  console.log("Branch przeszedł podstawowy checker R0.")
}
