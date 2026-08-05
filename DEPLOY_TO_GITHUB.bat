@echo off
setlocal enabledelayedexpansion
TITLE GitHub and Deployment Sub-Agent

echo ===================================================
echo   GitHub and Deployment Sub-Agent - HSK4 Master
echo ===================================================

:: Ensure Git is in PATH (support both app-3.6.3 and app-3.6.2)
set "PATH=%PATH%;C:\Users\HP\AppData\Local\GitHubDesktop\app-3.6.3\resources\app\git\cmd;C:\Users\HP\AppData\Local\GitHubDesktop\app-3.6.3\resources\app\git\mingw64\bin;C:\Users\HP\AppData\Local\GitHubDesktop\app-3.6.2\resources\app\git\cmd"

echo [INFO] Step 1: Building fresh production distribution...
call npm.cmd run build
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Build failed! Please fix errors before deploying.
    pause
    exit /b 1
)

echo [INFO] Step 2: Checking Git repository status...
git status >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [INFO] Initializing new Git repository...
    git init
    git branch -M main
)

echo [INFO] Step 3: Setting remote repository...
git remote remove origin >nul 2>nul
git remote add origin https://github.com/5cfm98gf55-maker/HSK4-.git

echo [INFO] Step 4: Staging and committing changes...
git add .
git commit -m "feat: update HSK4 Phrase Master web app with Admin & Auth flow" >nul 2>nul

echo [INFO] Step 5: Pushing source code to main branch...
git push -u origin main

echo [INFO] Step 6: Cleaning gh-pages cache...
if exist "node_modules\.cache\gh-pages" rmdir /s /q "node_modules\.cache\gh-pages" >nul 2>nul

echo [INFO] Step 7: Deploying live site to GitHub Pages...
call npx.cmd gh-pages -d dist

echo ===================================================
echo [SUCCESS] Deploy process completed successfully!
echo [ONLINE URL] https://5cfm98gf55-maker.github.io/HSK4-/
===================================================
endlocal
