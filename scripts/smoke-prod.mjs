import { spawn } from "node:child_process"
import { fileURLToPath } from "node:url"

const args = process.argv.slice(2)
const shouldBuild = args.includes("--build")
const portArg = args.find((item) => item.startsWith("--port="))
const port = portArg ? Number(portArg.split("=")[1]) : 3033

if (!Number.isFinite(port) || port <= 0) {
  console.error(`[smoke] Invalid port: ${portArg ?? String(port)}`)
  process.exit(1)
}

const ROUTES = [
  "/",
  "/login",
  "/today",
  "/leads",
  "/cases",
  "/tasks",
  "/calendar",
  "/activity",
  "/templates",
  "/billing",
  "/settings",
  "/access-blocked",
  "/api/auth/session",
  "/api/app/snapshot",
]

function spawnNext(command, extraArgs = []) {
  const nextBin = new URL("../node_modules/next/dist/bin/next", import.meta.url)
  const nextBinPath = fileURLToPath(nextBin)
  const child = spawn(process.execPath, [nextBinPath, command, ...extraArgs], {
    stdio: ["ignore", "pipe", "pipe"],
    env: {
      ...process.env,
      PORT: String(port),
      NEXT_TELEMETRY_DISABLED: "1",
      NODE_ENV: "production",
    },
  })
  return child
}

async function wait(ms) {
  await new Promise((resolve) => setTimeout(resolve, ms))
}

async function fetchWithTimeout(url, timeoutMs) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)
  try {
    // node fetch is available in Node 18+
    return await fetch(url, { redirect: "manual", signal: controller.signal })
  } finally {
    clearTimeout(timeout)
  }
}

async function waitForServer(baseUrl, timeoutMs) {
  const startedAt = Date.now()
  while (Date.now() - startedAt < timeoutMs) {
    try {
      const response = await fetchWithTimeout(`${baseUrl}/`, 1500)
      if (response.status >= 200 && response.status < 500) return
    } catch {
      // ignore
    }
    await wait(250)
  }
  throw new Error("Server did not become ready in time.")
}

function isAcceptableStatus(status) {
  // For protected routes we expect redirects to /login.
  return (
    status === 200
    || status === 204
    || status === 301
    || status === 302
    || status === 303
    || status === 307
    || status === 308
    || status === 401
    || status === 403
  )
}

async function run() {
  const baseUrl = `http://127.0.0.1:${port}`
  console.log(`[smoke] production smoke: ${baseUrl}`)

  if (shouldBuild) {
    console.log("[smoke] build: starting")
    const buildChild = spawnNext("build")
    buildChild.stdout?.on("data", (chunk) => process.stdout.write(chunk))
    buildChild.stderr?.on("data", (chunk) => process.stderr.write(chunk))
    const buildExitCode = await new Promise((resolve) => buildChild.on("close", resolve))
    if (buildExitCode !== 0) {
      console.error(`[smoke] build: failed (exit ${buildExitCode})`)
      process.exit(1)
    }
    console.log("[smoke] build: ok")
  }

  console.log("[smoke] start: starting")
  const startChild = spawnNext("start", ["-p", String(port)])

  startChild.stdout?.on("data", (chunk) => process.stdout.write(chunk))
  startChild.stderr?.on("data", (chunk) => process.stderr.write(chunk))

  let startExited = false
  startChild.on("close", (code) => {
    startExited = true
    console.error(`[smoke] start: exited (code ${code ?? 0})`)
  })

  try {
    await waitForServer(baseUrl, 20000)
    if (startExited) throw new Error("Server exited before smoke finished.")

    const results = []
    for (const route of ROUTES) {
      const url = `${baseUrl}${route}`
      try {
        const response = await fetchWithTimeout(url, 5000)
        const ok = isAcceptableStatus(response.status)
        results.push({ route, status: response.status, ok, location: response.headers.get("location") })
      } catch (error) {
        results.push({ route, status: -1, ok: false, location: null, error: error instanceof Error ? error.message : String(error) })
      }
    }

    const failed = results.filter((item) => !item.ok)
    for (const item of results) {
      const suffix = item.location ? ` -> ${item.location}` : ""
      const statusLabel = item.status === -1 ? "ERR" : String(item.status)
      console.log(`[smoke] ${item.ok ? "OK " : "BAD"} ${statusLabel.padStart(3, " ")} ${item.route}${suffix}`)
      if (!item.ok && item.error) console.log(`[smoke]      error: ${item.error}`)
    }

    if (failed.length > 0) {
      console.error(`[smoke] FAIL: ${failed.length}/${results.length} routes`)
      process.exitCode = 1
      return
    }

    console.log(`[smoke] PASS: ${results.length}/${results.length} routes`)
  } finally {
    startChild.kill("SIGTERM")
    await wait(400)
    if (!startChild.killed) startChild.kill("SIGKILL")
  }
}

run().catch((error) => {
  console.error(`[smoke] error: ${error instanceof Error ? error.message : String(error)}`)
  process.exit(1)
})
