import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawn, execFile } from 'node:child_process'
import http from 'node:http'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')
const logsDir = path.join(projectRoot, 'logs')
const appLogPath = path.join(logsDir, 'app.log')
const errorLogPath = path.join(logsDir, 'error.log')
const testLogPath = path.join(logsDir, 'test.log')
const url = 'http://localhost:3000'
const host = '127.0.0.1'
const port = 3000
const withTests = process.argv.includes('--with-tests')
const isWin = process.platform === 'win32'
const comspec = process.env.ComSpec || process.env.COMSPEC || 'cmd.exe'

fs.mkdirSync(logsDir, { recursive: true })
fs.writeFileSync(appLogPath, '')
fs.writeFileSync(errorLogPath, '')
if (withTests) fs.writeFileSync(testLogPath, '')

const appLog = fs.createWriteStream(appLogPath, { flags: 'a' })
const errorLog = fs.createWriteStream(errorLogPath, { flags: 'a' })
const testLog = withTests ? fs.createWriteStream(testLogPath, { flags: 'a' }) : null

let devChild = null
let browserOpened = false

function stamp() {
  return new Date().toISOString()
}

function logLine(stream, text) {
  const line = `[${stamp()}] ${text}\n`
  stream.write(line)
}

function writeStdout(text) {
  process.stdout.write(text)
  appLog.write(text)
}

function writeStderr(text) {
  process.stderr.write(text)
  errorLog.write(text)
}

function mirrorOutput(target, chunk, stream) {
  const text = chunk.toString()
  target.write(text)
  stream.write(text)
}

