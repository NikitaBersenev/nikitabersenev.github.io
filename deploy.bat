@echo off
title Deploy NikitaBersenev Portfolio
cls

echo ========================================================
echo       Deploying NikitaBersenev Portfolio to GitHub
echo ========================================================
echo.

echo [*] Step 1: Building production bundle...
call npm run build
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Build failed! Check errors above.
    pause
    exit /b %errorlevel%
)
echo [+] Build successful!
echo.

echo [*] Step 2: Committing source code...
git add -A
git commit -m "Deploy modern React and shadcn portfolio"
echo.

echo [*] Step 3: Pushing to GitHub main branch...
git branch -M main
git push -u origin main --force
echo.

echo [*] Step 4: Publishing production dist to gh-pages branch...
call npm run deploy
echo.

echo ========================================================
echo [+] ALL DONE!
echo [*] Your website is live at:
echo     https://nikitabersenev.github.io/
echo ========================================================
echo.
pause
