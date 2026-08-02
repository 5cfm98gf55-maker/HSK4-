@echo off
setlocal enabledelayedexpansion
TITLE GitHub & Deployment Sub-Agent

echo ===================================================
echo   GitHub & Deployment Sub-Agent - HSK4 Master
echo ===================================================

:: Locate Git
set "GIT_CMD=git"
WHERE git >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    if exist "C:\Users\HP\AppData\Local\GitHubDesktop\app-3.6.2\resources\app\git\cmd\git.exe" (
        set "GIT_CMD=C:\Users\HP\AppData\Local\GitHubDesktop\app-3.6.2\resources\app\git\cmd\git.exe"
    ) else (
        echo [ERROR] Git binary not found. Please install Git or GitHub Desktop.
        pause
        exit /b 1
    )
)

echo [INFO] Step 1: Building fresh production distribution...
call npm.cmd run build
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Build failed! Please fix errors before deploying.
    pause
    exit /b 1
)

echo [INFO] Step 2: Checking Git repository status...
call "%GIT_CMD%" status >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [INFO] Initializing new Git repository...
    call "%GIT_CMD%" init
    call "%GIT_CMD%" branch -M main
)

echo [INFO] Step 3: Staging and committing changes...
call "%GIT_CMD%" add .
call "%GIT_CMD%" commit -m "feat: auto update HSK4 Phrase Master web app"

echo [INFO] Step 4: Deploying live site to GitHub Pages...
call npm.cmd run deploy

echo ===================================================
echo [SUCCESS] Deploy process completed successfully!
echo ===================================================
pause
endlocal
