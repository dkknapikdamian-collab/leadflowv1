@echo off
setlocal enabledelayedexpansion
cd /d %~dp0

if not exist logs mkdir logs
> logs\test.log echo [TEST START] %date% %time%
> logs\app.log echo [APP START] %date% %time%
> logs\error.log echo [ERROR LOG] %date% %time%

echo Sprawdzanie Node i npm... >> logs\test.log
where node >nul 2>nul
if errorlevel 1 (
  echo Nie znaleziono Node.js. Zainstaluj Node.js 20+ i sprobuj ponownie.
  echo Node.js not found. >> logs\error.log
  pause
  exit /b 1
)

where npm >nul 2>nul
if errorlevel 1 (
  echo Nie znaleziono npm. Zainstaluj Node.js z npm i sprobuj ponownie.
  echo npm not found. >> logs\error.log
  pause
  exit /b 1
)

echo Instalacja zaleznosci... >> logs\test.log
call npm install >> logs\test.log 2>> logs\error.log
if errorlevel 1 (
  echo Blad podczas npm install. Sprawdz logs\test.log i logs\error.log
  pause
  exit /b 1
)

echo Uruchamianie lint... >> logs\test.log
call npm run lint >> logs\test.log 2>> logs\error.log
if errorlevel 1 (
  echo Blad lint. Sprawdz logs\test.log oraz logs\error.log
  pause
  exit /b 1
)

echo Uruchamianie build... >> logs\test.log
call npm run build >> logs\test.log 2>> logs\error.log
if errorlevel 1 (
  echo Blad build. Sprawdz logs\test.log oraz logs\error.log
  pause
  exit /b 1
)

echo Testy i build przeszly. Start aplikacji na http://localhost:3000 >> logs\test.log
start "" http://localhost:3000
call npm run dev >> logs\app.log 2>> logs\error.log
