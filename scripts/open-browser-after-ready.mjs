import http from "node:http"
import { execFile } from "node:child_process"

const url = process.argv[2] || "http://localhost:3000"
const maxAttempts = 60
const intervalMs = 1000
let attempts = 0
let opened = false

function openBrowser(targetUrl) {
  if (opened) return
  opened = true

  if (process.platform === "win32") {
    execFile("cmd", ["/c", "start", "", targetUrl])
    return
  }

  if (process.platform === "darwin") {
    execFile("open", [targetUrl])
    return
  }

  execFile("xdg-open", [targetUrl])
}

function check() {
  attempts += 1
  const request = http.get(url, (response) => {
    response.resume()
    openBrowser(url)
    process.exit(0)
  })

  request.on("error", () => {
    if (attempts >= maxAttempts) {
      openBrowser(url)
      process.exit(0)
    }

    setTimeout(check, intervalMs)
  })
}

check()
