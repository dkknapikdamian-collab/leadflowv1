@echo off
setlocal enabledelayedexpansion
cd /d %~dp0

if not exist logs mkdir logs
> logs\app.log echo [APP START] %date% %time%
> logs\error.log echo [ERROR LOG] %date% %time%

echo Sprawdzanie Node i npm... >> logs\app.log
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

echo Instalacja zaleznosci... >> logs\app.log
call npm install >> logs\app.log 2>> logs\error.log
if errorlevel 1 (
  echo Blad podczas npm install. Sprawdz logs\error.log
  pause
  exit /b 1
)

echo Start dev servera na http://localhost:3000 >> logs\app.log
start "" http://localhost:3000
call npm run dev >> logs\app.log 2>> logs\error.log
