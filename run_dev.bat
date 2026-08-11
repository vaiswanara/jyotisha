@echo off
title e-JYOTISHA Dev Runner
echo ========================================================
echo        Starting e-JYOTISHA Dev Servers...
echo ========================================================
echo.

echo [1/2] Starting Frontend (Vite) on port 5173...
start "e-JYOTISHA Frontend" cmd /k "set VITE_BACKEND_TYPE=node&& npm run dev"

echo [2/2] Starting Backend (ts-node API) on port 3000...
start "e-JYOTISHA Backend" cmd /k "cd jyotisha_api && npx ts-node server.ts"

echo.
echo ========================================================
echo   Both servers launched successfully in new windows!
echo   - Frontend: http://localhost:5173
echo   - Backend:  http://localhost:3000
echo ========================================================
echo.
echo You can close this window now.
timeout /t 5
