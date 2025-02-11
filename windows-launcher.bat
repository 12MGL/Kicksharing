@echo off

:: Запуск бэкенда
cd backend
if not exist "node_modules" (
    npm install
)
start cmd /k "npm run dev"

:: Запуск админ-панели
cd ../admin-panel
if not exist "node_modules" (
    npm install
)
start cmd /k "npm webpack serve"

:: Запуск интерфейса ремонтников
cd ../repairmen-interface
if not exist "node_modules" (
    npm install
)
start cmd /k "npm webpack serve"

echo Все сервисы запущены!
pause