function quoteCmdArg(value) {
  if (!value) return '""'
  if (!/[\s^"]/.test(value)) return value
  return `"${value.replace(/"/g, '""')}"`
}

function spawnPortable(command, args, options = {}) {
  const base = {
    cwd: projectRoot,
    env: process.env,
    stdio: ['ignore', 'pipe', 'pipe'],
    windowsHide: false,
    ...options,
  }

  if (isWin) {
    const full = [command, ...args].map(quoteCmdArg).join(' ')
    return spawn(comspec, ['/d', '/s', '/c', full], base)
  }

  return spawn(command, args, base)
}

function openBrowser(targetUrl) {
  if (browserOpened) return
  browserOpened = true

  if (isWin) {
    const winAttempts = [
      () => spawn(comspec, ['/d', '/s', '/c', `start "" ${quoteCmdArg(targetUrl)}`], { windowsHide: true, detached: true, stdio: 'ignore' }).unref(),
      () => execFile('powershell', ['-NoProfile', '-Command', `Start-Process '${targetUrl.replace(/'/g, "''")}'`], { windowsHide: true }),
      () => execFile('rundll32.exe', ['url.dll,FileProtocolHandler', targetUrl], { windowsHide: true }),
    ]

    for (const attempt of winAttempts) {
      try {
        attempt()
        const msg = `[ClientPilot] Otwieram przeglądarkę: ${targetUrl}\n`
        writeStdout(msg)
        return
      } catch (error) {
        logLine(errorLog, `Nieudana próba otwarcia przeglądarki: ${error instanceof Error ? error.message : String(error)}`)
      }
    }
    return
  }

  try {
    if (process.platform === 'darwin') {
      execFile('open', [targetUrl])
    } else {
      execFile('xdg-open', [targetUrl])
    }
    const msg = `[ClientPilot] Otwieram przeglądarkę: ${targetUrl}\n`
    writeStdout(msg)
  } catch (error) {
    logLine(errorLog, `Nieudana próba otwarcia przeglądarki: ${error instanceof Error ? error.message : String(error)}`)
  }
}

function waitForServerThenOpen() {
  let attempts = 0
  const maxAttempts = 180

  const check = () => {
    attempts += 1

    const req = http.get({ host, port, path: '/', timeout: 1000 }, (res) => {
      res.resume()
      openBrowser(url)
    })

    req.on('error', () => {
      if (attempts < maxAttempts) {
        setTimeout(check, 1000)
      } else {
        logLine(errorLog, 'Serwer nie odpowiedział na czas.')
        writeStderr('[ClientPilot] Serwer nie odpowiedział na czas.\n')
      }
    })

    req.on('timeout', () => {
      req.destroy()
      if (attempts < maxAttempts) {
        setTimeout(check, 1000)
      }
    })
  }

  check()
}

function runCommand(command, args, { stdoutStream, stderrStream, prefix, env }) {
  return new Promise((resolve, reject) => {
    const child = spawnPortable(command, args, env ? { env } : undefined)

    child.stdout.on('data', (chunk) => mirrorOutput(process.stdout, chunk, stdoutStream))
    child.stderr.on('data', (chunk) => mirrorOutput(process.stderr, chunk, stderrStream))
    child.on('error', (error) => {
      logLine(errorLog, `${prefix} spawn error: ${error instanceof Error ? error.message : String(error)}`)
      reject(error)
    })
    child.on('close', (code) => {
      if (code === 0) {
        resolve(code)
      } else {
        reject(new Error(`${prefix} zakończył się kodem ${code}`))
      }
    })
  })
}

async function ensureNodeModules() {
  if (fs.existsSync(path.join(projectRoot, 'node_modules'))) return
  writeStdout('[ClientPilot] Instalacja zależności...\n')
  await runCommand(
    'npm',
    [
      'install',
      '--registry=https://registry.npmjs.org/',
      '--no-audit',
      '--no-fund',
      '--prefer-online',
    ],
    {
      stdoutStream: appLog,
      stderrStream: errorLog,
      prefix: 'npm install',
      env: {
        ...process.env,
        npm_config_registry: 'https://registry.npmjs.org/',
      },
    },
  )
}

async function runTestsIfNeeded() {
  if (!withTests) return
  writeStdout('[ClientPilot] Uruchamiam testy...\n')
  await runCommand('npm', ['run', 'test'], {
    stdoutStream: testLog,
    stderrStream: errorLog,
    prefix: 'testy',
  })
  writeStdout('[ClientPilot] Testy przeszły.\n')
}

function startDevServer() {
  writeStdout('[ClientPilot] Uruchamiam aplikację...\n')
  devChild = spawnPortable('npm', ['run', 'dev'])

  devChild.stdout.on('data', (chunk) => {
    mirrorOutput(process.stdout, chunk, appLog)
    const text = chunk.toString()
    if (!browserOpened && (text.includes('Ready in') || text.includes('Local:') || text.includes('localhost:3000'))) {
      openBrowser(url)
    }
  })

  devChild.stderr.on('data', (chunk) => mirrorOutput(process.stderr, chunk, errorLog))
  devChild.on('error', (error) => {
    const message = `[ClientPilot] Błąd uruchamiania serwera: ${error instanceof Error ? error.message : String(error)}\n`
    writeStderr(message)
  })
  devChild.on('close', (code) => {
    const message = `[ClientPilot] Serwer zakończył pracę z kodem ${code ?? 0}.\n`
    writeStdout(`\n${message}`)
    process.exit(code ?? 0)
  })

  waitForServerThenOpen()
}

function shutdown() {
  if (devChild && !devChild.killed) {
    devChild.kill('SIGINT')
  }
  appLog.end()
  errorLog.end()
  testLog?.end()
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
process.on('uncaughtException', (error) => {
  writeStderr(`[ClientPilot] uncaughtException: ${error instanceof Error ? error.stack || error.message : String(error)}\n`)
  shutdown()
  process.exit(1)
})
process.on('unhandledRejection', (reason) => {
  writeStderr(`[ClientPilot] unhandledRejection: ${reason instanceof Error ? reason.stack || reason.message : String(reason)}\n`)
  shutdown()
  process.exit(1)
})

try {
  logLine(appLog, `Start launchera. withTests=${withTests}`)
  await ensureNodeModules()
  await runTestsIfNeeded()
  startDevServer()
} catch (error) {
  const message = error instanceof Error ? error.stack || error.message : String(error)
  writeStderr(`[ClientPilot] ${message}\n`)
  shutdown()
  process.exit(1)
}
