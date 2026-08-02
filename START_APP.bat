@echo off
setlocal
TITLE HSK4 Phrase Master - Super Agent App

echo ===================================================
echo     HSK4 Phrase Master - AI Pronunciation Lab
echo ===================================================

:: Check for Node.js
WHERE node >nul 2>nul
IF %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed. Please install it from https://nodejs.org/
    pause
    exit /b 1
)

if not exist "node_modules\" (
    echo [INFO] Installing dependencies for first-time setup...
    call npm.cmd install
)

echo [INFO] Starting HSK4 Phrase Master Web App...
echo [INFO] Opening browser at http://localhost:3000
call npx.cmd -y vite --open


endlocal
