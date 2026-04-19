@echo off
setlocal
cd /d %~dp0
where node >nul 2>nul
if errorlevel 1 (
  echo Nie znaleziono Node.js. Zainstaluj Node.js 20+.
  pause
  exit /b 1
)
where npm >nul 2>nul
if errorlevel 1 (
  echo Nie znaleziono npm. Zainstaluj Node.js 20+.
  pause
  exit /b 1
)
node scripts\launch-dev.mjs --with-tests
pause
