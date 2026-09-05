@echo off
chcp 65001 >nul
title Деплой сайта NikitaBersenev на GitHub Pages
cls

echo =====================================================================
echo       🚀 Автоматический деплой сайта-портфолио на GitHub
echo       Разработчик: NikitaBersenev
echo =====================================================================
echo.

:: 1. Проверка Git
where git >nul 2>nul
if %errorlevel% neq 0 (
    echo [ОШИБКА] Git не установлен или не добавлен в PATH!
    echo Скачайте и установите Git с https://git-scm.com/
    echo.
    pause
    exit /b 1
)

:: 2. Проверка инициализации Git
if not exist ".git" (
    echo [*] Инициализирую локальный Git репозиторий...
    git init
    git branch -M main
    echo [+] Репозиторий инициализирован.
    echo.
)

:: Проверка имени и email в Git
git config user.name >nul 2>nul
if %errorlevel% neq 0 (
    git config user.name "Nikita Bersenev"
)
git config user.email >nul 2>nul
if %errorlevel% neq 0 (
    git config user.email "nikitabersenev@users.noreply.github.com"
)

:: 3. Проверка remote origin
git remote get-url origin >nul 2>nul
if %errorlevel% neq 0 (
    echo [*] Remote origin не найден.
    echo.
    echo В какой репозиторий выложить проект?
    echo 1) https://github.com/NikitaBersenev/nikitabersenev.github.io.git  (По умолчанию для GitHub Pages)
    echo 2) Ввести другой URL репозитория вручную
    echo.
    set /p REPO_CHOICE="Выберите 1 или 2 [нажмите Enter для 1]: "

    if "%REPO_CHOICE%"=="2" (
        set /p CUSTOM_URL="Введите полный URL репозитория: "
        git remote add origin %CUSTOM_URL%
    ) else (
        git remote add origin https://github.com/NikitaBersenev/nikitabersenev.github.io.git
    )
    echo.
    echo [+] Remote origin успешно добавлен!
    echo.
)

:: 4. Меню действий
echo Выберите вариант выкладки:
echo [1] ⚡ Стандартный: Запушить код в GitHub (ветка main + авто-деплой GitHub Actions)
echo [2] 📦 Прямой: Собрать проект и сразу залить в ветку gh-pages (через npm run deploy)
echo [3] 🚀 Полный: Запушить исходники в main + сразу опубликовать в gh-pages
echo.
set /p ACTION_CHOICE="Выберите действие (1, 2 или 3) [нажмите Enter для 1]: "
if "%ACTION_CHOICE%"=="" set ACTION_CHOICE=1
echo.

if "%ACTION_CHOICE%"=="2" goto deploy_gh_pages
if "%ACTION_CHOICE%"=="3" goto full_deploy

:push_main
echo [*] Добавляю файлы в коммит...
git add .

set COMMIT_MSG=Update blog and project showcase
set /p USER_MSG="Введите сообщение коммита [Enter для '%COMMIT_MSG%']: "
if not "%USER_MSG%"=="" set COMMIT_MSG=%USER_MSG%

git commit -m "%COMMIT_MSG%"
echo.
echo [*] Отправляю код на GitHub (ветка main)...
git branch -M main
git push -u origin main --force

if %errorlevel% neq 0 (
    echo.
    echo [!] Не удалось отправить код автоматически.
    echo Возможные причины:
    echo  - На GitHub в репозитории уже есть файлы (например README/License).
    echo    Попробуйте выполнить: git pull origin main --rebase
    echo  - Требуется авторизация в GitHub (GitHub CLI или Personal Access Token).
    echo.
) else (
    echo.
    echo =====================================================================
    echo [+] Исходники успешно отправлены на GitHub!
    echo [*] Если у вас включен GitHub Actions:
    echo     Перейдите в репозиторий: Settings -> Pages -> Source: GitHub Actions
    echo     Сайт соберется и опубликуется автоматически за 1-2 минуты.
    echo =====================================================================
)
goto end

:deploy_gh_pages
echo [*] Запускаю сборку и публикацию через gh-pages...
call npm run deploy
if %errorlevel% neq 0 (
    echo [!] Ошибка при сборке или деплое. Проверьте логи выше.
) else (
    echo.
    echo =====================================================================
    echo [+] Сайт успешно опубликован в ветку gh-pages!
    echo [*] Проверьте: Settings -> Pages -> Source: Deploy from a branch -> gh-pages
    echo =====================================================================
)
goto end

:full_deploy
echo [*] Шаг 1/2: Коммит и push в main...
git add .
git commit -m "Update portfolio and blog"
git branch -M main
git push -u origin main --force

echo.
echo [*] Шаг 2/2: Прямая сборка и отправка в gh-pages...
call npm run deploy
echo.
echo =====================================================================
echo [+] Всё готово! Код в main, сайт опубликован в gh-pages.
echo =====================================================================
goto end

:end
echo.
pause
