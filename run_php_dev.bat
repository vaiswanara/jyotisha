@echo off
title e-JYOTISHA PHP Dev Runner
echo ========================================================
echo        Starting e-JYOTISHA PHP Dev Servers...
echo ========================================================
echo.

echo [1/2] Starting Frontend (Vite) on port 5173...
start "e-JYOTISHA Frontend" cmd /k "set VITE_BACKEND_TYPE=php&& npm run dev"

echo [2/2] Starting PHP Backend on port 3000...
if exist "C:\xampp\php\php.exe" (
    start "e-JYOTISHA PHP Backend" cmd /k "C:\xampp\php\php.exe -S 0.0.0.0:3000 jyotisha_php_api/router.php"
) else (
    start "e-JYOTISHA PHP Backend" cmd /k "php -S 0.0.0.0:3000 jyotisha_php_api/router.php"
)

echo.
echo ========================================================
echo   Both servers launched successfully in new windows!
echo   - Frontend: http://localhost:5173
echo   - PHP Backend:  http://localhost:3000/api
echo ========================================================
echo.
echo You can close this window now.
timeout /t 5
