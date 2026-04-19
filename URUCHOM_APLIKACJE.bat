@echo off
setlocal enabledelayedexpansion
cd /d %~dp0

if not exist logs mkdir logs
>> logs\app.log echo [APP START] %date% %time%
>> logs\error.log echo [ERROR LOG] %date% %time%

where node >nul 2>nul
if errorlevel 1 (
  echo Nie znaleziono Node.js (wymagane 20+).
  >> logs\error.log echo Node.js not found.
  pause
  exit /b 1
)

where npm >nul 2>nul
if errorlevel 1 (
  echo Nie znaleziono npm.
  >> logs\error.log echo npm not found.
  pause
  exit /b 1
)

if not exist node_modules (
  echo Instalacja zależności (pierwsze uruchomienie)...
  call npm ci >> logs\app.log 2>> logs\error.log
  if errorlevel 1 (
    echo Błąd npm ci. Sprawdź logs\error.log
    pause
    exit /b 1
  )
)

start "" http://localhost:3000
call npm run dev >> logs\app.log 2>> logs\error.log
