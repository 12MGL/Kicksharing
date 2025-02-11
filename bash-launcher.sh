#!/bin/bash

# Запуск бэкенда
cd backend
gnome-terminal -- bash -c "npm run dev; exec bash" &

# Запуск админ-панели
cd ../admin-panel
gnome-terminal -- bash -c "npm webpack serve; exec bash" &

# Запуск интерфейса ремонтников
cd ../repairmen-interface
gnome-terminal -- bash -c "npm webpack serve; exec bash" &

echo "Проект запущен"
